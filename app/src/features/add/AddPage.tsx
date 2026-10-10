import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Copy, UploadCloud, Check, Loader2, ArrowRight, Github, Link2, Star, Route, CircleAlert, CalendarDays, BookOpen } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { Button, Input } from "@/components/ui/primitives";
import { DatePicker } from "@/components/ui/date-picker";
import { TypeBadge } from "@/components/ResourceMeta";
import { topics, TYPES, getTopic } from "@/lib/content";
import type { Resource, ResourceType } from "@/data/schema";
import { DEFAULT_RESOURCE_GROUP, formatEntry, type DraftResource } from "@/lib/mdWriteback";
import { normalizeDate } from "@/data/parser/parse";
import { getGitHubConfig, publishNewEntry } from "@/lib/github";
import { addOverlayNew } from "@/lib/overlay";
import { usePublishingConfigured } from "@/hooks/publishing";
import { logActivity } from "@/lib/db";
import { formatResourceDate, isHttpUrl, isUnknownResourceDate, isValidResourceDate } from "@/lib/resource-fields";

const selectCls =
  "h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

const markerOptions = [
  { key: "star", label: "Must-read", icon: Star },
  { key: "startHere", label: "Start here", icon: Route },
  { key: "unverified", label: "Unverified", icon: CircleAlert },
] as const;

const createDraftId = () => `resource__${crypto.randomUUID()}`;

