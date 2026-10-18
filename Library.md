# 📚 Library — Frontier AI Research Atlas

A Library organized into 12 AI research domains and one separate area for life, career, and finance. Entries contain a source, a concise learning note, and a publication date when it can be established. Source review, publication time, and capture time are different things.

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
| [[Foundations & Math]] | Math, ML/LLM courses, interviews, engineering foundations | 19 |
| [[LLM Architecture & Scaling]] | Attention, architectures, scaling laws, pretraining | 43 |
| [[Post-Training & Alignment]] | SFT, preference optimization, LoRA, distillation, alignment | 61 |
| [[Reinforcement Learning & Reasoning]] | RL algorithms, reasoning, rewards, RL infrastructure | 76 |
| [[Diffusion & Flow Matching]] | Diffusion theory, flow matching, VAEs, text and video generation | 37 |
| [[Voice & Audio]] | ASR, TTS, audio representations, streaming speech | 20 |
| [[Vision & Multimodal]] | Vision encoders, video architectures, OCR, multimodal interaction | 12 |
| [[Agents, Memory & Retrieval]] | Agent foundations, harnesses, context, memory, tool use | 22 |
| [[Inference & Serving]] | Inference engines, decoding, KV caches, distributed serving | 73 |
| [[Distributed Training]] | DDP/FSDP, tensor and pipeline parallelism, training systems | 27 |
| [[GPU, CUDA & Kernels]] | CUDA, Triton, matmul, FlashAttention, profiling, hardware | 55 |
| [[Data & Evaluation]] | Training data, human annotation, judges, verifiers, evaluation | 31 |
| [[Life, Career & Finance]] | Personal finance, career growth, habits, reflective self-development | 2 |

*Total: 478 entries across 13 topics. All 213 original resource IDs are retained, preserving notes, highlights, favorites, and reading progress. Existing duplicate entries remain separate for the same reason.*

Publishers are sources, not domains: use the Source filter to collect Thinking Machines, Lilian Weng, or other publishers. Each resource has one primary subject; cross-domain relationships are stored in provenance. RL is a method and post-training is a training stage, so a resource may connect to both without being duplicated.

## Source review and intake

The October 10, 2026 refresh added 74 substantive sources from the captured Edge tabs, 9 missing Lilian Weng articles, and 2 separately identified official-documentation alternatives. Notes were grounded in inspected abstracts, documentation, READMEs, or relevant article sections. This does **not** mean every paper, lecture, experiment, or linked resource was fully read or reproduced.

The Edge capture contains 198 tabs across four windows, representing 190 normalized URLs. Every URL has a disposition in the private audit ledger. The Edge/Lilian and official-follow-up portion of **Sources & inbox** contains 184 records: 85 imported resources, 47 existing/related-source records, and 52 needing review. Seventeen private, local, unrelated, challenge-only, or privacy-unconfirmed records are withheld from public data.

The X browser timeline yielded 420 unique observed reposts across 241 frames, ending after eight frames with no new items and extending beyond May; the user accepted this visible boundary. Every observation is retained in a separate private ledger, including 87 posts whose original publication predates June and whose repost date remains unresolved. Exact repost timestamps and archive-level completeness are not claimed.

The combined public inbox now contains 619 records. The X review adds 168 source resources in total and refreshes 4 existing entries from primary evidence. Sources & inbox additionally lists 435 X observations: 137 linked to newly imported resources, 66 matching existing resources, and 232 needing review. Three unrelated observations from the original research pass remain private. The two life/career resources and sixteen observations from the October 18 recent-only pass are outside the original 420-repost research count. A post may link to several sources: matching one does not mark its other links, videos, quoted posts, or author replies as reviewed.

The October 18, 2026 recent-only pass reviewed 25 visible repost roots and 243 rendered comments, including 32 same-author comments. Eighteen threads reached a visible recommendation boundary; seven stopped at a bounded scroll limit and may have further comments. Fourteen source resources were added from twelve newly observed roots, while four roots were queued with specific review limitations. Three of the added resources are explicitly metadata-only. Nine of the 25 roots already had Library/intake records. Exact repost times, hidden or ranked replies, and complete comment coverage are not claimed.

The final saved author-comment checkpoint covers 420 observed threads: 397 sampled exact-author scans and 23 explicit zero-reply observations, with 0 unreadable attempts and 0 unattempted threads. Captures retain 888 unique author replies; 126 roots have links in author replies and 0 captured reply bodies remain truncated. Main captures contain text for 417 posts and link cards for 2 additional posts; 1 legacy unavailable-body record retains its visible link card and timeline context. Discovered source-link replies are retained alongside the original repost in each resource's discovery trail. These bounded scans do not establish exhaustive hidden/ranked comment coverage or exact repost dates; technical review of linked sources remains separately recorded.

Two additional X articles from the original Edge inventory were captured separately, with 14 sampled same-author replies and 10 distinct destination URLs inventoried. They remain needs-review for technical content and are not added to the 420-repost count. Their original post dates are not treated as repost dates.

## 🔖 Entry conventions

- **Type:** `Blog` · `Paper` · `Video` · `Course` · `Book` · `Repo` · `News`.
- **Format:** a permanent `<!-- resource-id: … -->` comment, then `**[Title](url)** · Type · Source · *date*`, a short summary, and a `*Key concepts:*` line.
- **Markers:** ⭐ = priority reading; 🔁 = suggested starting point; ⚠️unverified = a legacy entry needing verification. Absence of this legacy marker alone is not evidence of a source review.
- **Publication dates:** use a date explicitly supported by the source, or `—` when unknown. Do not substitute an update, event, or capture date. For linked works, the announcement or repost date is not the publication date; a directly reviewed X article may use its own original publication date.
- **Provenance:** `Library/provenance.json` records the reviewed source URL, observed/reviewed times, review scope, and related domains. “Primary” means the original publisher material was inspected; the note states whether that was an abstract, excerpt, or repository overview.
- **Pending sources:** `Library/intake.json` tracks public sources without inventing technical summaries for unread videos, inaccessible pages, or metadata-only records.

### Adding or updating an entry

Choose the primary research domain and an appropriate learning section. Use a few reusable concepts rather than turning full sentences into tags. Preserve every existing resource-ID comment when renaming or moving an entry, and check URL aliases and editions before adding a duplicate. Add source-review evidence separately from publication metadata.

Private chats, local file paths, personal feeds, and documents of unconfirmed visibility do not belong in the public intake. Keep those identifiers in the ignored local audit until their status is resolved.

## 🔗 Related notes

- `2026/RESOURCE.md` — an older resource index. Its coverage overlaps this Library and has not been exhaustively reconciled in this refresh.
- `DATALAKE.md` — an older operations-focused index, retained separately.

## Remaining review work

The Sources & inbox page lists outstanding public videos, collections, articles, papers, and documents individually with access or review limitations. Older Library entries may also require checking; 16 existing entries received evidence-backed metadata, summary, or quality annotations in this refresh. Capturing a tab, finding a title, or reaching a login page is never treated as reading the source.
