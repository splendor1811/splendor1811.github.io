import { NavLink } from "react-router-dom";
import { Plus } from "lucide-react";
import { Logo } from "@/components/Logo";
import { TopicIcon } from "@/components/TopicIcon";
import { PRIMARY_NAV, FOOTER_NAV } from "@/lib/nav";
import { topics, resources } from "@/lib/content";
import { useProgressMap } from "@/hooks/personal";
import { cn, hexToRgb } from "@/lib/utils";

function NavRow({
  to,
  label,
  icon: Icon,
  onNavigate,
  badge,
}: {
  to: string;
  label: string;
  icon: typeof Plus;
  onNavigate?: () => void;
  badge?: number;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
          isActive
            ? "bg-surface-raised text-foreground"
            : "text-muted-foreground hover:bg-surface-raised/60 hover:text-foreground",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={17}
            className={cn("shrink-0", isActive ? "text-primary" : "text-faint group-hover:text-muted-foreground")}
          />
          <span className="flex-1 truncate font-medium">{label}</span>
          {badge != null && badge > 0 && (
            <span className="rounded-full bg-accent/20 px-1.5 text-2xs font-semibold text-accent">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const progress = useProgressMap();

  const topicProgress = (slug: string) => {
    const list = resources.filter((r) => r.topicSlug === slug);
    const done = list.filter((r) => progress.get(r.id) === "completed").length;
    return { done, total: list.length, pct: list.length ? done / list.length : 0 };
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center px-4">
        <NavLink to="/" onClick={onNavigate}>
          <Logo />
        </NavLink>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <nav className="space-y-0.5">
          {PRIMARY_NAV.map((item) => (
            <NavRow key={item.to} {...item} onNavigate={onNavigate} />
          ))}
        </nav>

        <div className="mt-6 mb-2 flex items-center justify-between px-2.5">
          <span className="rail">Topics</span>
          <span className="font-mono text-2xs text-faint">{topics.length}</span>
        </div>
        <nav className="space-y-0.5">
          {topics.map((t) => {
            const p = topicProgress(t.slug);
            return (
              <NavLink
                key={t.slug}
                to={`/topics/${t.slug}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-surface-raised text-foreground"
                      : "text-muted-foreground hover:bg-surface-raised/60 hover:text-foreground",
                  )
                }
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                  style={{
                    background: `rgba(${hexToRgb(t.color)}, 0.14)`,
                    color: t.color,
                  }}
                >
                  <TopicIcon name={t.icon} size={13} />
                </span>
                <span className="flex-1 truncate text-[13px]">{t.short}</span>
                <span className="font-mono text-2xs text-faint">
                  {p.done}/{p.total}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border p-3">
        <NavLink
          to="/add"
          onClick={onNavigate}
          className="mb-2 flex items-center gap-2.5 rounded-md border border-dashed border-border px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <Plus size={16} className="text-faint" />
          Add resource
        </NavLink>
        {FOOTER_NAV.map((item) => (
          <NavRow key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}
