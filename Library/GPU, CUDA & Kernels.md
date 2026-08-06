# GPU, CUDA & Kernels

[[Library|← Back to Library index]] · Related: [[Efficient Inference & Serving]] · [[Distributed & Parallel Training]]

Curated resources for going deep on GPU programming — from CUDA fundamentals and parallel-computing courses through matmul/GEMM kernel engineering, Triton, FlashAttention internals, and PyTorch profiling. Emphasis is on understanding the hardware (memory hierarchy, warps, tensor cores) and translating that into fast kernels.

### CUDA fundamentals & courses
- **[CUDA Course (Infatoshi)](https://github.com/Infatoshi/cuda-course/tree/master)** · `Repo` · GitHub · *—*
  A comprehensive, structured CUDA programming course (Ubuntu/Linux-oriented) that takes learners from GPU basics through advanced kernel optimization, aiming to lower the barrier into high-performance computing.
  *Key concepts:* GPU architecture, CUDA kernel development, memory/bandwidth optimization, matmul optimization, PyTorch extensions & Triton, cuBLAS/cuDNN
- **[Advanced CUDA learning (curated thread + comments)](https://x.com/goyal__pramod/status/2071642403023507498)** · `Blog` · X (Twitter) · *—* · ⚠️unverified
  A crowd-sourced thread curating advanced CUDA learning resources, with commenters adding books, courses, kernel repos, and blog posts for going beyond the basics.
  *Key concepts:* advanced CUDA, kernel optimization, learning roadmap, community-curated resources
- **[GPU Mode (YouTube channel)](https://www.youtube.com/channel/UCJgIbYl6C5no72a0NUAPcTA)** · `Video` · YouTube · *—* · ⚠️unverified
  The channel of the GPU Mode (formerly CUDA Mode) community, hosting lecture-style talks on GPU programming, CUDA, Triton, performance optimization, and ML systems from practitioners and researchers.
  *Key concepts:* CUDA, Triton, kernel optimization, GPU performance, ML systems, community lectures
- **[Stanford CS149: Parallel Computing](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)** · `Course` · YouTube (Stanford, Kayvon Fatahalian & Kunle Olukotun) · *2023* · ⚠️unverified
  Stanford's undergraduate parallel-computing course (2023 offering), covering the principles and practice of programming parallel machines including multicore CPUs and GPUs.
  *Key concepts:* parallel programming models, SIMD/SIMT, multicore & GPU architecture, work distribution & scheduling, memory & synchronization, performance analysis
- **[The Feynman GPU Lectures](https://www.dcbaslani.xyz/blog/gpu_masterclass/)** · `Blog` · dcbaslani.xyz · *2026-06-05*
  A progressive masterclass that builds GPU understanding from transistors and logic gates up through complete matrix-multiply implementations, tracing tensor-core evolution to Blackwell's fifth generation.
  *Key concepts:* SIMT execution & warps, memory-hierarchy latency & occupancy, tensor core evolution (WMMA→WGMMA→tcgen05), Blackwell TMEM, TMA & mbarrier async engines, FP4/microscaling precision tradeoffs
- **[Different CUDA Cores and Tensor Cores (WMMA)](https://jino-rohit.github.io/blogs/04_wmma.html)** · `Blog` · jino-rohit.github.io · *2026-03-21*
  Introduces tensor cores and CUDA's warp-level WMMA API for high-performance matrix operations, with a complete working example of warp-level matrix multiplication.
  *Key concepts:* tensor cores (Volta), WMMA API (CUDA 9.0), fragment class, tile sizes (16×16×16), load/mma/store_matrix_sync, FMA throughput vs CUDA cores

- **[ Lecture 75 [ScaleML Series] GPU Programming Fundamentals + ThunderKittens](https://www.youtube.com/watch?v=Cl2B_hmg4gA&list=PLgE2fNm9NzK1yvZcVzuZXreyMB42AVeGl&index=5)** · `Blog` · ScaleML · *2026-08-06*
  Fundamental of GPU Programming
  *Key concepts:* —
- **[Outperforming cuBLAS on B200](https://www.paulwillchan.com/articles/outperforming-cublas-b200)** · `Blog` · Unknown · *2026-08-06*
  Outperforming cuBLAS on B200
  *Key concepts:* —
### Matmul & kernel engineering
- **[Inside NVIDIA GPUs: Anatomy of high performance matmul kernels](https://www.aleksagordic.com/blog/matmul)** · `Blog` · aleksagordic.com · *2025-09-29*
  A deep walkthrough of designing high-performance matmul kernels for NVIDIA GPUs, progressing from hardware fundamentals through warp-tiling to state-of-the-art async Hopper implementations with ~10x speedups.
  *Key concepts:* GPU memory hierarchy, warp-tiling, Tensor Memory Accelerator (TMA), instruction-level parallelism, warp groups & wgmma, persistent kernels & tile scheduling
- **[Breaking PyTorch Boundaries: Fusing RMSNorm and GDN in Triton for Qwen 3.5](https://www.dcbaslani.xyz/blog/qwen_3.5/)** · `Blog` · dcbaslani.xyz · *2026-05-25*
  The author rebuilds Qwen 3.5's inference stack in PyTorch, profiles memory-bandwidth bottlenecks, and replaces key ops with hand-written Triton kernels — fusing RMSNorm and optimizing Gated Delta Network attention for a 5.2x speedup on a B200.
  *Key concepts:* kernel fusion (residual + RMSNorm), GDN linear attention, HBM/SRAM memory optimization, chunkwise processing & WY decomposition, Triton vs CUTLASS tradeoffs, systems vs kernel optimization

### FlashAttention internals
- **[Visualize FlashAttention to understand (memory)](https://winterrykim.github.io/blog/2026/training-lm-from-scratch-part2-flashattention-memory/)** · `Blog` · winterrykim.github.io · *2026-06-23*
  Explains how FlashAttention avoids materializing the full attention-score matrix in device memory, using tiling, online softmax, and selective recomputation to reach identical results with far better memory access patterns.
  *Key concepts:* IO-awareness, online softmax, tiling strategy, log-sum-exp (LSE) saving, backward recomputation tradeoff, FlashAttention-2 loop reordering
- **[Flash Attention Series — Mastering Softmax](https://jino-rohit.github.io/blogs/05_softmax.html)** · `Blog` · jino-rohit.github.io · *2026-04-09*
  Walks through four progressively optimized softmax implementations that underpin FlashAttention, from naive to safe to online to blocked softmax, showing how each reduces HBM access and improves stability.
  *Key concepts:* numerical stability (max-subtraction), online softmax, blocked softmax, HBM vs SRAM tradeoffs, rescaling factor, parallel GPU computation
- **[Flash Attention derived and coded from first principles with Triton (video)](https://www.youtube.com/watch?v=zy8ChVd_oTM)** · `Video` · YouTube (Umar Jamil) · *—* · ⚠️unverified
  A long-form tutorial deriving the FlashAttention algorithm mathematically from first principles and then implementing forward and backward passes as Triton kernels step by step.
  *Key concepts:* attention math derivation, online/safe softmax, tiling & blocks, Triton kernel programming, forward & backward pass, GPU memory hierarchy

### Profiling & hardware
- **[Profiling in PyTorch (Part 1): A Beginner's Guide to torch.profiler](https://huggingface.co/blog/torch-profiler)** · `Blog` · Hugging Face · *2026-05-29*
  A beginner-friendly guide to `torch.profiler` using a simple matmul + add, teaching how to read profiler tables and traces, interpret CPU–GPU dispatch chains, and distinguish overhead-bound from compute-bound execution.
  *Key concepts:* overhead-bound vs compute-bound, profiler tables vs traces, GPU kernel dispatch chain (ATen), operator fusion (addmm), torch.compile overhead, kernel timing variance
- **[Profiling in PyTorch (Part 2): From nn.Linear to a Fused MLP](https://huggingface.co/blog/torch-mlp-fusion)** · `Blog` · Hugging Face · *2026-06-11*
  Uses profiler-driven analysis to optimize an `nn.Linear` and a GeGLU MLP, comparing eager execution, `torch.compile`, and hand-tuned Triton kernels to show how fusion cuts memory round-trips.
  *Key concepts:* kernel fusion & epilogues, tensor strides & views, torch.compile pointwise fusion, cuBLAS GEMM kernel selection, generic vs specialized kernels, profiler-driven analysis
- **[Chip Design (podcast)](https://www.youtube.com/watch?v=oIk3R-sMX5o)** · `Video` · YouTube (Reiner Pope, "Chip Design from the Bottom Up") · *—* · ⚠️unverified
  A talk/podcast building up chip and accelerator design from the bottom up, connecting transistor- and circuit-level realities to the architecture of ML accelerators and their performance characteristics.
  *Key concepts:* chip design fundamentals, accelerator architecture, compute vs memory bandwidth, hardware/software co-design, ML accelerators

- **[GPU Profiling for AI Workloads: Nsight Compute, Nsight Systems, and PyTorch Profiler Production Guide (2026)](https://www.spheron.network/blog/gpu-profiling-ai-workloads-nsight-compute-pytorch-profiler-guide/)** · `Blog` · Unknown · *2026-07-31*
  Profiling with Pytorch
  *Key concepts:* —