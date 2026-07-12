import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Button, Input } from "@/components/ui/primitives";
import type { Resource, ResourceType } from "@/data/schema";
import { TYPES } from "@/lib/content";
import { formatEntry } from "@/lib/mdWriteback";
import { normalizeDate } from "@/data/parser/parse";
import { getGitHubConfig, publishEditEntry } from "@/lib/github";
import { addOverlayPatch } from "@/lib/overlay";
import { logActivity } from "@/lib/db";

const selectCls =
  "h-9 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function EditResourceDialog({
  resource,
  open,
  onOpenChange,
}: {
  resource: Resource;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [type, setType] = useState<ResourceType>(resource.type);
  const [source, setSource] = useState(resource.source);
  const [date, setDate] = useState(resource.dateRaw === "—" ? "" : resource.dateRaw);
  const [summary, setSummary] = useState(resource.summary);
  const [concepts, setConcepts] = useState(resource.keyConcepts.join(", "));
  const [markers, setMarkers] = useState(resource.markers);
  const [saving, setSaving] = useState(false);

  async function onSave() {
    setSaving(true);
    try {
      const keyConcepts = concepts.split(",").map((c) => c.trim()).filter(Boolean);
      const entry = formatEntry({
        title: resource.title,
        url: resource.url,
        type,
        source: source || "Unknown",
        date,
        summary,
        keyConcepts,
        markers,
      });
      const cfg = await getGitHubConfig();
      await publishEditEntry(cfg, resource.topicSlug, resource.url, entry);
      await addOverlayPatch(resource.id, {
        type,
        source,
        dateRaw: date || "—",
        dateSort: normalizeDate(date),
        summary,
        keyConcepts,
        markers,
      });
      await logActivity({ type: "added", resourceId: resource.id, topicSlug: resource.topicSlug });
      toast.success("Changes published", { description: "Live across the site in ~1–2 min." });
      onOpenChange(false);
    } catch (err) {
      toast.error("Couldn't publish", { description: (err as Error).message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[60] max-h-[88vh] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 animate-scale-in overflow-y-auto rounded-xl border border-border bg-popover p-6 shadow-raised">
          <div className="flex items-start justify-between">
            <div>
              <Dialog.Title className="font-display text-lg font-semibold text-foreground">Edit resource</Dialog.Title>
              <Dialog.Description className="mt-0.5 text-xs text-muted-foreground">
                Publishing updates <code className="font-mono">{resource.topicSlug}</code> Markdown on GitHub.
              </Dialog.Description>
            </div>
            <Dialog.Close className="rounded-md p-1 text-faint hover:text-foreground">
              <X size={18} />
            </Dialog.Close>
          </div>

          <p className="mt-3 truncate rounded-md border border-border bg-surface/50 px-3 py-2 text-sm font-medium text-foreground">
            {resource.title}
          </p>

          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Type</span>
                <select className={selectCls} value={type} onChange={(e) => setType(e.target.value as ResourceType)}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Date</span>
                <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="2026-07-12 or —" />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Source</span>
              <Input value={source} onChange={(e) => setSource(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Summary</span>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="min-h-[90px] w-full resize-y rounded-md border border-border bg-input p-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Key concepts</span>
              <Input value={concepts} onChange={(e) => setConcepts(e.target.value)} />
            </label>
            <div className="flex flex-wrap gap-3">
              {(["star", "startHere", "unverified"] as const).map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={markers[m]}
                    onChange={(e) => setMarkers({ ...markers, [m]: e.target.checked })}
                    className="h-4 w-4 accent-[hsl(var(--primary))]"
                  />
                  {m === "star" ? "⭐" : m === "startHere" ? "🔁" : "⚠️"}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={saving || !summary.trim()}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
              Publish changes
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
