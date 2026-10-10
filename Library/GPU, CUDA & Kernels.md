# GPU, CUDA & Kernels

[[Library|← Back to Library index]] · Related: [[Distributed Training]] · [[Inference & Serving]]

Curated resources for going deep on GPU programming — from CUDA fundamentals and parallel-computing courses through matmul/GEMM kernel engineering, Triton, FlashAttention internals, and PyTorch profiling. Emphasis is on understanding the hardware (memory hierarchy, warps, tensor cores) and translating that into fast kernels.

### FlashAttention internals
<!-- resource-id: efficient-inference-serving__flash-attn -->
- **[FLASH ATTN](https://hebiao064.github.io/flash-attn#what-is-flash-attention)** · `Paper` · Unknown · *2026-08-24* · ⭐
  FLASH ATTN TUTORIAL
  *Key concepts:* —

<!-- resource-id: gpu-cuda-kernels__visualize-flashattention-to-understand-memory -->
- **[Visualize FlashAttention to understand (memory)](https://winterrykim.github.io/blog/2026/training-lm-from-scratch-part2-flashattention-memory/)** · `Blog` · winterrykim.github.io · *2026-06-23*
  Explains how FlashAttention avoids materializing the full attention-score matrix in device memory, using tiling, online softmax, and selective recomputation to reach identical results with far better memory access patterns.
  *Key concepts:* IO-awareness, online softmax, tiling strategy, log-sum-exp (LSE) saving, backward recomputation tradeoff, FlashAttention-2 loop reordering

<!-- resource-id: gpu-cuda-kernels__flash-attention-series-mastering-softmax -->
- **[Flash Attention Series — Mastering Softmax](https://jino-rohit.github.io/blogs/05_softmax.html)** · `Blog` · jino-rohit.github.io · *2026-04-09*
  Walks through four progressively optimized softmax implementations that underpin FlashAttention, from naive to safe to online to blocked softmax, showing how each reduces HBM access and improves stability.
  *Key concepts:* numerical stability (max-subtraction), online softmax, blocked softmax, HBM vs SRAM tradeoffs, rescaling factor, parallel GPU computation

<!-- resource-id: gpu-cuda-kernels__flash-attention-derived-and-coded-from-first-principles-with-triton-video -->
- **[Flash Attention derived and coded from first principles with Triton (video)](https://www.youtube.com/watch?v=zy8ChVd_oTM)** · `Video` · YouTube (Umar Jamil) · *—* · ⚠️unverified
  A long-form tutorial deriving the FlashAttention algorithm mathematically from first principles and then implementing forward and backward passes as Triton kernels step by step.
  *Key concepts:* attention math derivation, online/safe softmax, tiling & blocks, Triton kernel programming, forward & backward pass, GPU memory hierarchy

<!-- resource-id: gpu-cuda-kernels__kda-doesn-t-care-about-the-future -->
- **[KDA Doesn't Care About the Future](https://drisspg.github.io/nuggets/KDA-Future-Token-Leakage)** · `Blog` · drisspg · *2026-09-15*
  Investigates how a chunked Kimi Delta Attention implementation can introduce a subtle train–inference causality mismatch through numerical choices. Connects recurrent and chunkwise formulations to kernel engineering and describes using TorchTitan to test whether a model can exploit the mismatch.
  *Key concepts:* Kimi Delta Attention, Causality, Numerical precision, Chunkwise recurrence, Train-inference mismatch


### CUDA fundamentals & courses
<!-- resource-id: gpu-cuda-kernels__cuda-course-infatoshi -->
- **[CUDA Course (Infatoshi)](https://github.com/Infatoshi/cuda-course/tree/master)** · `Repo` · GitHub · *—*
  A comprehensive, structured CUDA programming course (Ubuntu/Linux-oriented) that takes learners from GPU basics through advanced kernel optimization, aiming to lower the barrier into high-performance computing.
  *Key concepts:* GPU architecture, CUDA kernel development, memory/bandwidth optimization, matmul optimization, PyTorch extensions & Triton, cuBLAS/cuDNN

<!-- resource-id: gpu-cuda-kernels__advanced-cuda-learning-curated-thread-comments -->
- **[Advanced CUDA learning (curated thread + comments)](https://x.com/goyal__pramod/status/2071642403023507498)** · `Blog` · X (Twitter) · *—* · ⚠️unverified
  A crowd-sourced thread curating advanced CUDA learning resources, with commenters adding books, courses, kernel repos, and blog posts for going beyond the basics.
  *Key concepts:* advanced CUDA, kernel optimization, learning roadmap, community-curated resources

<!-- resource-id: gpu-cuda-kernels__gpu-mode-youtube-channel -->
- **[GPU Mode (YouTube channel)](https://www.youtube.com/channel/UCJgIbYl6C5no72a0NUAPcTA)** · `Video` · YouTube · *—* · ⚠️unverified
  The channel of the GPU Mode (formerly CUDA Mode) community, hosting lecture-style talks on GPU programming, CUDA, Triton, performance optimization, and ML systems from practitioners and researchers.
  *Key concepts:* CUDA, Triton, kernel optimization, GPU performance, ML systems, community lectures

<!-- resource-id: gpu-cuda-kernels__stanford-cs149-parallel-computing -->
- **[Stanford CS149: Parallel Computing](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)** · `Course` · YouTube (Stanford, Kayvon Fatahalian & Kunle Olukotun) · *2023* · ⚠️unverified
  Stanford's undergraduate parallel-computing course (2023 offering), covering the principles and practice of programming parallel machines including multicore CPUs and GPUs.
  *Key concepts:* parallel programming models, SIMD/SIMT, multicore & GPU architecture, work distribution & scheduling, memory & synchronization, performance analysis

<!-- resource-id: gpu-cuda-kernels__the-feynman-gpu-lectures -->
- **[The Feynman GPU Lectures](https://www.dcbaslani.xyz/blog/gpu_masterclass/)** · `Blog` · dcbaslani.xyz · *2026-06-05*
  A progressive masterclass that builds GPU understanding from transistors and logic gates up through complete matrix-multiply implementations, tracing tensor-core evolution to Blackwell's fifth generation.
  *Key concepts:* SIMT execution & warps, memory-hierarchy latency & occupancy, tensor core evolution (WMMA→WGMMA→tcgen05), Blackwell TMEM, TMA & mbarrier async engines, FP4/microscaling precision tradeoffs

<!-- resource-id: gpu-cuda-kernels__different-cuda-cores-and-tensor-cores-wmma -->
- **[Different CUDA Cores and Tensor Cores (WMMA)](https://jino-rohit.github.io/blogs/04_wmma.html)** · `Blog` · jino-rohit.github.io · *2026-03-21*
  Introduces tensor cores and CUDA's warp-level WMMA API for high-performance matrix operations, with a complete working example of warp-level matrix multiplication.
  *Key concepts:* tensor cores (Volta), WMMA API (CUDA 9.0), fragment class, tile sizes (16×16×16), load/mma/store_matrix_sync, FMA throughput vs CUDA cores

<!-- resource-id: gpu-cuda-kernels__lecture-75-scaleml-series-gpu-programming-fundamentals-thunderkittens -->
- **[ Lecture 75 [ScaleML Series] GPU Programming Fundamentals + ThunderKittens](https://www.youtube.com/watch?v=Cl2B_hmg4gA&list=PLgE2fNm9NzK1yvZcVzuZXreyMB42AVeGl&index=5)** · `Blog` · ScaleML · *2026-08-06*
  Fundamental of GPU Programming
  *Key concepts:* —

<!-- resource-id: gpu-cuda-kernels__outperforming-cublas-on-b200 -->
- **[Outperforming cuBLAS on B200](https://www.paulwillchan.com/articles/outperforming-cublas-b200)** · `Blog` · Unknown · *2026-08-06*
  Outperforming cuBLAS on B200
  *Key concepts:* —

<!-- resource-id: gpu-cuda-kernels__special-topics-in-kernels-rl-reward-hacking-in-agents-daniel-han-unsloth -->
- **[ Special Topics in Kernels, RL, Reward Hacking in Agents — Daniel Han, Unsloth](https://www.youtube.com/watch?v=uIiA6DquRiE)** · `Video` · Daniel Han · *2026-08-06*
  Daniel Han Unsloth Kernel session
  *Key concepts:* —

<!-- resource-id: gpu-cuda-kernels__worklog-optimising-gemm-on-nvidia-h100-for-cublas-like-performance-wip -->
- **[Worklog: Optimising GEMM on NVIDIA H100 for cuBLAS-like Performance (WIP)](https://hamzaelshafie.bearblog.dev/worklog-optimising-gemm-on-nvidia-h100-for-cublas-like-performance-wip/)** · `Blog` · Hamza's Blog · *2026-08-08*
  Worklog: Optimising GEMM on NVIDIA H100 for cuBLAS-like Performance
  *Key concepts:* —

<!-- resource-id: gpu-cuda-kernels__inside-nvidia-gpus-anatomy-of-high-performance-matmul-kernels -->
- **[Inside NVIDIA GPUs: Anatomy of high performance matmul kernels](https://www.aleksagordic.com/blog/matmul)** · `Blog` · Aleksa Gordić · *2025-09-29*
  Builds from NVIDIA GPU memory and compute architecture through PTX/SASS and synchronous warp tiling to asynchronous Hopper matmul pipelines. Explains how tensor cores, TMA transfers, overlap, and tile scheduling interact; hardware-specific results should be read in that context.
  *Key concepts:* GPU memory hierarchy, PTX/SASS, warp tiling, tensor cores, TMA, asynchronous pipelines, tile scheduling

<!-- resource-id: gpu-cuda-kernels__ai-chip-architectures -->
- **[AI Chip Architectures](https://www.jacobpeake.com/ai-chip-architectures)** · `Blog` · Jacob · *2026-08-23*
  AI Chip Architectures
  *Key concepts:* —

<!-- resource-id: gpu-cuda-kernels__gpu-mode-lecture-materials -->
- **[GPU MODE Lecture Materials](https://github.com/gpu-mode/lectures)** · `Repo` · GPU MODE contributors · *—*
  A structured collection of slides, notebooks, and code accompanying GPU MODE lectures. The index provides a route through profiling, CUDA programming, hardware behavior, and kernel optimization; linked lectures were not individually reviewed.
  *Key concepts:* CUDA, GPU programming, Profiling, Kernel optimization, GPU MODE

<!-- resource-id: gpu-cuda-kernels__introduction-to-cuda-c -->
- **[Introduction to CUDA C++](https://olcf.ornl.gov/calendar/introduction-to-cuda-c)** · `Course` · OLCF / ORNL and NERSC · *2019-12-11*
  A workshop introduction to writing and launching CUDA kernels, managing host-device data movement, and organizing threads. The event page links instructional materials and exercises for GPU programming.
  *Key concepts:* CUDA, GPU programming, Thread hierarchy, Memory transfers, Parallel computing

<!-- resource-id: gpu-cuda-kernels__gpu-performance-engineering-resources -->
- **[GPU Performance Engineering Resources](https://github.com/wafer-ai/gpu-perf-engineering-resources)** · `Repo` · Wafer AI · *—*
  An ordered reading curriculum spanning request-level inference, GPU architecture, kernels, serving engines, and distributed systems. It emphasizes primary papers, documentation, and implementation repositories as a practical path into performance engineering.
  *Key concepts:* GPU programming, Kernel optimization, Inference serving, Distributed systems, Reading list

<!-- resource-id: gpu-cuda-kernels__compilers-for-machine-learning-project-course-syllabus -->
- **[Compilers for Machine Learning — project-course syllabus](https://gist.github.com/geohot/4768597d9dc536446ee2d5de1f29e89d)** · `Course` · George Hotz / geohot · *—*
  A project-based syllabus for building an ML compiler from elementary tensor programs toward GPU training workloads. Covers intermediate representations, rewriting, code generation, fusion, memory hierarchy, and automatic differentiation; this is a proposed course specification, not a completed set of public lectures.
  *Key concepts:* ML compilers, Intermediate representation, Kernel fusion, Automatic differentiation, GPU programming

<!-- resource-id: gpu-cuda-kernels__gpu-architecture-llm-inference-handbook -->
- **[GPU architecture — LLM Inference Handbook](https://handbook.modular.com/kernel-optimization/gpu-architecture-fundamentals)** · `Blog` · Modular · *—*
  Connects the programming hierarchy of threads, warps, blocks, and grids to the GPU's physical compute and memory resources. Builds the mental model needed to reason about occupancy, bandwidth, register pressure, and shared-memory constraints before tuning kernels.
  *Key concepts:* GPU architecture, Warps, Memory hierarchy, Occupancy, Kernel optimization


### Matmul & kernel engineering
<!-- resource-id: gpu-cuda-kernels__inside-nvidia-gpus-anatomy-of-high-performance-matmul-kernels-2 -->
- **[Inside NVIDIA GPUs: Anatomy of high performance matmul kernels](https://www.aleksagordic.com/blog/matmul)** · `Blog` · Aleksa Gordić · *2025-09-29*
  Explains the hardware and programming techniques behind NVIDIA matmul kernels, including memory hierarchy, synchronous warp tiling, and asynchronous Hopper tensor-core pipelines. This is the same article as the earlier entry; its publication date is September 29, 2025.
  *Key concepts:* GPU memory hierarchy, warp tiling, Tensor Memory Accelerator (TMA), instruction-level parallelism, warp groups, tile scheduling

<!-- resource-id: gpu-cuda-kernels__breaking-pytorch-boundaries-fusing-rmsnorm-and-gdn-in-triton-for-qwen-3-5 -->
- **[Breaking PyTorch Boundaries: Fusing RMSNorm and GDN in Triton for Qwen 3.5](https://www.dcbaslani.xyz/blog/qwen_3.5/)** · `Blog` · dcbaslani.xyz · *2026-05-25*
  The author rebuilds Qwen 3.5's inference stack in PyTorch, profiles memory-bandwidth bottlenecks, and replaces key ops with hand-written Triton kernels — fusing RMSNorm and optimizing Gated Delta Network attention for a 5.2x speedup on a B200.
  *Key concepts:* kernel fusion (residual + RMSNorm), GDN linear attention, HBM/SRAM memory optimization, chunkwise processing & WY decomposition, Triton vs CUTLASS tradeoffs, systems vs kernel optimization

<!-- resource-id: gpu-cuda-kernels__fast-matrix-multiplication-on-cpu-a-worklog -->
- **[Fast Multidimensional Matrix Multiplication on CPU from Scratch](https://siboehm.com/articles/22/Fast-MMM-on-CPU)** · `Blog` · Simon Boehm · *2022-08-14*
  An iterative C++ matrix-multiplication worklog connecting algorithm structure to CPU hardware performance. It studies data reuse and single- versus multi-core execution; results are implementation and hardware specific.
  *Key concepts:* Matrix multiplication, CPU optimization, Memory locality, Multithreading, Benchmarking

<!-- resource-id: gpu-cuda-kernels__how-to-optimize-a-cuda-matmul-kernel-for-cublas-like-performance -->
- **[How to Optimize a CUDA Matmul Kernel for cuBLAS-like Performance: a Worklog](https://siboehm.com/articles/22/CUDA-MMM)** · `Blog` · Simon Boehm · *2022-12-31*
  A step-by-step CUDA SGEMM worklog progressing through coalesced access, shared-memory tiling, vectorization, autotuning, and warp tiling. Its comparison is against FP32 cuBLAS on a particular setup, not a claim of matching tensor-core performance.
  *Key concepts:* CUDA, Matrix multiplication, Memory coalescing, Shared memory, Warp tiling

<!-- resource-id: gpu-cuda-kernels__making-gemv-fast -->
- **[Making GEMV Fast](https://heyyanshuman.com/posts/making_gemv_fast)** · `Blog` · Anshuman Mishra · *2026-09-10*
  A CUDA matrix-vector multiplication worklog that begins with a naive kernel and derives its low arithmetic intensity. It uses a roofline argument to explain why memory traffic, rather than peak floating-point throughput, usually controls this workload's performance.
  *Key concepts:* GEMV, CUDA, Arithmetic intensity, Memory bandwidth, Roofline model


### Profiling & hardware
<!-- resource-id: gpu-cuda-kernels__profiling-in-pytorch-part-1-a-beginner-s-guide-to-torch-profiler -->
- **[Profiling in PyTorch (Part 1): A Beginner's Guide to torch.profiler](https://huggingface.co/blog/torch-profiler)** · `Blog` · Hugging Face · *2026-05-29*
  A beginner-friendly guide to `torch.profiler` using a simple matmul + add, teaching how to read profiler tables and traces, interpret CPU–GPU dispatch chains, and distinguish overhead-bound from compute-bound execution.
  *Key concepts:* overhead-bound vs compute-bound, profiler tables vs traces, GPU kernel dispatch chain (ATen), operator fusion (addmm), torch.compile overhead, kernel timing variance

<!-- resource-id: gpu-cuda-kernels__profiling-in-pytorch-part-2-from-nn-linear-to-a-fused-mlp -->
- **[Profiling in PyTorch (Part 2): From nn.Linear to a Fused MLP](https://huggingface.co/blog/torch-mlp-fusion)** · `Blog` · Hugging Face · *2026-06-11*
  Uses profiler-driven analysis to optimize an `nn.Linear` and a GeGLU MLP, comparing eager execution, `torch.compile`, and hand-tuned Triton kernels to show how fusion cuts memory round-trips.
  *Key concepts:* kernel fusion & epilogues, tensor strides & views, torch.compile pointwise fusion, cuBLAS GEMM kernel selection, generic vs specialized kernels, profiler-driven analysis

<!-- resource-id: gpu-cuda-kernels__chip-design-podcast -->
- **[Chip Design (podcast)](https://www.youtube.com/watch?v=oIk3R-sMX5o)** · `Video` · YouTube (Reiner Pope, "Chip Design from the Bottom Up") · *—* · ⚠️unverified
  A talk/podcast building up chip and accelerator design from the bottom up, connecting transistor- and circuit-level realities to the architecture of ML accelerators and their performance characteristics.
  *Key concepts:* chip design fundamentals, accelerator architecture, compute vs memory bandwidth, hardware/software co-design, ML accelerators

<!-- resource-id: gpu-cuda-kernels__gpu-profiling-for-ai-workloads-nsight-compute-nsight-systems-and-pytorch-profiler-production-guide-2026 -->
- **[GPU Profiling for AI Workloads: Nsight Compute, Nsight Systems, and PyTorch Profiler Production Guide (2026)](https://www.spheron.network/blog/gpu-profiling-ai-workloads-nsight-compute-pytorch-profiler-guide/)** · `Blog` · Unknown · *2026-07-31*
  Profiling with Pytorch
  *Key concepts:* —

<!-- resource-id: gpu-cuda-kernels__tiny-tpu-an-educational-accelerator -->
- **[Tiny TPU](https://tinytpu.com/)** · `Blog` · Xander Chin, Kenny Guo, Evan Lin & Surya Sure · *2025-08-17*
  An educational accelerator project that builds intuition for the hardware used in neural-network computation. It connects matrix operations and training concepts to a small implementation; it is not documentation for a production Google TPU.
  *Key concepts:* Accelerator architecture, Matrix multiplication, Hardware design, Backpropagation, Systolic arrays

<!-- resource-id: gpu-cuda-kernels__all-about-rooflines-an-explorable-explanation -->
- **[All About Rooflines — an explorable explanation](https://ezyang.github.io/interactive-parallelize-transformer/roofline.html)** · `Blog` · Edward Z. Yang / interactive adaptation · *—*
  An interactive explanation of performance bounds from compute throughput, memory traffic, and communication bandwidth. Distinguishes hardware peak rates from achieved throughput and separates on-device HBM movement from inter-device communication, helping ground optimization estimates in explicit assumptions.
  *Key concepts:* Roofline model, Arithmetic intensity, HBM bandwidth, Communication, Performance modeling
