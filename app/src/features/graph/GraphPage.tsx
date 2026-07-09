import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ForceGraph2D from "react-force-graph-2d";
import { Eye, EyeOff, Maximize2 } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/primitives";
import { TopicIcon } from "@/components/TopicIcon";
import { buildGraph, type GraphNode } from "@/lib/graph";
import { topics } from "@/lib/content";
import { useProgressMap } from "@/hooks/personal";
import { cn, hexToRgb } from "@/lib/utils";

export function GraphPage() {
  const navigate = useNavigate();
  const progress = useProgressMap();
  const wrapRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const [size, setSize] = useState({ w: 800, h: 560 });
  const [showResources, setShowResources] = useState(true);
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

      {/* Topic filter legend */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFocusTopic(null)}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
            !focusTopic ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-surface-raised",
          )}
        >
          All
        </button>
        {topics.map((t) => (
          <button
            key={t.slug}
            onClick={() => setFocusTopic(focusTopic === t.slug ? null : t.slug)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              focusTopic === t.slug ? "text-foreground" : "border-border text-muted-foreground hover:bg-surface-raised",
            )}
            style={focusTopic === t.slug ? { borderColor: `rgba(${hexToRgb(t.color)},0.5)`, background: `rgba(${hexToRgb(t.color)},0.12)` } : undefined}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
            {t.short}
          </button>
        ))}
      </div>

      <div
        ref={wrapRef}
        className="relative mt-4 h-[62vh] overflow-hidden rounded-xl border border-border bg-[#0a0c14]"
      >
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" />
        <ForceGraph2D
          ref={fgRef}
          graphData={data}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          nodeRelSize={4}
          nodeVal={(n: any) => n.val}
          cooldownTicks={120}
          onEngineStop={() => fgRef.current?.zoomToFit(400, 60)}
          linkColor={(l: any) =>
            l.kind === "related" ? "rgba(150,160,200,0.35)" : "rgba(110,120,150,0.12)"
          }
          linkWidth={(l: any) => (l.kind === "related" ? 1.4 : 0.6)}
          onNodeHover={(n: any) => setHover(n ?? null)}
          onNodeClick={(n: any) => {
            if (n.kind === "topic") navigate(`/topics/${n.topicSlug}`);
            else navigate(`/resource/${n.id}`);
          }}
          nodeCanvasObject={(node: any, ctx, scale) => {
            const n = node as GraphNode & { x: number; y: number };
            const isTopic = n.kind === "topic";
            const r = isTopic ? 6 : n.status === "completed" ? 3 : 2.4;
            const alpha = dimmed(n) ? 0.12 : 1;

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = n.color;
            // Unread resources render hollow; completed are solid + ring.
            if (!isTopic && n.status === "unread") {
              ctx.globalAlpha = alpha * 0.35;
            }
            ctx.fill();

            if (isTopic) {
              ctx.globalAlpha = alpha;
              ctx.strokeStyle = "rgba(255,255,255,0.25)";
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
            if (!isTopic && n.status === "completed") {
              ctx.globalAlpha = alpha;
              ctx.strokeStyle = n.color;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.arc(n.x, n.y, r + 1.6, 0, 2 * Math.PI);
              ctx.stroke();
            }

            if (isTopic && scale > 1.2) {
              ctx.globalAlpha = alpha;
              ctx.font = `600 ${3.5}px Inter, sans-serif`;
              ctx.fillStyle = "rgba(230,232,240,0.95)";
              ctx.textAlign = "center";
              ctx.fillText(n.label, n.x, n.y + r + 4);
            }
            ctx.globalAlpha = 1;
          }}
        />

        {/* Hover card */}
        {hover && (
          <div className="pointer-events-none absolute bottom-3 left-3 max-w-xs rounded-lg border border-border bg-popover/95 p-3 shadow-raised backdrop-blur">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: hover.color }} />
              <span className="rail">{hover.kind}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">{hover.label}</p>
          </div>
        )}

        <button
          onClick={() => fgRef.current?.zoomToFit(400, 60)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-popover/90 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          aria-label="Fit to view"
        >
          <Maximize2 size={15} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-2xs text-faint">
        <span className="flex items-center gap-1.5">
          <TopicIcon name="Sparkles" size={11} /> Large nodes are topics
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full ring-1 ring-primary" /> Ring = completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary/30" /> Faded = unread
        </span>
      </div>
    </PageContainer>
  );
}
