import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { Search, Menu, Moon, Sun, Flame, Plus } from "lucide-react";
import { Button, Kbd } from "@/components/ui/primitives";
import { Tooltip } from "@/components/ui/tooltip";
import { useUI } from "@/store/ui";
import { db } from "@/lib/db";
import { computeStreak } from "@/lib/stats";
import { cn } from "@/lib/utils";

function useStreak() {
  return useLiveQuery(async () => computeStreak((await db.activity.toArray()).map((a) => a.at)), [], 0);
}

export function TopBar() {
  const navigate = useNavigate();
  const { setCommandOpen, setSidebarOpen, theme, toggleTheme } = useUI();
  const streak = useStreak();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-md md:px-5">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </Button>

      <button
        onClick={() => setCommandOpen(true)}
        className="group flex h-9 flex-1 items-center gap-2.5 rounded-md border border-border bg-surface px-3 text-sm text-faint transition-colors hover:border-primary/30 hover:text-muted-foreground md:max-w-md"
      >
        <Search size={15} className="shrink-0" />
        <span className="flex-1 text-left">Search resources, topics, tags…</span>
        <span className="hidden items-center gap-0.5 sm:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-1">
        <Tooltip content={streak > 0 ? `${streak}-day streak` : "Start a streak by reading today"}>
          <button
            onClick={() => navigate("/activity")}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors",
              streak > 0 ? "text-accent hover:bg-accent/10" : "text-faint hover:bg-surface-raised",
            )}
          >
            <Flame size={16} className={streak > 0 ? "fill-accent/20" : ""} />
            <span className="font-mono tabular-nums">{streak}</span>
          </button>
        </Tooltip>

        <Tooltip content="Add resource">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate("/add")} aria-label="Add resource">
            <Plus size={18} />
          </Button>
        </Tooltip>

        <Tooltip content={theme === "dark" ? "Light mode" : "Dark mode"}>
          <Button variant="ghost" size="icon-sm" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </Button>
        </Tooltip>
      </div>
    </header>
  );
}
