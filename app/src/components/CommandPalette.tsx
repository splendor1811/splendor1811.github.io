import { useMemo, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Moon,
  Sun,
  Plus,
  CornerDownLeft,
  Hash,
} from "lucide-react";
import { useUI } from "@/store/ui";
import { search as runSearch } from "@/lib/search";
import { getResource, topicBySlug } from "@/lib/content";
import { PRIMARY_NAV } from "@/lib/nav";
import { TypeBadge } from "@/components/ResourceMeta";
import { TopicIcon } from "@/components/TopicIcon";
import { hexToRgb } from "@/lib/utils";

export function CommandPalette() {
  const { commandOpen, setCommandOpen, toggleTheme, theme } = useUI();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = useMemo(() => runSearch(query, 8), [query]);

  function go(to: string) {
    setCommandOpen(false);
    setQuery("");
    navigate(to);
  }

  return (
    <Command.Dialog
      open={commandOpen}
      onOpenChange={setCommandOpen}
      label="Command menu"
      shouldFilter={false}
      className="fixed inset-0 z-[60]"
    >
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-fade-in"
        onClick={() => setCommandOpen(false)}
      />
      <div className="absolute left-1/2 top-[12vh] w-[92vw] max-w-xl -translate-x-1/2 animate-scale-in overflow-hidden rounded-xl border border-border bg-popover shadow-raised">
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <Search size={16} className="text-faint" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            autoFocus
            placeholder="Search or jump to…"
            className="h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-faint"
          />
        </div>
        <Command.List className="max-h-[52vh] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-faint">
            No results for “{query}”.
          </Command.Empty>

          {query && results.length > 0 && (
            <Command.Group
              heading="Results"
              className="[&_[cmdk-group-heading]]:rail [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
            >
              {results.map((r) => {
                if (r.kind === "topic") {
                  const slug = String(r.id).replace("topic:", "");
                  const t = topicBySlug.get(slug);
                  return (
                    <Item key={r.id} onSelect={() => go(`/topics/${slug}`)}>
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-md"
                        style={{ background: `rgba(${hexToRgb(t?.color ?? "#7C8CFF")},0.14)`, color: t?.color }}
                      >
                        <TopicIcon name={t?.icon ?? "Circle"} size={13} />
                      </span>
                      <span className="flex-1 truncate">{r.title}</span>
                      <span className="rail">Topic</span>
                    </Item>
                  );
                }
                const res = getResource(String(r.id));
                if (!res) return null;
                return (
                  <Item key={r.id} onSelect={() => go(`/resource/${res.id}`)}>
                    <TypeBadge type={res.type} />
                    <span className="flex-1 truncate">{res.title}</span>
                    <CornerDownLeft size={13} className="text-faint" />
                  </Item>
                );
              })}
            </Command.Group>
          )}

          {!query && (
            <>
              <Command.Group
                heading="Go to"
                className="[&_[cmdk-group-heading]]:rail [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
              >
                {PRIMARY_NAV.map((n) => (
                  <Item key={n.to} onSelect={() => go(n.to)}>
                    <n.icon size={16} className="text-faint" />
                    <span className="flex-1">{n.label}</span>
                  </Item>
                ))}
              </Command.Group>
              <Command.Group
                heading="Actions"
                className="[&_[cmdk-group-heading]]:rail [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
              >
                <Item onSelect={() => go("/add")}>
                  <Plus size={16} className="text-faint" />
                  <span className="flex-1">Add resource</span>
                </Item>
                <Item
                  onSelect={() => {
                    toggleTheme();
                    setCommandOpen(false);
                  }}
                >
                  {theme === "dark" ? <Sun size={16} className="text-faint" /> : <Moon size={16} className="text-faint" />}
                  <span className="flex-1">Toggle theme</span>
                </Item>
              </Command.Group>
            </>
          )}
        </Command.List>
        <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-2xs text-faint">
          <Hash size={11} />
          <span>{query ? "Enter to open" : "Type to search 178 resources"}</span>
        </div>
      </div>
    </Command.Dialog>
  );
}

function Item({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm text-muted-foreground aria-selected:bg-surface-raised aria-selected:text-foreground"
    >
      {children}
    </Command.Item>
  );
}
