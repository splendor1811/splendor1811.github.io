# Inference & Serving

[[Library|← Back to Library index]] · Related: [[GPU, CUDA & Kernels]] · [[Distributed Training]] · [[LLM Architecture & Scaling]]

Inference engines, speculative decoding, KV-cache management, quantization, and production serving. Study the path from model weights to reliable, efficient tokens.

**Suggested reading order:** Inside Nano-vLLM (Part 1) → mini-SGLang → speculative decoding (DFlash + Spec V2) → KV-cache infra problems → Red Hat distributed-inference series.

### Build engines from scratch (vLLM / SGLang)
<!-- resource-id: efficient-inference-serving__understanding-llm-inference-engines-inside-nano-vllm-part-1 -->
- **[Understanding LLM Inference Engines: Inside Nano-vLLM (Part 1)](https://neutree.ai/blog/nano-vllm-part-1)** · `Blog` · Neutree AI · *2026-02-01*
  A walkthrough of Nano-vLLM, a ~1,200-line yet production-grade inference engine, built around a producer-consumer Scheduler that batches sequences through prefill and decode phases.
  *Key concepts:* producer-consumer scheduling, prefill vs. decode, block-based KV memory, tensor parallelism, CUDA graphs

<!-- resource-id: efficient-inference-serving__building-mini-vllm-nano-vllm-blog -->
- **[Building Mini-vLLM (nano-vllm blog)](https://github.com/ovshake/nano-vllm/blob/main/BLOG.md)** · `Repo` · GitHub (ovshake) · *—*
  An educational guide to nano-vllm, a minimalist LLM inference engine demonstrating PagedAttention and continuous batching, with interactive learning modes to reveal how modern engines work internally.
  *Key concepts:* PagedAttention, continuous batching, prefix caching, speculative decoding, chunked prefill, FlashAttention

<!-- resource-id: efficient-inference-serving__mini-sglang-learn-sglang-from-scratch -->
- **[mini-SGLang (learn SGLang from scratch)](https://github.com/sgl-project/mini-sglang)** · `Repo` · GitHub (sgl-project) · *—*
  A compact ~5,000-line Python reimplementation of SGLang meant to demystify modern LLM serving, delivering high-performance serving behind an OpenAI-compatible API.
  *Key concepts:* radix cache, tensor parallelism, chunked prefill, overlap scheduling, FlashInfer integration

<!-- resource-id: efficient-inference-serving__tracing-vllm-sglang-internals-linkedin-post -->
- **[Tracing vLLM & SGLang internals (LinkedIn post)](https://www.linkedin.com/feed/update/urn:li:activity:7413999777731772416/)** · `Blog` · LinkedIn · *—* · ⚠️unverified
  A practitioner post on instrumenting and tracing the request lifecycle inside vLLM and SGLang to understand scheduling, batching, and kernel dispatch behavior in production.
  *Key concepts:* engine tracing, request lifecycle, scheduler internals, batching, profiling

<!-- resource-id: efficient-inference-serving__nano-vllm-a-minimal-inference-engine -->
- **[nano-vllm: A Minimal Inference Engine](https://github.com/GeeeekExplorer/nano-vllm/tree/main)** · `Repo` · GeeeekExplorer / nano-vllm contributors · *—*
  A compact inference-engine implementation for studying the components behind high-throughput language-model serving. Its README describes prefix caching, tensor parallelism, torch.compile, and CUDA graphs; this is the upstream repository, distinct from the existing fork in the Library.
  *Key concepts:* vLLM, Inference serving, Prefix caching, Tensor parallelism, CUDA graphs

<!-- resource-id: efficient-inference-serving__how-to-approach-vllm-minivllm-roadmap -->
- **[How to Approach vLLM: MinivLLM Roadmap](https://github.com/Wenyueh/MinivLLM/blob/main/HowToApproachvLLM.md)** · `Repo` · Wenyueh / MinivLLM · *—*
  A bottom-up study plan for reconstructing inference-engine components, starting with operations such as normalization and progressing toward model execution. The notes include hardware-specific experiments and discuss where compilation overhead changes the payoff of optimization.
  *Key concepts:* Inference serving, vLLM, RMSNorm, torch.compile, Kernel benchmarking

<!-- resource-id: efficient-inference-serving__mini-sglang-part-1-architecture-engine-request-flow -->
- **[Mini SGLang, Part 1: Architecture, Engine & Request Flow](https://blog.dotieuthien.com/posts/mini-sglang-part-1)** · `Blog` · Thien Do · *—*
  Traces a request through the frontend, tokenizer, scheduler, engine, and detokenizer of Mini SGLang. It connects paged KV storage and CUDA-graph execution to request completion and prefix-cache reuse.
  *Key concepts:* SGLang, Request lifecycle, Paged KV cache, CUDA graphs, Prefix caching

<!-- resource-id: efficient-inference-serving__vllm-architecture-overview -->
- **[vLLM Architecture Overview](https://docs.vllm.ai/en/latest/design/arch_overview/)** · `Blog` · vLLM Project · *—*
  Maps vLLM's offline and online entrypoints to its API server, engine core, GPU workers, and optional data-parallel coordinator. The design page relates process counts and responsibilities to deployment parallelism and points to the corresponding source modules.
  *Key concepts:* vLLM, Inference engines, GPU workers, Data parallelism, Process architecture


### Speculative decoding
<!-- resource-id: efficient-inference-serving__dspark-confidence-scheduled-speculative-decoding-with-semi-autoregressive-generation -->
- **[DSpark: Confidence-Scheduled Speculative Decoding with Semi-Autoregressive Generation](https://github.com/deepseek-ai/DeepSpec/blob/main/DSpark_paper.pdf)** · `Paper` · DeepSeek (GitHub) · *—* · ⚠️unverified
  DeepSeek's DSpark accelerates decoding by combining confidence-based scheduling of draft acceptance with semi-autoregressive (multi-token block) generation, adaptively deciding how aggressively to draft based on model confidence.
  *Key concepts:* confidence scheduling, semi-autoregressive generation, draft acceptance, lossless acceleration, multi-token blocks

<!-- resource-id: efficient-inference-serving__dspark-explained-video -->
- **[DSpark explained (video)](https://www.youtube.com/watch?v=eFgknPFK-g0)** · `Video` · YouTube · *—* · ⚠️unverified
  A video explainer walking through DSpark's confidence-scheduled speculative decoding and why it speeds up inference at no quality cost.
  *Key concepts:* speculative decoding, DeepSeek DSpark, draft-and-verify, inference speedup

<!-- resource-id: efficient-inference-serving__dflash-block-diffusion-for-flash-speculative-decoding -->
- **[DFlash: Block Diffusion for Flash Speculative Decoding](https://arxiv.org/pdf/2602.06036)** · `Paper` · arXiv · *2026-05-28*
  DFlash uses a lightweight block-diffusion draft model to generate candidate tokens in parallel (rather than sequentially), conditioning on the target model's context features and verifying in parallel to reach over 6x lossless acceleration and up to 2.5x higher speedup than EAGLE-3.
  *Key concepts:* block diffusion drafting, parallel generation, context feature conditioning, acceptance-rate optimization, lossless speculative decoding

<!-- resource-id: efficient-inference-serving__the-next-generation-of-speculative-decoding-dflash-and-spec-v2-lmsys -->
- **[The next generation of speculative decoding: DFlash and Spec V2 (LMSYS)](https://www.lmsys.org/blog/2026-06-15-next-generation-speculative-decoding-dflash-v2/)** · `Blog` · LMSYS · *2026-06-15*
  Z Lab, Modal, and the SGLang team present DFlash — parallel block-diffusion drafting with KV-cache injection — paired with SGLang's Spec V2 engine, reporting higher throughput than both the baseline and native MTP on a Qwen 3.5 397B-A17B draft.
  *Key concepts:* block diffusion, KV-cache injection, Spec V2 overlap scheduler, acceptance length vs. drafting cost, parallel verification

<!-- resource-id: efficient-inference-serving__speculative-decoding-theory-and-implementation-in-vllm -->
- **[Speculative Decoding: Theory and Implementation in vLLM](https://substack.com/@mayankpratapsingh022/p-205325757)** · `Blog` · Mayank Pratap Singh · *2026-07-12*
  Spleculative Decoding with EAGLE3
  *Key concepts:* Spleculative Decoding

<!-- resource-id: efficient-inference-serving__dflash-3x-faster-llm-inference -->
- **[DFlash: 3x faster LLM inference](https://www.baseten.co/blog/dflash-faster-llm-inference/)** · `Blog` · Basen Blog · *2026-07-23*
  Summary DFlash Paper
  *Key concepts:* DFlash

<!-- resource-id: efficient-inference-serving__the-complete-guide-to-llm-quantization-with-vllm-benchmarks-best-practices-jaydev-tonde -->
- **[The Complete Guide to LLM Quantization with vLLM: Benchmarks & Best Practices Jaydev Tonde](https://jarvislabs.ai/blog/vllm-quantization-complete-guide-benchmarks)** · `Blog` · Unknown · *2026-07-29*
  Key survey LLM Quantization with vLLM
  *Key concepts:* —

<!-- resource-id: efficient-inference-serving__tech-why-mla-and-mtp-fight-each-other-attention-through-arithmetic-intensity -->
- **[[Tech] Why MLA and MTP Fight Each Other: Attention Through Arithmetic Intensity](https://changyi.fun/posts/attention-arithmetic-intensity/)** · `Blog` · Changyi Yang · *2026-08-09* · ⭐
  Uses an idealized BF16 attention-core model to compare cache reuse in MHA, GQA, MQA, and MLA, then explains why speculative verification can consume MLA's remaining compute headroom. Distinguishes absorbed decode from expanded prefill and includes a positional-key correction. Arithmetic intensity alone cannot rank algorithms: absolute FLOPs, bytes, kernel realization, and full-model costs still matter.
  *Key concepts:* Arithmetic intensity, Roofline model, Multi-head latent attention, Speculative decoding, KV cache reuse

<!-- resource-id: efficient-inference-serving__speculative-decoding-how-it-evolved-when-it-stays-lossless-and-what-s-next -->
- **[Speculative Decoding: How It Evolved, When It Stays Lossless, and What's Next](https://neurips2026-speculative-decoding.vercel.app/)** · `Blog` · Lily Zhang and Madison Kanna · *—*
  Introduces draft-and-verify decoding and the rejection-sampling argument for preserving a target model's distribution under the stated algorithmic assumptions. The tutorial then motivates parallel drafting and evaluation questions; its page labels the NeurIPS Education Track submission as under review.
  *Key concepts:* Speculative decoding, Rejection sampling, Draft models, Lossless decoding, Inference latency

<!-- resource-id: efficient-inference-serving__exploring-speculative-decoding-in-vllm-on-amd-gpus -->
- **[Exploring Speculative Decoding in vLLM on AMD GPUs](https://vllm.ai/blog/2026-08-23-speculative-decoding-amd-gpus)** · `Blog` · AMD and Embedded LLM / vLLM · *2026-08-23*
  Compares several draft-and-verify approaches in a vLLM serving environment on AMD GPUs. The introduction separates proposal mechanisms and emphasizes that throughput depends on model family, draft checkpoint, proposal length, workload, and acceptance behavior rather than one universally best method.
  *Key concepts:* Speculative decoding, vLLM, ROCm, Draft models, Workload-aware tuning

<!-- resource-id: efficient-inference-serving__hardware-aware-dynamic-speculative-decoding -->
- **[Hardware-aware dynamic speculative decoding](https://cohere.com/blog/hardware-aware-dynamic-speculative-decoding)** · `Blog` · Ekagra Ranjan / Cohere · *2026-07-10*
  Adjusts draft length to the serving workload and hardware regime instead of keeping it fixed. Explains why verification can help bandwidth-bound decoding but hurt compute-bound batches, and why the batch-size relationship differs between dense and MoE models.
  *Key concepts:* Speculative decoding, Dynamic draft length, Roofline model, Batching, MoE inference

<!-- resource-id: efficient-inference-serving__online-dspark-training-example-in-speculators -->
- **[Online DSpark training example in Speculators](https://github.com/vllm-project/speculators/blob/main/examples/train/dspark_qwen3_0_6b_sharegpt_online.sh)** · `Repo` · vLLM Project · *—*
  A concrete script wiring response regeneration, dataset preparation, and online draft-model training against a live vLLM server. Its comments distinguish DSpark's Markov/confidence additions from the underlying DFlash pipeline and label the small example as a pipeline check rather than a strong-performance recipe.
  *Key concepts:* DSpark, Speculative decoding, Online distillation, vLLM, Training pipelines

<!-- resource-id: efficient-inference-serving__vllm-dynamic-speculative-decoding -->
- **[vLLM Dynamic Speculative Decoding](https://docs.vllm.ai/en/latest/features/speculative_decoding/dynamic_speculative_decoding)** · `Blog` · vLLM documentation contributors · *—*
  Adjusts the number of draft tokens according to scheduled concurrency so verification cost does not overwhelm the benefit of speculation. The documentation illustrates workload-specific batch-size ranges, including long-tail RL rollouts, and records important method, model-runner, CUDA-graph, and data-parallel limitations. These are settings to validate for a deployment, not a guarantee that speculative decoding always improves latency.
  *Key concepts:* Speculative decoding, Dynamic draft length, Verification cost, CUDA graphs, Rollout tails

<!-- resource-id: efficient-inference-serving__deepspec-training-and-evaluating-speculative-draft-models -->
- **[DeepSpec: Training and Evaluating Speculative Draft Models](https://github.com/deepseek-ai/DeepSpec/tree/main)** · `Repo` · DeepSeek / DeepSpec contributors · *—*
  Provides a pipeline for preparing target-model caches, training draft models, and evaluating speculative acceptance across tasks. Its README covers DSpark, DFlash, and Eagle3, and warns that cached-target storage can be large. Released comparisons use specific non-thinking target-generation settings; domain or thinking-mode use may require retraining rather than reusing headline results.
  *Key concepts:* Speculative decoding, Draft-model training, Target caching, Acceptance evaluation, Benchmark alignment


### KV cache, MoE & kernels for inference
<!-- resource-id: efficient-inference-serving__kv-cache-compression-and-its-infra-problems-nvidia -->
- **[KV-cache compression and its infra problems (NVIDIA)](https://research.nvidia.com/labs/eai/blogs/kv-cache-compression-and-its-infra-problems/)** · `Blog` · NVIDIA Research · *2026-06-12*
  Examines why KV-cache compression fails in production: FlashAttention never materializes the attention scores that eviction methods depend on, and paged allocators can't reclaim fragmented blocks. TriAttention sidesteps both, reaching 2.5x faster decode and 10.7x KV reduction.
  *Key concepts:* KV-cache eviction, attention-score dependency, paged-attention fragmentation, pre-RoPE geometry, forward-packing compaction

<!-- resource-id: efficient-inference-serving__the-vllm-moe-playbook-tp-dp-pp-and-expert-parallelism-amd-rocm -->
- **[The vLLM MoE Playbook: TP, DP, PP and Expert Parallelism (AMD ROCm)](https://rocm.blogs.amd.com/software-tools-optimization/vllm-moe-guide/README.html)** · `Blog` · AMD ROCm · *2025-11-24*
  A parallelism decision guide for serving MoE models on vLLM/MI300X, benchmarking DeepSeek-R1, Qwen3, and Llama-4; shows TP+EP wins low-concurrency latency while DP+EP scales throughput.
  *Key concepts:* tensor/data/pipeline/expert parallelism, DP attention, expert activation density, MLA/MQA KV duplication, AllToAll vs. AllReduce

<!-- resource-id: efficient-inference-serving__moe-as-dense-gemm-optimizing-low-latency-moe-inference-on-nvidia-blackwell -->
- **[MoE as Dense GEMM: Optimizing Low-Latency MoE Inference on NVIDIA Blackwell](https://github.com/NVIDIA/TensorRT-LLM/blob/main/docs/source/blogs/tech_blog/blog24_MoE_as_Dense_GEMM.md)** · `Blog` · NVIDIA (TensorRT-LLM) · *—*
  Introduces DENSEGEMM, reformulating routed-expert compute as a single large dense GEMM with per-token alpha masks; in the memory-bound low-latency regime the extra arithmetic is nearly free, yielding up to 1.12x speedup on DeepSeek-V3-style models.
  *Key concepts:* dense GEMM reformulation, memory-bound regime, NVFP4 quantization, CuTe DSL kernels, alpha masking, Blackwell tcgen05 MMA

<!-- resource-id: efficient-inference-serving__dissecting-flashinfer-a-systems-perspective-on-high-performance-llm-inference -->
- **[Dissecting FlashInfer — A Systems Perspective on High-Performance LLM Inference](https://ydnyshhh.github.io/posts/flash_infer/)** · `Blog` · ydnyshhh.github.io · *2025-10-09*
  A systems deep dive into FlashInfer as a unified attention-kernel interface, covering its block-sparse KV-cache format, JIT-compiled attention variants, and a cost-model scheduler that load-balances variable-length requests.
  *Key concepts:* unified kernel interface, block-sparse-row KV cache, paged-KV abstraction, JIT user-defined functors, cost-model scheduler, MLA matrix absorption

<!-- resource-id: efficient-inference-serving__your-vllm-replicas-are-isolated-cache-islands-and-mooncake-fixes-that -->
- **[Your vLLM replicas are isolated cache islands and Mooncake fixes that](https://x.com/RedHat_AI/status/2086832585972359606)** · `Blog` · Unknown · *2026-08-23*
  Your vLLM replicas are isolated cache islands and Mooncake fixes that
  *Key concepts:* —

<!-- resource-id: efficient-inference-serving__lmcache-kv-cache-offloading-and-reuse -->
- **[LMCache: KV Cache Offloading and Reuse](https://github.com/LMCache/LMCache/tree/dev)** · `Repo` · LMCache contributors · *—*
  An engine-independent layer for storing and sharing KV caches across GPU, CPU, local, and remote storage. Its README describes persistent cache reuse, prefill/decode transfer, observability, and selective recomputation for non-prefix reuse.
  *Key concepts:* KV cache, Cache offloading, Prefix caching, Prefill-decode disaggregation, Inference serving

<!-- resource-id: efficient-inference-serving__how-prompt-caching-works -->
- **[How prompt caching works - Paged Attention and Automatic Prefix Caching plus practical tips](https://sankalp.bearblog.dev/how-prompt-caching-works)** · `Blog` · Sankalp · *2025-11-30*
  Connects practical prompt layout to vLLM's paged attention and automatic prefix caching. It distinguishes keeping a conversation prefix stable from reusing a shared prefix across requests, while explaining prefill/decode and memory-allocation mechanics.
  *Key concepts:* Prompt caching, PagedAttention, KV cache, Prefill-decode, vLLM

<!-- resource-id: efficient-inference-serving__prompt-caching-how-it-works-and-why-it-matters -->
- **[Prompt caching: 10x cheaper LLM tokens, but how?](https://ngrok.com/blog/prompt-caching)** · `Blog` · Sam Rose / ngrok · *2025-12-16*
  Uses an author's experiments to explain how shared prompt prefixes and KV-cache reuse affect inference cost and latency. Pricing examples and measured cache behavior are time- and provider-specific, so the enduring value is the cache mechanism and experiment design.
  *Key concepts:* Prompt caching, KV cache, Prefill-decode, Latency, Inference benchmarking

<!-- resource-id: efficient-inference-serving__moe-inference-engineering-clearly-explained -->
- **[MoE inference engineering, clearly explained](https://x.com/_avichawla/status/2100876555409039605)** · `Blog` · Avi Chawla / X article · *2026-09-18*
  Separates per-token activated parameters from the full weights a serving system must keep available. Traces expert routing toward grouped computation and cross-device communication, explaining why fewer executed FLOPs do not automatically imply lower end-to-end latency.
  *Key concepts:* MoE inference, Expert routing, Grouped GEMM, Expert parallelism, Memory footprint

<!-- resource-id: efficient-inference-serving__lmcache-quickstart-vllm-integration -->
- **[LMCache Quickstart: vLLM integration](https://docs.lmcache.ai/getting_started/quickstart.html)** · `Blog` · LMCache Project · *—*
  Explains vLLM integration with LMCache through a standalone multiprocess service or an in-process connector. A paired-request example shows shared prompt prefixes being stored and retrieved from the external cache, with distinct connector and version requirements.
  *Key concepts:* LMCache, vLLM, Prefix caching, KV cache reuse, Cache connectors

<!-- resource-id: efficient-inference-serving__kimi-k3-is-here-efficient-day-0-support-on-vllm -->
- **[Kimi K3 Is Here: Efficient Day-0 Support on vLLM](https://vllm.ai/blog/2026-07-27-k3)** · `Blog` · vLLM Team and Inferact · *2026-07-27*
  Explains serving a hybrid recurrent-attention MoE through coordinated KDA-state and paged-KV caches, fine-grained prefix reuse, fused residual/attention kernels, and prefill/decode disaggregation. Adds DSpark speculative decoding and selective cache retention. Its reported 3.14× single-user speedup is tied to SPEED Bench on 16 GB300 GPUs, not a general throughput guarantee or a hardware-independent deployment result.
  *Key concepts:* Kimi Delta Attention, Hybrid prefix caching, DSpark, Prefill/decode disaggregation, Cache retention


### Scaling, streaming & disaggregation
<!-- resource-id: efficient-inference-serving__go-big-or-go-oom-the-art-of-scaling-vllm -->
- **[Go big or go OOM: the art of scaling vLLM](https://www.ai21.com/blog/scaling-vllm-without-oom/)** · `Blog` · AI21 Labs · *2026-02-05*
  Tackles GPU underutilization in LLM-as-a-Judge deployments with single-node tuning plus multi-node autoscaling, hitting ~2x throughput; notably found 4-GPU TP beat both 1- and 8-GPU setups for their workload.
  *Key concepts:* continuous batching, max-num-seqs/max-num-batched-tokens tuning, tensor parallelism, NSGA-II auto-tuning, queue-based HPA

<!-- resource-id: efficient-inference-serving__streaming-requests-realtime-api-in-vllm -->
- **[Streaming Requests & Realtime API in vLLM](https://vllm.ai/blog/2026-01-31-streaming-realtime)** · `Blog` · vLLM · *2026-01-31*
  vLLM adds incremental streaming input and a WebSocket Realtime API for voice/transcription, using an "anchor request" pattern to preserve KV state across streamed chunks.
  *Key concepts:* StreamingInput interface, anchor request pattern, causal vs. bidirectional attention, sliding-window attention, WebSocket Realtime API

<!-- resource-id: efficient-inference-serving__lecture-58-disaggregated-llm-inference-video -->
- **[Lecture 58: Disaggregated LLM Inference (video)](https://www.youtube.com/watch?v=tIPDwUepXcA)** · `Video` · YouTube · *—* · ⚠️unverified
  A lecture on disaggregated inference — running prefill and decode on separate GPU pools — covering the motivation, KV-cache transfer between stages, and scheduling trade-offs.
  *Key concepts:* prefill/decode disaggregation, KV-cache transfer, resource pooling, TTFT vs. TPOT, interconnect bandwidth

<!-- resource-id: efficient-inference-serving__the-shift-to-distributed-llm-inference -->
- **[The Shift to Distributed LLM Inference: 3 Key Technologies Breaking Single-Node Bottlenecks](https://bentoml.com/blog/the-shift-to-distributed-llm-inference)** · `Blog` · Bo Jiang & Sherlock Xu / BentoML · *—*
  Explains three distributed-serving patterns: separating prefill from decode, routing according to cache utilization, and routing to workers with reusable prefixes. It frames these patterns around workload and memory tradeoffs rather than treating distribution as an automatic speedup.
  *Key concepts:* Distributed inference, Prefill-decode disaggregation, KV cache, Load balancing, Prefix routing

<!-- resource-id: efficient-inference-serving__data-parallel-vision-encoding-in-vllm -->
- **[Accelerating Multimodal Inference in vLLM: The One-Line Optimization for Large Multimodal Models](https://rocm.blogs.amd.com/software-tools-optimization/vllm-dp-vision/README.html)** · `Blog` · AMD ROCm engineering · *2026-01-02*
  Explores running vision encoders with data parallelism while the language decoder uses tensor parallelism. The design aims to avoid unnecessary communication in multimodal inference; reported gains are tied to the article's models and AMD hardware.
  *Key concepts:* Multimodal inference, Data parallelism, Tensor parallelism, Vision encoders, vLLM

<!-- resource-id: efficient-inference-serving__parallelism-strategies-for-llm-inference-clearly-explained -->
- **[Parallelism strategies for LLM inference, clearly explained](https://x.com/_avichawla/status/2107427400779026843)** · `Blog` · Avi Chawla / X article · *2026-10-06*
  Explains distributed inference as a data-placement problem across separate GPU memories. Compares partitioned state, replicated state, communication frequency, and service-level metrics so additional devices are evaluated against both capacity and latency constraints.
  *Key concepts:* Inference parallelism, Tensor parallelism, Pipeline parallelism, Collective communication, Service-level objectives


### Distributed AI inference series (Red Hat)
<!-- resource-id: efficient-inference-serving__designing-distributed-ai-inference-core-concepts-and-scaling-dimensions -->
- **[Designing distributed AI inference: Core concepts and scaling dimensions](https://developers.redhat.com/articles/2026/06/22/designing-distributed-ai-inference-core-concepts-and-scaling-dimensions)** · `Blog` · Red Hat Developers · *2026-06-22*
  Establishes mental models for distributed inference, centering the structural tension between compute-bound prefill and bandwidth-bound decode, and maps business KPIs to a five-dimensional parallelism framework.
  *Key concepts:* prefill vs. decode, 5D parallelism, decode context parallel (DCP), expert-parallel load balancing, KV-cache management, TTFT/TPOT/hit-rate KPIs

<!-- resource-id: efficient-inference-serving__optimizing-distributed-ai-inference-advanced-deployment-patterns -->
- **[Optimizing distributed AI inference: Advanced deployment patterns](https://developers.redhat.com/articles/2026/06/24/optimizing-distributed-ai-inference-advanced-deployment-patterns)** · `Blog` · Red Hat Developers · *2026-06-24*
  Examines three optimizations — prefill/decode disaggregation, KV-cache tiering/sharing, and speculative decoding — arguing they should be applied to measured traffic patterns rather than as universal defaults.
  *Key concepts:* P/D disaggregation, KV tiering (HBM/DRAM/NVMe), LMCache prefix sharing, cache-aware routing (llm-d), constrained-decoding acceptance collapse

<!-- resource-id: efficient-inference-serving__deploying-distributed-ai-inference-blueprints-troubleshooting -->
- **[Deploying distributed AI inference: Blueprints & troubleshooting](https://developers.redhat.com/articles/2026/06/26/deploying-distributed-ai-inference-blueprints-troubleshooting)** · `Blog` · Red Hat Developers · *2026-06-26*
  Presents six deployment blueprints matched to traffic patterns (from high-concurrency chat to single-GPU edge) plus troubleshooting recipes and a roadmap from single-node vLLM to multi-tenant AI grids.
  *Key concepts:* deployment blueprints, KV-cache tiering, speculative decoding, model cascading, SLO-aware admission control, llm-d scheduling

### Courses & quantization
<!-- resource-id: efficient-inference-serving__mit-6-5940-fall-2026-tinyml-efficient-ai-computing -->
- **[MIT 6.5940 Fall 2026 — TinyML and Efficient AI Computing](https://hanlab.mit.edu/courses/2026-fall-65940)** · `Course` · MIT HAN Lab · *2026*
  The official Fall 2026 course hub links the syllabus, lecture slides and videos, and labs on GPU basics, pruning, architecture search, quantization, and deploying an LLM on a laptop. It is the current offering, distinct from the Fall 2024 course already in the Library.
  *Key concepts:* efficient inference, pruning and sparsity, quantization, neural architecture search, GPU basics, on-device LLM deployment

<!-- resource-id: efficient-inference-serving__fast-efficient-llm-inference-with-vllm-deeplearning-ai -->
- **[Fast & Efficient LLM Inference with vLLM (DeepLearning.AI)](https://learn.deeplearning.ai/courses/fast-and-efficient-llm-inference-with-vllm/lesson/rm60gb/introduction)** · `Course` · DeepLearning.AI × Red Hat · *—*
  A hands-on course on deploying open-source LLMs efficiently with vLLM, teaching quantization, PagedAttention, and serving strategies with benchmarking to balance latency, throughput, and quality.
  *Key concepts:* PagedAttention, quantization, KV-cache management, continuous batching, prefix caching, GuideLLM/LM-Eval benchmarking

<!-- resource-id: efficient-inference-serving__efficient-model-serving-mlss-alex-smola-video -->
- **[Efficient Model Serving (MLSS, Alex Smola) — video](https://www.youtube.com/watch?v=XIY2lAsZLt8)** · `Video` · YouTube (MLSS) · *—* · ⚠️unverified
  An MLSS lecture by Alex Smola on efficient model serving, covering the systems and hardware considerations behind serving models at scale. [Slides](https://alex.smola.org/posts/45-mlss-efficiency/main.pdf).
  *Key concepts:* model serving systems, hardware accelerators, batching, latency vs. throughput, memory hierarchy

<!-- resource-id: efficient-inference-serving__reverse-engineering-gguf-post-training-quantization-video -->
- **[Reverse-engineering GGUF | Post-Training Quantization (video)](https://www.youtube.com/watch?v=vW30o4U9BFE)** · `Video` · YouTube · *—* · ⚠️unverified
  A hands-on video dissecting the GGUF file format and how post-training quantization schemes (llama.cpp k-quants) pack weights, block scales, and metadata for efficient inference.
  *Key concepts:* GGUF format, post-training quantization, block-wise k-quants, weight/scale packing, llama.cpp

<!-- resource-id: efficient-inference-serving__interview-llm-inference-pdf -->
- **[Interview: LLM Inference (PDF)](https://drive.google.com/file/d/1mfTzOnwn8yx4eKObjPvpd-B_toGkQ_tu/view)** · `Paper` · Google Drive · *—* · ⚠️unverified
  An interview-prep document on LLM inference fundamentals, covering the metrics, memory, and optimization concepts commonly asked about in ML-systems/inference interviews.
  *Key concepts:* prefill/decode, KV cache, batching, quantization, TTFT/TPOT, tensor parallelism

<!-- resource-id: efficient-inference-serving__inference-engineer-book -->
- **[Inference Engineer Book](https://www.baseten.co/inference-engineering/)** · `Book` · Unknown · *2026-08-23*
  Inference Engineer Book 1
  *Key concepts:* —

### More engine internals & tutorials
<!-- resource-id: efficient-inference-serving__understanding-high-throughput-llm-inference-systems-vllm-architecture-deep-dive -->
- **[Understanding High Throughput LLM Inference Systems (vLLM architecture deep dive)](https://aerlabs.tech/blogs/vllm-architecture-deep-dive)** · `Blog` · AER Labs · *2025-01-09*
  A systems-engineering deep dive into how vLLM reclaims the GPU VRAM wasted by naive serving, arguing its throughput comes from four combined innovations rather than a single breakthrough.
  *Key concepts:* PagedAttention, preemptive scheduling, prefill/decode specialization, guided decoding, KV cache block pooling

<!-- resource-id: efficient-inference-serving__ml-systems-infrastructure-tutorial-mlsys-for-dummies -->
- **[ML Systems Infrastructure Tutorial (mlsys for dummies)](https://abhishekmaiti.com/mlsys-for-dummies)** · `Course` · Abhishek Maiti · *—*
  A hands-on 14-chapter tutorial taking readers from distributed primitives to production RLHF, aimed at those fluent in PyTorch but new to distributed systems.
  *Key concepts:* NCCL communication primitives, training parallelism (DDP/FSDP/tensor/pipeline), KV cache management, prefill/decode inference lifecycle, RLHF multi-model orchestration

<!-- resource-id: efficient-inference-serving__vllm-from-scratch-with-flexattention -->
- **[vLLM from scratch with FlexAttention](https://jonathanc.net/blog/vllm-flex-attention-from-scratch)** · `Blog` · Jonathan C. · *2025-08-07*
  Documents the flex-nano-vllm project: building a minimal vLLM-style inference engine on PyTorch FlexAttention in ~1000 lines that reaches roughly 90% of production vLLM performance.
  *Key concepts:* FlexAttention BlockMask, paged attention, dynamic KV cache updates, CUDA graph capture, request preemption

<!-- resource-id: efficient-inference-serving__sglang-cookbook -->
- **[SGLang Cookbook](https://cookbook.sglang.io/)** · `Repo` · SGLang · *—*
  A community-maintained collection of practical deployment guides and benchmarks answering how to run SGLang and related models on specific hardware for specific tasks.
  *Key concepts:* autoregressive model serving, diffusion model serving, hardware-specific deployment, benchmarking, production configuration

<!-- resource-id: efficient-inference-serving__ray-data-llm-enables-2x-throughput-over-vllm -->
- **[Ray Data LLM enables 2x throughput over vLLM](https://www.anyscale.com/blog/ray-data-llm-2x-throughput-vs-vllm)** · `Blog` · Anyscale · *—*
  Explains how Ray Data LLM doubles offline batch-inference throughput versus vLLM's synchronous engine by combining asynchronous execution at both batch and token levels with streaming datasets.
  *Key concepts:* asynchronous batch execution, token-level continuous batching, streaming data processing, pipeline disaggregation, fault tolerance

<!-- resource-id: efficient-inference-serving__inside-sglang-architecture-deep-dive -->
- **[SGLang Deep Dive: Inside SGLang](https://blog.sugiv.fyi/sglang-deep-dive-inside-sglang)** · `Blog` · SugiV · *2025-09-27*
  A code-oriented walkthrough of SGLang's serving architecture, including scheduling, prefix reuse, and structured generation. It targets the author's examined v0.5.2 implementation, so current internals may differ.
  *Key concepts:* SGLang, RadixAttention, Scheduling, Prefix caching, Structured generation

<!-- resource-id: efficient-inference-serving__sglang-efficient-execution-of-structured-language-model-programs -->
- **[Fast and Expressive LLM Inference with RadixAttention and SGLang](https://lmsys.org/blog/2024-01-17-sglang)** · `Blog` · LMSYS / SGLang authors · *2024-01-17*
  Introduces SGLang's co-designed programming interface and execution runtime. RadixAttention reuses KV caches across shared prefixes in structured language-model programs; the original performance comparisons are tied to the tested models and hardware.
  *Key concepts:* SGLang, RadixAttention, KV cache, Structured generation, Inference serving

<!-- resource-id: efficient-inference-serving__inside-vllm-anatomy-of-a-high-throughput-llm-inference-system -->
- **[Inside vLLM: Anatomy of a High-Throughput LLM Inference System](https://aleksagordic.com/blog/vllm)** · `Blog` · Aleksa Gordić · *—*
  Builds a mental model of vLLM from engine construction and scheduling through caching, advanced decoding, and distributed serving. The analysis is pinned to commit 42172ad from August 9, 2025 and focuses on the V1 engine.
  *Key concepts:* vLLM, Scheduling, PagedAttention, Continuous batching, Distributed inference

<!-- resource-id: efficient-inference-serving__vllm-openai-compatible-server-code-walkthrough-part-1 -->
- **[vLLM OpenAI-Compatible Server: Code Walkthrough, Part 1](https://zerohertz.github.io/vllm-openai-1)** · `Blog` · Zerohertz · *2025-06-12*
  A code walkthrough following server startup from command-line arguments into vLLM's engine, executor, and worker components. It maps the API-serving path to execution layers and is best read alongside the version of source code examined.
  *Key concepts:* vLLM, Inference serving, Request lifecycle, Engine architecture, Code walkthrough

<!-- resource-id: efficient-inference-serving__continuous-batching-from-first-principles -->
- **[Continuous Batching from First Principles](https://huggingface.co/blog/continuous_batching)** · `Blog` · Rémi Ouazan Reboul, Arthur Zucker & Luc Georges / Hugging Face · *2025-11-25*
  Derives continuous batching from autoregressive generation, attention, and KV-cache reuse. It explains why replacing finished requests with new work can improve serving throughput and connects that mechanism to prefill and decode behavior.
  *Key concepts:* Continuous batching, KV cache, Autoregressive decoding, Throughput, Inference serving

<!-- resource-id: efficient-inference-serving__demystify-vllm-v1-kvconnector-sharedstorageconnector -->
- **[Demystify vLLM V1 KVconnector SharedStorageConnector](https://blog.diabloneo.com/demystify-vllm-v1-kvconnector-sharedstorageconnector-05a487627036)** · `Blog` · Coffee, Coke and Code · *2025-05-09*
  Walks through the vLLM V1 KV-connector interface using SharedStorageConnector as an example/debug implementation. Connects scheduler metadata, prefix-cache matching, and per-layer load/save calls to host-directory safetensors storage; the explanation describes the 2025 implementation rather than guaranteeing current API behavior.
  *Key concepts:* vLLM, KV cache, KV connectors, Prefix caching, Safetensors

<!-- resource-id: efficient-inference-serving__mastering-llm-techniques-inference-optimization -->
- **[Mastering LLM Techniques: Inference Optimization](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization)** · `Blog` · Shashank Verma and Neal Vaidya / NVIDIA · *2023-11-17*
  Organizes LLM inference around prompt processing, autoregressive decoding, memory capacity, and cache reuse. Surveys model parallelism, MQA/GQA, FlashAttention, paged KV management, quantization, and request scheduling. A useful map of distinct optimization layers: changing the model, changing a kernel, and changing the serving schedule have different compatibility and quality implications.
  *Key concepts:* Prefill and decode, KV caching, Model parallelism, PagedAttention, Inference scheduling


### Quantization, low-latency & KV compression
<!-- resource-id: efficient-inference-serving__cache-aware-prefill-decode-disaggregation-cpd-for-faster-long-context-serving -->
- **[Cache-aware prefill–decode disaggregation (CPD) for faster long-context serving](https://www.together.ai/blog/cache-aware-disaggregated-inference)** · `Blog` · Together AI · *2026-03-04*
  Presents CPD, a serving architecture that separates cold (new context) from warm (cached) workloads and routes them across a distributed KV-cache hierarchy, yielding up to 40% higher throughput and lower TTFT on long-context workloads.
  *Key concepts:* cache-aware routing, three-level KV-cache hierarchy (GPU/DRAM/RDMA), prefill-decode disaggregation, workload isolation, reusability-based scheduling

<!-- resource-id: efficient-inference-serving__turboquant-the-math-behind-it -->
- **[TurboQuant: the math behind it](https://www.baseten.co/blog/i-spent-31-hours-on-the-math-behind-turboquant-so-you-dont-have-to/)** · `Blog` · Baseten · *2026-03-27*
  Walks through PolarQuant, the math underpinning TurboQuant, which achieves over 4.2x KV-cache compression via random preconditioning and recursive polar transforms with analytically precomputed codebooks that need no calibration data.
  *Key concepts:* KV cache compression, random preconditioning, recursive polar transformation, angle-distribution clustering, analytical codebooks, multi-level quantization

<!-- resource-id: efficient-inference-serving__a-guide-to-quantization -->
- **[A guide to quantization](https://ngrok.com/blog/quantization)** · `Blog` · ngrok · *2026-03-25*
  A ground-up guide to LLM quantization showing how it cuts model size ~4x and roughly doubles speed with only 5-10% accuracy loss, validated across perplexity, KL divergence, and benchmarks.
  *Key concepts:* floating-point formats (fp32/fp16/bf16/fp8/fp4), symmetric vs asymmetric quantization, block-based outlier handling, quality measurement (perplexity/KL divergence)

<!-- resource-id: efficient-inference-serving__low-latency-inference-with-speculative-decoding-corsair -->
- **[Low latency inference with speculative decoding (Corsair)](https://gimletlabs.ai/blog/low-latency-spec-decode-corsair)** · `Blog` · Gimlet Labs · *2026-03-11*
  Shows that offloading speculative decoding from GPU to d-Matrix's SRAM-centric Corsair accelerator (2GB on-chip, 150 TB/s bandwidth) delivers 2-10x request-latency improvements when serving gpt-oss-120b.
  *Key concepts:* speculative decoding, SRAM-centric accelerators, heterogeneous inference, draft-length vs acceptance-rate tradeoff, prefill-decode disaggregation

<!-- resource-id: efficient-inference-serving__how-to-serve-big-llm-over-decentralized-gpus-parallax-dynamic-programming -->
- **[How to Serve Big LLM over Decentralized GPUs (Parallax + Dynamic Programming)](https://www.youtube.com/watch?v=xFADPHDHLhI)** · `Video` · YouTube · *—* · ⚠️unverified
  A talk on serving large language models across decentralized, heterogeneous GPU pools using the Parallax framework, applying dynamic programming to partition and schedule model layers across distributed nodes.
  *Key concepts:* decentralized GPU serving, Parallax framework, dynamic-programming layer partitioning, heterogeneous hardware scheduling, distributed inference

<!-- resource-id: efficient-inference-serving__i-quants-vector-quantization-in-gguf -->
- **[I-Quants: Vector Quantization in GGUF](https://github.com/iuliaturc/gguf-docs/blob/main/i-quants.md)** · `Repo` · Iulia Turc / gguf-docs · *—*
  Explains how importance-aware vector quantization differs from earlier scalar GGUF quantizers, including codebooks, scaling, and sign encoding. This is an author's conceptual guide linked to a particular llama.cpp revision, not an official specification for every quantization subtype.
  *Key concepts:* Quantization, GGUF, Vector quantization, Codebooks, llama.cpp

<!-- resource-id: efficient-inference-serving__disaggregated-quantization-specializing-llm-prefill-and-decode -->
- **[Disaggregated Quantization: Specializing LLM Prefill and Decode](https://arxiv.org/abs/2609.26333)** · `Paper` · Andrei Panferov, Maximilian Kleinegger et al. / arXiv · *2026-09-22*
  Specializes quantization formats, weights, and storage placement separately for prompt processing and token generation. The abstract connects compute-oriented prefill quantization with bandwidth-oriented decode compression and explores offloading the additional prefill checkpoint; benefits depend on workload and sequence length.
  *Key concepts:* Quantization, Prefill-decode separation, Weight offloading, NVFP4, Inference efficiency

<!-- resource-id: efficient-inference-serving__mixed-precision-quantization-for-language-models-techniques-and-prospects -->
- **[Mixed-Precision Quantization for Language Models: Techniques and Prospects](https://arxiv.org/abs/2510.16805)** · `Paper` · Mariam Rakka, Marios Fournarakis et al. / arXiv · *2025-10-19*
  Surveys mixed-precision quantization by how precision is allocated across layers and within weights, activations, and KV caches. The abstract emphasizes accuracy–efficiency trade-offs, quantization granularity, and hardware-aware deployment challenges rather than recommending one universally best bit allocation.
  *Key concepts:* Mixed-precision quantization, Bit allocation, Activation quantization, KV cache quantization, Hardware-aware compression


### Serving workloads & load balancing
<!-- resource-id: llm-architecture-scaling-laws__a-year-in-llm-serving-workload-evolution-caching-and-load-balancing -->
- **[A Year in LLM Serving: Workload Evolution, Caching and Load-Balancing](https://arxiv.org/abs/2608.13573)** · `Paper` · Paper · *2026-08-23*
  A Year in LLM Serving: Workload Evolution, Caching and Load-Balancing
  *Key concepts:* —

<!-- resource-id: efficient-inference-serving__mooncake-store-for-agentic-kv-cache-reuse-in-vllm -->
- **[Serving Agentic Workloads at Scale with vLLM x Mooncake](https://vllm.ai/blog/2026-05-06-mooncake-store)** · `Blog` · Yifan Qiao, Trong Dao Le, Ao Shen, Zhewen Li & Bowen Wang / vLLM · *2026-05-06*
  Describes a distributed KV-cache store integrated with vLLM to preserve reusable prefixes across agent turns. Trace-based experiments study latency and cache behavior; the reported speedups depend on the workload, storage, and baseline configuration.
  *Key concepts:* vLLM, Mooncake, KV cache, Prefix caching, Agentic workloads

<!-- resource-id: efficient-inference-serving__investigating-vllm-request-latency -->
- **[vLLM - Why Requests Take Hours Under Load](https://blog.dotieuthien.com/posts/vllm)** · `Blog` · Thien Do · *2025-01-14*
  A firsthand investigation of extreme request latency in vLLM, connecting queue behavior to KV-cache pressure and preemption. It provides a concrete debugging case for understanding scheduling and memory constraints rather than a universal description of every vLLM release.
  *Key concepts:* vLLM, Scheduling, KV cache, Preemption, Latency debugging

<!-- resource-id: efficient-inference-serving__benchmarking-llm-inference-at-scale-with-aiperf -->
- **[Benchmarking LLM Inference at Scale with AIPerf](https://developer.nvidia.com/blog/benchmarking-llm-inference-at-scale-with-aiperf)** · `Blog` · Francesco Di Natale et al. / NVIDIA · *2026-09-18*
  Explains AIPerf's multiprocess load-generation design and why a benchmark client must avoid becoming the bottleneck. Walks through workload shaping and streaming measurements, distinguishing first-token and inter-token latency from whole-request throughput.
  *Key concepts:* Inference benchmarking, Load generation, TTFT, Inter-token latency, Workload replay


### Determinism & reproducibility
<!-- resource-id: thinking-machines-lab__defeating-nondeterminism-in-llm-inference -->
- **[Defeating Nondeterminism in LLM Inference](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)** · `Blog` · Thinking Machines · *2025-09-10*
  Argues that LLM inference nondeterminism comes mainly from batch-size-dependent kernels rather than floating-point concurrency, and shows how batch-invariant kernels for RMSNorm, matmul, and attention yield fully reproducible outputs and enable true on-policy RL.
  *Key concepts:* floating-point non-associativity, batch invariance, data-parallel reduction, split-KV attention, run-to-run determinism
