# Efficient Inference & Serving

[[Library|← Back to Library index]] · Related: [[GPU, CUDA & Kernels]] · [[Async & Infrastructure RL]] · [[Distributed & Parallel Training]]

Efficient inference and serving is where model quality meets production economics: how you turn weights into fast, cheap tokens. These references trace the full stack — building minimal engines from scratch (nano-vLLM, mini-SGLang), the newest speculative-decoding research (block diffusion, DFlash), KV-cache and MoE kernel internals, and the distributed/disaggregated patterns that scale serving across nodes.

**Suggested reading order:** Inside Nano-vLLM (Part 1) → mini-SGLang → speculative decoding (DFlash + Spec V2) → KV-cache infra problems → Red Hat distributed-inference series.

### Build engines from scratch (vLLM / SGLang)
- **[Understanding LLM Inference Engines: Inside Nano-vLLM (Part 1)](https://neutree.ai/blog/nano-vllm-part-1)** · `Blog` · Neutree AI · *2026-02-01*
  A walkthrough of Nano-vLLM, a ~1,200-line yet production-grade inference engine, built around a producer-consumer Scheduler that batches sequences through prefill and decode phases.
  *Key concepts:* producer-consumer scheduling, prefill vs. decode, block-based KV memory, tensor parallelism, CUDA graphs
- **[Building Mini-vLLM (nano-vllm blog)](https://github.com/ovshake/nano-vllm/blob/main/BLOG.md)** · `Repo` · GitHub (ovshake) · *—*
  An educational guide to nano-vllm, a minimalist LLM inference engine demonstrating PagedAttention and continuous batching, with interactive learning modes to reveal how modern engines work internally.
  *Key concepts:* PagedAttention, continuous batching, prefix caching, speculative decoding, chunked prefill, FlashAttention
- **[mini-SGLang (learn SGLang from scratch)](https://github.com/sgl-project/mini-sglang)** · `Repo` · GitHub (sgl-project) · *—*
  A compact ~5,000-line Python reimplementation of SGLang meant to demystify modern LLM serving, delivering high-performance serving behind an OpenAI-compatible API.
  *Key concepts:* radix cache, tensor parallelism, chunked prefill, overlap scheduling, FlashInfer integration
- **[Tracing vLLM & SGLang internals (LinkedIn post)](https://www.linkedin.com/feed/update/urn:li:activity:7413999777731772416/)** · `Blog` · LinkedIn · *—* · ⚠️unverified
  A practitioner post on instrumenting and tracing the request lifecycle inside vLLM and SGLang to understand scheduling, batching, and kernel dispatch behavior in production.
  *Key concepts:* engine tracing, request lifecycle, scheduler internals, batching, profiling

### Speculative decoding
- **[DSpark: Confidence-Scheduled Speculative Decoding with Semi-Autoregressive Generation](https://github.com/deepseek-ai/DeepSpec/blob/main/DSpark_paper.pdf)** · `Paper` · DeepSeek (GitHub) · *—* · ⚠️unverified
  DeepSeek's DSpark accelerates decoding by combining confidence-based scheduling of draft acceptance with semi-autoregressive (multi-token block) generation, adaptively deciding how aggressively to draft based on model confidence.
  *Key concepts:* confidence scheduling, semi-autoregressive generation, draft acceptance, lossless acceleration, multi-token blocks
- **[DSpark explained (video)](https://www.youtube.com/watch?v=eFgknPFK-g0)** · `Video` · YouTube · *—* · ⚠️unverified
  A video explainer walking through DSpark's confidence-scheduled speculative decoding and why it speeds up inference at no quality cost.
  *Key concepts:* speculative decoding, DeepSeek DSpark, draft-and-verify, inference speedup
- **[DFlash: Block Diffusion for Flash Speculative Decoding](https://arxiv.org/pdf/2602.06036)** · `Paper` · arXiv · *2026-05-28*
  DFlash uses a lightweight block-diffusion draft model to generate candidate tokens in parallel (rather than sequentially), conditioning on the target model's context features and verifying in parallel to reach over 6x lossless acceleration and up to 2.5x higher speedup than EAGLE-3.
  *Key concepts:* block diffusion drafting, parallel generation, context feature conditioning, acceptance-rate optimization, lossless speculative decoding
- **[The next generation of speculative decoding: DFlash and Spec V2 (LMSYS)](https://www.lmsys.org/blog/2026-06-15-next-generation-speculative-decoding-dflash-v2/)** · `Blog` · LMSYS · *2026-06-15*
  Z Lab, Modal, and the SGLang team present DFlash — parallel block-diffusion drafting with KV-cache injection — paired with SGLang's Spec V2 engine, reporting higher throughput than both the baseline and native MTP on a Qwen 3.5 397B-A17B draft.
  *Key concepts:* block diffusion, KV-cache injection, Spec V2 overlap scheduler, acceptance length vs. drafting cost, parallel verification

### KV cache, MoE & kernels for inference
- **[KV-cache compression and its infra problems (NVIDIA)](https://research.nvidia.com/labs/eai/blogs/kv-cache-compression-and-its-infra-problems/)** · `Blog` · NVIDIA Research · *2026-06-12*
  Examines why KV-cache compression fails in production: FlashAttention never materializes the attention scores that eviction methods depend on, and paged allocators can't reclaim fragmented blocks. TriAttention sidesteps both, reaching 2.5x faster decode and 10.7x KV reduction.
  *Key concepts:* KV-cache eviction, attention-score dependency, paged-attention fragmentation, pre-RoPE geometry, forward-packing compaction
- **[The vLLM MoE Playbook: TP, DP, PP and Expert Parallelism (AMD ROCm)](https://rocm.blogs.amd.com/software-tools-optimization/vllm-moe-guide/README.html)** · `Blog` · AMD ROCm · *2025-11-24*
  A parallelism decision guide for serving MoE models on vLLM/MI300X, benchmarking DeepSeek-R1, Qwen3, and Llama-4; shows TP+EP wins low-concurrency latency while DP+EP scales throughput.
  *Key concepts:* tensor/data/pipeline/expert parallelism, DP attention, expert activation density, MLA/MQA KV duplication, AllToAll vs. AllReduce
- **[MoE as Dense GEMM: Optimizing Low-Latency MoE Inference on NVIDIA Blackwell](https://github.com/NVIDIA/TensorRT-LLM/blob/main/docs/source/blogs/tech_blog/blog24_MoE_as_Dense_GEMM.md)** · `Blog` · NVIDIA (TensorRT-LLM) · *—*
  Introduces DENSEGEMM, reformulating routed-expert compute as a single large dense GEMM with per-token alpha masks; in the memory-bound low-latency regime the extra arithmetic is nearly free, yielding up to 1.12x speedup on DeepSeek-V3-style models.
  *Key concepts:* dense GEMM reformulation, memory-bound regime, NVFP4 quantization, CuTe DSL kernels, alpha masking, Blackwell tcgen05 MMA
- **[Dissecting FlashInfer — A Systems Perspective on High-Performance LLM Inference](https://ydnyshhh.github.io/posts/flash_infer/)** · `Blog` · ydnyshhh.github.io · *2025-10-09*
  A systems deep dive into FlashInfer as a unified attention-kernel interface, covering its block-sparse KV-cache format, JIT-compiled attention variants, and a cost-model scheduler that load-balances variable-length requests.
  *Key concepts:* unified kernel interface, block-sparse-row KV cache, paged-KV abstraction, JIT user-defined functors, cost-model scheduler, MLA matrix absorption

### Scaling, streaming & disaggregation
- **[Go big or go OOM: the art of scaling vLLM](https://www.ai21.com/blog/scaling-vllm-without-oom/)** · `Blog` · AI21 Labs · *2026-02-05*
  Tackles GPU underutilization in LLM-as-a-Judge deployments with single-node tuning plus multi-node autoscaling, hitting ~2x throughput; notably found 4-GPU TP beat both 1- and 8-GPU setups for their workload.
  *Key concepts:* continuous batching, max-num-seqs/max-num-batched-tokens tuning, tensor parallelism, NSGA-II auto-tuning, queue-based HPA
- **[Streaming Requests & Realtime API in vLLM](https://vllm.ai/blog/2026-01-31-streaming-realtime)** · `Blog` · vLLM · *2026-01-31*
  vLLM adds incremental streaming input and a WebSocket Realtime API for voice/transcription, using an "anchor request" pattern to preserve KV state across streamed chunks.
  *Key concepts:* StreamingInput interface, anchor request pattern, causal vs. bidirectional attention, sliding-window attention, WebSocket Realtime API
- **[Lecture 58: Disaggregated LLM Inference (video)](https://www.youtube.com/watch?v=tIPDwUepXcA)** · `Video` · YouTube · *—* · ⚠️unverified
  A lecture on disaggregated inference — running prefill and decode on separate GPU pools — covering the motivation, KV-cache transfer between stages, and scheduling trade-offs.
  *Key concepts:* prefill/decode disaggregation, KV-cache transfer, resource pooling, TTFT vs. TPOT, interconnect bandwidth
- **[harness-optimization (HF Space)](https://huggingface.co/spaces/joelniklaus/harness-optimization)** · `Repo` · Hugging Face Spaces · *—* · ⚠️unverified
  A Space titled "Don't Train the Model, Evolve the Harness," exploring improving system performance by optimizing/evolving the inference-and-eval harness rather than retraining the model itself.
  *Key concepts:* harness optimization, evolutionary search, eval infrastructure, inference-time improvement

### Distributed AI inference series (Red Hat)
- **[Designing distributed AI inference: Core concepts and scaling dimensions](https://developers.redhat.com/articles/2026/06/22/designing-distributed-ai-inference-core-concepts-and-scaling-dimensions)** · `Blog` · Red Hat Developers · *2026-06-22*
  Establishes mental models for distributed inference, centering the structural tension between compute-bound prefill and bandwidth-bound decode, and maps business KPIs to a five-dimensional parallelism framework.
  *Key concepts:* prefill vs. decode, 5D parallelism, decode context parallel (DCP), expert-parallel load balancing, KV-cache management, TTFT/TPOT/hit-rate KPIs
- **[Optimizing distributed AI inference: Advanced deployment patterns](https://developers.redhat.com/articles/2026/06/24/optimizing-distributed-ai-inference-advanced-deployment-patterns)** · `Blog` · Red Hat Developers · *2026-06-24*
  Examines three optimizations — prefill/decode disaggregation, KV-cache tiering/sharing, and speculative decoding — arguing they should be applied to measured traffic patterns rather than as universal defaults.
  *Key concepts:* P/D disaggregation, KV tiering (HBM/DRAM/NVMe), LMCache prefix sharing, cache-aware routing (llm-d), constrained-decoding acceptance collapse
- **[Deploying distributed AI inference: Blueprints & troubleshooting](https://developers.redhat.com/articles/2026/06/26/deploying-distributed-ai-inference-blueprints-troubleshooting)** · `Blog` · Red Hat Developers · *2026-06-26*
  Presents six deployment blueprints matched to traffic patterns (from high-concurrency chat to single-GPU edge) plus troubleshooting recipes and a roadmap from single-node vLLM to multi-tenant AI grids.
  *Key concepts:* deployment blueprints, KV-cache tiering, speculative decoding, model cascading, SLO-aware admission control, llm-d scheduling

### Courses & quantization
- **[Fast & Efficient LLM Inference with vLLM (DeepLearning.AI)](https://learn.deeplearning.ai/courses/fast-and-efficient-llm-inference-with-vllm/lesson/rm60gb/introduction)** · `Course` · DeepLearning.AI × Red Hat · *—*
  A hands-on course on deploying open-source LLMs efficiently with vLLM, teaching quantization, PagedAttention, and serving strategies with benchmarking to balance latency, throughput, and quality.
  *Key concepts:* PagedAttention, quantization, KV-cache management, continuous batching, prefix caching, GuideLLM/LM-Eval benchmarking
- **[Efficient Model Serving (MLSS, Alex Smola) — video](https://www.youtube.com/watch?v=XIY2lAsZLt8)** · `Video` · YouTube (MLSS) · *—* · ⚠️unverified
  An MLSS lecture by Alex Smola on efficient model serving, covering the systems and hardware considerations behind serving models at scale. [Slides](https://alex.smola.org/posts/45-mlss-efficiency/main.pdf).
  *Key concepts:* model serving systems, hardware accelerators, batching, latency vs. throughput, memory hierarchy
- **[Reverse-engineering GGUF | Post-Training Quantization (video)](https://www.youtube.com/watch?v=vW30o4U9BFE)** · `Video` · YouTube · *—* · ⚠️unverified
  A hands-on video dissecting the GGUF file format and how post-training quantization schemes (llama.cpp k-quants) pack weights, block scales, and metadata for efficient inference.
  *Key concepts:* GGUF format, post-training quantization, block-wise k-quants, weight/scale packing, llama.cpp
- **[Interview: LLM Inference (PDF)](https://drive.google.com/file/d/1mfTzOnwn8yx4eKObjPvpd-B_toGkQ_tu/view)** · `Paper` · Google Drive · *—* · ⚠️unverified
  An interview-prep document on LLM inference fundamentals, covering the metrics, memory, and optimization concepts commonly asked about in ML-systems/inference interviews.
  *Key concepts:* prefill/decode, KV cache, batching, quantization, TTFT/TPOT, tensor parallelism

### More engine internals & tutorials
- **[Understanding High Throughput LLM Inference Systems (vLLM architecture deep dive)](https://aerlabs.tech/blogs/vllm-architecture-deep-dive)** · `Blog` · AER Labs · *2025-01-09*
  A systems-engineering deep dive into how vLLM reclaims the GPU VRAM wasted by naive serving, arguing its throughput comes from four combined innovations rather than a single breakthrough.
  *Key concepts:* PagedAttention, preemptive scheduling, prefill/decode specialization, guided decoding, KV cache block pooling
- **[ML Systems Infrastructure Tutorial (mlsys for dummies)](https://abhishekmaiti.com/mlsys-for-dummies)** · `Course` · Abhishek Maiti · *—*
  A hands-on 14-chapter tutorial taking readers from distributed primitives to production RLHF, aimed at those fluent in PyTorch but new to distributed systems.
  *Key concepts:* NCCL communication primitives, training parallelism (DDP/FSDP/tensor/pipeline), KV cache management, prefill/decode inference lifecycle, RLHF multi-model orchestration
- **[vLLM from scratch with FlexAttention](https://jonathanc.net/blog/vllm-flex-attention-from-scratch)** · `Blog` · Jonathan C. · *2025-08-07*
  Documents the flex-nano-vllm project: building a minimal vLLM-style inference engine on PyTorch FlexAttention in ~1000 lines that reaches roughly 90% of production vLLM performance.
  *Key concepts:* FlexAttention BlockMask, paged attention, dynamic KV cache updates, CUDA graph capture, request preemption
- **[SGLang Cookbook](https://cookbook.sglang.io/)** · `Repo` · SGLang · *—*
  A community-maintained collection of practical deployment guides and benchmarks answering how to run SGLang and related models on specific hardware for specific tasks.
  *Key concepts:* autoregressive model serving, diffusion model serving, hardware-specific deployment, benchmarking, production configuration
- **[Ray Data LLM enables 2x throughput over vLLM](https://www.anyscale.com/blog/ray-data-llm-2x-throughput-vs-vllm)** · `Blog` · Anyscale · *—*
  Explains how Ray Data LLM doubles offline batch-inference throughput versus vLLM's synchronous engine by combining asynchronous execution at both batch and token levels with streaming datasets.
  *Key concepts:* asynchronous batch execution, token-level continuous batching, streaming data processing, pipeline disaggregation, fault tolerance

### Quantization, low-latency & KV compression
- **[Cache-aware prefill–decode disaggregation (CPD) for faster long-context serving](https://www.together.ai/blog/cache-aware-disaggregated-inference)** · `Blog` · Together AI · *2026-03-04*
  Presents CPD, a serving architecture that separates cold (new context) from warm (cached) workloads and routes them across a distributed KV-cache hierarchy, yielding up to 40% higher throughput and lower TTFT on long-context workloads.
  *Key concepts:* cache-aware routing, three-level KV-cache hierarchy (GPU/DRAM/RDMA), prefill-decode disaggregation, workload isolation, reusability-based scheduling
- **[TurboQuant: the math behind it](https://www.baseten.co/blog/i-spent-31-hours-on-the-math-behind-turboquant-so-you-dont-have-to/)** · `Blog` · Baseten · *2026-03-27*
  Walks through PolarQuant, the math underpinning TurboQuant, which achieves over 4.2x KV-cache compression via random preconditioning and recursive polar transforms with analytically precomputed codebooks that need no calibration data.
  *Key concepts:* KV cache compression, random preconditioning, recursive polar transformation, angle-distribution clustering, analytical codebooks, multi-level quantization
- **[A guide to quantization](https://ngrok.com/blog/quantization)** · `Blog` · ngrok · *2026-03-25*
  A ground-up guide to LLM quantization showing how it cuts model size ~4x and roughly doubles speed with only 5-10% accuracy loss, validated across perplexity, KL divergence, and benchmarks.
  *Key concepts:* floating-point formats (fp32/fp16/bf16/fp8/fp4), symmetric vs asymmetric quantization, block-based outlier handling, quality measurement (perplexity/KL divergence)
- **[Low latency inference with speculative decoding (Corsair)](https://gimletlabs.ai/blog/low-latency-spec-decode-corsair)** · `Blog` · Gimlet Labs · *2026-03-11*
  Shows that offloading speculative decoding from GPU to d-Matrix's SRAM-centric Corsair accelerator (2GB on-chip, 150 TB/s bandwidth) delivers 2-10x request-latency improvements when serving gpt-oss-120b.
  *Key concepts:* speculative decoding, SRAM-centric accelerators, heterogeneous inference, draft-length vs acceptance-rate tradeoff, prefill-decode disaggregation
- **[How to Serve Big LLM over Decentralized GPUs (Parallax + Dynamic Programming)](https://www.youtube.com/watch?v=xFADPHDHLhI)** · `Video` · YouTube · *—* · ⚠️unverified
  A talk on serving large language models across decentralized, heterogeneous GPU pools using the Parallax framework, applying dynamic programming to partition and schedule model layers across distributed nodes.
  *Key concepts:* decentralized GPU serving, Parallax framework, dynamic-programming layer partitioning, heterogeneous hardware scheduling, distributed inference
