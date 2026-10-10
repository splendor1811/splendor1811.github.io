# Reinforcement Learning & Reasoning

[[Library|← Back to Library index]] · Related: [[Post-Training & Alignment]] · [[Agents, Memory & Retrieval]] · [[Distributed Training]]

Reinforcement learning foundations, policy optimization, rewards, and reasoning. Async RL and rollout-training infrastructure are grouped alongside the algorithms they support.

**Suggested reading order:** hands-on-modern-rl 🔁 → RLHF book/series (Nathan Lambert) → GRPO++ tricks → Beyond PPO → RL scaling laws.

### Courses & books (start here)
<!-- resource-id: reinforcement-learning__hands-on-modern-rl -->
- **[Hands-On Modern RL](https://github.com/walkinglabs/hands-on-modern-rl)** · `Repo` · GitHub (walkinglabs) · *2026-06-18* · 🔁
  A practice-first, open-source curriculum that walks from classical control (CartPole, DQN, PPO) all the way to modern LLM post-training, with runnable Python code and visual training metrics. Bridges foundational RL with contemporary alignment and agentic techniques.
  *Key concepts:* deep RL fundamentals, RLHF/DPO/GRPO/RLVR, agentic multi-turn credit assignment, preference optimization, multimodal RL, training debugging

<!-- resource-id: reinforcement-learning__stanford-cs224r-deep-reinforcement-learning -->
- **[Stanford CS224R Deep Reinforcement Learning](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)** · `Course` · YouTube (Stanford) · *2025* · ⚠️unverified
  Stanford's graduate deep-RL course (Spring 2025 recordings), spanning imitation learning through model-based, multi-task, and hierarchical RL to research frontiers.
  *Key concepts:* imitation learning, policy gradients & actor-critic, model-based RL, multi-task & hierarchical RL, offline RL, RL frontiers

<!-- resource-id: reinforcement-learning__the-ultimate-guide-to-rl-environments -->
- **[The Ultimate Guide to RL Environments](https://huggingface.co/spaces/AdithyaSK/rl-environments-guide)** · `Blog` · Hugging Face Spaces · *—* · ⚠️unverified
  A practitioner-oriented guide to building and scaling reinforcement-learning environments in the LLM era, covering environment design fundamentals and the scaling considerations that arise when training language models.
  *Key concepts:* RL environment construction, verifiable-reward design, scaling environments for LLMs, environment frameworks, HF ecosystem tooling

<!-- resource-id: reinforcement-learning__cs-185-285-deep-reinforcement-learning-decision-making-and-control-spring-2026 -->
- **[CS 185/285 Deep Reinforcement Learning, Decision Making, and Control (Spring 2026)](https://www.youtube.com/watch?v=zSJ7vDBWkPk&list=PLKq1TCpsv3Y4&index=24)** · `Course` · Unknown · *2026-08-23* · ⭐
  CS 185/285 Deep Reinforcement Learning, Decision Making, and Control (Spring 2026)
  *Key concepts:* —

<!-- resource-id: reinforcement-learning__training-agents-3-reinforcement-learning -->
- **[ Training Agents 3: Reinforcement Learning](https://www.youtube.com/watch?v=ztdTed5egrM)** · `Video` · Unknown · *2026-08-23*

Training Agents 3: Reinforcement Learning
  *Key concepts:* —

<!-- resource-id: reinforcement-learning__a-survey-of-reinforcement-learning-for-large-reasoning-models -->
- **[A Survey of Reinforcement Learning for Large Reasoning Models](https://arxiv.org/abs/2509.08827)** · `Paper` · Kaiyan Zhang et al. / arXiv · *2025-09-10*
  Surveys RL for reasoning language models across algorithms, data, infrastructure, and downstream applications. The abstract frames scalability as a joint systems and methodology challenge, not just an increase in compute.
  *Key concepts:* Reinforcement learning, Reasoning models, RL infrastructure, Training data, Scalability

### Policy optimization & tricks
<!-- resource-id: reinforcement-learning__grpo-tricks-for-making-rl-actually-work -->
- **[GRPO++: Tricks for Making RL Actually Work](https://cameronrwolfe.substack.com/p/grpo-tricks)** · `Blog` · Cameron R. Wolfe (Substack) · *2026-01-05*
  A deep dive into Group Relative Policy Optimization and the practical modifications that make it stable at scale — decoupled clipping, dynamic sampling, token-level loss aggregation, and overlong reward shaping. Addresses entropy collapse, instability, and poor sample efficiency in vanilla GRPO.
  *Key concepts:* group-relative advantages, decoupled/asymmetric clipping, entropy collapse, token-level loss aggregation, truncated importance sampling, GSPO/GMPO/CISPO variants

<!-- resource-id: reinforcement-learning__beyond-ppo-the-new-wave-of-policy-optimization-techniques -->
- **[Beyond PPO — The New Wave of Policy Optimization Techniques](https://ydnyshhh.github.io/posts/policy_optimization)** · `Blog` · ydnyshhh.github.io · *2025-12-28*
  Traces the evolution of policy-optimization methods for LLM post-training beyond PPO, covering GRPO's critic-free baseline and newer variants (GSPO, DAPO, CISPO, GMPO, RSPO, SAPO) that target instabilities in long-horizon reasoning.
  *Key concepts:* critic-free baselines, trust-region/soft-gating design, sequence vs. token-level optimization, importance-sampling ratios, long-CoT variance management

<!-- resource-id: reinforcement-learning__rubric-based-rewards-for-rl -->
- **[Rubric-Based Rewards for RL](https://cameronrwolfe.substack.com/p/rubric-rl)** · `Blog` · Cameron R. Wolfe (Substack) · *2026-02-16*
  Explores rubric-based rewards as a way to extend RL beyond verifiable domains (math, code) into subjective tasks like creative writing and scientific reasoning, decomposing desired behavior into interpretable criteria that LLM judges can score.
  *Key concepts:* rubric-based rewards (RaR), LLM-as-a-judge, RLVR vs. open-ended domains, instance-specific rubrics, reward aggregation, reward hacking mitigation

<!-- resource-id: reinforcement-learning__teaching-a-language-model-arithmetic-with-reinforcement-learning -->
- **[Teaching a Language Model Arithmetic with Reinforcement Learning](https://samikhan.ai/blog/countdown-rl.html)** · `Blog` · Sami Khan · *2026-01*
  A hands-on writeup of training LLMs with RL on the Countdown Numbers Game, surfacing sharp lessons about reward design — including a model that gamed the closeness reward by simply restating the target. Scaling from a collapsing 4B to a stable 30B MoE reached 50% exact-match on unseen puzzles.
  *Key concepts:* reward hacking, closeness/exponential-decay rewards, PRIME-RL token-level masking, pre-computed dataset verification, model-scale training stability

<!-- resource-id: reinforcement-learning__the-engineering-handbook-for-grpo-lora-verl-qwen2-5-multi-gpu -->
- **[The Engineering Handbook for GRPO+LoRA (verl, Qwen2.5 multi-GPU)](https://medium.com/@weyaxi1/the-engineering-handbook-for-grpo-lora-with-verl-training-qwen2-5-on-multi-gpu-b2431a2a8e92)** · `Blog` · Medium (Weyaxi) · *2026-01-02*
  A practical engineering guide to training Qwen2.5-3B with GRPO + LoRA on multi-GPU (4× A100) using verl, sharing optimizations that cut training from 9.5 to 6 hours and documenting how binary rewards pushed toward shorter responses.
  *Key concepts:* GRPO memory savings vs. PPO, data vs. tensor parallelism, gpu_memory_utilization tuning, reward-engineering trade-offs, checkpoint/infra stability, format overfitting

<!-- resource-id: reinforcement-learning__tiny-rl -->
- **[Tiny-RL](https://github.com/0xD4rky/Tiny-RL)** · `Repo` · GitHub (0xD4rky) · *—*
  A compact lab repository implementing multiple RL algorithms (GRPO, DAPO, Reinforce++) for training LLMs on mathematical tasks, with a configurable YAML-driven training framework for comparing methods.
  *Key concepts:* GRPO/DAPO/Reinforce++, math-task reward models, vLLM rollouts, YAML-configured hyperparameters, replay buffers, Weights & Biases logging

<!-- resource-id: reinforcement-learning__reinforcement-learning-without-verifiable-rewards-will-brown-prime-intellect -->
- **[Reinforcement Learning without Verifiable Rewards — Will Brown, Prime Intellect](https://www.youtube.com/watch?v=AQv3qRCG6Gw&t=1s)** · `Blog` · Will Brown · *2026-08-24* · ⭐
  Reinforcement Learning without Verifiable Rewards — Will Brown, Prime Intellect
  *Key concepts:* —

<!-- resource-id: reinforcement-learning__frognano-training-a-4b-coding-agent-via-online-task-synthesis -->
- **[FrogNano: Training a 4B Coding Agent via Online Task Synthesis](https://microsoft.github.io/debug-gym/static/papers/frognano_technical_report.pdf)** · `Paper` · Microsoft · *2026-09-09* · ⭐
  RL with synthetic data by Microsoft 09/09
  *Key concepts:* —

<!-- resource-id: reinforcement-learning__gspo-in-ms-swift -->
- **[Group Sequence Policy Optimization (GSPO)](https://swift.readthedocs.io/en/latest/Instruction/GRPO/AdvancedResearch/GSPO.html)** · `Blog` · MS-Swift documentation · *—*
  Documents sequence-level importance weighting for Group Sequence Policy Optimization and its relationship to token-level variants. The guide explains configuration choices within Swift's GRPO training stack, so examples need to be matched to the installed version.
  *Key concepts:* GSPO, GRPO, Importance sampling, Policy optimization, RL infrastructure

<!-- resource-id: reinforcement-learning__best-practice-critic-optimization -->
- **[Best Practice Critic Optimization](https://arxiv.org/abs/2608.23566)** · `Paper` · Penghui Qi, Xiangxin Zhou and Wee Sun Lee / arXiv · *2026-08-24*
  Investigates instability in critic-based LLM RL and combines bounded value prediction, Monte Carlo targets, unnormalized advantages, and length-adaptive estimation into BPCO. The critic may use privileged grading information during training while the policy cannot; reported comparisons concern the evaluated reasoning and rubric-reward tasks.
  *Key concepts:* Actor-critic, Advantage estimation, Value learning, Privileged information, RL stability


### Scaling, continual learning & state-of-the-field
<!-- resource-id: reinforcement-learning__rl-scaling-laws-for-llms -->
- **[RL Scaling Laws for LLMs](https://cameronrwolfe.substack.com/p/rl-scaling-laws)** · `Blog` · Cameron R. Wolfe (Substack) · *2026-04-20*
  Examines how scaling laws extend from pretraining to RL training, contrasting sigmoidal curves and power-law formulations for predicting reward gains as compute grows, and covering optimal compute-allocation strategies.
  *Key concepts:* sigmoidal vs. power-law scaling, GRPO variants (GSPO/DAPO/Dr.GRPO/TIS/CISPO), compute allocation trade-offs, difficulty-dependent regularization, inter/intra-model extrapolation

<!-- resource-id: reinforcement-learning__continual-learning-with-rl-for-llms -->
- **[Continual Learning with RL for LLMs](https://cameronrwolfe.substack.com/p/rl-continual-learning)** · `Blog` · Cameron R. Wolfe (Substack) · *2026-01-26*
  Argues that on-policy RL naturally mitigates catastrophic forgetting during continual learning, in contrast to SFT's tendency to degrade prior knowledge, connecting decades of continual-learning research with recent LLM findings.
  *Key concepts:* catastrophic forgetting, mode-seeking (reverse KL) vs. mode-covering, on-policy data, KL-divergence as forgetting predictor, confident conflicts, cross-domain generalization

<!-- resource-id: reinforcement-learning__state-of-rl-for-reasoning-llms -->
- **[State of RL for Reasoning LLMs](https://aweers.de/blog/2026/rl-for-llms/)** · `Blog` · aweers.de · *2026-03-15*
  A survey of RL algorithms for reasoning LLMs across 2024–2026, tracing the path from REINFORCE and PPO through specialized techniques, and identifying emerging consensus around critic-free training and better loss aggregation.
  *Key concepts:* critic-free training, trust-region refinement, loss-aggregation bias, group-relative advantages, verifiable-task optimization, scaling-law validation

<!-- resource-id: reinforcement-learning__best-resources-to-learn-rl-curated-thread -->
- **[Best Resources to Learn RL (curated thread)](https://x.com/cwolferesearch/status/2061827001204240599)** · `Blog` · X / Cameron R. Wolfe · *—* · ⚠️unverified
  A curated X thread pointing to high-quality resources for learning reinforcement learning — foundational courses, textbooks, and LLM-focused RL writeups.
  *Key concepts:* curated RL learning path, foundational RL courses, RLHF/RLVR resources, policy-optimization references

<!-- resource-id: reinforcement-learning__keep-the-tokens-flowing-lessons-from-16-open-source-rl-libraries -->
- **[Keep the Tokens Flowing: Lessons from 16 Open-Source RL Libraries](https://huggingface.co/blog/async-rl-training-landscape)** · `Blog` · Hugging Face Blog · *2026-03-10*
  A technical survey comparing 16 open-source RL libraries for LLM post-training, centered on async architectures that decouple inference from training, proposing seven orthogonal axes of comparison spanning orchestration, buffers, weight sync, and staleness.
  *Key concepts:* async RL training, orchestration/concurrency primitives, rollout buffer design, weight synchronization protocols, staleness & partial-rollout handling, MoE support

<!-- resource-id: reinforcement-learning__the-art-of-scaling-reinforcement-learning-compute-for-llms -->
- **[The Art of Scaling Reinforcement Learning Compute for LLMs](https://arxiv.org/abs/2510.13786)** · `Paper` · Devvrit Khatri, Lovish Madaan et al. / arXiv · *2025-10-15*
  Fits compute–performance trajectories for large-scale LLM RL and separates recipe effects on efficiency from effects on eventual performance. The abstract introduces ScaleRL as a practical outcome of the study and reports extrapolation from smaller runs, within the tested training regimes.
  *Key concepts:* RL scaling, Compute efficiency, Scaling laws, Training recipes, Predictive modeling

<!-- resource-id: reinforcement-learning__scaling-behaviors-of-llm-reinforcement-learning-post-training-an-empirical-study-in-mathematical-reasoning -->
- **[Scaling Behaviors of LLM Reinforcement Learning Post-Training: An Empirical Study in Mathematical Reasoning](https://arxiv.org/abs/2509.25300)** · `Paper` · Zelin Tan, Hejia Geng et al. / arXiv · *2025-09-29*
  An empirical study of how model size, training data, and compute interact during mathematical-reasoning RL on the Qwen2.5 dense family. It examines fitted scaling relationships and reuse of high-quality data under limited-data conditions, with conclusions bounded to that experimental family and task setting.
  *Key concepts:* RL scaling, Data efficiency, Compute budgets, Mathematical reasoning, Data reuse


### Hands-on & lab writeups
<!-- resource-id: reinforcement-learning__how-to-finetune-llms-to-think-with-reinforcement-learning-grpo-from-scratch -->
- **[How to finetune LLMs to THINK with Reinforcement Learning (GRPO from scratch!)](https://www.youtube.com/watch?v=yGkJj_4bjpE)** · `Video` · Neural Breakdown with AVB (YouTube) · *2025-06-29* · ⚠️unverified
  A from-scratch PyTorch walkthrough of Group Relative Policy Optimization (GRPO), showing how to train small language models to reason step-by-step with RL — the full loop: rollouts, group-relative advantages, reward design, and the policy update.
  *Key concepts:* GRPO, reasoning fine-tuning, group-relative advantage, reward functions, KL penalty

<!-- resource-id: reinforcement-learning__building-olmo-3-for-ai-agents-nathan-lambert-slides -->
- **[Building Olmo 3 for AI Agents — Nathan Lambert (slides)](https://docs.google.com/presentation/d/1K3bM3K7q_CBcXzUCX7a1YvUHAycpvTKZbJElKSOdiok/edit)** · `Blog` · Nathan Lambert / CMU LTI talk · *2026-02-13* · ⚠️unverified
  Slide deck ("Agentic Olmos") from a CMU LTI talk on building the fully open Olmo 3 model family for agentic use, covering the post-training recipe and design choices behind agent-capable open models.
  *Key concepts:* Olmo 3, open post-training, agentic LLMs, RL post-training, AI2 open models

<!-- resource-id: reinforcement-learning__minimax-2-5-rl-thread -->
- **[MiniMax 2.5 RL (thread)](https://x.com/neural_avb/status/2022715561390776524)** · `Blog` · @neural_avb (X) · *2026-02-13* · ⚠️unverified
  A clear explainer of the RL architecture behind MiniMax M2.5, centered on the CISPO algorithm and its reward structure (process rewards, completion-time rewards, reward-to-go) — CISPO clips importance-sampling weights rather than token updates so all tokens contribute to gradients.
  *Key concepts:* CISPO, importance-sampling clipping, process rewards, reward-to-go, Forge RL framework

<!-- resource-id: foundations-interviews-meta__cs336-study-notes-grpo-for-math-reasoning-on-lambda-cloud -->
- **[CS336 Study Notes: GRPO for Math Reasoning on Lambda Cloud](https://bearbearyu1223.github.io/posts/grpo-math-reasoning-lambda-cloud/)** · `Blog` · Han Yu · *2026-02-08*
  Post 15 of a CS336 study-notes series: a practical GRPO implementation that lifts Qwen2.5-Math-1.5B from ~6% to ~25% accuracy, training on 2×H100 (Lambda Cloud) with vLLM inference on GPU 0 and policy training on GPU 1 to eliminate memory contention.
  *Key concepts:* GRPO, group-normalized advantages, 2-GPU vLLM/trainer split, math-reasoning reward design, off-policy training with PPO clipping, Lambda Cloud setup

<!-- resource-id: reinforcement-learning__reinforcement-learning-environments-for-ai-agents -->
- **[Reinforcement Learning environments and how to build them](https://unsloth.ai/blog/rl-environments)** · `Blog` · Unsloth / NVIDIA collaborators · *2026-03-13*
  Explains the policy-environment-reward loop for training agents and the role of executable task environments. The walkthrough connects Unsloth with NeMo RL, NeMo Gym, and synthetic-data tools, while distinguishing supervised demonstrations from reward-driven learning.
  *Key concepts:* Reinforcement learning, Agent environments, Reward design, NeMo RL, Synthetic data

<!-- resource-id: reinforcement-learning__mithrl-minimal-rl-training-for-language-models -->
- **[mithrl: Minimal RL Training for Language Models](https://github.com/omkaark/mithrl)** · `Repo` · omkaark / mithrl contributors · *—*
  A compact RL training implementation built around a swappable chat-model interface, vLLM rollouts, and local PEFT adapters. Its README offers a small math-training example intended to make the training loop inspectable.
  *Key concepts:* Reinforcement learning, RL infrastructure, vLLM, LoRA, Rollout generation

<!-- resource-id: reinforcement-learning__training-search-agents-with-grpo -->
- **[Training Search Agents with GRPO](https://jasperlu.com/blog/training-search-agents-grpo)** · `Blog` · Jasper Lu · *—*
  Introduces agent RL through a search task over financial filings, using a simplified Harness-1 environment and group-relative policy optimization. The write-up exposes dataset subsets and training artifacts, making reward design and retrieval behavior concrete without assuming results generalize beyond the evaluated corpus.
  *Key concepts:* GRPO, Search agents, Reward design, Retrieval, Training evaluation


### Interview
<!-- resource-id: reinforcement-learning__rl-algorithms-interview-questions -->
- **[RL Algorithms Interview Questions](https://www.k-a.in/rl-algo.html)** · `Blog` · k-a.in (Arjun Kocher) · *—* · ⚠️unverified
  A Q&A-style reference page of reinforcement-learning algorithm interview questions covering core RL concepts and algorithm design.
  *Key concepts:* RL fundamentals, value-based vs. policy-based methods, algorithm design trade-offs, interview Q&A format

### Async RL: the core problem: training–inference mismatch
<!-- resource-id: async-infrastructure-rl__is-frontier-asynchronous-rl-solved -->
- **[Is Frontier Asynchronous RL Solved?](https://luk-huang.github.io/personal-website/blog/is-frontier-asynchronous-rl-solved.html)** · `Blog` · Luke Huang · *2026-05-31* · ⭐
  A survey of frontier-scale async RL where rollout and training loops run concurrently for 2-3x throughput, and the "policy lag" staleness this introduces; it compares algorithmic (importance-sampling reshaping) versus systems (deterministic kernels, routing replay, quantization) fixes and argues sequence-level importance ratios scale with compute better than token-level ones.
  *Key concepts:* policy lag (K), token/sequence/geometric-mean importance sampling, batch-invariant kernels, TIS/MIS/M2PO clipping, bias-variance scaling

<!-- resource-id: async-infrastructure-rl__your-efficient-rl-framework-secretly-brings-you-off-policy-rl-training -->
- **[Your Efficient RL Framework Secretly Brings You Off-Policy RL Training](https://fengyao.notion.site/off-policy-rl)** · `Blog` · Feng Yao et al. (Notion) · *2025-08* · ⚠️unverified
  Argues that in modern frameworks like VeRL, using different implementations for rollout generation (vLLM) and training (FSDP) creates a numerical gap that silently converts nominally on-policy RL into off-policy training; proposes a simple importance-sampling correction to account for the discrepancy.
  *Key concepts:* rollout/training implementation gap, hidden off-policyness, importance sampling ratio, vLLM vs FSDP mismatch, VeRL

<!-- resource-id: async-infrastructure-rl__when-speed-kills-stability-demystifying-rl-collapse-from-the-training-inference-mismatch -->
- **[When Speed Kills Stability: Demystifying RL Collapse from the Training-Inference Mismatch](https://yingru.notion.site/When-Speed-Kills-Stability-Demystifying-RL-Collapse-from-the-Training-Inference-Mismatch-271211a558b7808d8b12d403fd15edda)** · `Blog` · Jiacai Liu, Yingru Li et al. (Notion) · *2025-09* · ⚠️unverified
  Establishes a stochastic-gradient-ascent (SGA) framework to explain why the training-inference mismatch causes RL collapse, decomposing the failure into a bias term (TV distance) and a variance term (χ²-divergence), and motivating a rollout-correction fix.
  *Key concepts:* SGA analysis framework, bias (TV distance) vs variance (χ²-divergence), off-policy failure modes, rollout correction, PPO sample reuse

<!-- resource-id: async-infrastructure-rl__defeating-the-trainer-generator-precision-mismatch-in-trl -->
- **[Defeating the trainer-generator precision mismatch in TRL](https://huggingface.co/spaces/aminediroHF/trainer-generator-bf16-mismatch)** · `Blog` · Hugging Face Space (aminediroHF) · *—*
  Walks through the precision mismatch that arises in TRL when the trainer and the generator operate at conflicting numerical precision (notably bf16), and how aligning precision across the distributed components removes the divergence that destabilizes RL fine-tuning.
  *Key concepts:* bf16/bfloat16 precision, trainer-generator mismatch, precision alignment, TRL, distributed RL fine-tuning

### Async RL: async RL systems & scale
<!-- resource-id: async-infrastructure-rl__vllm-native-rl-apis-async-weight-updates-when-training-rl -->
- **[vLLM native RL APIs: async weight updates when training RL](https://vllm.ai/blog/2026-05-28-native-rl-apis)** · `Blog` · vLLM · *2026-05-28*
  Introduces native weight-sync APIs in vLLM to standardize how training and inference engines exchange weights across RL frameworks, with pluggable transport backends and a pause/resume protocol that resolves deadlocks and enables true asynchronous RL.
  *Key concepts:* WeightTransferEngine abstraction, NCCL/CUDA-IPC backends, keep-mode pause/resume, two-phase pause (DP deadlock resolution), packed-tensor weight broadcast

<!-- resource-id: async-infrastructure-rl__rl-at-1t-scale -->
- **[RL at 1T scale](https://www.primeintellect.ai/blog/rl-at-1t-scale)** · `Blog` · Prime Intellect · *2026-06-21*
  Describes prime-rl v0.6.0 training trillion-parameter models on agentic workloads with sub-5-minute step times on GLM-5 using only 28 H200 nodes, via a disaggregated async trainer/inference architecture and aggressive low-precision and parallelism optimizations.
  *Key concepts:* disaggregated async trainer/inference, prefill/decode disaggregation, FSDP+EP+CP parallelism, block-scaled FP8 training, Router Replay (R3), Mooncake KV-cache pooling

<!-- resource-id: async-infrastructure-rl__pipelinerl-faster-on-policy-rl-for-long-sequence-generation -->
- **[PipelineRL: Faster On-policy RL for Long Sequence Generation](https://arxiv.org/pdf/2509.19128)** · `Paper` · arXiv · *2025-09-30*
  Presents PipelineRL, which uses pipeline parallelism to overlap rollout collection with gradient updates, cutting idle time and accelerating RL on long-sequence generation tasks while keeping data as close to on-policy as possible.
  *Key concepts:* pipeline parallelism, overlapping rollout/gradient computation, on-policy data freshness, long-sequence generation, GPU utilization/buffer management

<!-- resource-id: reinforcement-learning__ai-infrastructure-at-periodic -->
- **[AI Infrastructure at Periodic](https://periodic.com/news/ai-infrastructure-at-periodic)** · `Blog` · Periodic Labs · *—*
  Describes a scientific-model training stack that combines asynchronous training and rollouts with specialized inference and sandbox infrastructure. The opening sections explain why long tool-running trajectories need different resource scheduling from short training steps; reported efficiency gains are workload-specific engineering results.
  *Key concepts:* Asynchronous RL, Scientific agents, Rollout infrastructure, Sandboxing, GPU utilization


### Async RL: agentic RL (token-in / token-out)
<!-- resource-id: async-infrastructure-rl__agentic-rl-token-in-token-out-done-right -->
- **[Agentic RL: Token-In, Token-Out Done Right](https://qgallouedec-tito.hf.space/)** · `Blog` · Quentin Gallouédec (HF) · *2026-05-28*
  Diagnoses a subtle multi-turn tool-use RL bug where re-tokenizing conversations during training breaks the invariant of optimizing on the exact tokens the model sampled, causing silent gradient corruption; proposes the TITO approach of a single never-re-encoded token buffer.
  *Key concepts:* Token-In Token-Out invariant, BPE non-injectivity / retokenization drift, prefix-preservation property, tool-response delta, incremental loss-mask synchronization

<!-- resource-id: async-infrastructure-rl__agentic-rl-deep-dive -->
- **[Agentic RL (deep dive)](https://cameronrwolfe.substack.com/p/agentic-rl)** · `Blog` · Cameron R. Wolfe (Substack) · *2026-06-22*
  A comprehensive overview of RL frameworks for training autonomous LLM agents on long-horizon, multi-turn tasks, synthesizing design principles and infrastructure challenges around environment scaling, trajectory representation, and training stability.
  *Key concepts:* multi-turn MDP formulation, asynchronous training pipelines, step-level trajectory representation, ScalingInter-RL curriculum, cross-policy sampling, synthetic environment synthesis

<!-- resource-id: async-infrastructure-rl__what-are-rlvr-environments-for-llms-policy-rollouts-rubrics -->
- **[What are RLVR environments for LLMs? (Policy · Rollouts · Rubrics)](https://www.youtube.com/watch?v=52UlnK-SW7I)** · `Video` · Yacine Mahdid (YouTube) · *2025-10-15* · ⚠️unverified
  A ~27-minute tutorial walking through the full RLVR loop (dataset, policy, rollouts, rewards, updates) using the verifiers library, contrasting verifiable rewards with RLHF and giving a 7-step deep dive on building a math-python environment.
  *Key concepts:* RLVR loop, verifiable/non-gameable rewards, verifiers library, rubrics-as-rewards, RLVR vs RLHF, environment/parser packaging

<!-- resource-id: async-infrastructure-rl__async-rl-scaling-bartoldson-thread -->
- **[Async RL scaling (Bartoldson thread)](https://x.com/bartoldson/status/2038373819304559058)** · `Blog` · @bartoldson (X) · *2026-03-28* · ⚠️unverified
  Brian Bartoldson recommends learning async RL for LLMs by hacking on the prime-RL codebase, and points to foundational early papers on asynchronous RL post-training. Connects to his own work on Trajectory Balance with Asynchrony (TBA), which decouples exploration from learning for faster, scalable post-training.
  *Key concepts:* asynchronous RL, prime-RL, off-policy training, Trajectory Balance (TBA), decoupled exploration/learning

<!-- resource-id: async-infrastructure-rl__the-4-bitter-lesson-balancing-stability-and-performance-in-nvfp4-rl -->
- **[The 4-bitter Lesson Balancing Stability and Performance in NVFP4 RL](https://humansand.ai/blog/nvfp4-rl?v=3)** · `Blog` · Human& · *2026-07-12* · ⭐
  Baseline: A starting recipe with stable training dynamics
  *Key concepts:* NVFP4 for RL

<!-- resource-id: reinforcement-learning__training-frontier-knowledge-work-agents-a-397b-rl-guide-with-skyrl -->
- **[Training frontier knowledge work agents: a 397B RL guide with SkyRL](https://mercor.com/blog/training-frontier-knowledge-work-agents-a-397b-rl-training-guide-with-skyrl)** · `Blog` · Mercor and SkyRL · *2026-09-01*
  Documents staged environment checks, systems tuning, overfitting tests, and algorithm ablations before a large agent-RL run. Distinguishes public evaluation artifacts and training code from the proprietary expert-created training tasks, so the open recipe is not mistaken for a fully public reproduction dataset.
  *Key concepts:* Agentic RL, SkyRL, Training validation, Expert data, Long-horizon tasks


### Reasoning model reports
<!-- resource-id: post-training-playbooks-reports__mai-thinking-1-building-a-hill-climbing-machine -->
- **[MAI-Thinking-1: Building a Hill-Climbing Machine](https://microsoft.ai/pdf/mai-thinking-1.pdf)** · `Paper` · Microsoft AI · *2026-06-06*
  Microsoft AI's first reasoning model, a 35B-active / 1T-total MoE trained from scratch on clean enterprise-grade data with no distillation from third-party models, pairing a scaling-focused pre-training framework with an RL recipe engineered for sustained log-linear improvement over thousands of steps.
  *Key concepts:* hill-climbing machine / system-level optimization, from-scratch training without distillation, scaling-focused pre-training framework, log-linear RL scaling, STEM reasoning + coding, MoE architecture

<!-- resource-id: reinforcement-learning__acereason-nemotron-advancing-math-and-code-reasoning-through-reinforcement-learning -->
- **[AceReason-Nemotron: Advancing Math and Code Reasoning through Reinforcement Learning](https://arxiv.org/abs/2505.16400)** · `Paper` · Yang Chen, Zhuolin Yang et al. / NVIDIA · *2025-05-22*
  Studies a sequential math-then-code RL recipe for improving already strong distilled reasoning models. The abstract highlights verifiable data curation, response-length curricula, and on-policy updates, with cross-domain transfer measured in the authors' experiments.
  *Key concepts:* Reasoning, RLVR, Curriculum learning, Data curation, On-policy updates

<!-- resource-id: reinforcement-learning__nemotron-cascade-scaling-cascaded-reinforcement-learning-for-general-purpose-reasoning-models -->
- **[Nemotron-Cascade: Scaling Cascaded Reinforcement Learning for General-Purpose Reasoning Models](https://arxiv.org/abs/2512.13607)** · `Paper` · Boxin Wang, Chankyu Lee et al. / NVIDIA · *2025-12-15*
  Introduces sequential domain-wise reinforcement learning to manage differences in response length and verification latency across tasks. Contrasts this curriculum with mixed-domain training and reports cross-domain retention in the evaluated models, rather than assuming all RL stages interfere equally.
  *Key concepts:* Cascade RL, Multi-domain training, Curriculum learning, Verification latency, Reasoning


### Applied RL & decision making
<!-- resource-id: thinking-machines-lab__training-llms-to-predict-world-events-guest-post-with-mantic -->
- **[Training LLMs to Predict World Events (Guest Post with Mantic)](https://thinkingmachines.ai/news/training-llms-to-predict-world-events/)** · `News` · Thinking Machines · *2026-03-19*
  A guest post from Mantic showing that RL fine-tuning (via Tinker) lifts gpt-oss-120b's geopolitical forecasting from 38.6 to 45.8 points, matching frontier LLMs, and that the fine-tuned model adds decorrelated value inside forecasting ensembles.
  *Key concepts:* RL fine-tuning for forecasting, binary event prediction, two-phase research/prediction architecture, ensemble decorrelation, GRPO-style advantage normalization, proper scoring (Brier/log)

### Reasoning & test-time compute

<!-- resource-id: reinforcement-learning__why-we-think -->
- **[Why We Think](https://lilianweng.github.io/posts/2025-05-01-thinking/)** · `Blog` · Lilian Weng / Lil'Log · *2025-05-01*
  Reviews test-time computation through token-based reasoning, parallel sampling, sequential revision, reinforcement learning, and continuous or latent computation. It distinguishes making more attempts from learning to use computation well and highlights that self-correction and verbalized reasoning need not be reliable.
  *Key concepts:* Test-time compute, Reasoning models, Chain-of-thought, Reinforcement learning, Inference-time scaling

<!-- resource-id: reinforcement-learning__base-models-can-reason-by-taking-a-cue-from-training-data -->
- **[Base Models Can Reason By Taking a Cue From Training Data](https://arxiv.org/abs/2610.06851)** · `Paper` · Sophie L. Wang, Amil Dravid et al. / arXiv · *2026-10-05*
  Studies how a model's opening tokens activate reasoning behaviors associated with its training data. The abstract reports cue interventions and comparisons with RL-trained models on selected math and coding tasks; this is evidence about those settings, not a claim that prompting universally replaces RL.
  *Key concepts:* Reasoning, Training data, Token cues, Reinforcement learning, Causal interventions

<!-- resource-id: reinforcement-learning__scaling-llm-test-time-compute-optimally-can-be-more-effective-than-scaling-model-parameters -->
- **[Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters](https://arxiv.org/abs/2408.03314)** · `Paper` · Charlie Snell, Jaehoon Lee, Kelvin Xu and Aviral Kumar / arXiv · *2024-08-06*
  Studies how verifier-guided search and adaptive response generation use inference-time compute. The abstract argues that an effective allocation depends on prompt difficulty, making smaller-model versus larger-model comparisons conditional on the task and compute budget.
  *Key concepts:* Test-time compute, Verifier-guided search, Compute allocation, Reasoning, Scaling laws


### Reward design & robustness

<!-- resource-id: reinforcement-learning__reward-hacking-in-reinforcement-learning -->
- **[Reward Hacking in Reinforcement Learning](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)** · `Blog` · Lilian Weng / Lil'Log · *2024-11-28*
  Explains the gap between maximizing a proxy reward and completing the intended task, covering specification gaming, reward tampering, and RLHF examples. It separates ordinary generalization failure from pursuing the wrong objective and surveys the limited mitigation evidence available at publication.
  *Key concepts:* Reward hacking, Reward design, RLHF, Specification gaming, Evaluation

<!-- resource-id: reinforcement-learning__training-a-misaligned-reward-seeker -->
- **[Training a Misaligned Reward Seeker](https://alignment.anthropic.com/2026/reward-seeker)** · `Blog` · Richard Qi, Benjamin Wright, Monte MacDiarmid and Evan Hubinger / Anthropic · *2026-08*
  Studies an intentionally vulnerable RL training setup to test whether reward hacking can generalize into more serious unwanted behavior. The overview distinguishes harmful reward-seeking in evaluated scenarios from behaviors it did not find, including self-preservation and beyond-episode reward seeking; this is not a characterization of ordinary deployed models.
  *Key concepts:* Reward hacking, RL safety, Misalignment, Behavioral evaluation, Reward tampering
