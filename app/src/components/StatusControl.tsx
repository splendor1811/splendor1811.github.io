import { Circle, CircleDashed, BookOpen, CheckCircle2, Archive, ChevronDown } from "lucide-react";
import type { ReadStatus } from "@/lib/db";
import { setStatus } from "@/lib/db";
import { useStatus } from "@/hooks/personal";
import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";

export const STATUS_META: Record<
  ReadStatus,
  { label: string; icon: typeof Circle; color: string; dot: string }
> = {
  unread: { label: "Unread", icon: Circle, color: "text-faint", dot: "bg-faint" },
  reading: { label: "Reading", icon: BookOpen, color: "text-primary", dot: "bg-primary" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-success", dot: "bg-success" },
  archived: { label: "Archived", icon: Archive, color: "text-muted-foreground", dot: "bg-muted-foreground" },
};

const ORDER: ReadStatus[] = ["unread", "reading", "completed", "archived"];

export function StatusControl({
  resourceId,
  topicSlug,
  variant = "pill",
}: {
  resourceId: string;
  topicSlug?: string;
  variant?: "pill" | "full";
}) {
  const status = useStatus(resourceId);
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <DropdownMenu>
      <DropdownTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-raised text-sm font-medium transition-colors hover:border-primary/30",
            variant === "pill" ? "h-7 px-2 text-xs" : "h-9 px-3",
          )}
        >
          <Icon size={variant === "pill" ? 13 : 15} className={meta.color} />
          <span className={variant === "pill" ? "hidden sm:inline" : ""}>{meta.label}</span>
          <ChevronDown size={12} className="text-faint" />
        </button>
      </DropdownTrigger>
      <DropdownContent align="start">
        {ORDER.map((s) => {
          const m = STATUS_META[s];
          const MIcon = m.icon;
          return (
            <DropdownItem key={s} active={s === status} onSelect={() => setStatus(resourceId, s, topicSlug)}>
              <span className="flex items-center gap-2">
                <MIcon size={14} className={m.color} />
                {m.label}
              </span>
            </DropdownItem>
          );
        })}
      </DropdownContent>
    </DropdownMenu>
  );
}

export function StatusDot({ status }: { status: ReadStatus }) {
  const meta = STATUS_META[status] ?? STATUS_META.unread;
  if (status === "unread") return <CircleDashed size={13} className="text-faint/60" />;
  const Icon = meta.icon;
  return <Icon size={13} className={meta.color} />;
}
