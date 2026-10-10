# LLM Architecture & Scaling

[[Library|← Back to Library index]] · Related: [[Foundations & Math]] · [[Post-Training & Alignment]] · [[Inference & Serving]]

Model architecture, attention mechanisms, scaling laws, and end-to-end pre-training recipes. Explore how design choices and compute budgets shape model capability.

### Architecture deep dives
<!-- resource-id: llm-architecture-scaling-laws__recent-developments-in-llm-architectures-kv-sharing-mhc-and-compressed-attention -->
- **[Recent Developments in LLM Architectures: KV Sharing, mHC, and Compressed Attention](https://magazine.sebastianraschka.com/p/recent-developments-in-llm-architectures)** · `Blog` · Sebastian Raschka (Ahead of AI) · *2026-05-16*
  Surveys architectural moves in recent open-weight models (Gemma 4, ZAYA1-8B, Laguna XS.2, DeepSeek V4) aimed at cutting long-context inference cost without sacrificing quality.
  *Key concepts:* cross-layer KV sharing, per-layer embeddings (PLE), compressed convolutional attention (CCA), manifold-constrained hyper-connections (mHC), layer-wise attention budgeting

<!-- resource-id: llm-architecture-scaling-laws__attention-residual-teaching-transformers -->
- **[Attention Residual: Teaching Transformers](https://www.vizuaranewsletter.com/p/attention-residuals-teaching-transformers)** · `Blog` · Vizuara Newsletter · *2026-04-06*
  Explains Moonshot AI's Attention Residuals (AttnRes), which replace fixed-weight residual connections with learned depth-wise softmax attention over prior layers, reported as a ~25% compute efficiency gain in Kimi.
  *Key concepts:* PreNorm dilution (O(L) growth), pseudo-query vectors, depth-time duality, convex-combination bound, Block AttnRes, gradient flow

<!-- resource-id: llm-architecture-scaling-laws__a-visual-guide-to-gemma-4 -->
- **[A Visual Guide to Gemma 4](https://substack.com/@maartengrootendorst/p-200261831)** · `Blog` · Maarten Grootendorst (Exploring Language Models) · *2026-04-03*
  A visual walkthrough of Google DeepMind's Gemma 4 family (E2B/E4B, 31B dense, 26B-A4B MoE), covering shared architecture and the efficiency and inference-acceleration techniques that define it.
  *Key concepts:* interleaved local/global attention, per-layer embeddings, pruned RoPE (p-RoPE), grouped-query attention, Mixture of Experts, Multi-Token Prediction (MTP) drafters, KV cache sharing

<!-- resource-id: llm-architecture-scaling-laws__understanding-deepseek-s-multi-head-latent-attention-mla -->
- **[Understanding DeepSeek's Multi-Head Latent Attention (MLA)](https://www.shashankshekhar.com/blog/flashmla/flashmla-1-mla)** · `Blog` · Shashank Shekhar · *2026-02-09*
  Walks through MLA, which compresses the KV cache via low-rank factorization to a latent dimension, achieving ~64× cache reduction versus standard MHA while preserving quality via the "absorption trick."
  *Key concepts:* low-rank KV compression, absorption trick, memory-compute tradeoff, latent-space attention, query compression, MQA comparison

<!-- resource-id: llm-architecture-scaling-laws__deepseek-v4-architecture -->
- **[DeepSeek v4 Architecture](https://www.k-a.in/DeepSeek-V4.html)** · `Blog` · k-a.in (arjun) · *—* · ⚠️unverified
  A component breakdown of DeepSeek V4's architecture, centered on its residual-stream and attention-compression innovations for extreme context lengths.
  *Key concepts:* manifold-constrained hyper-connections (mHC), compressed sparse attention (CSA), heavily compressed attention (HCA), sequence compression, long-context KV reduction

<!-- resource-id: llm-architecture-scaling-laws__glm-5-technical-report-from-vibe-coding-to-agentic-engineering -->
- **[GLM-5 Technical Report (from Vibe Coding to Agentic Engineering)](https://arxiv.org/pdf/2602.15763)** · `Paper` · arXiv (Zhipu/GLM team) · *2026-02-25*
  Introduces GLM-5, positioned as an evolution from code generation ("vibe coding") toward autonomous agentic engineering, with an emphasis on tool use, long-context reasoning, and training-efficiency methods.
  *Key concepts:* agentic engineering paradigm, extended context windows, instruction following, tool use / function calling, training-efficiency optimization

<!-- resource-id: llm-architecture-scaling-laws__linear-attention-explained -->
- **[Linear Attention Explained](https://sustcsonglin.github.io/blog/2024/deltanet-1/)** · `Blog` · Songlin Yang · *—*
  Derives linear attention as recurrent associative memory, explains interference in additive outer-product updates, and introduces DeltaNet's error-correcting state update. Connects the delta rule to online squared-error minimization and examines retrieval-focused experiments. The page does not display a publication date.
  *Key concepts:* linear attention, recurrent associative memory, DeltaNet, delta rule, in-context retrieval, test-time training

<!-- resource-id: llm-architecture-scaling-laws__linear-attention-explained-part-1 -->
- **[Linear Attention Explained Part 1](https://sustcsonglin.github.io/blog/2024/deltanet-1/)** · `Blog` · Songlin Yang · *—*
  An author-written companion to the NeurIPS 2024 DeltaNet paper, covering the model's associative-memory interpretation, error-correcting updates, and retrieval behavior. This is the same source as the preceding entry; its visible text does not establish a publication date.
  *Key concepts:* linear attention, DeltaNet, associative memory, delta rule, retrieval interference

<!-- resource-id: llm-architecture-scaling-laws__llm-frontier-overview -->
- **[LLM FRONTIER OVERVIEW](https://x.com/CopyRebeldia/status/2091231950774112412)** · `Video` · X · *2026-08-23*
  LLM OVERVIEW
  *Key concepts:* —

<!-- resource-id: llm-architecture-scaling-laws__notes-on-midtraining -->
- **[Notes on Midtraining](https://cameronrwolfe.substack.com/p/midtraining-notes)** · `Book` · Cameron R. Wolfe, Ph.D. · *2026-08-24* · ⭐
  Notes on Midtraining LLM
  *Key concepts:* —

<!-- resource-id: llm-architecture-scaling-laws__you-could-have-come-up-with-kimi-delta-attention -->
- **[You Could Have Come Up With Kimi Delta Attention](https://blog.doubleword.ai/you-could-have-come-up-with-kimi-delta-attention)** · `Blog` · Unknown · *2026-09-09* · ⭐
  Kimi Delta Attention
  *Key concepts:* —

<!-- resource-id: llm-architecture-scaling-laws__how-did-we-go-from-gpt-2-to-kimi3 -->
- **[How did we go from GPT-2 to Kimi3?](https://programmerftw.github.io/llm-breakdown-/#s8)** · `Blog` · Unknown · *—*
  How did we go from GPT-2 to Kimi3?
  *Key concepts:* —

<!-- resource-id: llm-architecture-scaling-laws__olmo-3-from-scratch-a-standalone-notebook -->
- **[Olmo 3 From Scratch: A Standalone Notebook](https://github.com/rasbt/LLMs-from-scratch/blob/main/ch05/13_olmo3/standalone-olmo3.ipynb)** · `Repo` · Sebastian Raschka · *—*
  A minimal PyTorch reimplementation of Olmo 3 model inference, with support for base, instruction, and reasoning checkpoints. It maps the architecture onto transparent code instead of relying on a separate LLM modeling library.
  *Key concepts:* Olmo 3, Transformers, PyTorch, Model architecture, Open models

### Scaling laws & pretraining efficiency
<!-- resource-id: llm-architecture-scaling-laws__scaling-laws-carefully -->
- **[Scaling Laws, Carefully](https://lilianweng.github.io/posts/2026-06-24-scaling-laws/)** · `Blog` · Lilian Weng (Lil'Log) · *2026-06-24*
  A careful survey of neural scaling laws, tracing power-law loss behavior from Kaplan et al. through Chinchilla and into data-constrained regimes, stressing how sensitive extrapolations are to minor fitting choices.
  *Key concepts:* power-law loss (L ∝ N^-α + D^-β + E), compute allocation (C ≈ 6ND), Kaplan vs Chinchilla, data-constrained scaling, fitting sensitivity, parametric fitting (L-BFGS)

<!-- resource-id: llm-architecture-scaling-laws__improving-our-llm-pretraining-efficiency -->
- **[Improving our LLM Pretraining Efficiency](https://openathena.ai/blog/pretraining-speedup/)** · `Blog` · Open Athena · *2026-06-03*
  Describes refinements to Open Athena's MoE pretraining recipe that yield roughly a 6.7× theoretical speedup over a dense baseline at 1e23 FLOPs, validated via isoFLOP scaling experiments.
  *Key concepts:* Mixture of Experts (256 experts, 4 active), MuonH optimizer, Partial Key Offset (PKO), quantile load balancing, isoFLOP optimization

<!-- resource-id: llm-architecture-scaling-laws__scaling-laws-that-extrapolate-300-past-the-fit-delphi -->
- **[Scaling Laws That Extrapolate 300× Past the Fit (Delphi)](https://openathena.ai/blog/delphi/)** · `Blog` · Open Athena · *2026-05-11*
  Presents Delphi, an open scaling suite that forecasts frontier-scale model performance from small runs, accurate up to ~300× beyond the fitted range, combining a transferable scaling recipe with a two-step regression to benchmark scores.
  *Key concepts:* transferable scaling recipe, isoFLOP sweeps, token-horizon LR correction ((T₀/T)^0.3), AdamH optimizer, observational projection, power-law extrapolation

<!-- resource-id: llm-architecture-scaling-laws__understanding-the-limits-of-ai-the-compute-optimal-frontier-scaling-laws-explained -->
- **[Understanding the Limits of AI: The Compute Optimal Frontier (Scaling Laws explained)](https://www.youtube.com/watch?v=5eqRuVp65eY)** · `Video` · YouTube · *—* · ⚠️unverified
  An explainer on AI scaling laws and the compute-optimal frontier: how model loss falls predictably with parameters, data, and compute, and how to allocate a fixed compute budget between model size and training tokens.
  *Key concepts:* scaling laws, compute-optimal frontier, parameters vs data vs compute, power-law loss, compute budget allocation

<!-- resource-id: llm-architecture-scaling-laws__pretraining-kimi-k3-mini -->
- **[PRETRAINING KIMI K3 MINI](https://books.vizuara.ai/book/pretraining-a-mini-k3)** · `Book` · Viruara · *2026-08-23* · ⭐
  PRETRAINING KIMI K3 MINI
  *Key concepts:* —

<!-- resource-id: llm-architecture-scaling-laws__scaling-laws-in-large-language-models-and-toy-models -->
- **[Scaling Laws in Large Language Models and Toy Models](https://nicolaszucchet.github.io/Tutorial-scaling-laws)** · `Course` · Nicolas Zucchet · *—*
  Tutorial slides connect empirical pretraining scaling laws to model/data/compute allocation and a toy associative-memory model. The deck includes a practical section on training a model using scaling-law estimates.
  *Key concepts:* Scaling laws, Pretraining, Compute allocation, Associative memory, Language modeling

<!-- resource-id: llm-architecture-scaling-laws__pretraining-and-scaling-methodology-from-a-scientific-perspective -->
- **[Pretraining and scaling as a methodology and scientific perspective](https://jiaxuanzou0714.github.io/en/blog/2026/pretrain-scaling-methodology-scientific-perspective)** · `Blog` · Jiaxuan Zou · *—*
  An author's analysis of pretraining and scaling as an experimental methodology, using embodied-model examples to discuss transfer and model development. Treat the article as a synthesis and research perspective; the cited systems' results were not independently audited.
  *Key concepts:* Pretraining, Scaling laws, Transfer learning, Embodied AI, Research methodology

### Training playbooks & model reports
<!-- resource-id: post-training-playbooks-reports__the-smol-training-playbook-the-secrets-to-building-world-class-llms -->
- **[The Smol Training Playbook: The Secrets to Building World-Class LLMs](https://huggingface.co/spaces/HuggingFaceTB/smol-training-playbook)** · `Blog` · Hugging Face · *2025-10-31* · ⚠️unverified
  A 200+ page interactive guide from Hugging Face's Smol Models team documenting the full pipeline behind SmolLM3 — including what worked and what failed — structured around ablations and empirical results rather than theory.
  *Key concepts:* pre-training recipes, post-training/alignment, ablation-driven development, data mixtures, training infrastructure

<!-- resource-id: post-training-playbooks-reports__how-frontier-model-training-works -->
- **[How frontier model training works](https://djdumpling.github.io/2026/01/31/frontier_training.html)** · `Blog` · djdumpling (Alex Wa) · *2026-01-31*
  A synthesis of training methodology across seven open-weight frontier models (SmolLM3, DeepSeek-R1, Kimi K2, and others), arguing that frontier training is fundamentally a systems problem where data mixture, architecture, and stability dominate algorithmic tweaks.
  *Key concepts:* GQA vs. MoE architecture choices, logit softcapping/stability, multi-stage data strategy, AdamW vs. Muon, RLVR post-training, RoPE/YaRN long-context scaling

<!-- resource-id: post-training-playbooks-reports__nvidia-nemotron-3-ultra-technical-report -->
- **[NVIDIA Nemotron 3 Ultra Technical Report](https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Ultra-Technical-Report.pdf)** · `Paper` · NVIDIA · *2026-06-09*
  Introduces Nemotron 3 Ultra, a 550B-total / 55B-active MoE hybrid Mamba-Attention model pre-trained on 20T tokens, extended to 1M-token context, and post-trained with SFT, RL, and Multi-teacher On-Policy Distillation — reaching ~6x higher inference throughput than comparable public LLMs at on-par accuracy.
  *Key concepts:* hybrid Mamba-Attention MoE, LatentMoE, Multi-Token Prediction (MTP), NVFP4 pre-training, multi-environment RLVR, Multi-teacher On-Policy Distillation (MOPD), reasoning budget control

<!-- resource-id: llm-architecture-scaling-laws__introducing-nanochat -->
- **[Introducing nanochat: The best ChatGPT that $100 can buy.](https://github.com/karpathy/nanochat/discussions/1)** · `Repo` · Andrej Karpathy · *2025-10-13*
  An end-to-end walkthrough of a small chat-model training run, starting with tokenizer and pretraining data preparation and continuing through the project's training pipeline. The budget-oriented speedrun is an educational experiment, not a general cost estimate for production model training.
  *Key concepts:* Pretraining, Tokenization, Fine-tuning, Evaluation, Reproducibility
