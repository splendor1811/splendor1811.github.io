# LLM Architecture & Scaling Laws

[[Library|← Back to Library index]] · Related: [[Efficient Inference & Serving]] · [[Post-Training Playbooks & Reports]] · [[Diffusion & Flow Matching]]

A working library on how modern LLMs are actually built and scaled: the attention and residual-stream tricks that cut long-context inference cost (MLA, KV sharing, compressed attention, attention residuals, MTP), and the scaling-law and pretraining-efficiency work that tells us how to spend compute. Most entries are 2026 open-weight/frontier-model writeups plus two rigorous scaling-law treatments.

### Architecture deep dives
- **[Recent Developments in LLM Architectures: KV Sharing, mHC, and Compressed Attention](https://magazine.sebastianraschka.com/p/recent-developments-in-llm-architectures)** · `Blog` · Sebastian Raschka (Ahead of AI) · *2026-05-16*
  Surveys architectural moves in recent open-weight models (Gemma 4, ZAYA1-8B, Laguna XS.2, DeepSeek V4) aimed at cutting long-context inference cost without sacrificing quality.
  *Key concepts:* cross-layer KV sharing, per-layer embeddings (PLE), compressed convolutional attention (CCA), manifold-constrained hyper-connections (mHC), layer-wise attention budgeting
- **[Attention Residual: Teaching Transformers](https://www.vizuaranewsletter.com/p/attention-residuals-teaching-transformers)** · `Blog` · Vizuara Newsletter · *2026-04-06*
  Explains Moonshot AI's Attention Residuals (AttnRes), which replace fixed-weight residual connections with learned depth-wise softmax attention over prior layers, reported as a ~25% compute efficiency gain in Kimi.
  *Key concepts:* PreNorm dilution (O(L) growth), pseudo-query vectors, depth-time duality, convex-combination bound, Block AttnRes, gradient flow
- **[A Visual Guide to Gemma 4](https://substack.com/@maartengrootendorst/p-200261831)** · `Blog` · Maarten Grootendorst (Exploring Language Models) · *2026-04-03*
  A visual walkthrough of Google DeepMind's Gemma 4 family (E2B/E4B, 31B dense, 26B-A4B MoE), covering shared architecture and the efficiency and inference-acceleration techniques that define it.
  *Key concepts:* interleaved local/global attention, per-layer embeddings, pruned RoPE (p-RoPE), grouped-query attention, Mixture of Experts, Multi-Token Prediction (MTP) drafters, KV cache sharing
- **[Understanding DeepSeek's Multi-Head Latent Attention (MLA)](https://www.shashankshekhar.com/blog/flashmla/flashmla-1-mla)** · `Blog` · Shashank Shekhar · *2026-02-09*
  Walks through MLA, which compresses the KV cache via low-rank factorization to a latent dimension, achieving ~64× cache reduction versus standard MHA while preserving quality via the "absorption trick."
  *Key concepts:* low-rank KV compression, absorption trick, memory-compute tradeoff, latent-space attention, query compression, MQA comparison
- **[DeepSeek v4 Architecture](https://www.k-a.in/DeepSeek-V4.html)** · `Blog` · k-a.in (arjun) · *—* · ⚠️unverified
  A component breakdown of DeepSeek V4's architecture, centered on its residual-stream and attention-compression innovations for extreme context lengths.
  *Key concepts:* manifold-constrained hyper-connections (mHC), compressed sparse attention (CSA), heavily compressed attention (HCA), sequence compression, long-context KV reduction
- **[GLM-5 Technical Report (from Vibe Coding to Agentic Engineering)](https://arxiv.org/pdf/2602.15763)** · `Paper` · arXiv (Zhipu/GLM team) · *2026-02-25*
  Introduces GLM-5, positioned as an evolution from code generation ("vibe coding") toward autonomous agentic engineering, with an emphasis on tool use, long-context reasoning, and training-efficiency methods.
  *Key concepts:* agentic engineering paradigm, extended context windows, instruction following, tool use / function calling, training-efficiency optimization

- **[Linear Attention Explained](https://sustcsonglin.github.io/blog/2024/deltanet-1/)** · `Blog` · Unknown · *2026-08-06*
  Linear Attention Explained (DeltaNet) Part 1
  *Key concepts:* —
### Scaling laws & pretraining efficiency
- **[Scaling Laws, Carefully](https://lilianweng.github.io/posts/2026-06-24-scaling-laws/)** · `Blog` · Lilian Weng (Lil'Log) · *2026-06-24*
  A careful survey of neural scaling laws, tracing power-law loss behavior from Kaplan et al. through Chinchilla and into data-constrained regimes, stressing how sensitive extrapolations are to minor fitting choices.
  *Key concepts:* power-law loss (L ∝ N^-α + D^-β + E), compute allocation (C ≈ 6ND), Kaplan vs Chinchilla, data-constrained scaling, fitting sensitivity, parametric fitting (L-BFGS)
- **[Improving our LLM Pretraining Efficiency](https://openathena.ai/blog/pretraining-speedup/)** · `Blog` · Open Athena · *2026-06-03*
  Describes refinements to Open Athena's MoE pretraining recipe that yield roughly a 6.7× theoretical speedup over a dense baseline at 1e23 FLOPs, validated via isoFLOP scaling experiments.
  *Key concepts:* Mixture of Experts (256 experts, 4 active), MuonH optimizer, Partial Key Offset (PKO), quantile load balancing, isoFLOP optimization
- **[Scaling Laws That Extrapolate 300× Past the Fit (Delphi)](https://openathena.ai/blog/delphi/)** · `Blog` · Open Athena · *2026-05-11*
  Presents Delphi, an open scaling suite that forecasts frontier-scale model performance from small runs, accurate up to ~300× beyond the fitted range, combining a transferable scaling recipe with a two-step regression to benchmark scores.
  *Key concepts:* transferable scaling recipe, isoFLOP sweeps, token-horizon LR correction ((T₀/T)^0.3), AdamH optimizer, observational projection, power-law extrapolation
- **[Understanding the Limits of AI: The Compute Optimal Frontier (Scaling Laws explained)](https://www.youtube.com/watch?v=5eqRuVp65eY)** · `Video` · YouTube · *—* · ⚠️unverified
  An explainer on AI scaling laws and the compute-optimal frontier: how model loss falls predictably with parameters, data, and compute, and how to allocate a fixed compute budget between model size and training tokens.
  *Key concepts:* scaling laws, compute-optimal frontier, parameters vs data vs compute, power-law loss, compute budget allocation
