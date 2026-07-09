# Thinking Machines Lab

[[Library|← Back to Library index]] · Related: [[On-Policy Distillation]] · [[Reinforcement Learning]] · [[Efficient Inference & Serving]]

This page is a running tracker of every published post from **Thinking Machines Lab** — both their "Connectionism" research blog and their News feed. You consider all of it gold, so nothing is filtered out. Entries are ordered newest-first by publication date; update it whenever a new post drops.

> Home: [thinkingmachines.ai](https://thinkingmachines.ai/) · Blog: [/blog](https://thinkingmachines.ai/blog/) · News: [/news](https://thinkingmachines.ai/news/)

- **[Learning to Replicate Expert Judgment in Financial Tasks](https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/)** · `News` · Thinking Machines · *2026-06-30*
  A collaboration with Bridgewater AIA Labs showing that custom-trained models beat frontier LLMs on financial document classification, reaching 84.7% accuracy versus 78.2% while cutting inference cost 13.8x, via careful expert-labeled data curation plus specialized training techniques.
  *Key concepts:* expert dataset curation, interleaved batching, CISPO loss with asymmetric clipping, on-policy distillation, financial task taxonomy
- **[Announcing Interactivity Research Grants](https://thinkingmachines.ai/news/interactivity-research-grants/)** · `News` · Thinking Machines · *2026-05-19*
  Multiple $100,000 grants to fund research on AI interactivity — real-time, multimodal collaboration between humans and models — arguing interactivity deserves as much focus as intelligence and autonomy.
  *Key concepts:* real-time multimodal interaction, human-AI collaboration, generative UI, human steering of long-horizon agents, multimodal safety
- **[Interaction Models: A Scalable Approach to Human-AI Collaboration](https://thinkingmachines.ai/blog/interaction-models/)** · `Blog` · Thinking Machines · *2026-05-11*
  A research preview of "interaction models" that natively handle real-time audio/video/text collaboration without external scaffolding, using a time-aligned micro-turn architecture so the AI can respond, interject, and be interrupted at natural conversational speed.
  *Key concepts:* time-aligned micro-turns, encoder-free early fusion, streaming sessions, dual-system architecture, multi-modal interactivity, batch-invariant kernels
- **[Training LLMs to Predict World Events (Guest Post with Mantic)](https://thinkingmachines.ai/news/training-llms-to-predict-world-events/)** · `News` · Thinking Machines · *2026-03-19*
  A guest post from Mantic showing that RL fine-tuning (via Tinker) lifts gpt-oss-120b's geopolitical forecasting from 38.6 to 45.8 points, matching frontier LLMs, and that the fine-tuned model adds decorrelated value inside forecasting ensembles.
  *Key concepts:* RL fine-tuning for forecasting, binary event prediction, two-phase research/prediction architecture, ensemble decorrelation, GRPO-style advantage normalization, proper scoring (Brier/log)
- **[Thinking Machines Lab and NVIDIA Announce Long-Term Gigawatt-Scale Strategic Partnership](https://thinkingmachines.ai/news/nvidia-partnership/)** · `News` · Thinking Machines · *2026-03-10*
  A multi-year partnership to deploy at least one gigawatt of NVIDIA Vera Rubin systems for frontier model training, paired with a significant NVIDIA investment, aimed at delivering customizable and open AI to enterprises and researchers.
  *Key concepts:* gigawatt-scale infrastructure, frontier model training, NVIDIA Vera Rubin platform, customizable/open AI, strategic capital investment
- **[Tinker: General Availability and Vision Input](https://thinkingmachines.ai/news/tinker-general-availability/)** · `News` · Thinking Machines · *2025-12-12*
  Tinker exits beta with general availability, support for the Kimi K2 Thinking model, OpenAI API compatibility, and new vision fine-tuning via Qwen3-VL — with vision-language fine-tuning notably outperforming classic computer-vision approaches in low-data regimes.
  *Key concepts:* general availability, Kimi K2 Thinking, OpenAI API compatibility, Qwen3-VL vision models, LoRA vision fine-tuning, data efficiency vs. DINOv2
- **[Tinker: Call for Community Projects](https://thinkingmachines.ai/news/call-for-community-projects/)** · `News` · Thinking Machines · *2025-11-07*
  An invitation for researchers and builders to submit Tinker-based projects for featured blog coverage — reimplementations, novel ML methods, fine-tuned domain models, prototypes, datasets, and infrastructure — prioritizing rigorous evaluation over novelty.
  *Key concepts:* community-driven fine-tuning, constitutional AI / RLAIF, self-distillation and transfer learning, rigorous evaluation standards, open reporting
- **[Tinker: Announcing Research and Teaching Grants](https://thinkingmachines.ai/news/tinker-research-and-teaching-grants/)** · `News` · Thinking Machines · *2025-10-29*
  Grants to support Tinker adoption: $250-per-student teaching grants for academic courses and research grants starting at $5,000, reviewed on a rolling ~one-week basis.
  *Key concepts:* teaching grants ($250/student), research grants ($5,000+), open-weight LLM training, personalized LLMs and RL, open science
- **[On-Policy Distillation](https://thinkingmachines.ai/blog/on-policy-distillation/)** · `Blog` · Thinking Machines · *2025-10-27* · ⭐
  On-policy distillation combines student-generated (on-policy) sampling with dense per-token teacher supervision via reverse KL, delivering RL-level post-training gains at a fraction of the cost while avoiding the compounding errors of off-policy methods. Also enables continual learning using earlier model versions as teachers. See [[On-Policy Distillation]].
  *Key concepts:* reverse KL divergence, dense per-token reward, on-policy sampling, continual learning without catastrophic forgetting, process supervision / forking tokens, logprob-based distillation
- **[Announcing Tinker](https://thinkingmachines.ai/news/announcing-tinker/)** · `News` · Thinking Machines · *2025-10-01*
  Launch of Tinker, a managed API for fine-tuning open-weight LLMs that abstracts away distributed-training infrastructure while exposing low-level primitives and an open-source cookbook of post-training methods.
  *Key concepts:* managed fine-tuning API, distributed training abstraction, LoRA cost efficiency, low-level primitives (forward_backward, sample), Tinker Cookbook
- **[LoRA Without Regret](https://thinkingmachines.ai/blog/lora/)** · `Blog` · Thinking Machines · *2025-09-29*
  An empirical study of when LoRA matches full fine-tuning, finding that with proper hyperparameters and application to all layers (especially MLP/MoE), LoRA achieves the same sample efficiency and final performance as full fine-tuning.
  *Key concepts:* low-rank decomposition, all-layer application, learning-rate scaling (~10x), capacity bounds (1 bit/token vs 1 bit/episode), batch-size sensitivity, FLOP efficiency
- **[Modular Manifolds](https://thinkingmachines.ai/blog/modular-manifolds/)** · `Blog` · Thinking Machines · *2025-09-26*
  Introduces "manifold Muon," which constrains weight matrices to the Stiefel manifold using a spectral-norm distance, then extends it to whole networks via "modular manifolds" that compose per-layer constraints with provable Lipschitz guarantees.
  *Key concepts:* manifold constraints (Stiefel manifold), tangent-space optimization, spectral-norm distance, dual ascent, modular norm composition, Riemannian vs. Finsler geometry
- **[Defeating Nondeterminism in LLM Inference](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)** · `Blog` · Thinking Machines · *2025-09-10*
  Argues that LLM inference nondeterminism comes mainly from batch-size-dependent kernels rather than floating-point concurrency, and shows how batch-invariant kernels for RMSNorm, matmul, and attention yield fully reproducible outputs and enable true on-policy RL.
  *Key concepts:* floating-point non-associativity, batch invariance, data-parallel reduction, split-KV attention, run-to-run determinism

---
*Coverage note: captures the 5 Connectionism blog posts + 8 News posts publicly listed as of compilation (13 total). "Defeating Nondeterminism" (2025-09-10) appears to be the earliest post. Add new posts at the top as they publish.*
