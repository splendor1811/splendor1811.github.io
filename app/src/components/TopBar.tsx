import { Link, useLocation } from "react-router-dom";
import { Search, Menu, Moon, Sun, Plus, ChevronRight } from "lucide-react";
import { Button, Kbd } from "@/components/ui/primitives";
import { useUI } from "@/store/ui";
import { PRIMARY_NAV } from "@/lib/nav";

export function TopBar() {
  const { pathname } = useLocation();
  const { setCommandOpen, setSidebarOpen, theme, toggleTheme } = useUI();
  const section = PRIMARY_NAV.find(n => n.to !== "/" && pathname.startsWith(n.to))?.label
    ?? (pathname.startsWith("/resource/") ? "Reading desk" : pathname === "/add" ? "Add resource" : pathname === "/settings" ? "Settings" : "Overview");
  return (
    <header className="flex h-[72px] shrink-0 items-center gap-2 border-b border-border bg-surface/70 px-3 sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20} /></Button>
      <div className="hidden min-w-0 items-center gap-2 text-sm sm:flex">
        <Link to="/" className="text-muted-foreground hover:text-primary">Workspace</Link><ChevronRight size={14} className="text-faint" /><span className="truncate font-medium">{section}</span>
      </div>
      <button onClick={() => setCommandOpen(true)} className="ml-auto flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted sm:max-w-[270px]" aria-label="Search resources, topics and concepts">
        <Search size={18} /><span className="truncate">Search your brain</span><span className="ml-auto hidden sm:inline-flex"><Kbd>⌘ K</Kbd></span>
      </button>
      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
        {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
      </Button>
      <Button asChild className="hidden sm:inline-flex"><Link to="/add"><Plus size={17} /> Add resource</Link></Button>
      <Button asChild size="icon" className="sm:hidden"><Link to="/add" aria-label="Add resource"><Plus size={20} /></Link></Button>
    </header>
  );
}
