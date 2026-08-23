# Post-Training Playbooks & Reports

[[Library|← Back to Library index]] · Related: [[Reinforcement Learning]] · [[On-Policy Distillation]] · [[LLM Architecture & Scaling Laws]] · [[Distributed & Parallel Training]]

End-to-end guides for building modern LLMs alongside frontier-lab technical reports. These sources move past isolated tricks to treat model development as a systems problem — data mixture, architecture, stability, and multi-stage post-training. Together they map the full pipeline from pre-training through SFT, RL, and distillation.

### Playbooks (how to build LLMs end-to-end)
- **[The Smol Training Playbook: The Secrets to Building World-Class LLMs](https://huggingface.co/spaces/HuggingFaceTB/smol-training-playbook)** · `Blog` · Hugging Face · *2025-10-31* · ⚠️unverified
  A 200+ page interactive guide from Hugging Face's Smol Models team documenting the full pipeline behind SmolLM3 — including what worked and what failed — structured around ablations and empirical results rather than theory.
  *Key concepts:* pre-training recipes, post-training/alignment, ablation-driven development, data mixtures, training infrastructure
- **[How GPT, Claude, and Gemini are actually trained and served — Reiner Pope](https://www.youtube.com/watch?v=xmkSf5IS-zw)** · `Video` · YouTube (Dwarkesh Podcast) · *2026-04-29* · ⭐ · ⚠️unverified
  A blackboard lecture in which Reiner Pope walks through the math and systems behind how frontier models are trained and served, framing memory bandwidth as the real inference bottleneck.
  *Key concepts:* training vs. serving economics, memory-bandwidth bottleneck, cluster/parallelism strategy, inference throughput, ML infrastructure
- **[Reiner Pope talk — companion flashcards](https://flashcards.dwarkesh.com/)** · `Blog` · Dwarkesh Podcast · *—*
  A flashcard collection accompanying Dwarkesh Podcast content, including 27 cards on Reiner Pope's "The math behind how LLMs are trained and served," as spaced-repetition study material for ML infrastructure and hardware topics.
  *Key concepts:* LLM training math, serving/inference, pretraining parallelisms, failed training runs, semiconductor/silicon fundamentals
- **[How frontier model training works](https://djdumpling.github.io/2026/01/31/frontier_training.html)** · `Blog` · djdumpling (Alex Wa) · *2026-01-31*
  A synthesis of training methodology across seven open-weight frontier models (SmolLM3, DeepSeek-R1, Kimi K2, and others), arguing that frontier training is fundamentally a systems problem where data mixture, architecture, and stability dominate algorithmic tweaks.
  *Key concepts:* GQA vs. MoE architecture choices, logit softcapping/stability, multi-stage data strategy, AdamW vs. Muon, RLVR post-training, RoPE/YaRN long-context scaling
- **[How to train a small Model — LFM2.5](https://www.youtube.com/watch?v=fLUtUkqYHnQ)** · `Video` · Maxime Labonne, Liquid AI (YouTube) · *2026-04-29* · ⚠️unverified
  Maxime Labonne shares lessons from training Liquid AI's frontier small models (LFM2 / LFM2.5, down to 230M params) that follow instructions and call tools on-device under 1GB, detailing the pipeline: tempered decoupled Top-K knowledge distillation, difficulty-ordered curriculum, and a three-stage SFT → length-normalized preference optimization → model-merging recipe.
  *Key concepts:* small/edge models, LFM2.5, knowledge distillation, curriculum learning, preference optimization, model merging, on-device tool use

### Frontier lab technical reports
- **[NVIDIA Nemotron 3 Ultra Technical Report](https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Ultra-Technical-Report.pdf)** · `Paper` · NVIDIA · *2026-06-09*
  Introduces Nemotron 3 Ultra, a 550B-total / 55B-active MoE hybrid Mamba-Attention model pre-trained on 20T tokens, extended to 1M-token context, and post-trained with SFT, RL, and Multi-teacher On-Policy Distillation — reaching ~6x higher inference throughput than comparable public LLMs at on-par accuracy.
  *Key concepts:* hybrid Mamba-Attention MoE, LatentMoE, Multi-Token Prediction (MTP), NVFP4 pre-training, multi-environment RLVR, Multi-teacher On-Policy Distillation (MOPD), reasoning budget control
- **[MAI-Thinking-1: Building a Hill-Climbing Machine](https://microsoft.ai/pdf/mai-thinking-1.pdf)** · `Paper` · Microsoft AI · *2026-06-06*
  Microsoft AI's first reasoning model, a 35B-active / 1T-total MoE trained from scratch on clean enterprise-grade data with no distillation from third-party models, pairing a scaling-focused pre-training framework with an RL recipe engineered for sustained log-linear improvement over thousands of steps.
  *Key concepts:* hill-climbing machine / system-level optimization, from-scratch training without distillation, scaling-focused pre-training framework, log-linear RL scaling, STEM reasoning + coding, MoE architecture

- **[SLIDE POST TRAINING](https://kawine.github.io/assets/aiesi_post-training_public.pdf)** · `News` · Kawin Ethayarajh · *2026-8-23*
  Post-TRaining LLM
  *Key concepts:* —