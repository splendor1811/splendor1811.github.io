import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ExternalLink, ArrowUpRight, Inbox, Check, BookOpen, Clock3, Info } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button, Input } from "@/components/ui/primitives";
import { intake, type IntakeEntry } from "@/lib/intake";
import { topicBySlug } from "@/lib/content";
import { cn } from "@/lib/utils";

const states = {
  imported: {label:"Added to library",icon:Check},
  existing: {label:"Already in library",icon:BookOpen},
  "needs-review": {label:"Needs verification",icon:Clock3},
};

export function SourcesPage() {
  const [params,setParams] = useSearchParams();
  const query=params.get("q")??"";
  const status=params.get("status")??"all";
  const [visibleCount, setVisibleCount] = useState(50);
  useEffect(() => setVisibleCount(50), [query, status]);
  const normalized = (text:string) => text.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  const filtered=intake.entries.filter(e=>(status==="all"||e.status===status)&&normalized(`${e.title} ${e.source} ${e.note}`).includes(normalized(query)));
  function update(key:string,value:string){setParams(current=>{const next=new URLSearchParams(current);value?next.set(key,value):next.delete(key);return next;},{replace:key==="q"});}
  return <PageContainer>
    <PageHeader title="Sources & inbox" description="Every reference has a trail. See what was added, what you already had, and what still needs a closer read."/>
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground">
      {intake.coverage.edgeTabs != null && <span><strong className="font-semibold text-foreground">{intake.coverage.edgeTabs}</strong> Edge tabs checked across {intake.coverage.edgeWindows} windows</span>}
      {intake.coverage.edgeUniqueUrls != null && <span><strong className="font-semibold text-foreground">{intake.coverage.edgeUniqueUrls}</strong> distinct URLs inventoried</span>}
      {intake.updatedAt && <span>Reviewed {new Intl.DateTimeFormat("en",{dateStyle:"medium"}).format(new Date(intake.updatedAt))}</span>}
    </div>
    {intake.coverage.xStatus && <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed"><Info size={19} className="mt-0.5 shrink-0 text-primary"/><div><p className="font-medium">{intake.coverage.xComplete ? "X repost coverage verified" : "X repost review"}</p><p className="mt-1 text-muted-foreground">{intake.coverage.xStatus}</p></div></div>}
    <div className="relative mt-6"><Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary"/><Input type="search" aria-label="Search source inventory" value={query} onChange={e=>update("q",e.target.value)} placeholder="Find a source, article or review note…" className="h-14 rounded-xl pl-12 text-base"/></div>
    <div className="mt-5 flex max-w-full gap-1 overflow-x-auto border-b border-border" role="group" aria-label="Source status">
      {[{key:"all",label:"All sources"},...Object.entries(states).map(([key,s])=>({key,label:s.label}))].map(s=><button key={s.key} type="button" aria-pressed={status===s.key} onClick={()=>update("status",s.key)} className={cn("min-h-12 shrink-0 border-b-2 px-3 text-sm",status===s.key?"border-primary font-semibold text-primary":"border-transparent text-muted-foreground")}>
        {s.label} <span className="ml-1 text-xs tabular-nums">{s.key==="all"?intake.entries.length:intake.entries.filter(e=>e.status===s.key).length}</span>
      </button>)}
    </div>
    <p className="my-4 text-xs text-muted-foreground">{filtered.length} public references · Personal pages and unrelated tabs are omitted from this public view.</p>
    {!filtered.length ? <EmptyState icon={Inbox} title={intake.entries.length?"No matching sources":"Source review in progress"} description={intake.entries.length?"Try another search or status filter.":"Reviewed references will appear here with their verification status."}/> :
      <div className="divide-y divide-border">{filtered.slice(0,visibleCount).map(e=><SourceRow key={e.id} entry={e}/>)}</div>}
    {filtered.length > visibleCount && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"><p className="text-sm text-muted-foreground">Showing {visibleCount} of {filtered.length} matching references</p><Button variant="secondary" onClick={()=>setVisibleCount(n=>n+50)}>Show 50 more sources</Button></div>}
  </PageContainer>;
}

function SourceRow({entry:e}:{entry:IntakeEntry}) {
  const state=states[e.status];
  const Icon=state.icon;
  const topic=e.domainSlug?topicBySlug.get(e.domainSlug):null;
  const safeUrl=/^https?:\/\//.test(e.url)?e.url:undefined;
  return <article className="grid min-w-0 gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto]">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2 py-1"><Icon size={13}/>{state.label}</span><span>{e.source}</span>{topic&&<Link to={"/topics/"+topic.slug} className="py-2 text-primary hover:underline">{topic.short}</Link>}</div>
      <h2 className="mt-2 text-base font-semibold leading-relaxed">{e.resourceId?<Link to={"/resource/"+e.resourceId} className="hover:text-primary">{e.title}</Link>:e.title}</h2>
      <p className="mt-2 max-w-[78ch] text-sm leading-relaxed text-muted-foreground">{e.note}</p>
      {e.verifiedAt&&<p className="mt-2 text-xs text-muted-foreground">Source checked {new Intl.DateTimeFormat("en",{dateStyle:"medium"}).format(new Date(e.verifiedAt))}</p>}
    </div>
    <div className="flex items-center gap-2 self-start sm:self-center">
      {e.resourceId&&<Link to={"/resource/"+e.resourceId} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border px-3 text-sm text-primary hover:bg-primary/5">Reading notes <ArrowUpRight size={15}/></Link>}
      {safeUrl&&<a href={safeUrl} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted" aria-label={"Open source: "+e.title}><ExternalLink size={17}/></a>}
    </div>
  </article>;
}
