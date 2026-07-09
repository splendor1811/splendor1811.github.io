import { Star, Repeat, AlertTriangle, FileText, ScrollText, Video, GraduationCap, BookMarked, Github, Newspaper } from "lucide-react";
import type { Resource, ResourceType } from "@/data/schema";
import { Tooltip } from "@/components/ui/tooltip";
import { cn, hexToRgb } from "@/lib/utils";

export const TYPE_STYLE: Record<ResourceType, { color: string; icon: typeof Star }> = {
  Blog: { color: "#7C8CFF", icon: FileText },
  Paper: { color: "#F5A97F", icon: ScrollText },
  Video: { color: "#FB7185", icon: Video },
  Course: { color: "#4ADE9E", icon: GraduationCap },
  Book: { color: "#F2C55C", icon: BookMarked },
  Repo: { color: "#56C7F5", icon: Github },
  News: { color: "#C084FC", icon: Newspaper },
};

export function TypeBadge({ type, className }: { type: ResourceType; className?: string }) {
  const s = TYPE_STYLE[type];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-2xs font-medium uppercase tracking-wide",
        className,
      )}
      style={{
        color: s.color,
        borderColor: `rgba(${hexToRgb(s.color)}, 0.3)`,
        background: `rgba(${hexToRgb(s.color)}, 0.1)`,
      }}
    >
      <Icon size={11} strokeWidth={2.2} />
      {type}
    </span>
  );
}

export function MarkerBadges({ markers, size = 14 }: { markers: Resource["markers"]; size?: number }) {
  return (
    <>
      {markers.star && (
        <Tooltip content="Must-read / must-watch">
          <Star size={size} className="fill-accent/25 text-accent" />
        </Tooltip>
      )}
      {markers.startHere && (
        <Tooltip content="Recommended starting point">
          <Repeat size={size} className="text-success" />
        </Tooltip>
      )}
      {markers.unverified && (
        <Tooltip content="Summary reconstructed — verify details">
          <AlertTriangle size={size} className="text-faint" />
        </Tooltip>
      )}
    </>
  );
}