export function AddPage() {
  const navigate = useNavigate();
  const configured = usePublishingConfigured();

  // Identity belongs to this draft, not its mutable title, topic, or publish attempt.
  const [draftId, setDraftId] = useState(createDraftId);
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
  const [touched, setTouched] = useState({ title: false, url: false, summary: false });

  const topic = getTopic(topicSlug)!;
  const validUrl = isHttpUrl(url);
  const urlHost = validUrl ? new URL(url.trim()).hostname.replace(/^www\./, "") : "";
  const draft: DraftResource = {
    title: title.trim() || "Untitled",
    url: url.trim() || "https://",
    type,
    source: source.trim() || urlHost || "Unknown",
    date: date.trim(),
    summary: summary.trim() || "Add a one to three sentence summary.",
    keyConcepts: concepts.split(",").map((c) => c.trim()).filter(Boolean),
    markers,
  };
  const preview = formatEntry(draft, draftId);
  const publishGroup = group || DEFAULT_RESOURCE_GROUP;
  const valid = Boolean(title.trim() && validUrl && summary.trim() && isValidResourceDate(date));
  const titleError = touched.title && !title.trim() ? "Give this resource a title." : undefined;
  const urlError = (touched.url || url.length > 0) && !validUrl ? "Enter a complete link starting with https:// or http://." : undefined;
  const summaryError = touched.summary && !summary.trim() ? "Add a short summary so you can find the idea later." : undefined;

  function reset() {
    setDraftId(createDraftId());
    setTitle("");
    setUrl("");
    setSummary("");
    setConcepts("");
    setDate("");
    setSource("");
    setMarkers({ star: false, startHere: false, unverified: false });
    setPublished(null);
    setTouched({ title: false, url: false, summary: false });
    setCopied(false);
  }

  async function onCopy() {
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      toast.success("Markdown copied", { description: `Paste into Library/${topic.title}.md` });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to the clipboard", { description: "Open the Markdown preview below and copy the text directly." });
    }
  }

  async function onPublish() {
    if (!valid || publishing) return;
    setPublishing(true);
    try {
      const cfg = await getGitHubConfig();
      await publishNewEntry(cfg, topicSlug, publishGroup, preview);

      // Optimistically register so it shows immediately, before the redeploy.
      const id = draftId;
      const resource: Resource = {
        id,
        title: draft.title,
        url: draft.url,
        type,
        source: draft.source,
        dateRaw: draft.date || "—",
        dateSort: normalizeDate(draft.date),
        topicSlug,
        group: publishGroup,
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
    <PageContainer className="max-w-6xl">
      <PageHeader
        title="Add a resource"
        description="Keep a good find. Add a little context for your future self."
      />

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
        <form
          id="add-resource-form"
          noValidate
          className="min-w-0"
          onSubmit={(event) => {
            event.preventDefault();
            setTouched({ title: true, url: true, summary: true });
            if (configured) void onPublish();
            else void onCopy();
          }}
        >
          <fieldset disabled={publishing} className="min-w-0 space-y-8">
            <section aria-labelledby="resource-details-heading" className="space-y-4">
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="resource-details-heading" className="font-display text-lg font-semibold text-foreground">The resource</h2>
                <span className="text-xs text-muted-foreground">Title, URL, and summary are required</span>
              </div>
              <Field id="add-url" label="URL" error={urlError}>
                <div className="relative">
                  <Link2 size={17} className="pointer-events-none absolute left-3 top-3.5 text-muted-foreground" aria-hidden="true" />
                  <Input id="add-url" type="url" inputMode="url" autoComplete="url" required className="h-11 pl-10" value={url} onChange={(e) => setUrl(e.target.value)} onBlur={() => setTouched((current) => ({ ...current, url: true }))} aria-invalid={!!urlError} aria-describedby={urlError ? "add-url-error" : undefined} placeholder="https://example.com/something-worth-keeping" />
                </div>
              </Field>
              <Field id="add-title" label="Title" error={titleError}>
                <Input id="add-title" required className="h-11" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => setTouched((current) => ({ ...current, title: true }))} aria-invalid={!!titleError} aria-describedby={titleError ? "add-title-error" : undefined} placeholder="What is it called?" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="add-type" label="Type">
                  <select id="add-type" className={selectCls} value={type} onChange={(e) => setType(e.target.value as ResourceType)}>
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field id="add-date" label="Publication date" optional>
                  <DatePicker id="add-date" value={date} onChange={setDate} disabled={publishing} />
                </Field>
              </div>
              <Field id="add-source" label="Source" optional hint="Author, publication, or website. Defaults to the link’s domain.">
                <Input id="add-source" className="h-11" value={source} onChange={(e) => setSource(e.target.value)} aria-describedby="add-source-hint" placeholder={urlHost || "Author or website"} />
              </Field>
              <Field id="add-summary" label="Summary" error={summaryError}>
                <textarea id="add-summary" required value={summary} onChange={(e) => setSummary(e.target.value)} onBlur={() => setTouched((current) => ({ ...current, summary: true }))} aria-invalid={!!summaryError} aria-describedby={summaryError ? "add-summary-error" : undefined} placeholder="What’s the central idea, and why is it worth keeping?" className="min-h-[136px] w-full resize-y rounded-md border border-border bg-input p-3 text-sm leading-relaxed text-foreground placeholder:text-faint outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </Field>
            </section>

            <section aria-labelledby="resource-organize-heading" className="space-y-4 border-t border-border pt-6">
              <h2 id="resource-organize-heading" className="font-display text-lg font-semibold text-foreground">Give it a home</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="add-topic" label="Topic">
                  <select id="add-topic" className={selectCls} value={topicSlug} onChange={(e) => { setTopicSlug(e.target.value); setGroup(""); }}>
                    {topics.map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}
                  </select>
                </Field>
                <Field id="add-group" label="Group" optional>
                  <select id="add-group" className={selectCls} value={group} onChange={(e) => setGroup(e.target.value)}>
                    <option value="">{DEFAULT_RESOURCE_GROUP} (default)</option>
                    {topic.groups.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
              </div>
              <Field id="add-concepts" label="Key concepts" optional hint="Separate concepts with commas.">
                <Input id="add-concepts" className="h-11" value={concepts} onChange={(e) => setConcepts(e.target.value)} aria-describedby="add-concepts-hint" placeholder="attention, kv cache, inference" />
              </Field>
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-foreground">Reading markers</legend>
                <div className="flex flex-wrap gap-2">
                  {markerOptions.map(({ key, label, icon: Icon }) => (
                    <label key={key} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface/50 px-3 text-sm text-muted-foreground transition-colors has-[:checked]:border-primary/40 has-[:checked]:bg-primary/10 has-[:checked]:text-primary">
                      <input type="checkbox" checked={markers[key]} onChange={(e) => setMarkers({ ...markers, [key]: e.target.checked })} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                      <Icon size={15} aria-hidden="true" />{label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </section>
          </fieldset>
        </form>

        <aside className="min-w-0 space-y-5 xl:sticky xl:top-6 xl:self-start" aria-label="Resource preview and publishing">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">Library preview</h2>
            <span className="text-xs text-muted-foreground">Updates as you write</span>
          </div>
          <article className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border bg-surface/50 px-5 py-3 text-xs text-muted-foreground">
              <BookOpen size={15} className="shrink-0" aria-hidden="true" />
              <span className="truncate">{topic.title}</span>
            </div>
            <div className="p-5">
              <TypeBadge type={type} />
              <h3 className="mt-3 break-words font-display text-xl font-semibold leading-snug text-foreground">{title.trim() || "Your next good find"}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="break-all">{source.trim() || urlHost || "Original source"}</span>
                {!isUnknownResourceDate(date) && <span className="inline-flex items-center gap-1.5"><CalendarDays size={12} aria-hidden="true" />{formatResourceDate(date)}</span>}
              </div>
              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">{summary.trim() || "The main idea and a reason to come back to it. Your summary will appear here."}</p>
              {draft.keyConcepts.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{draft.keyConcepts.map((concept, index) => <span key={`${concept}-${index}`} className="max-w-full break-words rounded bg-surface-raised px-2 py-1 text-xs text-muted-foreground">{concept}</span>)}</div>}
              {markerOptions.some(({ key }) => markers[key]) && <div className="mt-4 flex flex-wrap gap-3 text-xs text-primary">{markerOptions.filter(({ key }) => markers[key]).map(({ key, label, icon: Icon }) => <span key={key} className="inline-flex items-center gap-1.5"><Icon size={13} aria-hidden="true" />{label}</span>)}</div>}
            </div>
          </article>

          <div className="space-y-3">
            {configured ? (
              <Button type="submit" form="add-resource-form" className="h-11 w-full" disabled={!valid || publishing}>
                {publishing ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                {publishing ? "Publishing…" : "Publish to library"}
              </Button>
            ) : (
              <Button className="h-11 w-full" asChild><Link to="/settings#publishing"><Github size={16} aria-hidden="true" />Connect publishing</Link></Button>
            )}
            <Button variant="outline" className="h-11 w-full" onClick={onCopy} disabled={!valid || publishing}>
              {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy Markdown"}
            </Button>
            <Button type="button" variant="ghost" className="h-11 w-full" onClick={reset} disabled={publishing || !(title || url || summary || source || date || concepts)}>
              Start a new resource
            </Button>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {!valid ? "Add a title, a valid URL, and a summary to prepare this resource." : configured ? "Publishing saves to your GitHub library and makes this resource available here immediately." : "Connect GitHub to publish here, or copy the Markdown into your library file."}
            </p>
            {!configured && <p className="text-xs leading-relaxed text-muted-foreground">Each draft has a permanent ID. Start a new resource before copying a different entry.</p>}
          </div>

          <details className="border-t border-border pt-2">
            <summary className="flex min-h-11 cursor-pointer items-center text-sm text-muted-foreground hover:text-foreground">View Markdown</summary>
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface/60 p-4 font-mono text-xs leading-relaxed text-foreground/90">{preview}</pre>
          </details>
        </aside>
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

function Field({ id, label, hint, optional, error, children }: { id: string; label: string; hint?: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex flex-wrap items-baseline gap-2">
        <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
        {optional && <span className="text-xs text-muted-foreground">Optional</span>}
      </div>
      {children}
      {error ? <p id={`${id}-error`} className="mt-1.5 text-xs text-destructive" role="alert">{error}</p> : hint && <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{hint}</p>}
    </div>
  );
}
