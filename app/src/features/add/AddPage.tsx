import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Copy, UploadCloud, Check, Info, Loader2, ArrowRight, Github, Settings2 } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { Button, Input } from "@/components/ui/primitives";
import { topics, TYPES, getTopic } from "@/lib/content";
import type { Resource, ResourceType } from "@/data/schema";
import { slugify } from "@/data/topics";
import { formatEntry, type DraftResource } from "@/lib/mdWriteback";
import { normalizeDate } from "@/data/parser/parse";
import { getGitHubConfig, publishNewEntry } from "@/lib/github";
import { addOverlayNew } from "@/lib/overlay";
import { usePublishingConfigured } from "@/hooks/publishing";
import { logActivity } from "@/lib/db";

const selectCls =
  "h-9 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function AddPage() {
  const navigate = useNavigate();
  const configured = usePublishingConfigured();

  const [topicSlug, setTopicSlug] = useState(topics[0].slug);
  const [group, setGroup] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<ResourceType>("Blog");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");
  const [concepts, setConcepts] = useState("");
  const [markers, setMarkers] = useState({ star: false, startHere: false, unverified: false });
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState<{ id: string; title: string } | null>(null);

  const topic = getTopic(topicSlug)!;
  const draft: DraftResource = {
    title: title || "Untitled",
    url: url || "https://",
    type,
    source: source || "Unknown",
    date,
    summary: summary || "Add a one to three sentence summary.",
    keyConcepts: concepts.split(",").map((c) => c.trim()).filter(Boolean),
    markers,
  };
  const preview = useMemo(() => formatEntry(draft), [draft]);
  const valid = Boolean(title.trim() && url.trim().startsWith("http") && summary.trim());

  function reset() {
    setTitle("");
    setUrl("");
    setSummary("");
    setConcepts("");
    setDate("");
    setSource("");
    setMarkers({ star: false, startHere: false, unverified: false });
    setPublished(null);
  }

  async function onCopy() {
    await navigator.clipboard.writeText(preview);
    setCopied(true);
    toast.success("Markdown copied", { description: `Paste into Library/${topic.title}.md` });
    setTimeout(() => setCopied(false), 1500);
  }

  async function onPublish() {
    if (!valid) return;
    setPublishing(true);
    try {
      const cfg = await getGitHubConfig();
      await publishNewEntry(cfg, topicSlug, group, preview);

      // Optimistically register so it shows immediately, before the redeploy.
      const id = `${topicSlug}__${slugify(draft.title)}`;
      const resource: Resource = {
        id,
        title: draft.title,
        url: draft.url,
        type,
        source: draft.source,
        dateRaw: date || "—",
        dateSort: normalizeDate(date),
        topicSlug,
        group,
        summary: draft.summary,
        keyConcepts: draft.keyConcepts,
        markers,
      };
      await addOverlayNew(resource);
      await logActivity({ type: "added", resourceId: id, topicSlug });
      setPublished({ id, title: draft.title });
      toast.success("Published to your library");
    } catch (err) {
      toast.error("Publish failed", { description: (err as Error).message });
    } finally {
      setPublishing(false);
    }
  }

  if (published) {
    return (
      <PageContainer className="max-w-xl">
        <PublishedPanel
          title={published.title}
          topicTitle={topic.title}
          onView={() => navigate(`/resource/${published.id}`)}
          onAnother={reset}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader
        eyebrow="Add resource"
        title="Add a resource"
        description="Fill in the details — publish it straight to your library from here."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-3.5">
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" />
          </Field>
          <Field label="URL">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select className={selectCls} value={type} onChange={(e) => setType(e.target.value as ResourceType)}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="2026-07-12 or —" />
            </Field>
          </div>
          <Field label="Source">
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Author / site" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Topic">
              <select
                className={selectCls}
                value={topicSlug}
                onChange={(e) => {
                  setTopicSlug(e.target.value);
                  setGroup("");
                }}
              >
                {topics.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Group">
              <select className={selectCls} value={group} onChange={(e) => setGroup(e.target.value)}>
                <option value="">— none —</option>
                {topic.groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Summary">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="One to three sentences on the key ideas."
              className="min-h-[80px] w-full resize-y rounded-md border border-border bg-input p-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </Field>
          <Field label="Key concepts" hint="Comma-separated">
            <Input value={concepts} onChange={(e) => setConcepts(e.target.value)} placeholder="attention, kv cache, …" />
          </Field>
          <div className="flex flex-wrap gap-3 pt-1">
            {(["star", "startHere", "unverified"] as const).map((m) => (
              <label key={m} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={markers[m]}
                  onChange={(e) => setMarkers({ ...markers, [m]: e.target.checked })}
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                />
                {m === "star" ? "⭐ Must-read" : m === "startHere" ? "🔁 Start here" : "⚠️ Unverified"}
              </label>
            ))}
          </div>
        </div>

        {/* Preview + publish */}
        <div className="space-y-3 lg:sticky lg:top-4 lg:self-start">
          <div className="rail">Markdown preview</div>
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface/60 p-4 font-mono text-xs leading-relaxed text-foreground/90">
            {preview}
          </pre>

          {configured ? (
            <Button className="w-full" onClick={onPublish} disabled={!valid || publishing}>
              {publishing ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
              {publishing ? "Publishing…" : "Publish to library"}
            </Button>
          ) : (
            <Button variant="secondary" className="w-full" asChild>
              <Link to="/settings#publishing">
                <Github size={15} /> Connect publishing to add online
              </Link>
            </Button>
          )}

          <Button variant="outline" className="w-full" onClick={onCopy} disabled={!valid}>
            {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
            Copy Markdown
          </Button>

          <div className="flex gap-2 rounded-lg border border-border bg-surface/50 p-3 text-xs text-muted-foreground">
            <Info size={14} className="mt-0.5 shrink-0 text-faint" />
            {configured ? (
              <span>
                Publishing commits this entry to{" "}
                <code className="font-mono">Library/{topic.title}.md</code> on GitHub and rebuilds the site. It shows
                here instantly and goes fully live in ~1–2 min.
              </span>
            ) : (
              <span>
                Add a GitHub token in{" "}
                <Link to="/settings#publishing" className="inline-flex items-center gap-1 text-foreground underline">
                  <Settings2 size={11} /> Settings
                </Link>{" "}
                to publish from here. Until then, use <span className="text-foreground">Copy Markdown</span>.
              </span>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function PublishedPanel({
  title,
  topicTitle,
  onView,
  onAnother,
}: {
  title: string;
  topicTitle: string;
  onView: () => void;
  onAnother: () => void;
}) {
  return (
    <div className="mt-10 flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success">
        <Check size={28} />
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Published</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        “{title}” was committed to <code className="font-mono">{topicTitle}.md</code> and added to your library.
      </p>

      <ol className="mt-5 w-full max-w-xs space-y-2 text-left text-sm">
        <li className="flex items-center gap-2 text-foreground">
          <Check size={15} className="text-success" /> Committed to GitHub
        </li>
        <li className="flex items-center gap-2 text-foreground">
          <Check size={15} className="text-success" /> Visible here now
        </li>
        <li className="flex items-center gap-2 text-muted-foreground">
          <Loader2 size={15} className="animate-spin text-primary" /> Rebuilding site (~1–2 min)
        </li>
      </ol>

      <div className="mt-6 flex w-full max-w-xs flex-col gap-2">
        <Button onClick={onView}>
          Open resource <ArrowRight size={15} />
        </Button>
        <Button variant="secondary" onClick={onAnother}>
          Add another
        </Button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {hint && <span className="text-2xs text-faint">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
