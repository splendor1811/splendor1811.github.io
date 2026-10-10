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

### Optimization & geometry
<!-- resource-id: thinking-machines-lab__modular-manifolds -->
- **[Modular Manifolds](https://thinkingmachines.ai/blog/modular-manifolds/)** · `Blog` · Thinking Machines · *2025-09-26*
  Introduces "manifold Muon," which constrains weight matrices to the Stiefel manifold using a spectral-norm distance, then extends it to whole networks via "modular manifolds" that compose per-layer constraints with provable Lipschitz guarantees.
  *Key concepts:* manifold constraints (Stiefel manifold), tangent-space optimization, spectral-norm distance, dual ascent, modular norm composition, Riemannian vs. Finsler geometry
