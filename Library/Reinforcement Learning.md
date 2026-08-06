# Reinforcement Learning

[[Library|← Back to Library index]] · Related: [[Async & Infrastructure RL]] · [[On-Policy Distillation]] · [[Synthetic Data & Evaluation]]

Reinforcement Learning has become the engine behind modern reasoning LLMs — from RLHF alignment to verifiable-reward training with GRPO and its many descendants. This page collects the best hands-on courses, policy-optimization deep-dives, scaling-law analyses, and frontier writeups for learning and applying RL to language models.

**Suggested reading order:** hands-on-modern-rl 🔁 → RLHF book/series (Nathan Lambert) → GRPO++ tricks → Beyond PPO → RL scaling laws.

### Courses & books (start here)
- **[Hands-On Modern RL](https://github.com/walkinglabs/hands-on-modern-rl)** · `Repo` · GitHub (walkinglabs) · *2026-06-18* · 🔁
  A practice-first, open-source curriculum that walks from classical control (CartPole, DQN, PPO) all the way to modern LLM post-training, with runnable Python code and visual training metrics. Bridges foundational RL with contemporary alignment and agentic techniques.
  *Key concepts:* deep RL fundamentals, RLHF/DPO/GRPO/RLVR, agentic multi-turn credit assignment, preference optimization, multimodal RL, training debugging
- **[RLHF & Post-Training Course (Nathan Lambert)](https://www.youtube.com/watch?v=jQPiH-KB4B0&list=PLL1tdVxB1CpVpEtMHxwuR4uI4Lxjw00_y)** · `Video` · YouTube · *—* · ⚠️unverified
  A free video lecture series accompanying Nathan Lambert's RLHF Book, following the book chapter-by-chapter with slides and added lectures. Aimed at early PhD/master's level but designed to be accessible without prior RL or language-modeling background.
  *Key concepts:* RLHF pipeline overview, instruction tuning, reward models, rejection sampling, RL math, RL implementation
- **[RLHF Book (Nathan Lambert)](https://rlhfbook.com/book.pdf)** · `Book` · rlhfbook.com · *2026-07-07*
  A comprehensive, continuously-updated guide to reinforcement learning from human feedback and modern LLM post-training, moving from foundations through the full RLHF pipeline to open research challenges.
  *Key concepts:* instruction tuning, reward modeling, policy gradients (PPO/GRPO), direct alignment (DPO), rejection sampling, synthetic data & evaluation
- **[Stanford CS224R Deep Reinforcement Learning](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)** · `Course` · YouTube (Stanford) · *2025* · ⚠️unverified
  Stanford's graduate deep-RL course (Spring 2025 recordings), spanning imitation learning through model-based, multi-task, and hierarchical RL to research frontiers.
  *Key concepts:* imitation learning, policy gradients & actor-critic, model-based RL, multi-task & hierarchical RL, offline RL, RL frontiers
- **[The Ultimate Guide to RL Environments](https://huggingface.co/spaces/AdithyaSK/rl-environments-guide)** · `Blog` · Hugging Face Spaces · *—* · ⚠️unverified
  A practitioner-oriented guide to building and scaling reinforcement-learning environments in the LLM era, covering environment design fundamentals and the scaling considerations that arise when training language models.
  *Key concepts:* RL environment construction, verifiable-reward design, scaling environments for LLMs, environment frameworks, HF ecosystem tooling

- **[RLHF Course - Nathan Lambert](https://rlhfbook.com/course)** · `Course` · Nathan Lambert · *2026-08-08* · ⭐
  Comprehensive course of Reinforcement Learning ưith Human Feedback LLM
  *Key concepts:* —
### Policy optimization & tricks
- **[GRPO++: Tricks for Making RL Actually Work](https://cameronrwolfe.substack.com/p/grpo-tricks)** · `Blog` · Cameron R. Wolfe (Substack) · *2026-01-05*
  A deep dive into Group Relative Policy Optimization and the practical modifications that make it stable at scale — decoupled clipping, dynamic sampling, token-level loss aggregation, and overlong reward shaping. Addresses entropy collapse, instability, and poor sample efficiency in vanilla GRPO.
  *Key concepts:* group-relative advantages, decoupled/asymmetric clipping, entropy collapse, token-level loss aggregation, truncated importance sampling, GSPO/GMPO/CISPO variants
- **[Beyond PPO — The New Wave of Policy Optimization Techniques](https://ydnyshhh.github.io/posts/policy_optimization)** · `Blog` · ydnyshhh.github.io · *2025-12-28*
  Traces the evolution of policy-optimization methods for LLM post-training beyond PPO, covering GRPO's critic-free baseline and newer variants (GSPO, DAPO, CISPO, GMPO, RSPO, SAPO) that target instabilities in long-horizon reasoning.
  *Key concepts:* critic-free baselines, trust-region/soft-gating design, sequence vs. token-level optimization, importance-sampling ratios, long-CoT variance management
- **[Rubric-Based Rewards for RL](https://cameronrwolfe.substack.com/p/rubric-rl)** · `Blog` · Cameron R. Wolfe (Substack) · *2026-02-16*
  Explores rubric-based rewards as a way to extend RL beyond verifiable domains (math, code) into subjective tasks like creative writing and scientific reasoning, decomposing desired behavior into interpretable criteria that LLM judges can score.
  *Key concepts:* rubric-based rewards (RaR), LLM-as-a-judge, RLVR vs. open-ended domains, instance-specific rubrics, reward aggregation, reward hacking mitigation
- **[Teaching a Language Model Arithmetic with Reinforcement Learning](https://samikhan.ai/blog/countdown-rl.html)** · `Blog` · Sami Khan · *2026-01*
  A hands-on writeup of training LLMs with RL on the Countdown Numbers Game, surfacing sharp lessons about reward design — including a model that gamed the closeness reward by simply restating the target. Scaling from a collapsing 4B to a stable 30B MoE reached 50% exact-match on unseen puzzles.
  *Key concepts:* reward hacking, closeness/exponential-decay rewards, PRIME-RL token-level masking, pre-computed dataset verification, model-scale training stability
- **[The Engineering Handbook for GRPO+LoRA (verl, Qwen2.5 multi-GPU)](https://medium.com/@weyaxi1/the-engineering-handbook-for-grpo-lora-with-verl-training-qwen2-5-on-multi-gpu-b2431a2a8e92)** · `Blog` · Medium (Weyaxi) · *2026-01-02*
  A practical engineering guide to training Qwen2.5-3B with GRPO + LoRA on multi-GPU (4× A100) using verl, sharing optimizations that cut training from 9.5 to 6 hours and documenting how binary rewards pushed toward shorter responses.
  *Key concepts:* GRPO memory savings vs. PPO, data vs. tensor parallelism, gpu_memory_utilization tuning, reward-engineering trade-offs, checkpoint/infra stability, format overfitting
- **[Tiny-RL](https://github.com/0xD4rky/Tiny-RL)** · `Repo` · GitHub (0xD4rky) · *—*
  A compact lab repository implementing multiple RL algorithms (GRPO, DAPO, Reinforce++) for training LLMs on mathematical tasks, with a configurable YAML-driven training framework for comparing methods.
  *Key concepts:* GRPO/DAPO/Reinforce++, math-task reward models, vLLM rollouts, YAML-configured hyperparameters, replay buffers, Weights & Biases logging

### Scaling, continual learning & state-of-the-field
- **[RL Scaling Laws for LLMs](https://cameronrwolfe.substack.com/p/rl-scaling-laws)** · `Blog` · Cameron R. Wolfe (Substack) · *2026-04-20*
  Examines how scaling laws extend from pretraining to RL training, contrasting sigmoidal curves and power-law formulations for predicting reward gains as compute grows, and covering optimal compute-allocation strategies.
  *Key concepts:* sigmoidal vs. power-law scaling, GRPO variants (GSPO/DAPO/Dr.GRPO/TIS/CISPO), compute allocation trade-offs, difficulty-dependent regularization, inter/intra-model extrapolation
- **[Continual Learning with RL for LLMs](https://cameronrwolfe.substack.com/p/rl-continual-learning)** · `Blog` · Cameron R. Wolfe (Substack) · *2026-01-26*
  Argues that on-policy RL naturally mitigates catastrophic forgetting during continual learning, in contrast to SFT's tendency to degrade prior knowledge, connecting decades of continual-learning research with recent LLM findings.
  *Key concepts:* catastrophic forgetting, mode-seeking (reverse KL) vs. mode-covering, on-policy data, KL-divergence as forgetting predictor, confident conflicts, cross-domain generalization
- **[State of RL for Reasoning LLMs](https://aweers.de/blog/2026/rl-for-llms/)** · `Blog` · aweers.de · *2026-03-15*
  A survey of RL algorithms for reasoning LLMs across 2024–2026, tracing the path from REINFORCE and PPO through specialized techniques, and identifying emerging consensus around critic-free training and better loss aggregation.
  *Key concepts:* critic-free training, trust-region refinement, loss-aggregation bias, group-relative advantages, verifiable-task optimization, scaling-law validation
- **[Best Resources to Learn RL (curated thread)](https://x.com/cwolferesearch/status/2061827001204240599)** · `Blog` · X / Cameron R. Wolfe · *—* · ⚠️unverified
  A curated X thread pointing to high-quality resources for learning reinforcement learning — foundational courses, textbooks, and LLM-focused RL writeups.
  *Key concepts:* curated RL learning path, foundational RL courses, RLHF/RLVR resources, policy-optimization references
- **[Keep the Tokens Flowing: Lessons from 16 Open-Source RL Libraries](https://huggingface.co/blog/async-rl-training-landscape)** · `Blog` · Hugging Face Blog · *2026-03-10*
  A technical survey comparing 16 open-source RL libraries for LLM post-training, centered on async architectures that decouple inference from training, proposing seven orthogonal axes of comparison spanning orchestration, buffers, weight sync, and staleness.
  *Key concepts:* async RL training, orchestration/concurrency primitives, rollout buffer design, weight synchronization protocols, staleness & partial-rollout handling, MoE support

### Recursive Language Models (RL-adjacent)
- **[Recursive Language Models](https://arxiv.org/abs/2512.24601)** · `Paper` · arXiv · *2026-05-11*
  Introduces Recursive Language Models (RLMs), an inference approach where an LLM programmatically examines, decomposes, and recursively calls itself over prompt snippets to handle contexts far beyond its window — reporting 26–130% improvements on long-context benchmarks at comparable cost.
  *Key concepts:* inference-time scaling, recursive self-calling over segments, context-window extension (~100x), context rot mitigation, REPL-based decomposition
- **[Recursive Language Model (PrimeIntellect blog)](https://www.primeintellect.ai/blog/rlm)** · `Blog` · Prime Intellect · *2026-01-01*
  Prime Intellect's exploration of RLMs as a way for LLM agents to manage their own context — delegating work to Python scripts and sub-LLMs rather than stuffing everything into the main window.
  *Key concepts:* context folding, recursive LMs with persistent REPL, sub-LM delegation, scaffolding architecture, context rot, token-efficiency trade-offs
- **[Recursive Language Model (author writeup)](https://alexzhang13.github.io/blog/2025/rlm/)** · `Blog` · Alex Zhang · *2025-10*
  The author's original writeup framing RLMs as recursive interaction with unbounded context via Python REPL environments, emphasizing that the recursive strategies are learnable via RL — a new axis for test-time scaling.
  *Key concepts:* recursive REPL decomposition, context-centric vs. problem-centric decomposition, context rot mitigation, test-time inference scaling, emergent interaction strategies

### Hands-on & lab writeups
- **[How to finetune LLMs to THINK with Reinforcement Learning (GRPO from scratch!)](https://www.youtube.com/watch?v=yGkJj_4bjpE)** · `Video` · Neural Breakdown with AVB (YouTube) · *2025-06-29* · ⚠️unverified
  A from-scratch PyTorch walkthrough of Group Relative Policy Optimization (GRPO), showing how to train small language models to reason step-by-step with RL — the full loop: rollouts, group-relative advantages, reward design, and the policy update.
  *Key concepts:* GRPO, reasoning fine-tuning, group-relative advantage, reward functions, KL penalty
- **[Building Olmo 3 for AI Agents — Nathan Lambert (slides)](https://docs.google.com/presentation/d/1K3bM3K7q_CBcXzUCX7a1YvUHAycpvTKZbJElKSOdiok/edit)** · `Blog` · Nathan Lambert / CMU LTI talk · *2026-02-13* · ⚠️unverified
  Slide deck ("Agentic Olmos") from a CMU LTI talk on building the fully open Olmo 3 model family for agentic use, covering the post-training recipe and design choices behind agent-capable open models.
  *Key concepts:* Olmo 3, open post-training, agentic LLMs, RL post-training, AI2 open models
- **[MiniMax 2.5 RL (thread)](https://x.com/neural_avb/status/2022715561390776524)** · `Blog` · @neural_avb (X) · *2026-02-13* · ⚠️unverified
  A clear explainer of the RL architecture behind MiniMax M2.5, centered on the CISPO algorithm and its reward structure (process rewards, completion-time rewards, reward-to-go) — CISPO clips importance-sampling weights rather than token updates so all tokens contribute to gradients.
  *Key concepts:* CISPO, importance-sampling clipping, process rewards, reward-to-go, Forge RL framework

### Interview
- **[RL Algorithms Interview Questions](https://www.k-a.in/rl-algo.html)** · `Blog` · k-a.in (Arjun Kocher) · *—* · ⚠️unverified
  A Q&A-style reference page of reinforcement-learning algorithm interview questions covering core RL concepts and algorithm design.
  *Key concepts:* RL fundamentals, value-based vs. policy-based methods, algorithm design trade-offs, interview Q&A format
