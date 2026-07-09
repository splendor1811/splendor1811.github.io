# Foundations, Interviews & Meta

[[Library|← Back to Library index]] · Related: [[Reinforcement Learning]] · [[GPU, CUDA & Kernels]] · [[Efficient Inference & Serving]]

A collection spanning ML/LLM interview prep, broad NLP and agentic-AI courses, systems/debugging references, and vision-language research. These resources support both foundational study (math, interview loops) and hands-on engineering (debugging, ML-systems infra, coding agents).

### Interview prep
- **[Alisa's Book of LLMs](https://alisawuffles.notion.site/alisa-s-book-of-llms)** · `Book` · Notion (Alisa Liu) · *—* · ⚠️unverified
  A personal, evolving Notion notebook compiling core LLM concepts and reference material, aimed at study and interview preparation, covering the modern LLM stack from fundamentals to training and evaluation.
  *Key concepts:* LLM fundamentals, transformer architecture, pretraining/fine-tuning, evaluation, interview prep
- **[Alisa's Math Notes](https://alisawuffles.notion.site/math-notes)** · `Book` · Notion (Alisa Liu) · *—* · ⚠️unverified
  A curated set of math notes covering the linear algebra, probability, and optimization background most relevant to ML and LLM work — a quick-reference companion for interview prep and research.
  *Key concepts:* linear algebra, probability, optimization, calculus, ML math foundations
- **[ML Interviews (Silvia Sapora)](https://silviasapora.github.io/blog/ml-interviews.html)** · `Blog` · silviasapora.github.io · *2026-06*
  A detailed personal guide to the ML research-scientist interview process, written after the author secured offers from DeepMind, Isomorphic Labs, Cohere, and Meta following a PhD — covering preparation, interview structure, negotiation, and the emotional side.
  *Key concepts:* interview structure (screening/technical/behavioral), LeetCode + ML-coding prep, mock interviews, equity/compensation tradeoffs, offer timing/negotiation, emotional resilience

### LLM-from-scratch & advanced-LLM courses
- **[CS336: Language Modeling from Scratch](https://cs336.stanford.edu/)** · `Course` · Stanford (Tatsunori Hashimoto & Percy Liang) · *2026 (Spring)*
  Stanford's hands-on course that walks through building a language model end-to-end with minimal scaffolding: tokenizers, transformer architecture, systems/kernels, scaling, data, and post-training alignment — heavy Python/PyTorch implementation.
  *Key concepts:* transformer architecture & MoE, systems optimization (Triton kernels, distributed training), scaling laws, data filtering/dedup/synthetic data, SFT + RL alignment, inference & evaluation
- **[CS336 Study Notes: GRPO for Math Reasoning on Lambda Cloud](https://bearbearyu1223.github.io/posts/grpo-math-reasoning-lambda-cloud/)** · `Blog` · Han Yu · *2026-02-08*
  Post 15 of a CS336 study-notes series: a practical GRPO implementation that lifts Qwen2.5-Math-1.5B from ~6% to ~25% accuracy, training on 2×H100 (Lambda Cloud) with vLLM inference on GPU 0 and policy training on GPU 1 to eliminate memory contention.
  *Key concepts:* GRPO, group-normalized advantages, 2-GPU vLLM/trainer split, math-reasoning reward design, off-policy training with PPO clipping, Lambda Cloud setup
- **[Advanced Large Language Models (ELL8299)](https://lcs2.in/llm2501)** · `Course` · IIT Delhi (Tanmoy Chakraborty et al.) · *2025-26 (Sem I)*
  A graduate course on recent generative-AI breakthroughs for text, organized into five thematic units with hands-on PyTorch work. (Redirects to [lcs2-iitd.github.io/ELL8299-2501](https://lcs2-iitd.github.io/ELL8299-2501).)
  *Key concepts:* LLM fundamentals, efficiency/optimization, augmentation & reasoning, alternative architectures (SSMs, discretized models), multimodal (text+image), interpretability / physics of LLMs

### Courses (general)
- **[Advanced NLP (CMU 11-711)](https://www.youtube.com/playlist?list=PLqC25OT8ZpD15emhQhNjRLym77-sp2kAx)** · `Course` · YouTube (Graham Neubig, CMU) · *—*
  Recorded lectures for CMU's graduate Advanced NLP course, with an LLM-centric curriculum (including a "build-your-own-LLaMA" style assignment), covering modern NLP from neural fundamentals through large language models.
  *Key concepts:* neural NLP, transformers/LLMs, pretraining and fine-tuning, prompting, evaluation, LLM implementation
- **[Agentic AI (CMU 11-768, AI Agents)](https://www.cmu-agents.com/#/)** · `Course` · cmu-agents.com (CMU) · *—*
  Course site for CMU's AI Agents class, focused on building and understanding LLM-based autonomous agents — agent architectures, tool use, and autonomous decision-making.
  *Key concepts:* AI agents, agent architectures, tool use, autonomous decision-making, LLM orchestration

### Systems, debugging & tooling
- **[The Art of Debugging: An Open Book](https://github.com/stas00/the-art-of-debugging/tree/master)** · `Book` · GitHub (Stas Bekman) · *—*
  An evolving open-source book on how to debug ordinary issues fast and make hard issues tractable, drawn from the author's ML/systems engineering experience, organized as practical recipes across Unix tooling, compiled programs, Python, and PyTorch.
  *Key concepts:* fast debugging methodology, Unix tools (strace, bash, make), gdb/ldd/nm for compiled programs, Python debugging (py-spy), PyTorch memory/perf debugging
- **[Awesome-ML-SYS-Tutorial](https://github.com/zhaochenyang20/Awesome-ML-SYS-Tutorial/tree/main)** · `Repo` · GitHub (Chenyang Zhao) · *2024-08*
  A large, actively maintained learning-notes repository documenting ML systems infrastructure, focused on RL infra, online/offline inference, and AI-infra fundamentals, with deep dives into SGLang, RLHF frameworks, and distributed training.
  *Key concepts:* RLHF systems (slime, verl, OpenRLHF), inference optimization (SGLang, KV cache), distributed training (FSDP, tensor/expert parallelism), quantization (FP8, INT4 QAT), speculative decoding, CUDA optimization
- **[A Component of a Coding Agent (Sebastian Raschka)](https://substack.com/@rasbt/p-193137515)** · `Blog` · Ahead of AI / Substack (Sebastian Raschka) · *2026-04-04*
  A concise write-up of the building blocks behind coding agents — repo context, tool use, memory, and delegation — accompanied by a minimal, readable Python harness that implements the core components.
  *Key concepts:* coding agents, repo context, tool use, agent memory, task delegation, minimal agent harness

### Vision-language
- **[Vision Encoders in Vision-Language Models: A Survey](https://jina.ai/vision-encoder-survey.pdf)** · `Paper` · Jina AI (Han Xiao) · *2025-12-29* · ⚠️unverified
  A survey of vision encoders as used in vision-language models, cataloging architectures and design tradeoffs for connecting visual features to LLMs.
  *Key concepts:* vision encoders, vision-language models (VLMs), CLIP/ViT backbones, multimodal fusion, image-text alignment, encoder design tradeoffs
