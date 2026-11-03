import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowUpRight, ArrowRight, Search, BookOpen, Bookmark, Repeat, Network, Plus, Clock3 } from "lucide-react";
import { PageContainer } from "@/components/PageHeader";
import { TopicIcon } from "@/components/TopicIcon";
import { ResourceRow } from "@/components/ResourceRow";
import { Button, Kbd } from "@/components/ui/primitives";
import { topics, topicBySlug, priorityQueue } from "@/lib/content";
import { useResources, usePendingIds, useAddedTimestamps } from "@/hooks/publishing";
import { useProgressMap, useReviewCount } from "@/hooks/personal";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { intake } from "@/lib/intake";
import { compareRecentlyAdded, recentPendingReposts } from "@/lib/recent";
import atlasConstellation from "@/assets/research-constellation.webp";

export function DashboardPage() {
  const navigate = useNavigate();
  const resources = useResources();
  const pending = usePendingIds();
  const addedAt = useAddedTimestamps();
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
  const recent = [...resources].sort((a,b) => compareRecentlyAdded(a,b,addedAt)).slice(0, 3);
  const newReposts = recentPendingReposts(intake.entries);

  return <PageContainer>
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] font-semibold uppercase tracking-[.12em] text-muted-foreground">
      <span className="pulse-chip bg-accent">Live knowledge signal</span>
      <span>{new Intl.DateTimeFormat("en", {weekday:"long", day:"numeric", month:"long", year:"numeric"}).format(new Date())}</span>
    </div>
    <section className="grid items-center gap-8 xl:grid-cols-[1.05fr_1fr]">
      <div className="min-w-0 pb-2 pt-2">
        <p className="rail mb-4 text-primary">Observe · connect · understand</p>
        <h1 className="font-display text-[clamp(3.25rem,6.2vw,6.5rem)] font-semibold leading-[.94] tracking-[-0.055em]">Your research.<br/><span className="pulse-highlight">In motion.</span></h1>
        <p className="mt-7 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">Track the ideas shaping modern AI. Connect papers, courses and field notes into one living knowledge system.</p>
        <form onSubmit={e => {e.preventDefault();navigate("/library"+(query.trim()?"?q="+encodeURIComponent(query.trim()):""));}} className="mt-8 flex min-w-0 items-center gap-3 rounded-lg border-2 border-border bg-surface p-2 pl-4 shadow-raised">
          <Search size={22} className="text-primary"/>
          <input aria-label="Search your research library" value={query} onChange={e=>setQuery(e.target.value)} placeholder="What are you exploring?" className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-faint"/>
          <Button type="submit" size="icon" aria-label="Search library"><ArrowRight size={20}/></Button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="font-mono font-semibold uppercase tracking-wider">Explore</span>
          {topics.filter(t=>["reinforcement-learning","diffusion-flow-matching","efficient-inference-serving"].includes(t.slug)).map(t=><Link key={t.slug} to={"/topics/"+t.slug} className="pulse-link inline-flex min-h-11 min-w-11 items-center justify-center">{t.short}</Link>)}
          <span className="ml-auto hidden items-center gap-1.5 sm:flex"><Kbd>⌘ K</Kbd> quick search</span>
        </div>
      </div>
      <div className="pulse-panel relative hidden min-w-0 overflow-hidden xl:block">
        <div className="atlas-surface absolute inset-0"/>
        <img src={atlasConstellation} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply dark:mix-blend-screen"/>
        <div className="relative flex items-center justify-between px-5 pt-5"><span className="pulse-chip bg-[#bc82f4]"><Network size={14}/> Knowledge map</span><Link to="/graph" className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border bg-accent shadow-subtle" aria-label="Explore knowledge graph"><ArrowUpRight size={20}/></Link></div>
        <KnowledgeAtlas count={resources.length}/>
        <p className="relative px-5 pb-5 text-xs text-muted-foreground">Connections follow the related topics in your library.</p>
      </div>
    </section>

    <div className="my-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[{label:"Resources collected",value:resources.length,to:"/library"},{label:"Research topics",value:topics.length,to:"/topics"},{label:"Currently reading",value:reading.length,to:"/library?status=reading"},{label:"Notes written",value:notes,to:"/activity"}].map(s=>
        <Link key={s.label} to={s.to} className="pulse-panel-sm group flex min-h-[100px] flex-col justify-center gap-1 px-4 transition-transform hover:-translate-y-1">
          <span className="font-display text-4xl font-semibold tabular-nums tracking-tight group-hover:text-primary">{s.value}</span><span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</span>
        </Link>)}
    </div>

    <DomainPulseChart domains={domainCounts} total={resources.length} />

    <div className="mt-10 grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,1fr)]">
      <section className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-display text-xl font-semibold tracking-tight">{reading.length ? "Back to your reading desk" : "A good place to begin"}</h2><Link to="/library?star=1" className="flex min-h-11 items-center gap-1 text-xs font-medium text-primary">Reading picks <ArrowUpRight size={15}/></Link></div>
        {spotlight && <article className="pulse-panel relative overflow-hidden bg-[#ffd21e] p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground"><BookOpen size={16}/>{reading.length?"Continue reading":"From your priority queue"}<span className="ml-auto rounded-full border-2 border-border bg-surface px-2 py-1">{spotlight.type}</span></div>
          <h3 className="mt-5 max-w-[32ch] font-display text-[clamp(1.3rem,2vw,1.75rem)] font-semibold leading-snug tracking-tight"><Link to={"/resource/"+spotlight.id} className="hover:text-primary">{spotlight.title}</Link></h3>
          <p className="mt-3 line-clamp-3 max-w-[62ch] text-sm leading-relaxed text-foreground/70">{spotlight.summary}</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{spotlight.source} · {formatDate(spotlight.dateRaw,spotlight.dateSort)}</span><Button asChild><Link to={"/resource/"+spotlight.id}>Open reading notes <ArrowUpRight size={16}/></Link></Button></div>
        </article>}
        <div className="mt-4 divide-y divide-border">{desk.map((r,index)=><ResourceRow key={r.id} resource={r} pending={pending.has(r.id)} tone={index}/>)}</div>
      </section>
      <aside className="min-w-0">
        <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-xl font-semibold tracking-tight">Explore a topic</h2><Link to="/topics" className="flex min-h-11 items-center gap-1 text-xs font-medium text-primary">View all <ArrowUpRight size={15}/></Link></div>
        <div className="pulse-panel-sm divide-y-2 divide-border overflow-hidden px-4">{[...domainCounts].sort((a,b)=>b.count-a.count).slice(0,6).map((t,index)=>
          <Link key={t.slug} to={"/topics/"+t.slug} className="group flex min-h-[72px] items-center gap-3 py-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-border text-foreground ${["bg-[#3b6ff5]","bg-[#ff8a1f]","bg-[#62c889]","bg-[#bc82f4]","bg-[#ff7277]","bg-[#ffd21e]"][index]}`}><TopicIcon name={t.icon} size={19}/></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-medium group-hover:text-primary">{t.title}</span><span className="mt-1 block text-xs text-muted-foreground">{t.count} resources</span></span><ArrowUpRight size={16} className="text-faint"/>
          </Link>)}</div>
        <div className="pulse-panel-sm mt-5 bg-[#bc82f4] p-5 text-foreground">
          <div className="flex items-center gap-2 text-sm font-medium"><Bookmark size={17} className="text-primary"/> Your reading practice</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{complete ? complete+" resources completed. Every note adds a connection." : "Mark a resource as reading, capture a thought, and make it yours."}</p>
          <Link to={reviews.due ? "/review" : "/roadmap"} className="mt-3 flex min-h-11 items-center gap-2 text-sm font-medium text-primary"><Repeat size={16}/>{reviews.due ? reviews.due+" resources due for review" : "Find a learning path"}<ArrowUpRight size={15}/></Link>
        </div>
      </aside>
    </div>
    {newReposts.length > 0 && <section className="mt-9 border-t border-border pt-6" aria-labelledby="new-reposts-heading">
      <div className="mb-2 flex items-center justify-between gap-3"><div><h2 id="new-reposts-heading" className="font-display text-xl font-semibold">New reposts to review</h2><p className="mt-1 text-xs text-muted-foreground">Discovered recently; source material has not yet been reviewed for the Library.</p></div><Link to="/sources?origin=x&status=needs-review" className="flex min-h-11 items-center gap-1 text-xs font-medium text-primary">Source inbox <ArrowUpRight size={15}/></Link></div>
      <div className="grid gap-3 md:grid-cols-3">{newReposts.map(entry => <article key={entry.id} className="min-w-0 rounded-xl border border-border bg-surface p-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 size={14}/> Awaiting source review</span>
        <h3 className="mt-2 text-sm font-semibold leading-relaxed"><a href={entry.url} target="_blank" rel="noreferrer" className="hover:text-primary">{entry.title} <ArrowUpRight size={14} className="inline"/></a></h3>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{entry.note}</p>
      </article>)}</div>
    </section>}
    <section className="mt-9 border-t border-border pt-6">
      <div className="mb-2 flex items-center justify-between gap-3"><div><h2 className="font-display text-xl font-semibold">Recently added to your Library</h2><p className="mt-1 text-xs text-muted-foreground">Ordered by when each source entered the Library, not its publication date.</p></div><Link to="/library?sort=added" className="flex min-h-11 items-center text-xs font-medium text-primary">Browse all <ArrowUpRight size={15}/></Link></div>
      <div className="divide-y divide-border">{recent.map((r,index)=><ResourceRow key={r.id} resource={r} addedAt={addedAt.get(r.id)} tone={index}/>)}</div>
    </section>
    <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground"><span>Second Brain · Built around your curiosity.</span><Link to="/add" className="flex min-h-11 items-center gap-2 text-primary"><Plus size={16}/> Save something worth reading</Link></footer>
  </PageContainer>;
}

