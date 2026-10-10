import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowUpRight, ArrowRight, Search, BookOpen, Bookmark, Repeat, Network, Plus } from "lucide-react";
import { PageContainer } from "@/components/PageHeader";
import { TopicIcon } from "@/components/TopicIcon";
import { ResourceRow } from "@/components/ResourceRow";
import { Button, Kbd } from "@/components/ui/primitives";
import { topics, topicBySlug, priorityQueue } from "@/lib/content";
import { useResources, usePendingIds } from "@/hooks/publishing";
import { useProgressMap, useReviewCount } from "@/hooks/personal";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export function DashboardPage() {
  const navigate = useNavigate();
  const resources = useResources();
  const pending = usePendingIds();
  const progress = useProgressMap();
  const reviews = useReviewCount();
  const [query, setQuery] = useState("");
  const notes = useLiveQuery(async () => (await db.notes.toArray()).filter(n => n.body.trim()).length, [], 0);
  const reading = resources.filter(r => progress.get(r.id) === "reading");
  const complete = resources.filter(r => progress.get(r.id) === "completed").length;
  const seen = new Set<string>();
  const picks = [...priorityQueue.map(p => resources.find(r => r.url === p.url)), ...resources.filter(r => r.markers.startHere || r.markers.star)]
    .filter((r): r is typeof resources[number] => !!r && !seen.has(r.id) && !!seen.add(r.id));
  const spotlight = reading[0] ?? picks.find(r => progress.get(r.id) !== "completed") ?? resources[0];
  const desk = (reading.length ? reading : picks).filter(r => r.id !== spotlight?.id).slice(0, 4);
  const domainCounts = topics.map(t => ({...t, count: resources.filter(r => r.topicSlug === t.slug).length}));
  const recent = [...resources].filter(r => r.dateSort).sort((a,b) => b.dateSort!.localeCompare(a.dateSort!)).slice(0, 3);

  return <PageContainer>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
      <span>Splendor's research atlas</span>
      <span>{new Intl.DateTimeFormat("en", {weekday:"long", day:"numeric", month:"long", year:"numeric"}).format(new Date())}</span>
    </div>
    <section className="grid items-center gap-8 xl:grid-cols-[1.05fr_1fr]">
      <div className="min-w-0 pb-2 pt-2">
        <h1 className="font-display text-[clamp(2.75rem,4.4vw,4.5rem)] font-semibold leading-[1.12] tracking-[-0.055em]">Your AI research,<br/><span className="text-primary">connected.</span></h1>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted-foreground">A living library for ideas worth keeping.<br className="hidden sm:block"/> Read deeply. Find connections. Build what comes next.</p>
        <form onSubmit={e => {e.preventDefault();navigate("/library"+(query.trim()?"?q="+encodeURIComponent(query.trim()):""));}} className="mt-7 flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface p-2 pl-4 shadow-subtle">
          <Search size={21} className="text-primary"/>
          <input aria-label="Search your research library" value={query} onChange={e=>setQuery(e.target.value)} placeholder="What are you exploring?" className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-faint"/>
          <Button type="submit" size="icon" aria-label="Search library"><ArrowRight size={20}/></Button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span>Explore</span>
          {topics.filter(t=>["reinforcement-learning","diffusion-flow-matching","efficient-inference-serving"].includes(t.slug)).map(t=><Link key={t.slug} to={"/topics/"+t.slug} className="inline-flex min-h-11 min-w-11 items-center justify-center font-medium text-foreground underline decoration-border underline-offset-4 hover:text-primary">{t.short}</Link>)}
          <span className="ml-auto hidden items-center gap-1.5 sm:flex"><Kbd>⌘ K</Kbd> quick search</span>
        </div>
      </div>
      <div className="relative hidden min-w-0 overflow-hidden rounded-2xl border border-border bg-surface xl:block">
        <div className="atlas-surface absolute inset-0"/>
        <div className="relative flex items-center justify-between px-5 pt-5"><span className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><Network size={16}/> The shape of your knowledge</span><Link to="/graph" className="flex h-11 w-11 items-center justify-center rounded-lg text-primary hover:bg-primary/10" aria-label="Explore knowledge graph"><ArrowUpRight size={20}/></Link></div>
        <KnowledgeAtlas count={resources.length}/>
        <p className="relative px-5 pb-5 text-xs text-muted-foreground">Connections follow the related topics in your library.</p>
      </div>
    </section>

    <div className="my-8 grid grid-cols-2 gap-y-5 border-y border-border py-5 sm:grid-cols-4">
      {[{label:"Resources collected",value:resources.length,to:"/library"},{label:"Research topics",value:topics.length,to:"/topics"},{label:"Currently reading",value:reading.length,to:"/library?status=reading"},{label:"Notes written",value:notes,to:"/activity"}].map(s=>
        <Link key={s.label} to={s.to} className="group flex min-h-11 flex-col gap-1 px-3 first:pl-0 sm:border-r sm:border-border sm:px-6 sm:last:border-0">
          <span className="font-display text-3xl font-semibold tabular-nums tracking-tight group-hover:text-primary">{s.value}</span><span className="text-xs text-muted-foreground">{s.label}</span>
        </Link>)}
    </div>

    <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,1fr)]">
      <section className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-display text-xl font-semibold tracking-tight">{reading.length ? "Back to your reading desk" : "A good place to begin"}</h2><Link to="/library?star=1" className="flex min-h-11 items-center gap-1 text-xs font-medium text-primary">Reading picks <ArrowUpRight size={15}/></Link></div>
        {spotlight && <article className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/[0.055] p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-primary"><BookOpen size={16}/>{reading.length?"Continue reading":"From your priority queue"}<span className="ml-auto rounded-md border border-primary/20 px-2 py-1">{spotlight.type}</span></div>
          <h3 className="mt-5 max-w-[32ch] font-display text-[clamp(1.3rem,2vw,1.75rem)] font-semibold leading-snug tracking-tight"><Link to={"/resource/"+spotlight.id} className="hover:text-primary">{spotlight.title}</Link></h3>
          <p className="mt-3 line-clamp-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">{spotlight.summary}</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{spotlight.source} · {formatDate(spotlight.dateRaw,spotlight.dateSort)}</span><Button asChild><Link to={"/resource/"+spotlight.id}>Open reading notes <ArrowUpRight size={16}/></Link></Button></div>
        </article>}
        <div className="mt-4 divide-y divide-border">{desk.map(r=><ResourceRow key={r.id} resource={r} pending={pending.has(r.id)}/>)}</div>
      </section>
      <aside className="min-w-0">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-xl font-semibold tracking-tight">Explore a topic</h2><Link to="/topics" className="flex min-h-11 items-center gap-1 text-xs font-medium text-primary">View all <ArrowUpRight size={15}/></Link></div>
        <div className="divide-y divide-border border-y border-border">{[...domainCounts].sort((a,b)=>b.count-a.count).slice(0,6).map(t=>
          <Link key={t.slug} to={"/topics/"+t.slug} className="group flex min-h-[72px] items-center gap-3 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-primary"><TopicIcon name={t.icon} size={19}/></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-medium group-hover:text-primary">{t.title}</span><span className="mt-1 block text-xs text-muted-foreground">{t.count} resources</span></span><ArrowUpRight size={16} className="text-faint"/>
          </Link>)}</div>
        <div className="mt-5 rounded-xl bg-surface p-5">
          <div className="flex items-center gap-2 text-sm font-medium"><Bookmark size={17} className="text-primary"/> Your reading practice</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{complete ? complete+" resources completed. Every note adds a connection." : "Mark a resource as reading, capture a thought, and make it yours."}</p>
          <Link to={reviews.due ? "/review" : "/roadmap"} className="mt-3 flex min-h-11 items-center gap-2 text-sm font-medium text-primary"><Repeat size={16}/>{reviews.due ? reviews.due+" resources due for review" : "Find a learning path"}<ArrowUpRight size={15}/></Link>
        </div>
      </aside>
    </div>
    <section className="mt-9 border-t border-border pt-6">
      <div className="mb-2 flex items-center justify-between gap-3"><div><h2 className="font-display text-xl font-semibold">Recent in your library</h2><p className="mt-1 text-xs text-muted-foreground">Ordered by publication date where available.</p></div><Link to="/library?sort=newest" className="flex min-h-11 items-center text-xs font-medium text-primary">Browse all <ArrowUpRight size={15}/></Link></div>
      <div className="divide-y divide-border">{recent.map(r=><ResourceRow key={r.id} resource={r}/>)}</div>
    </section>
    <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground"><span>Second Brain · Built around your curiosity.</span><Link to="/add" className="flex min-h-11 items-center gap-2 text-primary"><Plus size={16}/> Save something worth reading</Link></footer>
  </PageContainer>;
}

