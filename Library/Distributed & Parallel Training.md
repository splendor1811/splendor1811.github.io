# Distributed & Parallel Training

[[Library|← Back to Library index]] · Related: [[GPU, CUDA & Kernels]] · [[Efficient Inference & Serving]] · [[Post-Training Playbooks & Reports]]

Distributed and parallel training is how modern LLMs and large models get trained across many GPUs and nodes: splitting data, tensors, and pipeline stages while keeping everything synchronized through collective communication. This page collects hands-on blogs, university lectures, and practical multi-node guides spanning DDP, FSDP/ZeRO, tensor/pipeline parallelism, and the NCCL collectives underneath them.

**Suggested reading order:** Intro to parallelism → DDP → collective communication → EfficientML L20 ⭐ → CS231N L11.

### Foundations (parallelism, DDP, comms)
- **[Introduction to parallelism in PyTorch](https://ggrigorev.me/posts/introduction-to-parallelism/)** · `Blog` · ggrigorev.me · *2025-10-31*
  A comprehensive walkthrough of scaling PyTorch training from DDP through ZeRO stages to tensor parallelism, with practical implementations focused on communication optimization and memory efficiency.
  *Key concepts:* DDP + all-reduce, ZeRO stages / FSDP, ring collectives, tensor parallelism (column/row sharding), communication overlapping, gradient accumulation
- **[Everything you need to know about PyTorch Distributed Data Parallel (DDP)](https://jino-rohit.github.io/blogs/10_ddp.html)** · `Blog` · jino-rohit.github.io · *2026-05-30*
  Explains PyTorch DDP for multi-GPU training: replicating the model per GPU, processing different batches, and synchronizing gradients via ring all-reduce, contrasted against the older DataParallel module.
  *Key concepts:* data parallelism, all-reduce, ring all-reduce, rank / world size, NCCL backend, torchrun
- **[Collective Communication for Multiple GPUs](https://jino-rohit.github.io/blogs/11_collective_communication.html)** · `Blog` · jino-rohit.github.io · *2026-06-12*
  Explores the collective communication primitives behind multi-GPU coordination, modeling communication cost as α + nβ and comparing MST (latency-optimized) versus Ring (bandwidth-optimized) algorithms.
  *Key concepts:* communication cost model (α + nβ), minimum spanning tree, ring algorithm, allreduce, allgather / tensor parallelism, bandwidth-bound workloads
- **[Visualizing Parallelism in Transformer](https://ailzhang.github.io/posts/distributed-compute-in-transformer/)** · `Blog` · ailzhang.github.io · *2026-01-19*
  Uses visual diagrams to demystify the "alphabet soup" of DP/TP/SP/CP/EP, showing how compute and communication interact across Transformer components like attention, MLPs, and mixture-of-experts.
  *Key concepts:* local tensor shapes, sequence/context parallelism, tensor parallelism (column/row + reduce-scatter), expert parallelism + all-to-all, vocabulary parallelism, compute-communication interplay

### Lectures & courses
- **[EfficientML.ai Lecture 20 — Distributed Training Part 2 (MIT 6.5940)](https://www.youtube.com/watch?v=jb91nEH2g_0)** · `Video` · YouTube (MIT HAN Lab) · *2024* · ⭐ · ⚠️unverified
  Part 2 of MIT 6.5940's distributed training material (Fall 2024), covering advanced parallelism strategies and communication optimization for training large models across many GPUs.
  *Key concepts:* pipeline parallelism, tensor parallelism, ZeRO / sharded data parallel, gradient/communication compression, bandwidth vs latency, hybrid parallelism
- **[Stanford CS231N Lecture 11: Large Scale Distributed Training](https://www.youtube.com/watch?v=9MvD-XsowsE)** · `Video` · YouTube (Stanford) · *—* · ⚠️unverified
  Stanford CS231N lecture introducing large-scale distributed training of deep networks, covering how data and model parallelism scale training across clusters of accelerators.
  *Key concepts:* data parallelism, model parallelism, synchronous vs asynchronous SGD, all-reduce gradient sync, scaling efficiency, GPU clusters
- **[MIT 6.S191: Secrets of Massively Parallel Training](https://www.youtube.com/watch?v=UZZD9d9YqnQ)** · `Video` · YouTube (MIT 6.S191) · *—* · ⚠️unverified
  An MIT 6.S191 guest/industry lecture on the practical secrets of training models at massive scale, addressing parallelism strategies and the systems engineering needed to keep thousands of GPUs busy.
  *Key concepts:* massively parallel training, data/tensor/pipeline parallelism, collective communication, memory sharding, scaling laws, hardware utilization
- **[Training and Deploying Large-Scale Models (course)](https://training-large-models-course.github.io/)** · `Course` · MVA · *—*
  An MVA course (2025–2026, 2nd semester) teaching the foundations of training modern LLMs on distributed systems, bridging engineering practice and theory across multi-GPU training, optimization, and serving.
  *Key concepts:* distributed training across GPUs/nodes/clusters, pipeline parallelism, communication-efficient optimization, post-training / fine-tuning, large-scale inference & serving, agentic AI deployment

### Practical multi-node & speedups
- **[Multi-node training: painful lessons (Viblo, Vietnamese)](https://viblo.asia/p/trai-nghiem-met-moi-khi-thu-training-mo-hinh-tren-nhieu-node-multi-node-training-Do754LAe5M6)** · `Blog` · Viblo · *2022-08-05*
  A field report on implementing distributed GPU training across multiple machines with Horovod, documenting network configuration, container orchestration, and how much network speed dominates multi-node performance.
  *Key concepts:* data parallelization, ring allreduce, Horovod (MPI/NCCL), network interface configuration, Docker + passwordless SSH, DistributedOptimizer
- **[Inside FSDP with PyTorch and Ray: Scaling with Fully Sharded Data Parallel](https://debnsuma.github.io/my-blog/posts/fsdp-ray-train/)** · `Blog` · debnsuma.github.io · *2026-02-06*
  An in-depth, visual explanation of Fully Sharded Data Parallel implemented with Ray Train and PyTorch, grounded in a real project fine-tuning a 1.7B-parameter Qwen3-TTS model for voice cloning.
  *Key concepts:* FSDP sharding strategy, phase-based training workflow, per-GPU memory optimization vs DDP, FSDP2, DeepSpeed comparison, Ray Train orchestration
- **[How to Make LLM Training Faster with Unsloth and NVIDIA](https://unsloth.ai/blog/nvidia-collab)** · `Blog` · Unsloth · *2026-05-06*
  Details an Unsloth–NVIDIA collaboration delivering ~25% faster LLM training with no accuracy loss, on top of Unsloth's existing 2–5x speedups, via three targeted pipeline optimizations.
  *Key concepts:* packed-sequence metadata caching, double-buffered activation checkpointing, MoE routing optimization, memory-computation pipeline overlap, dynamic query reduction, GPU-CPU sync elimination
