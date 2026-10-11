/** Editorial learning paths. Resource IDs are stable across Library edits. */
export interface LearningStage {
  id: string;
  title: string;
  purpose: string;
  checkpoint: string;
  color: string;
  resourceIds: readonly string[];
}

export interface LearningPath {
  topicSlug: string;
  introduction: string;
  prerequisite: string;
  stages: readonly LearningStage[];
}

export const STAGE_COLORS = [
  "#3658A4", // blue
  "#007C84", // teal
  "#976314", // amber
  "#7651A6", // violet
  "#B14C60", // rose
  "#28744F", // green
  "#596E92", // slate
] as const;

export const LEARNING_PATHS: Record<string, LearningPath> = {
  "post-training-alignment": {
    topicSlug: "post-training-alignment",
    introduction: "From a pretrained model to a useful, reliable assistant: learn the objectives, data and trade-offs before choosing a training recipe.",
    prerequisite: "Know the basics of language-model training, cross-entropy and KL divergence. The RL path expands the policy-optimization branch.",
    stages: [
      {
        id: "map-the-pipeline",
        title: "Map the post-training pipeline",
        purpose: "Place instruction tuning, preferences, RL and distillation in one end-to-end picture. Read the RLHF book selectively, then inspect a complete open-model report.",
        checkpoint: "Sketch the pipeline and label the data source, objective and evaluation at each transition.",
        color: STAGE_COLORS[0],
        resourceIds: [
          "reinforcement-learning__rlhf-book-nathan-lambert",
          "post-training-alignment__olmo-3",
        ],
      },
      {
        id: "sft-and-adapters",
        title: "Supervised fine-tuning & adapters",
        purpose: "Build the SFT baseline first, then compare sampling-aware training, LoRA and full-weight updates. Keep model, data and budget fixed when comparing methods.",
        checkpoint: "Write down when an adapter is sufficient and what a full fine-tune might change.",
        color: STAGE_COLORS[1],
        resourceIds: [
          "post-training-alignment__finetuning-with-sampling-sft-learns-better-than-you-think",
          "thinking-machines-lab__lora-without-regret",
          "post-training-alignment__lora-vs-full-fine-tuning-an-illusion-of-equivalence",
          "post-training-alignment__open-instruct-open-instruction-tuning-and-post-training",
        ],
      },
      {
        id: "preferences-and-rewards",
        title: "Preferences, rewards & evaluation",
        purpose: "Understand how preferences become a training signal, and why offline data, online samples and reward quality lead to different behavior.",
        checkpoint: "Define a preference or reward signal, a held-out evaluation and a failure case before training.",
        color: STAGE_COLORS[2],
        resourceIds: [
          "post-training-alignment__reward-models",
          "post-training-alignment__online-versus-offline-rl-for-llms",
          "synthetic-data-evaluation__evaluation-rlhf-and-post-training-book",
        ],
      },
      {
        id: "on-policy-distillation",
        title: "On-policy distillation",
        purpose: "Move from teacher-generated examples to feedback on the student's own rollouts. Follow the distribution shift and the forward/reverse-KL choice.",
        checkpoint: "Explain what changes when the student samples its own prefixes and where the teacher supplies signal.",
        color: STAGE_COLORS[3],
        resourceIds: [
          "post-training-alignment__on-policy-distillation-of-language-models-learning-from-self-generated-mistakes",
          "on-policy-distillation__on-policy-distillation-from-first-principles",
          "on-policy-distillation__on-policy-distillation",
        ],
      },
      {
        id: "capability-integration",
        title: "Self-distillation & capability integration",
        purpose: "Study privileged-information students, specialist teachers and cascaded recipes. Treat reported gains as results for the authors' tasks and budgets.",
        checkpoint: "Compare a self-teacher, multiple specialist teachers and a single external teacher on supervision and cost.",
        color: STAGE_COLORS[4],
        resourceIds: [
          "post-training-alignment__self-distilled-reasoner-on-policy-self-distillation-for-large-language-models",
          "on-policy-distillation__open-multi-teacher-on-policy-distillation",
          "post-training-alignment__nemotron-cascade-2-post-training-llms-with-cascade-rl-and-multi-domain-on-policy-distillation",
        ],
      },
      {
        id: "audit-and-reproduce",
        title: "Audit failure modes & reproduce",
        purpose: "Close with cases where distillation hurts, then use an open training toolkit to design a measured comparison against the SFT baseline.",
        checkpoint: "Specify a retention check, a reward-hacking check and compute accounting for your reproduction.",
        color: STAGE_COLORS[5],
        resourceIds: [
          "on-policy-distillation__unmasking-on-policy-distillation-where-it-helps-where-it-hurts-and-why",
          "post-training-alignment__why-does-self-distillation-sometimes-degrade-the-reasoning-capability-of-llms",
          "post-training-alignment__trl-transformers-reinforcement-learning-toolkit",
        ],
      },
    ],
  },
  "reinforcement-learning": {
    topicSlug: "reinforcement-learning",
    introduction: "Start with policy gradients, train a small reasoner, then study rewards, test-time compute and the systems that keep long-horizon RL stable.",
    prerequisite: "Comfort with probability, gradients and language-model sampling helps. Start with the Post-Training map if SFT and reward models are unfamiliar.",
    stages: [
      {
        id: "rl-foundations",
        title: "RL foundations",
        purpose: "Learn states, actions, returns and policy gradients before translating them into tokens, trajectories and verifiable tasks.",
        checkpoint: "Derive the policy-gradient intuition and identify the policy, environment and reward in an LLM example.",
        color: STAGE_COLORS[0],
        resourceIds: [
          "reinforcement-learning__cs-185-285-deep-reinforcement-learning-decision-making-and-control-spring-2026",
          "reinforcement-learning__policy-gradient-algorithms",
        ],
      },
      {
        id: "llm-policy-optimization",
        title: "LLM policy optimization",
        purpose: "Connect the classical objective to LLM rollouts. Compare PPO, GRPO and newer variants by baseline, importance weighting and loss aggregation.",
        checkpoint: "Explain what GRPO removes from PPO and name two stability trade-offs it introduces.",
        color: STAGE_COLORS[1],
        resourceIds: [
          "reinforcement-learning__a-survey-of-reinforcement-learning-for-large-reasoning-models",
          "reinforcement-learning__grpo-tricks-for-making-rl-actually-work",
          "reinforcement-learning__beyond-ppo-the-new-wave-of-policy-optimization-techniques",
        ],
      },
      {
        id: "train-a-reasoner",
        title: "Train a small reasoner",
        purpose: "Run a compact math or code experiment before scaling. Track the verifier, rollout distribution, advantage and training curve.",
        checkpoint: "Reproduce one small run and record a baseline, reward definition and failure trace.",
        color: STAGE_COLORS[2],
        resourceIds: [
          "foundations-interviews-meta__cs336-study-notes-grpo-for-math-reasoning-on-lambda-cloud",
          "reinforcement-learning__teaching-a-language-model-arithmetic-with-reinforcement-learning",
          "reinforcement-learning__tiny-rl",
        ],
      },
      {
        id: "reward-reliability",
        title: "Reward design & reliability",
        purpose: "A rising reward is not enough. Study gaming, rubric design and held-out evaluation before trusting apparent gains.",
        checkpoint: "Build a reward-hacking probe and an evaluation that the policy cannot directly optimize.",
        color: STAGE_COLORS[3],
        resourceIds: [
          "reinforcement-learning__reward-hacking-in-reinforcement-learning",
          "reinforcement-learning__rubric-based-rewards-for-rl",
          "synthetic-data-evaluation__evaluation-rlhf-and-post-training-book",
        ],
      },
      {
        id: "reasoning-at-inference",
        title: "Reasoning at test time",
        purpose: "Separate capabilities learned during training from compute spent during inference. Compare longer reasoning, search and compute allocation.",
        checkpoint: "Choose an inference budget and explain when additional tokens are likely to help or waste compute.",
        color: STAGE_COLORS[4],
        resourceIds: [
          "reinforcement-learning__why-we-think",
          "reinforcement-learning__scaling-llm-test-time-compute-optimally-can-be-more-effective-than-scaling-model-parameters",
          "reinforcement-learning__base-models-can-reason-by-taking-a-cue-from-training-data",
        ],
      },
      {
        id: "async-and-mismatch",
        title: "Async RL & training–inference mismatch",
        purpose: "Study why faster rollouts can become stale or numerically different from training. Then compare orchestration, weight sync and kernel behavior.",
        checkpoint: "Diagram the rollout-to-update loop and identify where policy staleness or precision mismatch enters.",
        color: STAGE_COLORS[5],
        resourceIds: [
          "async-infrastructure-rl__is-frontier-asynchronous-rl-solved",
          "reinforcement-learning__keep-the-tokens-flowing-lessons-from-16-open-source-rl-libraries",
          "reinforcement-learning__reliable-rl-scaling-requires-accounting-for-prefill-decode-kernel-mismatch",
        ],
      },
      {
        id: "scale-to-agents",
        title: "Scale to agents & longer horizons",
        purpose: "Bring the pieces together: compute allocation, environments, delayed outcomes and agent trajectories. Use Xiaomi MiMo-V2.6 as a concrete case study, then inspect its released RL environments separately from the report's claims.",
        checkpoint: "Design an agent RL experiment with an environment, verifier, rollout budget and generalization test. State which parts of the MiMo report and dataset you could actually reproduce.",
        color: STAGE_COLORS[6],
        resourceIds: [
          "reinforcement-learning__the-art-of-scaling-reinforcement-learning-compute-for-llms",
          "async-infrastructure-rl__agentic-rl-token-in-token-out-done-right",
          "reinforcement-learning__training-search-agents-with-grpo",
          "reinforcement-learning__mimo-v2-6-scaling-reinforcement-learning-towards-self-improvement",
          "synthetic-data-evaluation__mimo-v2-6-rl-oss-agentic-rl-environments",
        ],
      },
    ],
  },
};