function KnowledgeAtlas({count}: {count:number}) {
  const nodes = topics.map((t,i) => ({...t,x:250+174*Math.cos(i/topics.length*Math.PI*2-Math.PI/2),y:173+118*Math.sin(i/topics.length*Math.PI*2-Math.PI/2)}));
  const positions = new Map(nodes.map(n=>[n.slug,n]));
  const edges = new Set<string>();
  return <svg viewBox="0 0 500 346" className="relative w-full" role="img" aria-labelledby="atlas-title atlas-description">
    <title id="atlas-title">Your research topics</title><desc id="atlas-description">{topics.length} topics connected by the related-topic links in your library. Open the knowledge graph to explore.</desc>
    {nodes.flatMap(n=>n.relatedSlugs.map(slug=> {
      const to=positions.get(slug); const key=[n.slug,slug].sort().join(":");
      if(!to||edges.has(key)) return null; edges.add(key);
      return <path key={key} d={`M ${n.x} ${n.y} Q 250 173 ${to.x} ${to.y}`} stroke="hsl(var(--primary) / .13)" strokeWidth="1" fill="none"/>;
    }))}
    <circle cx="250" cy="173" r="45" fill="hsl(var(--primary))"/>
    <text x="250" y="172" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="26" fontWeight="600" fontFamily="Space Grotesk, sans-serif">{count}</text>
    <text x="250" y="190" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12">resources</text>
    {nodes.map(n=><g key={n.slug}><rect x={n.x-43} y={n.y-20} width="86" height="40" rx="8" fill="hsl(var(--surface))" stroke="hsl(var(--border))"/><text x={n.x} y={n.y+4} textAnchor="middle" fontSize="12" fontWeight="500" fill="hsl(var(--foreground))">{topicBySlug.get(n.slug)?.short}</text></g>)}
  </svg>;
}
