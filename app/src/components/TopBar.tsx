import { Link, NavLink } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, Menu, Moon, Sun, Plus, ShieldCheck } from "lucide-react";
import { Button, Kbd } from "@/components/ui/primitives";
import { Logo } from "@/components/Logo";
import { useUI } from "@/store/ui";
import { PRIMARY_NAV } from "@/lib/nav";
import { useAuth } from "@/features/auth/AuthProvider";
import { cn } from "@/lib/utils";

const headlineNav = PRIMARY_NAV.filter(item => ["/", "/library", "/topics", "/roadmap"].includes(item.to));

export function TopBar() {
  const { setCommandOpen, theme, toggleTheme } = useUI();
  const auth = useAuth();
  return (
    <header className="relative z-30 shrink-0 overflow-hidden border-b-2 border-border bg-background/95 px-3 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-[1400px] items-center gap-2 lg:gap-4">
        <Dialog.Trigger asChild><Button variant="outline" size="icon" aria-label="Open all navigation"><Menu size={20} /></Button></Dialog.Trigger>
        <Link to="/" className="min-w-0 flex-1 overflow-hidden rounded-md xl:flex-none"><Logo size={34}/></Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 rounded-full border-2 border-border bg-surface p-1 xl:flex">
          {headlineNav.map(item => <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({isActive}) => cn("rounded-full px-4 py-2 text-sm font-semibold transition-colors", isActive ? "bg-accent text-foreground" : "hover:bg-muted")}>{item.label}</NavLink>)}
        </nav>
        <button onClick={() => setCommandOpen(true)} className="hidden h-11 min-w-0 items-center gap-2 rounded-md border-2 border-border bg-surface px-3 text-sm text-muted-foreground shadow-subtle transition-transform hover:-translate-y-0.5 md:flex md:w-[235px]" aria-label="Search resources, topics and concepts">
          <Search size={18} className="text-primary"/><span className="truncate">Search the signal</span><span className="ml-auto"><Kbd>⌘K</Kbd></span>
        </button>
        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setCommandOpen(true)} aria-label="Search"><Search size={19}/></Button>
        <Link to={auth.configured ? "/account" : "/settings"} className="hidden h-11 items-center gap-1.5 rounded-md border-2 border-border bg-surface px-3 font-mono text-[10px] font-semibold uppercase tracking-wide hover:bg-primary lg:flex" aria-label={auth.userId ? "Open your account" : "Personal progress is private to this browser"}><ShieldCheck size={15} />{auth.userId ? "Account" : "Local"}</Link>
        <Button variant="outline" size="icon" className="hidden sm:inline-flex" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</Button>
        <Button asChild className="hidden sm:inline-flex"><Link to="/add"><Plus size={17}/> Add resource</Link></Button>
        <Button asChild size="icon" className="sm:hidden"><Link to="/add" aria-label="Add resource"><Plus size={19}/></Link></Button>
      </div>
    </header>
  );
}
