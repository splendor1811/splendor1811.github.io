import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { contributionGrid } from "@/lib/stats";
import { Tooltip } from "@/components/ui/tooltip";

function level(count: number): number {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

const LEVEL_BG = [
  "bg-surface-raised",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
];

export function Heatmap({ weeks = 26 }: { weeks?: number }) {
  const activity = useLiveQuery(() => db.activity.toArray(), [], []);
  const grid = contributionGrid(activity ?? [], weeks);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-[3px] overflow-x-auto">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((cell, di) => (
              <Tooltip
                key={di}
                content={
                  cell.date > new Date()
                    ? ""
                    : `${cell.count} ${cell.count === 1 ? "action" : "actions"} · ${cell.date.toLocaleDateString()}`
                }
              >
                <div
                  className={`h-[11px] w-[11px] rounded-[3px] ${LEVEL_BG[level(cell.count)]} ${
                    cell.date > new Date() ? "opacity-30" : ""
                  }`}
                />
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 self-end text-2xs text-faint">
        <span>Less</span>
        {LEVEL_BG.map((bg, i) => (
          <span key={i} className={`h-[11px] w-[11px] rounded-[3px] ${bg}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
