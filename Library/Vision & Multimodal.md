# Vision & Multimodal

[[Library|← Back to Library index]] · Related: [[Diffusion & Flow Matching]] · [[Voice & Audio]] · [[LLM Architecture & Scaling]]

Vision encoders, video models, multimodal fusion, and real-time interaction across image, audio, and text.

### Video architectures & attention
<!-- resource-id: llm-architecture-scaling-laws__deltanet -->
- **[DeltaNet ](https://www.haoyizhu.site/blog/video-delta-rule/)** · `Blog` · Haoyi Zhu · *2026-08-08*
  Reflects on applying delta-rule linear attention to video, where within-frame token order depends on an arbitrary spatial scan. Motivates frame-level operators invariant to that ordering and connects the discussion to the author's SANA-WM work. The author identifies parts of the mathematical exploration as AI-assisted.
  *Key concepts:* video linear attention, delta rule, frame-level state updates, permutation invariance, Gated DeltaNet, SANA-WM

### Vision encoders & multimodal foundations
<!-- resource-id: foundations-interviews-meta__vision-encoders-in-vision-language-models-a-survey -->
- **[Vision Encoders in Vision-Language Models: A Survey](https://jina.ai/vision-encoder-survey.pdf)** · `Paper` · Jina AI (Han Xiao) · *2025-12-29* · ⚠️unverified
  A survey of vision encoders as used in vision-language models, cataloging architectures and design tradeoffs for connecting visual features to LLMs.
  *Key concepts:* vision encoders, vision-language models (VLMs), CLIP/ViT backbones, multimodal fusion, image-text alignment, encoder design tradeoffs

<!-- resource-id: vision-multimodal__sigreg-from-first-principles -->
- **[SIGReg from First Principles](https://rezabyt.github.io/blogposts/sigreg-tutorial.html)** · `Blog` · Reza Bayat · *2026-07-21*
  Derives a JEPA anti-collapse regularizer using empirical characteristic functions, one-dimensional Gaussianity tests, numerical quadrature, and random projections. Connects the idealized all-directions population objective to an isotropic Gaussian through Cramér–Wold, then sketches a predictive training loop. The ideal minimum is not a convergence guarantee; finite samples and projections are approximations, and marginal regularization alone does not learn useful dynamics.
  *Key concepts:* JEPA, Representation collapse, Characteristic functions, Random projections, Cramér–Wold


### Interactive multimodal research
<!-- resource-id: thinking-machines-lab__announcing-interactivity-research-grants -->
- **[Announcing Interactivity Research Grants](https://thinkingmachines.ai/news/interactivity-research-grants/)** · `News` · Thinking Machines · *2026-05-19*
  Multiple $100,000 grants to fund research on AI interactivity — real-time, multimodal collaboration between humans and models — arguing interactivity deserves as much focus as intelligence and autonomy.
  *Key concepts:* real-time multimodal interaction, human-AI collaboration, generative UI, human steering of long-horizon agents, multimodal safety

<!-- resource-id: thinking-machines-lab__interaction-models-a-scalable-approach-to-human-ai-collaboration -->
- **[Interaction Models: A Scalable Approach to Human-AI Collaboration](https://thinkingmachines.ai/blog/interaction-models/)** · `Blog` · Thinking Machines · *2026-05-11*
  A research preview of "interaction models" that natively handle real-time audio/video/text collaboration without external scaffolding, using a time-aligned micro-turn architecture so the AI can respond, interject, and be interrupted at natural conversational speed.
  *Key concepts:* time-aligned micro-turns, encoder-free early fusion, streaming sessions, dual-system architecture, multi-modal interactivity, batch-invariant kernels

### Vision fine-tuning
<!-- resource-id: thinking-machines-lab__tinker-general-availability-and-vision-input -->
- **[Tinker: General Availability and Vision Input](https://thinkingmachines.ai/news/tinker-general-availability/)** · `News` · Thinking Machines · *2025-12-12*
  Tinker exits beta with general availability, support for the Kimi K2 Thinking model, OpenAI API compatibility, and new vision fine-tuning via Qwen3-VL — with vision-language fine-tuning notably outperforming classic computer-vision approaches in low-data regimes.
  *Key concepts:* general availability, Kimi K2 Thinking, OpenAI API compatibility, Qwen3-VL vision models, LoRA vision fine-tuning, data efficiency vs. DINOv2

<!-- resource-id: vision-multimodal__fine-tuning-kosmos-2-5-on-grounded-ocr -->
- **[Fine-tuning KOSMOS 2.5 on Grounded OCR](https://huggingface.co/merve/smol-vision/blob/main/Grounded_Fine_tuning.ipynb)** · `Repo` · Merve / smol-vision · *—*
  An educational notebook converting document text and bounding boxes into layout-aware target sequences for KOSMOS 2.5 fine-tuning. It demonstrates preprocessing and training on a resplit DocLayNet subset; independent evaluation requires a genuinely held-out split rather than treating this example as a benchmark.
  *Key concepts:* OCR, Vision-language models, Grounding, Fine-tuning, Document layout

### Document understanding & OCR

<!-- resource-id: vision-multimodal__supercharge-your-ocr-pipelines-with-open-models -->
- **[Supercharge Your OCR Pipelines with Open Models](https://huggingface.co/blog/ocr-open-models)** · `Blog` · Merve et al. / Hugging Face · *2025-10-21*
  Surveys open OCR and vision-language models across transcription, layout-aware output, document evaluation, and deployment. It also connects extraction to multimodal retrieval and document question answering; model rankings and supported tools are version-dependent.
  *Key concepts:* OCR, Vision-language models, Document understanding, Multimodal retrieval, Evaluation

<!-- resource-id: vision-multimodal__olmocr-unlocking-trillions-of-tokens-in-pdfs-with-vision-language-models -->
- **[olmOCR: Unlocking Trillions of Tokens in PDFs with Vision Language Models](https://arxiv.org/abs/2502.18443)** · `Paper` · Jake Poznanski, Aman Rangapur et al. / Ai2 · *2025-02-25*
  Introduces an open VLM-based pipeline for converting PDFs into reading-order text while preserving tables, equations, and document structure. The abstract connects fine-tuning on varied page types with a dedicated OCR benchmark and large-scale inference support; reported quality and cost are specific to the evaluated setup.
  *Key concepts:* OCR, Document linearization, Vision-language models, Reading order, Document benchmarks


### World models & dynamics

<!-- resource-id: vision-multimodal__how-to-train-a-frontier-level-world-model -->
- **[How to train a frontier-level world model](https://next-state.github.io/open-dreamer)** · `Blog` · Diego Marti Monso, Francesco Sacco and Edward Hu · *2026-07-21*
  An open world-model reproduction account that starts with a smaller CoinRun setting before targeting more complex environments. The inspected sections connect block-causal attention, a masked tokenizer, diffusion forcing, and flow matching, emphasizing a constrained search space and a fast debugging loop.
  *Key concepts:* World models, Video tokenization, Block-causal attention, Diffusion forcing, Flow matching

### Embodied perception & action

<!-- resource-id: vision-multimodal__molmoact-action-reasoning-models-that-can-reason-in-space -->
- **[MolmoAct: Action Reasoning Models that can Reason in Space](https://arxiv.org/abs/2508.07917)** · `Paper` · Jason Lee, Jiafei Duan et al. / arXiv · *2025-08-11*
  Introduces an action-reasoning pipeline that connects depth-aware perception, editable spatial trajectory plans, and low-level robot actions. The abstract describes simulation and real-robot evaluations plus an open trajectory dataset; results concern the tested tasks and do not establish unrestricted real-world robotic competence.
  *Key concepts:* Action reasoning, Robotics, Spatial planning, Vision-language-action models, Trajectory data
