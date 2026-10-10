# 📚 Library — Frontier AI Research Atlas

A research Library organized into 12 subject domains. Entries contain a source, a concise learning note, and a publication date when it can be established. Source review, publication time, and capture time are different things.

## ⭐ Priority queue (read/watch first)

- **[On-Policy Distillation](https://thinkingmachines.ai/blog/on-policy-distillation/)** — Thinking Machines' OPD research and experiments → [[Post-Training & Alignment]]
- **[How GPT, Claude, and Gemini are actually trained and served — Reiner Pope](https://www.youtube.com/watch?v=xmkSf5IS-zw)** — training and serving systems talk → [[Post-Training & Alignment]]
- **[Is Frontier Asynchronous RL Solved?](https://luk-huang.github.io/personal-website/blog/is-frontier-asynchronous-rl-solved.html)** — the training–inference mismatch, surveyed → [[Reinforcement Learning & Reasoning]]
- **[Hands-On Modern RL](https://github.com/walkinglabs/hands-on-modern-rl)** 🔁 — a practical starting course for RL → [[Reinforcement Learning & Reasoning]]
- **[The Principles of Diffusion Models](https://arxiv.org/pdf/2510.21890)** — book-length foundations → [[Diffusion & Flow Matching]]
- **[Stanford CME296: Diffusion & Large Vision Models](https://www.youtube.com/watch?v=tr-CUpw--ck&list=PLoROMvodv4rNdy8rt2rZ4T2xM0OjADnfu)** — lecture series → [[Diffusion & Flow Matching]]
- **[EfficientML.ai L20 — Distributed Training](https://www.youtube.com/watch?v=jb91nEH2g_0)** — MIT 6.5940 distributed training lecture → [[Distributed Training]]
- **[Harness Engineering for Self-Improvement](https://lilianweng.github.io/posts/2026-07-04-harness/)** — Lilian Weng on agent runtimes, evaluation, and bounded improvement → [[Agents, Memory & Retrieval]]

## 🗂️ Domains

| Domain | What's inside | Entries |
|---|---|---:|
| [[Foundations & Math]] | Math, ML/LLM courses, interviews, engineering foundations | 15 |
| [[LLM Architecture & Scaling]] | Attention, architectures, scaling laws, pretraining | 32 |
| [[Post-Training & Alignment]] | SFT, preference optimization, LoRA, distillation, alignment | 48 |
| [[Reinforcement Learning & Reasoning]] | RL algorithms, reasoning, rewards, RL infrastructure | 54 |
| [[Diffusion & Flow Matching]] | Diffusion theory, flow matching, VAEs, text and video generation | 24 |
| [[Voice & Audio]] | ASR, TTS, audio representations, streaming speech | 20 |
| [[Vision & Multimodal]] | Vision encoders, video architectures, OCR, multimodal interaction | 8 |
| [[Agents, Memory & Retrieval]] | Agent foundations, harnesses, context, memory, tool use | 15 |
| [[Inference & Serving]] | Inference engines, decoding, KV caches, distributed serving | 64 |
| [[Distributed Training]] | DDP/FSDP, tensor and pipeline parallelism, training systems | 20 |
| [[GPU, CUDA & Kernels]] | CUDA, Triton, matmul, FlashAttention, profiling, hardware | 42 |
| [[Data & Evaluation]] | Training data, human annotation, judges, verifiers, evaluation | 19 |

*Total: 361 entries across 12 domains. All 213 original resource IDs are retained, preserving notes, highlights, favorites, and reading progress. Existing duplicate entries remain separate for the same reason.*

Publishers are sources, not domains: use the Source filter to collect Thinking Machines, Lilian Weng, or other publishers. Each resource has one primary subject; cross-domain relationships are stored in provenance. RL is a method and post-training is a training stage, so a resource may connect to both without being duplicated.

## Source review and intake

The October 10, 2026 refresh added 67 substantive sources from the captured Edge tabs and nine missing Lilian Weng articles. Notes were grounded in inspected abstracts, documentation, READMEs, or relevant article sections. This does **not** mean every paper, lecture, experiment, or linked resource was fully read or reproduced.

The Edge capture contains 198 tabs across four windows, representing 190 normalized URLs. Every URL has a disposition in the private audit ledger. The Edge/Lilian portion of **Sources & inbox** contains 182 records: 76 imported resources, 46 existing/related-source records, and 60 needing review. Seventeen private, local, unrelated, challenge-only, or privacy-unconfirmed records are withheld from public data.

The X browser timeline yielded 420 unique observed reposts across 241 frames, ending after eight frames with no new items and extending beyond May; the user accepted this visible boundary. Every observation is retained in a separate private ledger, including 87 posts whose original publication predates June and whose repost date remains unresolved. Exact repost timestamps and archive-level completeness are not claimed.

The combined public inbox contains 598 records. The X review adds 72 primary-source resources in total. Sources & inbox additionally lists 416 X observations: 60 linked to newly imported resources, 48 matching existing resources, and 308 needing review. Four clearly non-research observations remain private. A post may link to several sources: matching one does not mark its other links, videos, quoted posts, or author replies as reviewed.

The current author-comment checkpoint contains 86 sampled exact-author thread scans and 144 author replies. Discovered source-link replies are retained alongside the original repost in each resource's discovery trail. This is a saved partial checkpoint; further author-reply review is in progress. Unscanned comments remain explicitly pending, separately from whether the linked article itself has been reviewed. No exhaustive comment-coverage claim is made.

## 🔖 Entry conventions

- **Type:** `Blog` · `Paper` · `Video` · `Course` · `Book` · `Repo` · `News`.
- **Format:** a permanent `<!-- resource-id: … -->` comment, then `**[Title](url)** · Type · Source · *date*`, a short summary, and a `*Key concepts:*` line.
- **Markers:** ⭐ = priority reading; 🔁 = suggested starting point; ⚠️unverified = a legacy entry needing verification. Absence of this legacy marker alone is not evidence of a source review.
- **Publication dates:** use a date explicitly supported by the source, or `—` when unknown. Do not substitute an update, event, capture, original-tweet, or repost date.
- **Provenance:** `Library/provenance.json` records the reviewed source URL, observed/reviewed times, review scope, and related domains. “Primary” means the original publisher material was inspected; the note states whether that was an abstract, excerpt, or repository overview.
- **Pending sources:** `Library/intake.json` tracks public sources without inventing technical summaries for unread videos, inaccessible pages, or metadata-only records.

### Adding or updating an entry

Choose the primary research domain and an appropriate learning section. Use a few reusable concepts rather than turning full sentences into tags. Preserve every existing resource-ID comment when renaming or moving an entry, and check URL aliases and editions before adding a duplicate. Add source-review evidence separately from publication metadata.

Private chats, local file paths, personal feeds, and documents of unconfirmed visibility do not belong in the public intake. Keep those identifiers in the ignored local audit until their status is resolved.

## 🔗 Related notes

- `2026/RESOURCE.md` — an older resource index. Its coverage overlaps this Library and has not been exhaustively reconciled in this refresh.
- `DATALAKE.md` — an older operations-focused index, retained separately.

## Remaining review work

The Sources & inbox page lists outstanding public videos, collections, articles, papers, and documents individually with access or review limitations. Older Library entries may also require checking; ten existing entries received evidence-backed metadata or summary corrections in this refresh. Capturing a tab, finding a title, or reaching a login page is never treated as reading the source.