function DomainPulseChart({domains,total}: {domains: Array<(typeof topics)[number] & {count:number}>; total:number}) {
  const rows=[...domains].sort((a,b)=>b.count-a.count).slice(0,9);
  const max=Math.max(...rows.map(row=>row.count));
  const colors=["#3b6ff5","#ff8a1f","#2f8f5b","#a35bf0","#e5484d","#ffd21e","#36a7a0","#ef78b7","#7792ee"];
  return <section className="pulse-panel overflow-hidden" aria-labelledby="domain-pulse-title">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-border px-5 py-4 sm:px-6">
      <div><p className="rail text-primary">Library distribution</p><h2 id="domain-pulse-title" className="mt-1 font-display text-2xl font-semibold">Research signal by domain</h2></div>
      <div className="flex items-baseline gap-2"><span className="font-display text-4xl font-semibold tabular-nums">{total}</span><span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">total sources</span></div>
    </div>
    <div className="atlas-surface overflow-x-auto px-4 pb-5 pt-7 sm:px-6" aria-label="Scrollable chart of the nine largest research domains">
      <div className="relative min-w-[680px]">
        <div className="absolute inset-x-0 bottom-[74px] top-0 grid grid-rows-4" aria-hidden>{[0,1,2,3].map(line=><span key={line} className="border-t border-foreground/10" />)}</div>
        <div className="relative grid h-[230px] grid-cols-9 items-end gap-4">
          {rows.map((row,index)=><Link key={row.slug} to={`/topics/${row.slug}`} className="group flex h-full min-w-0 flex-col justify-end" aria-label={`${row.title}: ${row.count} resources`}>
            <span className="mb-2 text-center font-mono text-[10px] font-semibold tabular-nums text-foreground">{row.count}</span>
            <span className="mx-auto w-full max-w-14 rounded-t-md border-2 border-b-0 border-border transition-all group-hover:-translate-y-1 group-hover:brightness-105" style={{height:`${Math.max(24,row.count/max*138)}px`,backgroundColor:colors[index]}} />
            <span className="flex h-[62px] items-start justify-center border-t-2 border-border pt-2 text-center font-mono text-[9px] font-semibold uppercase leading-tight tracking-tight text-muted-foreground">{row.short}</span>
          </Link>)}
        </div>
      </div>
    </div>
  </section>;
}

