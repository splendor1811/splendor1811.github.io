import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Copy, Save, Check, Info } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { Button, Input } from "@/components/ui/primitives";
import { topics, TYPES, getTopic } from "@/lib/content";
import type { ResourceType } from "@/data/schema";
import {
  formatEntry,
  isWritebackAvailable,
  writeBack,
  type DraftResource,
} from "@/lib/mdWriteback";
import { logActivity } from "@/lib/db";
import { cn } from "@/lib/utils";

const selectCls =
  "h-9 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function AddPage() {
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
  const [serverAvailable, setServerAvailable] = useState(false);

  useEffect(() => {
    isWritebackAvailable().then(setServerAvailable);
  }, []);

  const topic = getTopic(topicSlug)!;
  const draft: DraftResource = {
    title: title || "Untitled",
    url: url || "https://",
    type,
    source: source || "Unknown",
    date,
    summary: summary || "Add a one to three sentence summary.",
    keyConcepts: concepts
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
    markers,
  };
  const preview = useMemo(() => formatEntry(draft), [draft]);
  const valid = title.trim() && url.trim().startsWith("http") && summary.trim();

  async function onCopy() {
    await navigator.clipboard.writeText(preview);
    setCopied(true);
    toast.success("Markdown copied", { description: `Paste into Library/${topic.title}.md` });
    setTimeout(() => setCopied(false), 1500);
  }

  async function onSave() {
    try {
      await writeBack(topicSlug, group, preview);
      await logActivity({ type: "added", topicSlug });
      toast.success("Added to your Markdown", { description: `${topic.title}.md updated` });
      setTitle("");
      setUrl("");
      setSummary("");
      setConcepts("");
    } catch (err) {
      toast.error("Couldn't write to Markdown", { description: (err as Error).message });
    }
  }

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader
        eyebrow="Add resource"
        title="Add a resource"
        description="Fill in the details — it becomes a properly formatted Markdown entry in your Library."
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
              <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="2026-07-08 or —" />
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

        {/* Preview + actions */}
        <div className="space-y-3">
          <div className="rail">Markdown preview</div>
          <pre className="overflow-x-auto rounded-lg border border-border bg-surface/60 p-4 font-mono text-xs leading-relaxed text-foreground/90">
            {preview}
          </pre>

          <div className="flex flex-col gap-2">
            <Button onClick={onSave} disabled={!valid || !serverAvailable}>
              <Save size={15} /> Save to Markdown
            </Button>
            <Button variant="secondary" onClick={onCopy} disabled={!valid}>
              {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
              Copy Markdown
            </Button>
          </div>

          <div
            className={cn(
              "flex gap-2 rounded-lg border p-3 text-xs",
              serverAvailable ? "border-success/30 bg-success/5 text-muted-foreground" : "border-border bg-surface/50 text-muted-foreground",
            )}
          >
            <Info size={14} className="mt-0.5 shrink-0 text-faint" />
            {serverAvailable ? (
              <span>
                Local writeback is connected — <span className="text-success">Save</span> appends this entry to{" "}
                <code className="font-mono">{topic.title}.md</code> and refreshes the app.
              </span>
            ) : (
              <span>
                Running as a static site, so direct writeback is off. Use <span className="text-foreground">Copy Markdown</span> and paste
                into <code className="font-mono">Library/{topic.title}.md</code>. To enable one-click save, run{" "}
                <code className="font-mono">bun run serve</code> locally.
              </span>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
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
