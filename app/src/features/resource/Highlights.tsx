import { useState } from "react";
import { Highlighter, Trash2, Plus } from "lucide-react";
import { addHighlight, removeHighlight, type HighlightColor } from "@/lib/db";
import { useHighlights } from "@/hooks/personal";
import { cn } from "@/lib/utils";

const COLORS: { key: HighlightColor; className: string; bar: string }[] = [
  { key: "amber", className: "bg-accent/15 border-accent/30", bar: "bg-accent" },
  { key: "indigo", className: "bg-primary/15 border-primary/30", bar: "bg-primary" },
  { key: "green", className: "bg-success/15 border-success/30", bar: "bg-success" },
  { key: "rose", className: "bg-destructive/15 border-destructive/30", bar: "bg-destructive" },
];

export function Highlights({ resourceId, topicSlug }: { resourceId: string; topicSlug: string }) {
  const highlights = useHighlights(resourceId) ?? [];
  const [text, setText] = useState("");
  const [color, setColor] = useState<HighlightColor>("amber");

  function add() {
    if (!text.trim()) return;
    addHighlight({ resourceId, text: text.trim(), color }, topicSlug);
    setText("");
  }

  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <Highlighter size={15} className="text-accent" />
        <h2 className="font-display text-sm font-semibold text-foreground">Highlights</h2>
        {highlights.length > 0 && (
          <span className="font-mono text-2xs text-faint">{highlights.length}</span>
        )}
      </div>

      <div className="rounded-lg border border-border bg-surface/50 p-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) add();
          }}
          placeholder="Paste a passage worth remembering…"
          className="min-h-[52px] w-full resize-none bg-transparent p-1.5 text-sm text-foreground outline-none placeholder:text-faint"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c.key}
                onClick={() => setColor(c.key)}
                className={cn(
                  "h-5 w-5 rounded-full border-2 transition-transform",
                  c.bar,
                  color === c.key ? "scale-110 border-foreground/40" : "border-transparent opacity-60",
                )}
                aria-label={`${c.key} highlight`}
              />
            ))}
          </div>
          <button
            onClick={add}
            disabled={!text.trim()}
            className="flex items-center gap-1 rounded-md bg-surface-raised px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-40"
          >
            <Plus size={13} /> Add
          </button>
        </div>
      </div>

      {highlights.length > 0 && (
        <ul className="mt-3 space-y-2">
          {highlights.map((h) => {
            const c = COLORS.find((x) => x.key === h.color) ?? COLORS[0];
            return (
              <li
                key={h.id}
                className={cn("group flex gap-3 rounded-lg border p-3 text-sm", c.className)}
              >
                <span className={cn("mt-0.5 w-0.5 shrink-0 rounded-full", c.bar)} />
                <p className="flex-1 leading-relaxed text-foreground/90">{h.text}</p>
                <button
                  onClick={() => h.id && removeHighlight(h.id)}
                  className="h-6 w-6 shrink-0 rounded text-faint opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  aria-label="Delete highlight"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
