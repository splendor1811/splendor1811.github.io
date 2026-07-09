// Topic metadata — the canonical order, categorical colors, and icons used by the
// sidebar, cards, and knowledge graph. Pure data (no browser deps) so the Bun parser
// script and the React app can both import it.

export interface TopicStyle {
  slug: string;
  /** Matches the H1 / filename of the Markdown subpage. */
  title: string;
  color: string; // hex, tuned to glow on the dark base
  icon: string; // lucide-react icon name
  short: string; // compact label for tight spaces
}

export const TOPIC_STYLES: TopicStyle[] = [
  { slug: "on-policy-distillation", title: "On-Policy Distillation", color: "#7C8CFF", icon: "GitFork", short: "OPD" },
  { slug: "reinforcement-learning", title: "Reinforcement Learning", color: "#4ADE9E", icon: "Target", short: "RL" },
  { slug: "async-infrastructure-rl", title: "Async & Infrastructure RL", color: "#2DD4BF", icon: "Workflow", short: "Async RL" },
  { slug: "diffusion-flow-matching", title: "Diffusion & Flow Matching", color: "#C084FC", icon: "Waves", short: "Diffusion" },
  { slug: "efficient-inference-serving", title: "Efficient Inference & Serving", color: "#F5A97F", icon: "Zap", short: "Inference" },
  { slug: "distributed-parallel-training", title: "Distributed & Parallel Training", color: "#56C7F5", icon: "Network", short: "Distributed" },
  { slug: "gpu-cuda-kernels", title: "GPU, CUDA & Kernels", color: "#A3E635", icon: "Cpu", short: "GPU/CUDA" },
  { slug: "llm-architecture-scaling-laws", title: "LLM Architecture & Scaling Laws", color: "#FB7185", icon: "Layers", short: "Architecture" },
  { slug: "post-training-playbooks-reports", title: "Post-Training Playbooks & Reports", color: "#F2C55C", icon: "BookOpen", short: "Playbooks" },
  { slug: "synthetic-data-evaluation", title: "Synthetic Data & Evaluation", color: "#22D3EE", icon: "FlaskConical", short: "Data/Eval" },
  { slug: "foundations-interviews-meta", title: "Foundations, Interviews & Meta", color: "#93A5CC", icon: "GraduationCap", short: "Foundations" },
  { slug: "thinking-machines-lab", title: "Thinking Machines Lab", color: "#F472B6", icon: "Sparkles", short: "TML" },
];

export const TOPIC_STYLE_BY_SLUG: Record<string, TopicStyle> = Object.fromEntries(
  TOPIC_STYLES.map((t) => [t.slug, t]),
);

/** Normalize a heading/title to a stable slug (e.g. "GPU, CUDA & Kernels" -> "gpu-cuda-kernels"). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
