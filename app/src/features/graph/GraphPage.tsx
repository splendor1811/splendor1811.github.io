import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ForceGraph2D from "react-force-graph-2d";
import { Eye, EyeOff, Maximize2 } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/primitives";
import { buildGraph, type GraphNode } from "@/lib/graph";
import { topics } from "@/lib/content";
import { useProgressMap } from "@/hooks/personal";
import { cn, hexToRgb } from "@/lib/utils";

const GRAPH_INK = "#1a1a1e";
const GRAPH_PAPER = "#f8f5eb";

function topicBox(node: GraphNode, ctx: CanvasRenderingContext2D) {
  ctx.font = "600 4.8px Fredoka, sans-serif";
  return { width: Math.max(28, ctx.measureText(node.label).width + 9), height: 12.5 };
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y - height / 2, width, height, radius);
}

export function GraphPage() {
  const navigate = useNavigate();
  const progress = useProgressMap();
  const wrapRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const [size, setSize] = useState({ w: 800, h: 560 });
  const [showResources, setShowResources] = useState(false);
  const [focusTopic, setFocusTopic] = useState<string | null>(null);
  const [hover, setHover] = useState<GraphNode | null>(null);

  const data = useMemo(() => buildGraph(progress, { showResources }), [progress, showResources]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    document.fonts.ready.then(() => fgRef.current?.d3Reheat?.());
  }, []);

  useEffect(() => {
    const graph = fgRef.current;
    if (!graph) return;
    graph.d3Force("charge")?.strength(showResources ? -18 : -78);
    graph.d3Force("link")?.distance((link: { kind?: string }) => showResources ? (link.kind === "related" ? 72 : 22) : 62);
    graph.d3Reheat?.();
  }, [showResources, data]);

  const dimmed = (n: GraphNode) => focusTopic != null && n.topicSlug !== focusTopic;

  return (
    <PageContainer className="max-w-[1400px]">
      <PageHeader
        eyebrow="Knowledge graph"
        title="The constellation"
        description="Every topic and resource, connected. Related topics pull together; click a node to open it."
        actions={
          <Button variant="secondary" size="sm" onClick={() => setShowResources((v) => !v)}>
            {showResources ? <EyeOff size={14} /> : <Eye size={14} />}
            {showResources ? "Topics only" : "Show resources"}
          </Button>
        }
      />

      <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter graph by topic">
        <button
          onClick={() => setFocusTopic(null)}
          className={cn(
            "min-h-10 rounded-full border-2 px-3 font-mono text-[10px] font-semibold uppercase tracking-wide shadow-subtle transition-transform hover:-translate-y-0.5",
            !focusTopic ? "bg-accent text-foreground" : "bg-surface text-muted-foreground",
          )}
        >
          All
        </button>
        {topics.map((t) => (
          <button
            key={t.slug}
            onClick={() => setFocusTopic(focusTopic === t.slug ? null : t.slug)}
            className={cn(
              "flex min-h-10 items-center gap-1.5 rounded-full border-2 border-border px-3 font-mono text-[10px] font-semibold uppercase tracking-wide shadow-subtle transition-transform hover:-translate-y-0.5",
              focusTopic === t.slug ? "text-foreground" : "bg-surface text-muted-foreground",
            )}
            style={focusTopic === t.slug ? { background: `rgba(${hexToRgb(t.color)},0.42)` } : undefined}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
            {t.short}
          </button>
        ))}
      </div>

      <div
        ref={wrapRef}
        className="atlas-surface relative mt-4 h-[66vh] min-h-[520px] overflow-hidden rounded-lg border-2 border-border bg-[#f8f5eb] shadow-raised"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b-2 border-border bg-[#f8f5eb]/95 px-4 py-2.5 backdrop-blur">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#57575f]">Drag to explore · scroll to zoom · click to open</p>
          <p className="hidden font-display text-sm font-semibold text-[#1a1a1e] sm:block">{data.nodes.length.toLocaleString()} nodes</p>
        </div>
        <ForceGraph2D
          ref={fgRef}
          graphData={data}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          nodeRelSize={4}
          nodeVal={(n: any) => n.val}
          cooldownTicks={120}
          onEngineStop={() => fgRef.current?.zoomToFit(400, 90)}
          linkColor={(link: any) => {
            const source = typeof link.source === "object" ? link.source as GraphNode : null;
            const target = typeof link.target === "object" ? link.target as GraphNode : null;
            const faded = focusTopic && source?.topicSlug !== focusTopic && target?.topicSlug !== focusTopic;
            if (faded) return "rgba(26,26,30,0.025)";
            return link.kind === "related" ? "rgba(26,26,30,0.38)" : "rgba(26,26,30,0.10)";
          }}
          linkWidth={(l: any) => (l.kind === "related" ? 1.6 : 0.65)}
          onNodeHover={(n: any) => setHover(n ?? null)}
          onNodeClick={(n: any) => {
            if (n.kind === "topic") navigate(`/topics/${n.topicSlug}`);
            else navigate(`/resource/${n.id}`);
          }}
          nodeCanvasObject={(node: any, ctx) => {
            const n = node as GraphNode & { x: number; y: number };
            const isTopic = n.kind === "topic";
            const r = n.status === "completed" ? 2.8 : 2.15;
            const alpha = dimmed(n) ? 0.12 : 1;

            ctx.globalAlpha = alpha;
            if (isTopic) {
              const box = topicBox(n, ctx);
              roundedRect(ctx, n.x + 1.4, n.y + 1.4, box.width, box.height, 3.2);
              ctx.fillStyle = GRAPH_INK;
              ctx.fill();
              roundedRect(ctx, n.x, n.y, box.width, box.height, 3.2);
              ctx.fillStyle = n.color;
              ctx.fill();
              ctx.strokeStyle = GRAPH_INK;
              ctx.lineWidth = 0.75;
              ctx.stroke();
              ctx.font = "600 4.8px Fredoka, sans-serif";
              ctx.fillStyle = GRAPH_INK;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(n.label, n.x, n.y + 0.2);
            } else {
              ctx.beginPath();
              ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
              ctx.fillStyle = n.status === "unread" ? GRAPH_PAPER : n.color;
              ctx.fill();
              ctx.strokeStyle = n.color;
              ctx.lineWidth = n.status === "reading" ? 1.15 : 0.7;
              ctx.stroke();
              if (n.priority) {
                ctx.beginPath();
                ctx.arc(n.x, n.y, r + 1.35, 0, 2 * Math.PI);
                ctx.strokeStyle = GRAPH_INK;
                ctx.lineWidth = 0.55;
                ctx.stroke();
              }
            }
            ctx.globalAlpha = 1;
          }}
          nodePointerAreaPaint={(node: any, color, ctx) => {
            const n = node as GraphNode & { x: number; y: number };
            ctx.fillStyle = color;
            if (n.kind === "topic") {
              const box = topicBox(n, ctx);
              roundedRect(ctx, n.x, n.y, box.width, box.height, 3.2);
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.arc(n.x, n.y, 3.2, 0, 2 * Math.PI);
              ctx.fill();
            }
          }}
        />

        {/* Hover card */}
        {hover && (
          <div className="pointer-events-none absolute bottom-4 left-4 max-w-xs rounded-lg border-2 border-[#1a1a1e] bg-[#ffd21e] p-3 text-[#1a1a1e] shadow-raised">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: hover.color }} />
              <span className="font-mono text-[9px] font-semibold uppercase tracking-wider">{hover.kind}</span>
            </div>
            <p className="mt-1 font-display text-sm font-semibold">{hover.label}</p>
          </div>
        )}

        <button
          onClick={() => fgRef.current?.zoomToFit(400, 60)}
          className="absolute right-3 top-14 z-20 flex h-11 w-11 items-center justify-center rounded-lg border-2 border-[#1a1a1e] bg-[#ffd21e] text-[#1a1a1e] shadow-subtle transition-transform hover:-translate-y-0.5"
          aria-label="Fit to view"
        >
          <Maximize2 size={15} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-4 w-8 rounded border-2 border-border bg-accent shadow-[2px_2px_0_hsl(var(--border))]" /> Cards are topics
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-primary bg-primary" /> Filled = active / completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-primary bg-surface" /> Hollow = unread
        </span>
        <span className="flex items-center gap-1.5"><span className="h-4 w-4 rounded-full border border-border ring-1 ring-offset-1" /> Double ring = must-read</span>
      </div>
    </PageContainer>
  );
}
