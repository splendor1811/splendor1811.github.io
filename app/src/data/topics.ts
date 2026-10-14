// Topic metadata — the canonical order, categorical colors, and icons used by the
// sidebar, cards, and knowledge graph. Pure data (no browser deps) so the Bun parser
// script and the React app can both import it.

export interface TopicStyle {
  slug: string;
  /** Matches the H1 / filename of the Markdown subpage. */
  title: string;
  color: string; // Categorical graph color; the reading interface uses semantic tokens.
  icon: string; // lucide-react icon name
  short: string; // compact label for tight spaces
}

export const TOPIC_STYLES: TopicStyle[] = [
  { slug: "foundations-math", title: "Foundations & Math", color: "#647A9B", icon: "GraduationCap", short: "Foundations" },
  { slug: "llm-architecture-scaling-laws", title: "LLM Architecture & Scaling", color: "#B15B75", icon: "Layers", short: "Architecture" },
  { slug: "post-training-alignment", title: "Post-Training & Alignment", color: "#6277CD", icon: "GitFork", short: "Post-training" },
  { slug: "reinforcement-learning", title: "Reinforcement Learning & Reasoning", color: "#318A6A", icon: "Target", short: "RL & reasoning" },
  { slug: "diffusion-flow-matching", title: "Diffusion & Flow Matching", color: "#C084FC", icon: "Waves", short: "Diffusion" },
  { slug: "voice-audio", title: "Voice & Audio", color: "#4A90A4", icon: "AudioLines", short: "Voice & audio" },
  { slug: "vision-multimodal", title: "Vision & Multimodal", color: "#9B69AE", icon: "ScanEye", short: "Vision" },
  { slug: "agents-memory-retrieval", title: "Agents, Memory & Retrieval", color: "#597EA5", icon: "Workflow", short: "Agents" },
  { slug: "efficient-inference-serving", title: "Inference & Serving", color: "#BC7A4E", icon: "Zap", short: "Inference" },
  { slug: "distributed-parallel-training", title: "Distributed Training", color: "#3B8DAA", icon: "Network", short: "Distributed" },
  { slug: "gpu-cuda-kernels", title: "GPU, CUDA & Kernels", color: "#A3E635", icon: "Cpu", short: "GPU/CUDA" },
  { slug: "synthetic-data-evaluation", title: "Data & Evaluation", color: "#288B9C", icon: "FlaskConical", short: "Data & eval" },
  { slug: "life-career-finance", title: "Life, Career & Finance", color: "#D49A39", icon: "Compass", short: "Life & career" },
];

/** Previous topic URLs remain meaningful after a domain is renamed or merged. */
export const TOPIC_ALIASES: Record<string, string> = {
  "foundations-interviews-meta": "foundations-math",
  "on-policy-distillation": "post-training-alignment",
  "post-training-playbooks-reports": "post-training-alignment",
  "async-infrastructure-rl": "reinforcement-learning",
  "llm-architecture-scaling": "llm-architecture-scaling-laws",
  "reinforcement-learning-reasoning": "reinforcement-learning",
  "inference-serving": "efficient-inference-serving",
  "distributed-training": "distributed-parallel-training",
  "data-evaluation": "synthetic-data-evaluation",
};

// A publisher is a source facet, not a domain. This redirect is intentionally not
// in TOPIC_ALIASES because its destination is a filtered library, not a topic.
export const SOURCE_TOPIC_REDIRECTS: Record<string, string> = {
  "thinking-machines-lab": "Thinking Machines",
};

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

/** Resolve Markdown titles, retained slugs, and legacy topic names consistently. */
export function resolveTopicSlug(input: string): string {
  const titleMatch = TOPIC_STYLES.find((topic) => topic.title.toLowerCase() === input.trim().toLowerCase());
  if (titleMatch) return titleMatch.slug;
  const slug = slugify(input);
  return TOPIC_ALIASES[slug] ?? slug;
}