function KnowledgeAtlas({count}: {count:number}) {
  const pastels=["#c9d8ff","#ffd0e5","#dec7fa","#c7ebd3","#e5cff8","#bde7e2","#d1d9fb","#c8dafa","#ffd5ad","#bee4e1","#ffeb91","#ffbec1","#c2e1cc","#ffdcad"];
  const nodes = topics.map((t,i) => ({...t,tone:pastels[i%pastels.length],x:300+235*Math.cos(i/topics.length*Math.PI*2-Math.PI/2),y:210+165*Math.sin(i/topics.length*Math.PI*2-Math.PI/2)}));
  const positions = new Map(nodes.map(n=>[n.slug,n]));
  const edges = new Set<string>();
  return <svg viewBox="0 0 600 420" className="relative w-full" role="img" aria-labelledby="atlas-title atlas-description">
    <title id="atlas-title">Your research topics</title><desc id="atlas-description">{topics.length} topics connected by the related-topic links in your library. Open the knowledge graph to explore.</desc>
    {nodes.flatMap(n=>n.relatedSlugs.map(slug=> {
      const to=positions.get(slug); const key=[n.slug,slug].sort().join(":");
      if(!to||edges.has(key)) return null; edges.add(key);
      return <path key={key} d={`M ${n.x} ${n.y} Q 300 210 ${to.x} ${to.y}`} stroke={n.color} strokeOpacity=".34" strokeWidth="1.6" fill="none"/>;
    }))}
    <circle cx="305" cy="215" r="49" fill="hsl(var(--foreground))"/>
    <circle cx="300" cy="210" r="49" fill="#ffd21e" stroke="hsl(var(--foreground))" strokeWidth="3"/>
    <text x="300" y="208" textAnchor="middle" fill="hsl(var(--accent-foreground))" fontSize="28" fontWeight="600" fontFamily="Fredoka, sans-serif">{count}</text>
    <text x="300" y="228" textAnchor="middle" fill="hsl(var(--accent-foreground))" fontSize="12" fontFamily="Source Sans 3, sans-serif">resources</text>
    {nodes.map(n=><g key={n.slug}>
      <rect x={n.x-37} y={n.y-13} width="78" height="32" rx="9" fill="hsl(var(--foreground))"/>
      <rect x={n.x-40} y={n.y-16} width="78" height="32" rx="9" fill={n.tone} stroke="hsl(var(--border))" strokeWidth="2"/>
      <circle cx={n.x-32} cy={n.y-8} r="3.5" fill={n.color} stroke="hsl(var(--border))" strokeWidth="1"/>
      <text x={n.x} y={n.y+4} textAnchor="middle" fontSize="10.5" fontWeight="600" fontFamily="Fredoka, sans-serif" fill="hsl(var(--foreground))">{topicBySlug.get(n.slug)?.short}</text>
    </g>)}
  </svg>;
}
