# Diffusion & Flow Matching

[[Library|← Back to Library index]] · Related: [[LLM Architecture & Scaling Laws]] · [[Efficient Inference & Serving]]

A curated library on diffusion models and flow matching: the shared mathematical backbone (variational, score-based, and flow perspectives), the flow-matching framework, VAEs and latent-space generative modeling, and the newer frontier of discrete and text/language diffusion. Entries mix foundational tutorials, textbooks, university courses, and intuition-building talks.

**Suggested reading order:** Understanding Diffusion Models (unified perspective) → The Principles of Diffusion Models book ⭐ → Flow Matching Guide and Code → MIT 6.S184 / Stanford CME296 courses ⭐ → discrete/text diffusion.

### Books & courses
- **[The Principles of Diffusion Models](https://arxiv.org/pdf/2510.21890)** · `Book` · arXiv · *2025-10-24* · ⭐
  A monograph that unifies diffusion models by showing how variational, score-based, and flow-based formulations all emerge from learning a time-dependent velocity field that transports a simple prior to the data distribution. Also covers guidance, numerical solvers, and flow-map models.
  *Key concepts:* forward/reverse processes, variational vs. score vs. flow views, time-dependent velocity field, guidance, numerical solvers, flow-map models
- **[Stanford CME296: Diffusion & Large Vision Models](https://www.youtube.com/watch?v=tr-CUpw--ck&list=PLoROMvodv4rNdy8rt2rZ4T2xM0OjADnfu)** · `Course` · Stanford / YouTube · *2026-04-10* · ⭐ · ⚠️unverified
  Spring 2026 lecture series tracing computer vision from classification to modern generative systems, covering diffusion foundations, score/flow matching, U-Nets and Diffusion Transformers, controllable generation, and evaluation.
  *Key concepts:* diffusion foundations, score matching, flow matching, U-Net / Diffusion Transformer, controllable generation, evaluation
- **[Introduction to Flow Matching and Diffusion Models 2026 (MIT 6.S184)](https://diffusion.csail.mit.edu/2026/index.html)** · `Course` · MIT CSAIL · *2026-01* · ⚠️partial
  MIT IAP 2026 course pairing lectures with labs so students build a latent diffusion model from scratch, teaching the mathematical foundations (SDEs, ODEs, Fokker-Planck) alongside practical implementation.
  *Key concepts:* SDEs/ODEs, flow matching & score matching objectives, classifier-free guidance, VAEs / latent space, Diffusion Transformers & U-Nets, discrete diffusion (CTMCs)
- **[MIT Flow Matching 2026 — lecture notes (PDF)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf)** · `Course` · MIT CSAIL · *2026-01* · ⚠️unverified
  The written lecture notes accompanying the MIT 6.S184 course, developing flow matching and diffusion from first principles: probability paths, conditional vector fields, and the SDE/ODE machinery needed to train and sample.
  *Key concepts:* probability paths, conditional vector fields, flow matching objective, SDEs/ODEs, Fokker-Planck equation
- **[Flow Matching Guide and Code](https://arxiv.org/pdf/2412.06264)** · `Paper` · arXiv (Meta / FAIR) · *2024-12-09*
  A comprehensive guide to Flow Matching, a generative framework achieving state-of-the-art results across images, video, audio, and biological structures, combining mathematical foundations with a PyTorch package and worked examples.
  *Key concepts:* flow matching framework, conditional/marginal vector fields, probability paths, design choices & extensions, PyTorch implementation, multi-domain applications

### Theory & foundations
- **[Understanding Diffusion Models: A Unified Perspective](https://calvinyluo.com/2022/08/26/diffusion-tutorial.html)** · `Blog` · Calvin Luo · *2022-08-26* · ⚠️unverified
  A widely-cited pedagogical tutorial that derives diffusion models step by step, connecting the variational (ELBO/VDM) view with the score-based view and showing they optimize equivalent objectives.
  *Key concepts:* variational diffusion models, ELBO derivation, denoising / noise prediction, score matching, three equivalent objectives, reverse process
- **[Tracing the Principles Behind Modern Diffusion Models](https://iclr-blogposts.github.io/2026/blog/2026/tracing-principles-behind-modern-diffusion-models/)** · `Blog` · ICLR Blogposts 2026 · *2026*
  Argues that DDPM, Score-SDE, and Flow Matching are the same idea: transporting probability mass from noise to data via the change-of-variable rule, differing only in prediction target (noise, score, or velocity).
  *Key concepts:* change-of-variable rule, the conditional trick, forward Gaussian process, probability flow ODE, flow map models
- **[Go with the Flow](https://ydnyshhh.github.io/posts/go_with_the_flow/)** · `Blog` · Yudhishthir Kandpal · *2025-04-27*
  A guide to flow-based generative models as alternatives to diffusion, walking from normalizing flows through flow matching to rectified flows and the reflow procedure that enables fast one-step generation.
  *Key concepts:* normalizing flows, flow matching, probability paths, rectified flow, reflow, marginal vs. conditional vector fields
- **[From Autoencoder to Beta-VAE](https://lilianweng.github.io/posts/2018-08-12-vae/)** · `Blog` · Lilian Weng · *2018-08-12*
  A foundational survey tracing autoencoder architectures from vanilla AEs through VAEs to Beta-VAE and beyond, explaining how each learns compressed latent representations and improves interpretability and disentanglement.
  *Key concepts:* bottleneck architecture, variational autoencoder / ELBO, reparameterization trick, disentangled representations (Beta-VAE), VQ-VAE, KL regularization
- **[Generative modelling in latent space](https://sander.ai/2025/04/15/latents.html)** · `Blog` · Sander Dieleman · *2025-04-15*
  Explains the now-dominant two-stage recipe behind modern image/audio/video generation: first learn a compact latent via an autoencoder, then train a diffusion or autoregressive model in that latent space.
  *Key concepts:* two-stage training, latent autoencoders, reconstruction loss (regression + LPIPS + GAN), rate-distortion-modelability trade-off, latent-space regularization/curation, grid-structure preservation
- **[Diffusion Model Visual Breakdown](https://vizuara.substack.com/p/diffusion-model-visual-breakdown)** · `Blog` · Vizuara · *2026-06-23*
  A visual, intuition-first walkthrough of how diffusion models turn noise into images by learning to reverse a corruption process, contrasting them with GANs/VAEs and detailing the math and architectures behind modern image generation.
  *Key concepts:* forward diffusion process, denoiser / noise-prediction training, latent-space compression, timestep embeddings, Diffusion Transformers, classifier-free guidance

### Discrete & text diffusion (language)
- **[Language Modeling by Estimating the Ratios of the Data Distribution](https://aaronlou.com/blog/2024/discrete-diffusion/)** · `Blog` · Aaron Lou · *2024*
  Introduces Score Entropy Discrete Diffusion (SEDD), which models probability ratios between tokens ("concrete scores") and generates text by iterative denoising, matching GPT-2-scale performance while enabling flexible non-autoregressive generation and infilling.
  *Key concepts:* concrete scores, score entropy loss, discrete diffusion (transition matrix Q), reverse diffusion sampling, conditional generation via Bayes rule
- **[Diffusion Language Models: The Next Big Shift in GenAI](https://www.youtube.com/watch?v=8BTOoc0yDVA)** · `Video` · YouTube · *—* · ⚠️unverified
  Overview of why diffusion-based language models are emerging as an alternative to autoregressive LLMs, arguing they can be faster and more efficient while offering controllable, any-order generation and error correction (referencing Mercury/Inception and LLaDA).
  *Key concepts:* autoregressive vs. diffusion LLMs, parallel/any-order generation, inference speed & efficiency, controllable generation, error correction, agentic applications
- **[Text Diffusion — Brendan O'Donoghue, Google DeepMind](https://www.youtube.com/watch?v=r305-aQTaU0)** · `Video` · YouTube · *—* · ⚠️unverified
  A talk from the lead of Google DeepMind's text-diffusion team explaining the theory and engineering behind text diffusion (the basis of Gemini Diffusion / DiffusionGemma).
  *Key concepts:* text/language diffusion, iterative denoising of tokens, non-autoregressive generation, Gemini Diffusion / DiffusionGemma, high-throughput decoding, coding & math strengths
- **[You Might Not Need 50 Diffusion Steps — Ziv Ilan, Nvidia](https://www.youtube.com/watch?v=gHs5ZiY80PM)** · `Video` · YouTube (Nvidia GTC 2026) · *—* · ⚠️unverified
  An Nvidia GTC 2026 talk arguing that denoising step count should be treated as an engineering variable, showing how quantization, caching, and distillation stack to run video diffusion near real time on a single Blackwell B200.
  *Key concepts:* step-count reduction, quantization (FP8/FP4), caching across steps, step distillation (1-8 steps), real-time video diffusion, composable optimizations

### Intuition videos
- **[But how do AI images and videos actually work?](https://www.youtube.com/watch?v=iv-5mZ_9CPY)** · `Video` · Welch Labs / YouTube · *2025-07-25* · ⚠️unverified
  A Welch Labs guest explainer that visually builds intuition for how modern generative models produce images and video, walking from the noising/denoising idea through the core mechanics of diffusion-based generation.
  *Key concepts:* forward noising / reverse denoising, learned denoiser, text-to-image generation, latent representations, visual intuition for diffusion
