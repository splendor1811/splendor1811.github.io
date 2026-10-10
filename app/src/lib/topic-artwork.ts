import foundations from "@/assets/topics/foundations.webp";
import reinforcement from "@/assets/topics/reinforcement.webp";
import diffusion from "@/assets/topics/diffusion.webp";
import audio from "@/assets/topics/audio.webp";
import agents from "@/assets/topics/agents.webp";
import systems from "@/assets/topics/systems.webp";

const artwork: Record<string, string> = {
  "foundations-math": foundations,
  "llm-architecture-scaling-laws": foundations,
  "post-training-alignment": reinforcement,
  "reinforcement-learning": reinforcement,
  "diffusion-flow-matching": diffusion,
  "vision-multimodal": diffusion,
  "voice-audio": audio,
  "agents-memory-retrieval": agents,
  "efficient-inference-serving": systems,
  "distributed-parallel-training": systems,
  "gpu-cuda-kernels": systems,
  "synthetic-data-evaluation": foundations,
};

export function topicArtwork(slug: string): string {
  return artwork[slug] ?? foundations;
}
