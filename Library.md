# 📚 Library — Frontier AI Second Brain

A continuously-updated knowledge base for tracking frontier AI/ML techniques: on-policy distillation, RL for LLMs, diffusion & flow matching, efficient inference, GPU/kernels, distributed training, and more. Every entry has a type, source, publication date, and a concise summary of its key ideas.

> **Focus right now:** on-policy distillation and (async) RL for reasoning LLMs, plus the inference/serving and GPU systems that make them run.

---

## ⭐ Priority queue (read/watch first)

- **[On-Policy Distillation](https://thinkingmachines.ai/blog/on-policy-distillation/)** — Thinking Machines' canonical OPD writeup → [[On-Policy Distillation]]
- **[How GPT, Claude, and Gemini are actually trained and served — Reiner Pope](https://www.youtube.com/watch?v=xmkSf5IS-zw)** — must-watch systems talk → [[Post-Training Playbooks & Reports]]
- **[Is Frontier Asynchronous RL Solved?](https://luk-huang.github.io/personal-website/blog/is-frontier-asynchronous-rl-solved.html)** — the training–inference mismatch, surveyed → [[Async & Infrastructure RL]]
- **[Hands-On Modern RL](https://github.com/walkinglabs/hands-on-modern-rl)** 🔁 — recommended starting course for RL → [[Reinforcement Learning]]
- **[The Principles of Diffusion Models](https://arxiv.org/pdf/2510.21890)** — the book to read for diffusion → [[Diffusion & Flow Matching]]
- **[Stanford CME296: Diffusion & Large Vision Models](https://www.youtube.com/watch?v=tr-CUpw--ck&list=PLoROMvodv4rNdy8rt2rZ4T2xM0OjADnfu)** — must-watch course → [[Diffusion & Flow Matching]]
- **[EfficientML.ai L20 — Distributed Training](https://www.youtube.com/watch?v=jb91nEH2g_0)** — must-watch (MIT 6.5940) → [[Distributed & Parallel Training]]

---

## 🗂️ Sections

| Section | What's inside | Entries |
|---|---|---|
| [[On-Policy Distillation]] | First-principles, multi-teacher/self-distillation, pitfalls (the current hot topic) | 19 |
| [[Reinforcement Learning]] | RL courses, GRPO/policy-optimization, RL scaling, environments, RLMs | 23 |
| [[Async & Infrastructure RL]] | Async RL, training–inference mismatch, off-policy, precision, agentic RL | 11 |
| [[Diffusion & Flow Matching]] | Diffusion theory, flow matching, VAEs, discrete/text diffusion | 16 |
| [[Efficient Inference & Serving]] | vLLM/SGLang internals, speculative decoding, KV cache, MoE, quant, disaggregation | 33 |
| [[Distributed & Parallel Training]] | Multi-node, FSDP, TP/PP/DP, DDP, collective communication | 11 |
| [[GPU, CUDA & Kernels]] | CUDA, matmul/GEMM, Triton, profiling, FlashAttention internals | 14 |
| [[LLM Architecture & Scaling Laws]] | MLA/KV-sharing/MTP/attention residuals, scaling laws, pretraining efficiency | 10 |
| [[Post-Training Playbooks & Reports]] | End-to-end LLM playbooks + frontier lab technical reports | 7 |
| [[Synthetic Data & Evaluation]] | Synthetic data generation, LLM-as-a-judge, verifiers | 9 |
| [[Foundations, Interviews & Meta]] | Interview prep, LLM-from-scratch (CS336) & general courses, debugging, ML-SYS, vision-language | 12 |
| [[Thinking Machines Lab]] | Running tracker of *every* TML blog/news post | 13 |

*Total: 178 entries across 12 subpages.*

---

## 🔖 Legend

- **Type:** `Blog` · `Paper` · `Video` · `Course` · `Book` · `Repo` · `News`
- **Format:** `**[Title](url)** · Type · Source · *date* · marker` followed by a summary line and a `*Key concepts:*` line.
- **Markers:** ⭐ = must-read/watch · 🔁 = recommended starting point · ⚠️unverified = page couldn't be machine-fetched, summary reconstructed from title/search/knowledge (verify details).
- **Dates** are the source's real publication date where fetchable; `—` if unknown.

### ➕ Adding a new entry
Drop it into the most relevant subpage under an existing `###` group, using the format above. If it opens a new theme, add a `###` group (or a new subpage + a row in the table here). Keep the newest Thinking Machines post at the top of [[Thinking Machines Lab]].

---

## 🔗 Related notes (Obsidian vault)

- `2026/RESOURCE.md` — the original resource index. Its RL / serving / distillation / architecture links were folded into this Library; it still holds **Agentic Systems, Speech (ASR/TTS), Claude Code tips, and Skills** resources not duplicated here.
- `DATALAKE.md` — older Ops-focused index (K8s, Jenkins, Terraform, RAG). Marked for archival; kept out of this frontier-AI Library by design.

---

## ⚠️ Appendix — unfetched / verify-manually

Some sources can't be machine-fetched (X/Twitter, Notion, YouTube transcripts, large or binary PDFs, Google Drive, LinkedIn, some HF Spaces). Their entries are marked `⚠️unverified` inline and were written from the title plus web-search + domain knowledge — dates and specifics are worth confirming when you read them. By platform:

- **X / Twitter:** ar0cket1 (On-Policy Self-Distillation, Solving OPSD), willccbb (SFT/RL/OPD), dwarkesh_sp (blackboard OPD), goyal__pramod (advanced CUDA thread), cwolferesearch (best RL resources).
- **Notion:** yumoxu (multi-teacher OPD), fengyao (off-policy RL), yingru (RL collapse), llm-as-a-verifier, alisawuffles (book of LLMs, math notes).
- **YouTube (no transcript returned):** O1AR4iL30mg (distillation talk), 52UlnK-SW7I (RLVR envs), RLHF series + CS224R playlists, CME296, jb91n/9MvD/UZZD (distributed lectures), CS149 playlist, zy8Ch (FlashAttention Triton), oIk3R (chip design), 8BTOoc0/r305/gHs5/iv-5mZ (diffusion videos), eFgkn (DSpark), tIPDwU (disaggregation), vW30o (GGUF), XIY2 (Smola serving), 5eqR (scaling laws), xmkSf (Reiner Pope).
- **PDF / Drive / LinkedIn / HF Space:** DSpark paper (GitHub PDF), MIT flow-matching lecture notes, Smola slides, Jina vision-encoder survey, Interview-LLM-Inference (Drive), vLLM/SGLang trace (LinkedIn), harness-optimization / rl-environments-guide / smol-training-playbook / finephrase (HF Spaces).

*Everything above still has a full entry on its topic subpage — nothing was dropped.*
