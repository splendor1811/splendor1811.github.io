import { useId, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { CircleAlert, Loader2, Route, Star, UploadCloud, X } from "lucide-react";
import { Button, Input } from "@/components/ui/primitives";
import { DatePicker } from "@/components/ui/date-picker";
import type { Resource, ResourceType } from "@/data/schema";
import { TYPES } from "@/lib/content";
import { formatEntry } from "@/lib/mdWriteback";
import { normalizeDate } from "@/data/parser/parse";
import { getGitHubConfig, publishEditEntry } from "@/lib/github";
import { addOverlayPatch } from "@/lib/overlay";
import { logActivity } from "@/lib/db";
import { isValidResourceDate } from "@/lib/resource-fields";

const selectCls =
  "h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function EditResourceDialog({
  resource,
  open,
  onOpenChange,
}: {
  resource: Resource;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [saving, setSaving] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!saving) onOpenChange(nextOpen); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[60] max-h-[90dvh] w-[calc(100vw-24px)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-popover p-5 shadow-raised sm:p-6">
          <EditResourceForm resource={resource} saving={saving} setSaving={setSaving} onClose={() => onOpenChange(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Mount with the dialog so cancelled changes never leak into the next editing session.
function EditResourceForm({ resource, saving, setSaving, onClose }: {
  resource: Resource;
  saving: boolean;
  setSaving: (saving: boolean) => void;
  onClose: () => void;
}) {
  const formId = useId();
  const initialDate = resource.dateRaw === "—" ? "" : resource.dateRaw;
  const [type, setType] = useState<ResourceType>(resource.type);
  const [source, setSource] = useState(resource.source);
  const [date, setDate] = useState(initialDate);
  const [summary, setSummary] = useState(resource.summary);
  const [concepts, setConcepts] = useState(resource.keyConcepts.join(", "));
  const [markers, setMarkers] = useState(resource.markers);
  const [summaryTouched, setSummaryTouched] = useState(false);
  const valid = Boolean(summary.trim()) && (isValidResourceDate(date) || date === initialDate);

  async function onSave() {
    if (!valid || saving) return;
    setSaving(true);
    try {
      const keyConcepts = concepts.split(",").map((c) => c.trim()).filter(Boolean);
      const savedSource = source.trim() || "Unknown";
      const savedDate = date.trim();
      const savedSummary = summary.trim();
      const entry = formatEntry({
        title: resource.title,
        url: resource.url,
        type,
        source: savedSource,
        date: savedDate,
        summary: savedSummary,
        keyConcepts,
        markers,
      });
      const cfg = await getGitHubConfig();
      await publishEditEntry(cfg, resource.topicSlug, resource.url, entry, resource.id);
      await addOverlayPatch(resource.id, {
        type,
        source: savedSource,
        dateRaw: savedDate || "—",
        dateSort: normalizeDate(savedDate),
        summary: savedSummary,
        keyConcepts,
        markers,
      });
      await logActivity({ type: "edited", resourceId: resource.id, topicSlug: resource.topicSlug });
      toast.success("Changes published", { description: "Live across the site in ~1–2 min." });
      onClose();
    } catch (err) {
      toast.error("Couldn't publish", { description: (err as Error).message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Dialog.Title className="font-display text-xl font-semibold text-foreground">Edit resource</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm leading-relaxed text-muted-foreground">Refine the details, then publish the update to your library.</Dialog.Description>
        </div>
        <Dialog.Close disabled={saving} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" aria-label="Close edit resource">
          <X size={19} aria-hidden="true" />
        </Dialog.Close>
      </div>

      <p className="mt-4 border-y border-border py-3 text-sm font-medium leading-relaxed text-foreground">{resource.title}</p>

      <form noValidate onSubmit={(event) => { event.preventDefault(); setSummaryTouched(true); void onSave(); }}>
        <fieldset disabled={saving} className="mt-5 min-w-0 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block min-w-0">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Type</span>
              <select className={selectCls} value={type} onChange={(e) => setType(e.target.value as ResourceType)}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <div className="min-w-0">
              <label htmlFor={`${formId}-date`} className="mb-1.5 block text-sm font-medium text-foreground">Publication date <span className="ml-1 text-xs font-normal text-muted-foreground">Optional</span></label>
              <DatePicker id={`${formId}-date`} value={date} onChange={setDate} legacyValue={initialDate} disabled={saving} />
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Source <span className="ml-1 text-xs font-normal text-muted-foreground">Optional</span></span>
            <Input className="h-11" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Author or website" />
          </label>
          <div>
            <label htmlFor={`${formId}-summary`} className="mb-1.5 block text-sm font-medium text-foreground">Summary</label>
            <textarea id={`${formId}-summary`} required value={summary} onChange={(e) => setSummary(e.target.value)} onBlur={() => setSummaryTouched(true)} aria-invalid={summaryTouched && !summary.trim()} aria-describedby={summaryTouched && !summary.trim() ? `${formId}-summary-error` : undefined} className="min-h-[132px] w-full resize-y rounded-md border border-border bg-input p-3 text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            {summaryTouched && !summary.trim() && <p id={`${formId}-summary-error`} className="mt-1.5 text-xs text-destructive" role="alert">Add a short summary before publishing.</p>}
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Key concepts <span className="ml-1 text-xs font-normal text-muted-foreground">Optional</span></span>
            <Input className="h-11" value={concepts} onChange={(e) => setConcepts(e.target.value)} placeholder="Separate concepts with commas" />
          </label>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-foreground">Reading markers</legend>
            <div className="flex flex-wrap gap-2">
              {([
                { key: "star", label: "Must-read", icon: Star },
                { key: "startHere", label: "Start here", icon: Route },
                { key: "unverified", label: "Unverified", icon: CircleAlert },
              ] as const).map(({ key, label, icon: Icon }) => (
                <label key={key} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border bg-surface/50 px-3 text-sm text-muted-foreground has-[:checked]:border-primary/40 has-[:checked]:bg-primary/10 has-[:checked]:text-primary">
                  <input type="checkbox" checked={markers[key]} onChange={(e) => setMarkers({ ...markers, [key]: e.target.checked })} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                  <Icon size={15} aria-hidden="true" />{label}
                </label>
              ))}
            </div>
          </fieldset>
        </fieldset>

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="ghost" className="h-11" disabled={saving} onClick={onClose}>Cancel</Button>
          <Button type="submit" className="h-11" disabled={saving || !valid}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            {saving ? "Publishing…" : "Publish changes"}
          </Button>
        </div>
      </form>
    </>
  );
}
