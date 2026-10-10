import { NavLink } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { TopicIcon } from "@/components/TopicIcon";
import { PRIMARY_NAV, FOOTER_NAV, type NavItem } from "@/lib/nav";
import { topics } from "@/lib/content";
import { useResources } from "@/hooks/publishing";
import { cn } from "@/lib/utils";

function NavRow({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const Icon = item.icon;
  return <NavLink to={item.to} end={item.to === "/"} onClick={onNavigate}
    className={({isActive}) => cn("flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", isActive ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
    <Icon size={18} /><span className="min-w-0 flex-1 truncate">{item.label}</span>
  </NavLink>;
}

export function Sidebar({onNavigate}: {onNavigate?: () => void}) {
  const resources = useResources();
  return <div className="flex h-full flex-col">
    <NavLink to="/" onClick={onNavigate} className="flex h-[72px] shrink-0 items-center px-5"><Logo size={32}/></NavLink>
    <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-border px-3 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-display font-semibold text-primary">S</span>
        <div className="min-w-0"><p className="text-sm font-semibold">Splendor's workspace</p><p className="mt-0.5 text-xs text-muted-foreground">Personal research library</p></div>
      </div>
      <nav aria-label="Main navigation" className="space-y-1">{PRIMARY_NAV.slice(0,5).map(item=><NavRow key={item.to} item={item} onNavigate={onNavigate}/>)}</nav>
      <p className="mb-2 mt-5 px-3 text-xs font-medium text-faint">Your practice</p>
      <nav aria-label="Learning tools" className="space-y-1">{PRIMARY_NAV.slice(5).map(item=><NavRow key={item.to} item={item} onNavigate={onNavigate}/>)}</nav>
      <div className="mb-2 mt-6 flex items-center justify-between px-3"><p className="text-xs font-medium text-faint">Research topics</p><NavLink to="/topics" onClick={onNavigate} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted" aria-label="Explore all topics"><ArrowUpRight size={15}/></NavLink></div>
      <nav aria-label="Research topics" className="space-y-0.5">
        {topics.map(t => <NavLink key={t.slug} to={"/topics/"+t.slug} onClick={onNavigate}
          className={({isActive})=>cn("flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors",isActive?"bg-primary/10 font-medium text-primary":"text-muted-foreground hover:bg-muted hover:text-foreground")}>
          <TopicIcon name={t.icon} size={15}/><span className="min-w-0 flex-1 truncate">{t.short}</span><span className="text-xs tabular-nums text-faint">{resources.filter(r=>r.topicSlug===t.slug).length}</span>
        </NavLink>)}
      </nav>
    </div>
    <div className="shrink-0 border-t border-border px-3 py-3">{FOOTER_NAV.map(item=><NavRow key={item.to} item={item} onNavigate={onNavigate}/>)}</div>
  </div>;
}
