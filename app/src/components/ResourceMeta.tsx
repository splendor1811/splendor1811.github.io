import { Star, Repeat, AlertTriangle, FileText, ScrollText, Video, GraduationCap, BookMarked, Github, Newspaper } from "lucide-react";
import type { Resource, ResourceType } from "@/data/schema";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      <Icon size={13} aria-hidden="true" />
      {type}
    </span>
  );
}

export function MarkerBadges({ markers, size = 14 }: { markers: Resource["markers"]; size?: number }) {
  return (
    <>
      {markers.star && (
        <Tooltip content="Must-read / must-watch">
          <span role="img" aria-label="Must-read"><Star size={size} className="fill-accent/15 text-accent" /></span>
        </Tooltip>
      )}
      {markers.startHere && (
        <Tooltip content="Recommended starting point">
          <span role="img" aria-label="Recommended starting point"><Repeat size={size} className="text-success" /></span>
        </Tooltip>
      )}
      {markers.unverified && (
        <Tooltip content="Summary reconstructed — verify details">
          <span role="img" aria-label="Unverified summary"><AlertTriangle size={size} className="text-faint" /></span>
        </Tooltip>
      )}
    </>
  );
}
