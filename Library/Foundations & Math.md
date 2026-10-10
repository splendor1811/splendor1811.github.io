# Foundations & Math

[[Library|← Back to Library index]] · Related: [[LLM Architecture & Scaling]] · [[Reinforcement Learning & Reasoning]]

Mathematical foundations, core ML and language-model courses, and the engineering practice that supports deeper research.

**Suggested reading order:** Alisa's Math Notes → CS336: Language Modeling from Scratch → Advanced NLP → training and serving fundamentals.

### Training & serving fundamentals
<!-- resource-id: post-training-playbooks-reports__how-gpt-claude-and-gemini-are-actually-trained-and-served-reiner-pope -->
- **[How GPT, Claude, and Gemini are actually trained and served — Reiner Pope](https://www.youtube.com/watch?v=xmkSf5IS-zw)** · `Video` · YouTube (Dwarkesh Podcast) · *2026-04-29* · ⭐ · ⚠️unverified
  A blackboard lecture in which Reiner Pope walks through the math and systems behind how frontier models are trained and served, framing memory bandwidth as the real inference bottleneck.
  *Key concepts:* training vs. serving economics, memory-bandwidth bottleneck, cluster/parallelism strategy, inference throughput, ML infrastructure

<!-- resource-id: post-training-playbooks-reports__reiner-pope-talk-companion-flashcards -->
- **[Reiner Pope talk — companion flashcards](https://flashcards.dwarkesh.com/)** · `Blog` · Dwarkesh Podcast · *—*
  A flashcard collection accompanying Dwarkesh Podcast content, including 27 cards on Reiner Pope's "The math behind how LLMs are trained and served," as spaced-repetition study material for ML infrastructure and hardware topics.
  *Key concepts:* LLM training math, serving/inference, pretraining parallelisms, failed training runs, semiconductor/silicon fundamentals

<!-- resource-id: foundations-math__language-models-for-text-classification-from-bag-of-words-to-jev -->
- **[Language Models for Text Classification: From Bag-of-Words to Jev](https://magazine.sebastianraschka.com/p/classifier-history-and-jev)** · `Blog` · Sebastian Raschka · *2026-09-29*
  Places modern decision APIs in the history of text classification, from bag-of-words methods to Transformer classification heads and text-to-text predictions. The article contrasts task-specific classifiers with general-purpose decision models; its discussion of Jev's undisclosed internals is explicitly an educated interpretation, not confirmed architecture documentation.
  *Key concepts:* Text classification, Bag of words, Classification heads, Text-to-text prediction, Decision models


### Interview prep
<!-- resource-id: foundations-interviews-meta__alisa-s-book-of-llms -->
- **[Alisa's Book of LLMs](https://alisawuffles.notion.site/alisa-s-book-of-llms)** · `Book` · Notion (Alisa Liu) · *—* · ⚠️unverified
  A personal, evolving Notion notebook compiling core LLM concepts and reference material, aimed at study and interview preparation, covering the modern LLM stack from fundamentals to training and evaluation.
  *Key concepts:* LLM fundamentals, transformer architecture, pretraining/fine-tuning, evaluation, interview prep

<!-- resource-id: foundations-interviews-meta__ml-interviews-silvia-sapora -->
- **[ML Interviews (Silvia Sapora)](https://silviasapora.github.io/blog/ml-interviews.html)** · `Blog` · silviasapora.github.io · *2026-06*
  A detailed personal guide to the ML research-scientist interview process, written after the author secured offers from DeepMind, Isomorphic Labs, Cohere, and Meta following a PhD — covering preparation, interview structure, negotiation, and the emotional side.
  *Key concepts:* interview structure (screening/technical/behavioral), LeetCode + ML-coding prep, mock interviews, equity/compensation tradeoffs, offer timing/negotiation, emotional resilience

### Mathematical foundations
<!-- resource-id: foundations-interviews-meta__alisa-s-math-notes -->
- **[Alisa's Math Notes](https://alisawuffles.notion.site/math-notes)** · `Book` · Notion (Alisa Liu) · *—* · ⚠️unverified
  A curated set of math notes covering the linear algebra, probability, and optimization background most relevant to ML and LLM work — a quick-reference companion for interview prep and research.
  *Key concepts:* linear algebra, probability, optimization, calculus, ML math foundations

### LLM-from-scratch & advanced-LLM courses
<!-- resource-id: foundations-interviews-meta__cs336-language-modeling-from-scratch -->
- **[CS336: Language Modeling from Scratch](https://cs336.stanford.edu/)** · `Course` · Stanford (Tatsunori Hashimoto & Percy Liang) · *2026 (Spring)*
  Stanford's hands-on course that walks through building a language model end-to-end with minimal scaffolding: tokenizers, transformer architecture, systems/kernels, scaling, data, and post-training alignment — heavy Python/PyTorch implementation.
  *Key concepts:* transformer architecture & MoE, systems optimization (Triton kernels, distributed training), scaling laws, data filtering/dedup/synthetic data, SFT + RL alignment, inference & evaluation

<!-- resource-id: foundations-interviews-meta__advanced-large-language-models-ell8299 -->
- **[Advanced Large Language Models (ELL8299)](https://lcs2.in/llm2501)** · `Course` · IIT Delhi (Tanmoy Chakraborty et al.) · *2025-26 (Sem I)*
  A graduate course on recent generative-AI breakthroughs for text, organized into five thematic units with hands-on PyTorch work. (Redirects to [lcs2-iitd.github.io/ELL8299-2501](https://lcs2-iitd.github.io/ELL8299-2501).)
  *Key concepts:* LLM fundamentals, efficiency/optimization, augmentation & reasoning, alternative architectures (SSMs, discretized models), multimodal (text+image), interpretability / physics of LLMs

<!-- resource-id: foundations-math__stanford-cme-295-transformers-large-language-models-syllabus -->
- **[Stanford CME 295: Transformers & Large Language Models Syllabus](https://cme295.stanford.edu/syllabus)** · `Course` · Stanford University · *—*
  The official Fall 2026 syllabus covers Transformer architecture, pretraining and post-training, RL, serving systems, agents, evaluation, and diffusion language models. It is a course roadmap; several lectures were still marked forthcoming at collection time.
  *Key concepts:* Transformers, Post-training, Reinforcement learning, Agents, Evaluation

<!-- resource-id: foundations-math__build-and-train-glm-5-3-flash-from-scratch -->
- **[Build and Train GLM-5.3-Flash From Scratch](https://github.com/vukrosic/glm-5.3-flash-from-scratch)** · `Repo` · Vuk Rosić / vukrosic · *—*
  An educational small-model implementation inspired by GLM-5.3-Flash, covering random-initialization training and executable-reward RL. The README reports results on a synthetic confirmation set and explicitly limits their interpretation: they do not establish broad coding ability or reproduce the frontier model.
  *Key concepts:* LLMs from scratch, Educational implementation, Executable rewards, Controlled evaluation, Pretraining

<!-- resource-id: foundations-math__cmu-advanced-natural-language-processing-spring-2026 -->
- **[CMU Advanced Natural Language Processing — Spring 2026](https://cmu-l3.github.io/anlp-spring2026)** · `Course` · Sean Welleck / Carnegie Mellon University · *—*
  A graduate NLP course connecting neural representations, language-model architectures, pretraining, decoding, retrieval, fine-tuning, and distillation. The syllabus organizes readings and implementation material around these foundations and culminates in a research project; individual lectures and assignments were not completed in this review.
  *Key concepts:* Language modeling, Transformers, Pretraining, Decoding, Research methodology


### Courses (general)
<!-- resource-id: foundations-interviews-meta__advanced-nlp-cmu-11-711 -->
- **[Advanced NLP (CMU 11-711)](https://www.youtube.com/playlist?list=PLqC25OT8ZpD15emhQhNjRLym77-sp2kAx)** · `Course` · YouTube (Graham Neubig, CMU) · *—*
  Recorded lectures for CMU's graduate Advanced NLP course, with an LLM-centric curriculum (including a "build-your-own-LLaMA" style assignment), covering modern NLP from neural fundamentals through large language models.
  *Key concepts:* neural NLP, transformers/LLMs, pretraining and fine-tuning, prompting, evaluation, LLM implementation

<!-- resource-id: foundations-math__mit-6-5940-tinyml-and-efficient-deep-learning-computing -->
- **[MIT 6.5940: TinyML and Efficient Deep Learning Computing](https://hanlab.mit.edu/courses/2024-fall-65940)** · `Course` · MIT HAN Lab · *—*
  A course spanning model compression and efficient deployment, including pruning, quantization, neural architecture search, and distributed or on-device execution. The official Fall 2024 page serves as a curriculum and lecture-material index.
  *Key concepts:* Model compression, Quantization, Pruning, Efficient deep learning, On-device inference

### Systems, debugging & tooling
<!-- resource-id: foundations-interviews-meta__the-art-of-debugging-an-open-book -->
- **[The Art of Debugging: An Open Book](https://github.com/stas00/the-art-of-debugging/tree/master)** · `Book` · GitHub (Stas Bekman) · *—*
  An evolving open-source book on how to debug ordinary issues fast and make hard issues tractable, drawn from the author's ML/systems engineering experience, organized as practical recipes across Unix tooling, compiled programs, Python, and PyTorch.
  *Key concepts:* fast debugging methodology, Unix tools (strace, bash, make), gdb/ldd/nm for compiled programs, Python debugging (py-spy), PyTorch memory/perf debugging

<!-- resource-id: foundations-interviews-meta__awesome-ml-sys-tutorial -->
- **[Awesome-ML-SYS-Tutorial](https://github.com/zhaochenyang20/Awesome-ML-SYS-Tutorial/tree/main)** · `Repo` · GitHub (Chenyang Zhao) · *2024-08*
  A large, actively maintained learning-notes repository documenting ML systems infrastructure, focused on RL infra, online/offline inference, and AI-infra fundamentals, with deep dives into SGLang, RLHF frameworks, and distributed training.
  *Key concepts:* RLHF systems (slime, verl, OpenRLHF), inference optimization (SGLang, KV cache), distributed training (FSDP, tensor/expert parallelism), quantization (FP8, INT4 QAT), speculative decoding, CUDA optimization

<!-- resource-id: foundations-math__colloquium-markdown-based-research-slides -->
- **[Colloquium: Markdown-based research slides](https://github.com/natolambert/colloquium)** · `Repo` · Nathan Lambert / Colloquium contributors · *—*
  A research-presentation tool that turns Markdown and frontmatter into self-contained HTML slides, with development preview, PDF export, and slide-image capture. The README frames this workflow as version-control-friendly and usable by coding agents; the rendering commands and browser dependencies were not tested here.
  *Key concepts:* Research communication, Markdown, Reproducible workflows, HTML slides, Agent tooling


### Optimization & geometry
<!-- resource-id: thinking-machines-lab__modular-manifolds -->
- **[Modular Manifolds](https://thinkingmachines.ai/blog/modular-manifolds/)** · `Blog` · Thinking Machines · *2025-09-26*
  Introduces "manifold Muon," which constrains weight matrices to the Stiefel manifold using a spectral-norm distance, then extends it to whole networks via "modular manifolds" that compose per-layer constraints with provable Lipschitz guarantees.
  *Key concepts:* manifold constraints (Stiefel manifold), tangent-space optimization, spectral-norm distance, dual ascent, modular norm composition, Riemannian vs. Finsler geometry

<!-- resource-id: foundations-math__how-to-predict-uncertainty -->
- **[How to Predict Uncertainty](https://francesco215.github.io/autoregressive_diffusion/uncertainty.html)** · `Blog` · Francesco Sacco · *—*
  Introduces uncertainty-aware regression by predicting a distribution rather than only a point estimate. Uses learned Gaussian mean and variance to connect a likelihood objective with input-dependent uncertainty, complementing the more familiar probability outputs of classification.
  *Key concepts:* Uncertainty estimation, Probabilistic regression, Gaussian likelihood, Heteroscedasticity, Calibration

<!-- resource-id: foundations-math__exact-solutions-to-the-nonlinear-dynamics-of-learning-in-deep-linear-neural-networks -->
- **[Exact solutions to the nonlinear dynamics of learning in deep linear neural networks](https://arxiv.org/abs/1312.6120)** · `Paper` · Andrew M. Saxe, James L. McClelland, Surya Ganguli / arXiv · *2013-12-20*
  Analyzes the nonlinear optimization dynamics of networks whose overall input-output mapping remains linear. Exact solutions connect learning plateaus and rapid transitions to initialization and depth, including conditions under which orthogonal initialization avoids depth-dependent delays; these are restricted theoretical settings, not a general theorem about modern LLM training.
  *Key concepts:* Learning dynamics, Deep linear networks, Orthogonal initialization, Gradient descent, Depth scaling
