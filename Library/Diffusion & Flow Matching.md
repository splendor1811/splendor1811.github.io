# Diffusion & Flow Matching

[[Library|← Back to Library index]] · Related: [[Voice & Audio]] · [[Vision & Multimodal]] · [[LLM Architecture & Scaling]]

A curated library on diffusion models and flow matching: the shared mathematical backbone (variational, score-based, and flow perspectives), the flow-matching framework, VAEs and latent-space generative modeling, and the newer frontier of discrete and text/language diffusion. Entries mix foundational tutorials, textbooks, university courses, and intuition-building talks.

**Suggested reading order:** VAE/latent-space basics → DDPM and Score-SDE → Flow Matching and rectified paths → latent diffusion, DiT, and the MIT hands-on labs → discrete/text diffusion → video generation and inference efficiency. The Roadmap page selects core readings; all other sources remain available below.

### Books & courses
<!-- resource-id: diffusion-flow-matching__the-principles-of-diffusion-models -->
- **[The Principles of Diffusion Models](https://arxiv.org/pdf/2510.21890)** · `Book` · arXiv · *2025-10-24* · ⭐
  A monograph that unifies diffusion models by showing how variational, score-based, and flow-based formulations all emerge from learning a time-dependent velocity field that transports a simple prior to the data distribution. Also covers guidance, numerical solvers, and flow-map models.
  *Key concepts:* forward/reverse processes, variational vs. score vs. flow views, time-dependent velocity field, guidance, numerical solvers, flow-map models

<!-- resource-id: diffusion-flow-matching__stanford-cme296-diffusion-large-vision-models -->
- **[Stanford CME296: Diffusion & Large Vision Models](https://www.youtube.com/watch?v=tr-CUpw--ck&list=PLoROMvodv4rNdy8rt2rZ4T2xM0OjADnfu)** · `Course` · Stanford / YouTube · *2026-04-10* · ⭐ · ⚠️unverified
  Spring 2026 lecture series tracing computer vision from classification to modern generative systems, covering diffusion foundations, score/flow matching, U-Nets and Diffusion Transformers, controllable generation, and evaluation.
  *Key concepts:* diffusion foundations, score matching, flow matching, U-Net / Diffusion Transformer, controllable generation, evaluation

<!-- resource-id: diffusion-flow-matching__introduction-to-flow-matching-and-diffusion-models-2026-mit-6-s184 -->
- **[Introduction to Flow Matching and Diffusion Models 2026 (MIT 6.S184)](https://diffusion.csail.mit.edu/2026/index.html)** · `Course` · MIT CSAIL · *2026-01*
  MIT IAP 2026 course pairing lectures with labs so students build a latent diffusion model from scratch, teaching the mathematical foundations (SDEs, ODEs, Fokker-Planck) alongside practical implementation.
  *Key concepts:* SDEs/ODEs, flow matching & score matching objectives, classifier-free guidance, VAEs / latent space, Diffusion Transformers & U-Nets, discrete diffusion (CTMCs)

<!-- resource-id: diffusion-flow-matching__mit-flow-matching-2026-lecture-notes-pdf -->
- **[MIT Flow Matching 2026 — lecture notes (PDF)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf)** · `Course` · MIT CSAIL · *2026-01* · ⚠️unverified
  The written lecture notes accompanying the MIT 6.S184 course, developing flow matching and diffusion from first principles: probability paths, conditional vector fields, and the SDE/ODE machinery needed to train and sample.
  *Key concepts:* probability paths, conditional vector fields, flow matching objective, SDEs/ODEs, Fokker-Planck equation

<!-- resource-id: diffusion-flow-matching__flow-matching-guide-and-code -->
- **[Flow Matching Guide and Code](https://arxiv.org/pdf/2412.06264)** · `Paper` · arXiv (Meta / FAIR) · *2024-12-09*
  A comprehensive guide to Flow Matching, a generative framework achieving state-of-the-art results across images, video, audio, and biological structures, combining mathematical foundations with a PyTorch package and worked examples.
  *Key concepts:* flow matching framework, conditional/marginal vector fields, probability paths, design choices & extensions, PyTorch implementation, multi-domain applications

<!-- resource-id: diffusion-flow-matching__deep-generative-models-course-materials -->
- **[Deep Generative Models: Course Materials](https://kuleshov-group.github.io/dgm-website)** · `Course` · Volodymyr Kuleshov, Aditya Grover, Yang Song & Stefano Ermon · *—*
  A course covering probabilistic foundations and major generative model families, including autoregressive models, VAEs, flows, GANs, and diffusion. The site links lectures and exercises, serving as a broad learning path rather than a review of one new method.
  *Key concepts:* Generative models, Probability, Variational inference, Normalizing flows, Diffusion models

<!-- resource-id: diffusion-flow-matching__cmu-10-799-diffusion-flow-matching-resources -->
- **[CMU 10-799 Diffusion & Flow Matching Resources](https://kellyyutonghe.github.io/10799S26/resources)** · `Course` · Carnegie Mellon University · *—*
  A curated course reading list connecting diffusion and flow matching to textbooks, lecture notes, tutorials, and foundational papers. It distinguishes broad introductions from specific research directions such as discrete diffusion and transport-based modeling.
  *Key concepts:* Diffusion models, Flow matching, Generative models, Discrete diffusion, Reading list

<!-- resource-id: diffusion-flow-matching__aligning-diffusion-models-with-human-preferences -->
- **[Aligning Diffusion Models with Human Preferences](https://diffusion-alignment.github.io/)** · `Course` · Liang Zheng, Zhanhao Liang, Shuchen Xue and Jie Liu / ECCV tutorial · *—*
  The tutorial overview organizes visual-generation alignment into reward backpropagation, pairwise preference optimization, group-relative RL, and forward-process RL. It provides a useful map of objectives before reading individual methods; the September 9, 2026 tutorial date is an event date, not an established publication date.
  *Key concepts:* Diffusion models, Preference optimization, Reward gradients, GRPO, Forward-process RL

<!-- resource-id: diffusion-flow-matching__cis-6270-discrete-generative-models -->
- **[CIS 6270: Discrete Generative Models](https://cis6270.github.io/)** · `Course` · Pranam Chatterjee / University of Pennsylvania · *—*
  A mathematics-first course connecting continuous generative modeling to discrete diffusion and flow matching. Its published overview includes probability transport, differential equations, optimal transport, stochastic control, and Schrödinger bridges, with applications to structured data.
  *Key concepts:* Discrete diffusion, Flow matching, Optimal transport, Stochastic control, Schrödinger bridges

<!-- resource-id: diffusion-flow-matching__a-mathematical-introduction-to-diffusion-models -->
- **[A Mathematical Introduction to Diffusion Models](https://arxiv.org/abs/2607.01693)** · `Book` · Jianfeng Lu / arXiv · *2026-07-02*
  Proof-oriented notes connect classical sampling dynamics with diffusion samplers, numerical error analysis, and inference-time control. The abstract distinguishes fully proved foundational identities, estimates under simplifying assumptions, and research results accompanied by proof roadmaps.
  *Key concepts:* Diffusion models, Sampling, Stochastic differential equations, Numerical analysis, Inference-time control

<!-- resource-id: diffusion-flow-matching__cme-296-diffusion-large-vision-models-cheatsheet -->
- **[CME 296 Diffusion & Large Vision Models Cheatsheet](https://cme296.stanford.edu/cheatsheet)** · `Course` · Afshine Amidi and Shervine Amidi / Stanford University · *2026-04-02*
  A compact reference connecting discrete diffusion, denoising score matching, stochastic and probability-flow dynamics, conditional flow matching, and latent representations. The inspected opening pages distinguish the time conventions used by diffusion and flow matching, helping align notation across these formulations.
  *Key concepts:* DDPM, Score matching, Probability-flow ODE, Flow matching, Variational autoencoders


### Theory & foundations
<!-- resource-id: diffusion-flow-matching__denoising-diffusion-probabilistic-models -->
- **[Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)** · `Paper` · Jonathan Ho, Ajay Jain and Pieter Abbeel / arXiv · *2020-06-19* · ⭐
  Introduces the DDPM image-generation formulation, training a denoiser through a weighted variational objective linked to denoising score matching. Read for the forward noising chain, reverse sampler, and noise-prediction objective before the continuous-time generalization.
  *Key concepts:* DDPM, forward/reverse Markov chains, denoising, variational bound, score matching

<!-- resource-id: diffusion-flow-matching__score-based-generative-modeling-through-stochastic-differential-equations -->
- **[Score-Based Generative Modeling through Stochastic Differential Equations](https://arxiv.org/abs/2011.13456)** · `Paper` · Yang Song et al. / arXiv · *2020-11-26* · ⭐
  Unifies score-based generation and diffusion through a forward SDE and score-driven reverse SDE; also derives a probability-flow ODE and predictor–corrector sampling. Distinguish the stochastic reverse path from the deterministic ODE when comparing samplers.
  *Key concepts:* score function, reverse-time SDE, probability-flow ODE, predictor–corrector sampling

<!-- resource-id: diffusion-flow-matching__flow-matching-for-generative-modeling -->
- **[Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747)** · `Paper` · Yaron Lipman et al. / arXiv · *2022-10-06* · ⭐
  Introduces simulation-free training of continuous normalizing flows by regressing vector fields of conditional probability paths. Gaussian paths include diffusion-style paths; optimal-transport displacement paths offer a contrasting design choice, not a universal speed guarantee.
  *Key concepts:* conditional probability paths, vector-field regression, continuous normalizing flows, optimal transport

<!-- resource-id: diffusion-flow-matching__high-resolution-image-synthesis-with-latent-diffusion-models -->
- **[High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)** · `Paper` · Robin Rombach et al. / arXiv · *2021-12-20* · ⭐
  Moves diffusion from pixels to a pretrained autoencoder's latent space to reduce training and sampling cost while preserving visual detail. Cross-attention provides conditioning by text or other inputs; the paper's quality and efficiency results are specific to its evaluated image tasks.
  *Key concepts:* latent diffusion, autoencoder, cross-attention conditioning, reconstruction–compute trade-off

<!-- resource-id: diffusion-flow-matching__scalable-diffusion-models-with-transformers -->
- **[Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748)** · `Paper` · William Peebles and Saining Xie / arXiv · *2022-12-19* · ⭐
  Replaces the image diffusion U-Net with a Transformer over latent patches and studies quality as forward-pass compute grows. Use it to compare architectural scaling at a fixed generative task, rather than assuming larger DiTs improve every modality or metric.
  *Key concepts:* Diffusion Transformer, latent patches, U-Net comparison, model scaling, image synthesis

<!-- resource-id: diffusion-flow-matching__understanding-diffusion-models-a-unified-perspective -->
- **[Understanding Diffusion Models: A Unified Perspective](https://calvinyluo.com/2022/08/26/diffusion-tutorial.html)** · `Blog` · Calvin Luo · *2022-08-26* · ⚠️unverified
  A widely-cited pedagogical tutorial that derives diffusion models step by step, connecting the variational (ELBO/VDM) view with the score-based view and showing they optimize equivalent objectives.
  *Key concepts:* variational diffusion models, ELBO derivation, denoising / noise prediction, score matching, three equivalent objectives, reverse process

<!-- resource-id: diffusion-flow-matching__tracing-the-principles-behind-modern-diffusion-models -->
- **[Tracing the Principles Behind Modern Diffusion Models](https://iclr-blogposts.github.io/2026/blog/2026/tracing-principles-behind-modern-diffusion-models/)** · `Blog` · ICLR Blogposts 2026 · *2026*
  Argues that DDPM, Score-SDE, and Flow Matching are the same idea: transporting probability mass from noise to data via the change-of-variable rule, differing only in prediction target (noise, score, or velocity).
  *Key concepts:* change-of-variable rule, the conditional trick, forward Gaussian process, probability flow ODE, flow map models

<!-- resource-id: diffusion-flow-matching__go-with-the-flow -->
- **[Go with the Flow](https://ydnyshhh.github.io/posts/go_with_the_flow/)** · `Blog` · Yudhishthir Kandpal · *2025-04-27*
  A guide to flow-based generative models as alternatives to diffusion, walking from normalizing flows through flow matching to rectified flows and the reflow procedure that enables fast one-step generation.
  *Key concepts:* normalizing flows, flow matching, probability paths, rectified flow, reflow, marginal vs. conditional vector fields

<!-- resource-id: diffusion-flow-matching__from-autoencoder-to-beta-vae -->
- **[From Autoencoder to Beta-VAE](https://lilianweng.github.io/posts/2018-08-12-vae/)** · `Blog` · Lilian Weng · *2018-08-12*
  A foundational survey tracing autoencoder architectures from vanilla AEs through VAEs to Beta-VAE and beyond, explaining how each learns compressed latent representations and improves interpretability and disentanglement.
  *Key concepts:* bottleneck architecture, variational autoencoder / ELBO, reparameterization trick, disentangled representations (Beta-VAE), VQ-VAE, KL regularization

<!-- resource-id: diffusion-flow-matching__generative-modelling-in-latent-space -->
- **[Generative modelling in latent space](https://sander.ai/2025/04/15/latents.html)** · `Blog` · Sander Dieleman · *2025-04-15*
  Explains the now-dominant two-stage recipe behind modern image/audio/video generation: first learn a compact latent via an autoencoder, then train a diffusion or autoregressive model in that latent space.
  *Key concepts:* two-stage training, latent autoencoders, reconstruction loss (regression + LPIPS + GAN), rate-distortion-modelability trade-off, latent-space regularization/curation, grid-structure preservation

<!-- resource-id: diffusion-flow-matching__diffusion-model-visual-breakdown -->
- **[Diffusion Model Visual Breakdown](https://vizuara.substack.com/p/diffusion-model-visual-breakdown)** · `Blog` · Vizuara · *2026-06-23*
  A visual, intuition-first walkthrough of how diffusion models turn noise into images by learning to reverse a corruption process, contrasting them with GANs/VAEs and detailing the math and architectures behind modern image generation.
  *Key concepts:* forward diffusion process, denoiser / noise-prediction training, latent-space compression, timestep embeddings, Diffusion Transformers, classifier-free guidance

<!-- resource-id: diffusion-flow-matching__visualizing-rectified-flows -->
- **[Visualizing Rectified Flows](https://alechelbling.com/blog/rectified-flow)** · `Blog` · Alec Helbling · *—*
  Uses low-dimensional visualizations to explain why learned flow trajectories can curve and require many numerical steps. Introduces rectification as a way to straighten transport paths and reduce sampling work, keeping the geometric intuition separate from guarantees for high-dimensional generative models.
  *Key concepts:* Rectified flow, Flow matching, Transport trajectories, Numerical integration, Generative modeling


### Discrete & text diffusion (language)
<!-- resource-id: diffusion-flow-matching__discrete-diffusion-modeling-by-estimating-the-ratios-of-the-data-distribution -->
- **[Discrete Diffusion Modeling by Estimating the Ratios of the Data Distribution](https://arxiv.org/abs/2310.16834)** · `Paper` · Aaron Lou, Chenlin Meng and Stefano Ermon / arXiv · *2023-10-25* · ⭐
  Introduces score-entropy discrete diffusion (SEDD), replacing continuous scores with a learnable signal over token transitions for language modeling and infilling. Reported quality and compute comparisons are against the baselines and settings in the paper.
  *Key concepts:* discrete diffusion, score entropy, token transitions, iterative sampling, infilling

<!-- resource-id: diffusion-flow-matching__large-language-diffusion-models -->
- **[Large Language Diffusion Models (LLaDA)](https://arxiv.org/abs/2502.09992)** · `Paper` · Shen Nie et al. / arXiv · *2025-02-14* · ⭐
  Presents a masked-token diffusion language model trained from pretraining through supervised fine-tuning. Its reverse process predicts masked tokens iteratively, offering a concrete contrast with left-to-right autoregressive decoding; benchmark claims are those of the authors.
  *Key concepts:* masked diffusion language model, iterative denoising, likelihood lower bound, non-autoregressive generation

<!-- resource-id: diffusion-flow-matching__language-modeling-by-estimating-the-ratios-of-the-data-distribution -->
- **[Language Modeling by Estimating the Ratios of the Data Distribution](https://aaronlou.com/blog/2024/discrete-diffusion/)** · `Blog` · Aaron Lou · *2024*
  Introduces Score Entropy Discrete Diffusion (SEDD), which models probability ratios between tokens ("concrete scores") and generates text by iterative denoising, matching GPT-2-scale performance while enabling flexible non-autoregressive generation and infilling.
  *Key concepts:* concrete scores, score entropy loss, discrete diffusion (transition matrix Q), reverse diffusion sampling, conditional generation via Bayes rule

<!-- resource-id: diffusion-flow-matching__diffusion-language-models-the-next-big-shift-in-genai -->
- **[Diffusion Language Models: The Next Big Shift in GenAI](https://www.youtube.com/watch?v=8BTOoc0yDVA)** · `Video` · YouTube · *—* · ⚠️unverified
  Overview of why diffusion-based language models are emerging as an alternative to autoregressive LLMs, arguing they can be faster and more efficient while offering controllable, any-order generation and error correction (referencing Mercury/Inception and LLaDA).
  *Key concepts:* autoregressive vs. diffusion LLMs, parallel/any-order generation, inference speed & efficiency, controllable generation, error correction, agentic applications

<!-- resource-id: diffusion-flow-matching__text-diffusion-brendan-o-donoghue-google-deepmind -->
- **[Text Diffusion — Brendan O'Donoghue, Google DeepMind](https://www.youtube.com/watch?v=r305-aQTaU0)** · `Video` · YouTube · *—* · ⚠️unverified
  A talk from the lead of Google DeepMind's text-diffusion team explaining the theory and engineering behind text diffusion (the basis of Gemini Diffusion / DiffusionGemma).
  *Key concepts:* text/language diffusion, iterative denoising of tokens, non-autoregressive generation, Gemini Diffusion / DiffusionGemma, high-throughput decoding, coding & math strengths

<!-- resource-id: diffusion-flow-matching__you-might-not-need-50-diffusion-steps-ziv-ilan-nvidia -->
- **[You Might Not Need 50 Diffusion Steps — Ziv Ilan, Nvidia](https://www.youtube.com/watch?v=gHs5ZiY80PM)** · `Video` · YouTube (Nvidia GTC 2026) · *—* · ⚠️unverified
  An Nvidia GTC 2026 talk arguing that denoising step count should be treated as an engineering variable, showing how quantization, caching, and distillation stack to run video diffusion near real time on a single Blackwell B200.
  *Key concepts:* step-count reduction, quantization (FP8/FP4), caching across steps, step distillation (1-8 steps), real-time video diffusion, composable optimizations

<!-- resource-id: diffusion-flow-matching__flow-reasoning-models-turning-flows-into-efficient-recurrent-reasoners -->
- **[Flow Reasoning Models: Turning Flows Into Efficient Recurrent Reasoners](https://arxiv.org/abs/2606.29150)** · `Paper` · Alec Helbling, Andrey Bryutkin et al. / arXiv · *2026-06-28*
  Adapts continuous flows over structured discrete outputs into recurrent reasoners that can revise multiple interdependent decisions in parallel. Fixed-Point Forcing trains on states generated by the model's own inference dynamics to address self-conditioning exposure bias; the reported efficiency gains are for Sudoku, Zebra, and maze benchmarks, not general language reasoning.
  *Key concepts:* Flow matching, Structured reasoning, Self-conditioning, Fixed-point forcing, Exposure bias


### Intuition videos
<!-- resource-id: diffusion-flow-matching__but-how-do-ai-images-and-videos-actually-work -->
- **[But how do AI images and videos actually work?](https://www.youtube.com/watch?v=iv-5mZ_9CPY)** · `Video` · Welch Labs / YouTube · *2025-07-25* · ⚠️unverified
  A Welch Labs guest explainer that visually builds intuition for how modern generative models produce images and video, walking from the noising/denoising idea through the core mechanics of diffusion-based generation.
  *Key concepts:* forward noising / reverse denoising, learned denoiser, text-to-image generation, latent representations, visual intuition for diffusion

### Video diffusion

<!-- resource-id: diffusion-flow-matching__diffusion-models-for-video-generation -->
- **[Diffusion Models for Video Generation](https://lilianweng.github.io/posts/2024-04-12-diffusion-video/)** · `Blog` · Lilian Weng / Lil'Log · *2024-04-12*
  Extends diffusion modeling from images to temporally consistent video, reviewing sampling parameterizations and architectures such as factorized 3D U-Nets and Transformers. It contrasts training video generators from scratch with adapting image models, under limited high-quality video data.
  *Key concepts:* Video generation, Diffusion models, Temporal consistency, DiT, Generative models

<!-- resource-id: diffusion-flow-matching__fast-video-generation-with-sliding-tile-attention -->
- **[Fast Video Generation with Sliding Tile Attention](https://arxiv.org/abs/2502.04507)** · `Paper` · Peiyuan Zhang, Yongqi Chen et al. / arXiv · *2025-02-06*
  Replaces dense spatiotemporal attention in video Diffusion Transformers with hardware-aware sliding tiles, exploiting the locality observed in pretrained attention patterns. The abstract distinguishes training-free substitution from fine-tuned configurations; speed and quality results are specific to the tested HunyuanVideo workloads and kernels.
  *Key concepts:* Sliding tile attention, Video diffusion, Sparse attention, Hardware-aware algorithms, Diffusion Transformers


### Efficient generation & caching

<!-- resource-id: diffusion-flow-matching__minidog-text-to-image-flow-matching-on-consumer-gpus -->
- **[MiniDog: Text-to-Image Flow Matching on Consumer GPUs](https://github.com/Reyhaneesmailizadeh/MiniDog)** · `Repo` · Reyhaneh Esmailizadeh et al. · *2026-10*
  A teaching-oriented 22M-parameter text-to-image DiT implementation, spanning pretraining, fine-tuning and evaluation on a dog-breed dataset. The README reports 55-minute pretraining on four RTX 3090s and documents its cached features, latent encoder, and evaluation recipe; those timings and scores were not reproduced here.
  *Key concepts:* Flow matching, Diffusion Transformer, Consumer GPUs, Cached features, T2I evaluation

<!-- resource-id: diffusion-flow-matching__gallery-of-methods-beyond-rl-part-ii-unsupervised-diffusion-models -->
- **[A Gallery of Methods Beyond RL — Part II: Unsupervised Diffusion Models](https://shengyu-feng.github.io/blog/2026/10/13/beyond-RL/)** · `Blog` · Shengyu Feng · *2026-10-13*
  Develops several ways to view unsupervised diffusion training and places them in the author's Beyond-RL series. This is a conceptual tutorial; the linked derivations and examples were inspected at article level, not independently reproduced.
  *Key concepts:* Unsupervised learning, Diffusion models, Generative modeling, Beyond RL

<!-- resource-id: diffusion-flow-matching__diffusion-language-models-from-scratch-to-production -->
- **[Diffusion Language Models, From Scratch to Production](https://www.comet.com/site/blog/diffusion-language-models/)** · `Blog` · Abby Morgan / Comet · *2026-08-27*
  Starts with masked-token diffusion and its training objective, then offers a tiny from-scratch notebook and an evaluation workflow for quality–latency tradeoffs. The article distinguishes parallel decoding speed from the dependency errors introduced when too many tokens are committed at once.
  *Key concepts:* Masked diffusion, Diffusion language models, Parallel decoding, Quality–latency tradeoff, Evaluation

<!-- resource-id: diffusion-flow-matching__kv-caching-in-flow-models -->
- **[KV Caching in Flow Models](https://sayak.dev/posts/kv-flow.html)** · `Blog` · Sayak Paul · *2026-10-07*
  Examines whether conditioning-token keys and values can be reused across iterative image generation in multimodal diffusion transformers. The explanation connects joint attention, changing noisy latents, and reference-image conditions; cache validity depends on the model's attention and conditioning design.
  *Key concepts:* KV cache, Flow matching, Diffusion transformers, Joint attention, Image generation
