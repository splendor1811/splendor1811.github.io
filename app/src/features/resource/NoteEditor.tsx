import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, Pencil, Check } from "lucide-react";
import { saveNote } from "@/lib/db";
import { useNote } from "@/hooks/personal";
import { cn } from "@/lib/utils";

export function NoteEditor({ resourceId, topicSlug }: { resourceId: string; topicSlug: string }) {
  const stored = useNote(resourceId);
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [saved, setSaved] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const hydrated = useRef(false);

  // Hydrate once from storage.
  useEffect(() => {
    if (stored && !hydrated.current) {
      setValue(stored.body);
      hydrated.current = true;
      if (stored.body) setMode("preview");
    }
  }, [stored]);

  function onChange(next: string) {
    setValue(next);
    setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      saveNote(resourceId, next, topicSlug);
      setSaved(true);
    }, 600);
  }

  const hasContent = value.trim().length > 0;

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-foreground">Your notes</h2>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-2xs text-faint">
            {saved ? (
              <>
                <Check size={12} className="text-success" /> Saved
              </>
            ) : (
              "Saving…"
            )}
          </span>
          {hasContent && (
            <div className="flex overflow-hidden rounded-md border border-border">
              <button
                onClick={() => setMode("edit")}
                className={cn("px-2 py-1", mode === "edit" ? "bg-surface-raised text-foreground" : "text-faint")}
                aria-label="Edit"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setMode("preview")}
                className={cn("px-2 py-1", mode === "preview" ? "bg-surface-raised text-foreground" : "text-faint")}
                aria-label="Preview"
              >
                <Eye size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {mode === "edit" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Capture insights, questions, key takeaways… Markdown supported."
          className="min-h-[160px] w-full resize-y rounded-lg border border-border bg-input p-3.5 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-faint focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : (
        <div
          onClick={() => setMode("edit")}
          className="prose-notes min-h-[160px] cursor-text rounded-lg border border-border bg-surface/50 p-3.5"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
        </div>
      )}
    </section>
  );
}
