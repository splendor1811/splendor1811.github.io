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
  return <NavLink to={item.to} end={item.to === "/"} onClick={onNavigate} className={({isActive}) => cn("flex min-h-11 items-center gap-3 rounded-md border-2 px-3 py-2 text-sm font-semibold transition-transform", isActive ? "border-border bg-accent text-foreground shadow-subtle" : "border-transparent text-muted-foreground hover:border-border hover:bg-surface-raised")}><Icon size={18}/><span className="min-w-0 flex-1 truncate">{item.label}</span></NavLink>;
}

export function Sidebar({onNavigate}: {onNavigate?: () => void}) {
  const resources = useResources();
  return <div className="flex h-full flex-col">
    <NavLink to="/" onClick={onNavigate} className="flex min-h-[78px] shrink-0 items-center border-b-2 border-border px-5"><Logo size={34}/></NavLink>
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="mb-4 rounded-lg border-2 border-border bg-[#3b6ff5] p-4 text-white shadow-subtle"><p className="font-display text-lg font-semibold">Splendor's workspace</p><p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/80">Personal research library</p></div>
      <p className="rail mb-2 px-2">Navigate</p><nav aria-label="Main navigation" className="space-y-1">{PRIMARY_NAV.map(item=><NavRow key={item.to} item={item} onNavigate={onNavigate}/>)}</nav>
      <div className="mb-2 mt-6 flex items-center justify-between px-2"><p className="rail">Research topics</p><NavLink to="/topics" onClick={onNavigate} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-accent" aria-label="Explore all topics"><ArrowUpRight size={16}/></NavLink></div>
      <nav aria-label="Research topics" className="space-y-1">
        {topics.map((t,index) => <NavLink key={t.slug} to={"/topics/"+t.slug} onClick={onNavigate} className={({isActive})=>cn("flex min-h-11 items-center gap-2.5 rounded-md border-2 px-3 text-sm",isActive?"border-border bg-surface-raised font-semibold shadow-subtle":"border-transparent text-muted-foreground hover:border-border hover:bg-surface")}><span className={cn("flex h-7 w-7 items-center justify-center rounded-full border border-foreground text-foreground", ["bg-[#ffd21e]","bg-[#ff8a1f]","bg-[#62c889]","bg-[#bc82f4]","bg-[#ff7277]"][index%5])}><TopicIcon name={t.icon} size={13}/></span><span className="min-w-0 flex-1 truncate">{t.short}</span><span className="font-mono text-[10px] font-semibold tabular-nums">{resources.filter(r=>r.topicSlug===t.slug).length}</span></NavLink>)}
      </nav>
    </div>
    <div className="shrink-0 border-t-2 border-border p-3">{FOOTER_NAV.map(item=><NavRow key={item.to} item={item} onNavigate={onNavigate}/>)}</div>
  </div>;
}
