# Async & Infrastructure RL

[[Library|← Back to Library index]] · Related: [[Reinforcement Learning]] · [[Efficient Inference & Serving]] · [[On-Policy Distillation]]

This page collects the current frontier work on **asynchronous & infrastructure RL** for LLMs: what breaks when rollout generation and training run as separate, differently-implemented engines. The recurring theme is the training–inference mismatch — the silent gap between the policy that samples tokens (vLLM/SGLang) and the policy that computes gradients (FSDP/Megatron) — and the algorithmic (importance sampling) and systems (precision, router replay, native weight sync) fixes that keep it stable at scale.

**Suggested reading order:** Is Frontier Async RL Solved? ⭐ → off-policy framework → RL collapse/mismatch → precision mismatch → vLLM native RL.

### The core problem: training–inference mismatch
- **[Is Frontier Asynchronous RL Solved?](https://luk-huang.github.io/personal-website/blog/is-frontier-asynchronous-rl-solved.html)** · `Blog` · Luke Huang · *2026-05-31* · ⭐
  A survey of frontier-scale async RL where rollout and training loops run concurrently for 2-3x throughput, and the "policy lag" staleness this introduces; it compares algorithmic (importance-sampling reshaping) versus systems (deterministic kernels, routing replay, quantization) fixes and argues sequence-level importance ratios scale with compute better than token-level ones.
  *Key concepts:* policy lag (K), token/sequence/geometric-mean importance sampling, batch-invariant kernels, TIS/MIS/M2PO clipping, bias-variance scaling
- **[Your Efficient RL Framework Secretly Brings You Off-Policy RL Training](https://fengyao.notion.site/off-policy-rl)** · `Blog` · Feng Yao et al. (Notion) · *2025-08* · ⚠️unverified
  Argues that in modern frameworks like VeRL, using different implementations for rollout generation (vLLM) and training (FSDP) creates a numerical gap that silently converts nominally on-policy RL into off-policy training; proposes a simple importance-sampling correction to account for the discrepancy.
  *Key concepts:* rollout/training implementation gap, hidden off-policyness, importance sampling ratio, vLLM vs FSDP mismatch, VeRL
- **[When Speed Kills Stability: Demystifying RL Collapse from the Training-Inference Mismatch](https://yingru.notion.site/When-Speed-Kills-Stability-Demystifying-RL-Collapse-from-the-Training-Inference-Mismatch-271211a558b7808d8b12d403fd15edda)** · `Blog` · Jiacai Liu, Yingru Li et al. (Notion) · *2025-09* · ⚠️unverified
  Establishes a stochastic-gradient-ascent (SGA) framework to explain why the training-inference mismatch causes RL collapse, decomposing the failure into a bias term (TV distance) and a variance term (χ²-divergence), and motivating a rollout-correction fix.
  *Key concepts:* SGA analysis framework, bias (TV distance) vs variance (χ²-divergence), off-policy failure modes, rollout correction, PPO sample reuse
- **[Defeating the trainer-generator precision mismatch in TRL](https://huggingface.co/spaces/aminediroHF/trainer-generator-bf16-mismatch)** · `Blog` · Hugging Face Space (aminediroHF) · *—*
  Walks through the precision mismatch that arises in TRL when the trainer and the generator operate at conflicting numerical precision (notably bf16), and how aligning precision across the distributed components removes the divergence that destabilizes RL fine-tuning.
  *Key concepts:* bf16/bfloat16 precision, trainer-generator mismatch, precision alignment, TRL, distributed RL fine-tuning

### Async RL systems & scale
- **[vLLM native RL APIs: async weight updates when training RL](https://vllm.ai/blog/2026-05-28-native-rl-apis)** · `Blog` · vLLM · *2026-05-28*
  Introduces native weight-sync APIs in vLLM to standardize how training and inference engines exchange weights across RL frameworks, with pluggable transport backends and a pause/resume protocol that resolves deadlocks and enables true asynchronous RL.
  *Key concepts:* WeightTransferEngine abstraction, NCCL/CUDA-IPC backends, keep-mode pause/resume, two-phase pause (DP deadlock resolution), packed-tensor weight broadcast
- **[RL at 1T scale](https://www.primeintellect.ai/blog/rl-at-1t-scale)** · `Blog` · Prime Intellect · *2026-06-21*
  Describes prime-rl v0.6.0 training trillion-parameter models on agentic workloads with sub-5-minute step times on GLM-5 using only 28 H200 nodes, via a disaggregated async trainer/inference architecture and aggressive low-precision and parallelism optimizations.
  *Key concepts:* disaggregated async trainer/inference, prefill/decode disaggregation, FSDP+EP+CP parallelism, block-scaled FP8 training, Router Replay (R3), Mooncake KV-cache pooling
- **[PipelineRL: Faster On-policy RL for Long Sequence Generation](https://arxiv.org/pdf/2509.19128)** · `Paper` · arXiv · *2025-09-30*
  Presents PipelineRL, which uses pipeline parallelism to overlap rollout collection with gradient updates, cutting idle time and accelerating RL on long-sequence generation tasks while keeping data as close to on-policy as possible.
  *Key concepts:* pipeline parallelism, overlapping rollout/gradient computation, on-policy data freshness, long-sequence generation, GPU utilization/buffer management

### Agentic RL (token-in / token-out)
- **[Agentic RL: Token-In, Token-Out Done Right](https://qgallouedec-tito.hf.space/)** · `Blog` · Quentin Gallouédec (HF) · *2026-05-28*
  Diagnoses a subtle multi-turn tool-use RL bug where re-tokenizing conversations during training breaks the invariant of optimizing on the exact tokens the model sampled, causing silent gradient corruption; proposes the TITO approach of a single never-re-encoded token buffer.
  *Key concepts:* Token-In Token-Out invariant, BPE non-injectivity / retokenization drift, prefix-preservation property, tool-response delta, incremental loss-mask synchronization
- **[Agentic RL (deep dive)](https://cameronrwolfe.substack.com/p/agentic-rl)** · `Blog` · Cameron R. Wolfe (Substack) · *2026-06-22*
  A comprehensive overview of RL frameworks for training autonomous LLM agents on long-horizon, multi-turn tasks, synthesizing design principles and infrastructure challenges around environment scaling, trajectory representation, and training stability.
  *Key concepts:* multi-turn MDP formulation, asynchronous training pipelines, step-level trajectory representation, ScalingInter-RL curriculum, cross-policy sampling, synthetic environment synthesis
- **[What are RLVR environments for LLMs? (Policy · Rollouts · Rubrics)](https://www.youtube.com/watch?v=52UlnK-SW7I)** · `Video` · Yacine Mahdid (YouTube) · *2025-10-15* · ⚠️unverified
  A ~27-minute tutorial walking through the full RLVR loop (dataset, policy, rollouts, rewards, updates) using the verifiers library, contrasting verifiable rewards with RLHF and giving a 7-step deep dive on building a math-python environment.
  *Key concepts:* RLVR loop, verifiable/non-gameable rewards, verifiers library, rubrics-as-rewards, RLVR vs RLHF, environment/parser packaging
- **[Async RL scaling (Bartoldson thread)](https://x.com/bartoldson/status/2038373819304559058)** · `Blog` · @bartoldson (X) · *2026-03-28* · ⚠️unverified
  Brian Bartoldson recommends learning async RL for LLMs by hacking on the prime-RL codebase, and points to foundational early papers on asynchronous RL post-training. Connects to his own work on Trajectory Balance with Asynchrony (TBA), which decouples exploration from learning for faster, scalable post-training.
  *Key concepts:* asynchronous RL, prime-RL, off-policy training, Trajectory Balance (TBA), decoupled exploration/learning

- **[The 4-bitter Lesson Balancing Stability and Performance in NVFP4 RL](https://humansand.ai/blog/nvfp4-rl?v=3)** · `Blog` · Human& · *2026-07-12* · ⭐
  Baseline: A starting recipe with stable training dynamics
  *Key concepts:* NVFP4 for RL
