# Distributed Training

[[Library|← Back to Library index]] · Related: [[GPU, CUDA & Kernels]] · [[Inference & Serving]] · [[Reinforcement Learning & Reasoning]]

Parallelism, collective communication, FSDP, and practical training across GPUs and nodes. Includes training frameworks and the infrastructure beneath large-scale model development.

**Suggested reading order:** Intro to parallelism → DDP → collective communication → EfficientML L20 ⭐ → CS231N L11.

### Training frameworks & pipeline parallelism
<!-- resource-id: efficient-inference-serving__pipeline-parallesim-tutorial -->
- **[Pipeline Parallesim TUTORIAL](https://ezyang.github.io/pipeline-parallelism-tutor/#level=first-steps)** · `Blog` · Unknown · *2026-08-23*
  Pipeline Parallesim TUTORIAL
  *Key concepts:* —

<!-- resource-id: efficient-inference-serving__building-a-distributed-training-framework-from-first-principles -->
- **[ Building a distributed training framework from first principles](https://www.youtube.com/watch?v=XoGvCBRnwLs)** · `Video` · Unknown · *2026-08-24* · ⭐ · 🔁
   Building a distributed training framework from first principles
  *Key concepts:* —

<!-- resource-id: distributed-parallel-training__configuring-megatron-lm-parallelism -->
- **[Configuring Megatron-LM Parallelism](https://apxml.com/courses/how-to-build-a-large-language-model/chapter-16-implementing-distributed-training-frameworks/configuring-megatron-lm)** · `Course` · ApX Machine Learning · *—*
  A tutorial on combining tensor, pipeline, and data parallelism in a distributed training configuration. It relates microbatching and pipeline bubbles to memory, communication, and hardware layout; example flags should be checked against the chosen Megatron-LM revision.
  *Key concepts:* Megatron-LM, Tensor parallelism, Pipeline parallelism, Data parallelism, Microbatching

### Foundations (parallelism, DDP, comms)
<!-- resource-id: distributed-parallel-training__introduction-to-parallelism-in-pytorch -->
- **[Introduction to parallelism in PyTorch](https://ggrigorev.me/posts/introduction-to-parallelism/)** · `Blog` · ggrigorev.me · *2025-10-31*
  A comprehensive walkthrough of scaling PyTorch training from DDP through ZeRO stages to tensor parallelism, with practical implementations focused on communication optimization and memory efficiency.
  *Key concepts:* DDP + all-reduce, ZeRO stages / FSDP, ring collectives, tensor parallelism (column/row sharding), communication overlapping, gradient accumulation

<!-- resource-id: distributed-parallel-training__everything-you-need-to-know-about-pytorch-distributed-data-parallel-ddp -->
- **[Everything you need to know about PyTorch Distributed Data Parallel (DDP)](https://jino-rohit.github.io/blogs/10_ddp.html)** · `Blog` · jino-rohit.github.io · *2026-05-30*
  Explains PyTorch DDP for multi-GPU training: replicating the model per GPU, processing different batches, and synchronizing gradients via ring all-reduce, contrasted against the older DataParallel module.
  *Key concepts:* data parallelism, all-reduce, ring all-reduce, rank / world size, NCCL backend, torchrun

<!-- resource-id: distributed-parallel-training__collective-communication-for-multiple-gpus -->
- **[Collective Communication for Multiple GPUs](https://jino-rohit.github.io/blogs/11_collective_communication.html)** · `Blog` · jino-rohit.github.io · *2026-06-12*
  Explores the collective communication primitives behind multi-GPU coordination, modeling communication cost as α + nβ and comparing MST (latency-optimized) versus Ring (bandwidth-optimized) algorithms.
  *Key concepts:* communication cost model (α + nβ), minimum spanning tree, ring algorithm, allreduce, allgather / tensor parallelism, bandwidth-bound workloads

<!-- resource-id: distributed-parallel-training__visualizing-parallelism-in-transformer -->
- **[Visualizing Parallelism in Transformer](https://ailzhang.github.io/posts/distributed-compute-in-transformer/)** · `Blog` · ailzhang.github.io · *2026-01-19*
  Uses visual diagrams to demystify the "alphabet soup" of DP/TP/SP/CP/EP, showing how compute and communication interact across Transformer components like attention, MLPs, and mixture-of-experts.
  *Key concepts:* local tensor shapes, sequence/context parallelism, tensor parallelism (column/row + reduce-scatter), expert parallelism + all-to-all, vocabulary parallelism, compute-communication interplay

<!-- resource-id: distributed-parallel-training__tensor-parallelism-in-transformers-5-minutes-to-understand -->
- **[Tensor Parallelism in Transformers: 5 Minutes to Understand](https://huggingface.co/blog/qgallouedec/tp)** · `Blog` · Quentin Gallouédec / Hugging Face · *2025-12-04*
  Explains column- and row-parallel matrix multiplication and applies the pattern to attention projections and feed-forward layers. The illustrated head-wise layout shows where local work ends and all-reduce communication is needed; its layout constraints are not universal limits on every TP design.
  *Key concepts:* Tensor parallelism, Matrix sharding, All-reduce, Attention, Distributed training

<!-- resource-id: distributed-parallel-training__how-to-parallelize-a-transformer-for-training -->
- **[How to Parallelize a Transformer for Training](https://jax-ml.github.io/scaling-book/training)** · `Book` · Jacob Austin et al. / How To Scale Your Model · *2025-02-04*
  Derives communication costs for data parallelism, FSDP, tensor parallelism, and pipeline parallelism in dense-Transformer training. It explains when inter-chip communication becomes the bottleneck and explicitly leaves expert parallelism outside this chapter's main analysis.
  *Key concepts:* Distributed training, FSDP, Tensor parallelism, Pipeline parallelism, Communication overlap

### Lectures & courses
<!-- resource-id: distributed-parallel-training__efficientml-ai-lecture-20-distributed-training-part-2-mit-6-5940 -->
- **[EfficientML.ai Lecture 20 — Distributed Training Part 2 (MIT 6.5940)](https://www.youtube.com/watch?v=jb91nEH2g_0)** · `Video` · YouTube (MIT HAN Lab) · *2024* · ⭐ · ⚠️unverified
  Part 2 of MIT 6.5940's distributed training material (Fall 2024), covering advanced parallelism strategies and communication optimization for training large models across many GPUs.
  *Key concepts:* pipeline parallelism, tensor parallelism, ZeRO / sharded data parallel, gradient/communication compression, bandwidth vs latency, hybrid parallelism

<!-- resource-id: distributed-parallel-training__stanford-cs231n-lecture-11-large-scale-distributed-training -->
- **[Stanford CS231N Lecture 11: Large Scale Distributed Training](https://www.youtube.com/watch?v=9MvD-XsowsE)** · `Video` · YouTube (Stanford) · *—* · ⚠️unverified
  Stanford CS231N lecture introducing large-scale distributed training of deep networks, covering how data and model parallelism scale training across clusters of accelerators.
  *Key concepts:* data parallelism, model parallelism, synchronous vs asynchronous SGD, all-reduce gradient sync, scaling efficiency, GPU clusters

<!-- resource-id: distributed-parallel-training__mit-6-s191-secrets-of-massively-parallel-training -->
- **[MIT 6.S191: Secrets of Massively Parallel Training](https://www.youtube.com/watch?v=UZZD9d9YqnQ)** · `Video` · YouTube (MIT 6.S191) · *—* · ⚠️unverified
  An MIT 6.S191 guest/industry lecture on the practical secrets of training models at massive scale, addressing parallelism strategies and the systems engineering needed to keep thousands of GPUs busy.
  *Key concepts:* massively parallel training, data/tensor/pipeline parallelism, collective communication, memory sharding, scaling laws, hardware utilization

<!-- resource-id: distributed-parallel-training__training-and-deploying-large-scale-models-course -->
- **[Training and Deploying Large-Scale Models (course)](https://training-large-models-course.github.io/)** · `Course` · MVA · *—*
  An MVA course (2025–2026, 2nd semester) teaching the foundations of training modern LLMs on distributed systems, bridging engineering practice and theory across multi-GPU training, optimization, and serving.
  *Key concepts:* distributed training across GPUs/nodes/clusters, pipeline parallelism, communication-efficient optimization, post-training / fine-tuning, large-scale inference & serving, agentic AI deployment

### Practical multi-node & speedups
<!-- resource-id: distributed-parallel-training__multi-node-training-painful-lessons-viblo-vietnamese -->
- **[Multi-node training: painful lessons (Viblo, Vietnamese)](https://viblo.asia/p/trai-nghiem-met-moi-khi-thu-training-mo-hinh-tren-nhieu-node-multi-node-training-Do754LAe5M6)** · `Blog` · Viblo · *2022-08-05*
  A field report on implementing distributed GPU training across multiple machines with Horovod, documenting network configuration, container orchestration, and how much network speed dominates multi-node performance.
  *Key concepts:* data parallelization, ring allreduce, Horovod (MPI/NCCL), network interface configuration, Docker + passwordless SSH, DistributedOptimizer

<!-- resource-id: distributed-parallel-training__inside-fsdp-with-pytorch-and-ray-scaling-with-fully-sharded-data-parallel -->
- **[Inside FSDP with PyTorch and Ray: Scaling with Fully Sharded Data Parallel](https://debnsuma.github.io/my-blog/posts/fsdp-ray-train/)** · `Blog` · debnsuma.github.io · *2026-02-06*
  An in-depth, visual explanation of Fully Sharded Data Parallel implemented with Ray Train and PyTorch, grounded in a real project fine-tuning a 1.7B-parameter Qwen3-TTS model for voice cloning.
  *Key concepts:* FSDP sharding strategy, phase-based training workflow, per-GPU memory optimization vs DDP, FSDP2, DeepSpeed comparison, Ray Train orchestration

<!-- resource-id: distributed-parallel-training__how-to-make-llm-training-faster-with-unsloth-and-nvidia -->
- **[How to Make LLM Training Faster with Unsloth and NVIDIA](https://unsloth.ai/blog/nvidia-collab)** · `Blog` · Unsloth · *2026-05-06*
  Details an Unsloth–NVIDIA collaboration delivering ~25% faster LLM training with no accuracy loss, on top of Unsloth's existing 2–5x speedups, via three targeted pipeline optimizations.
  *Key concepts:* packed-sequence metadata caching, double-buffered activation checkpointing, MoE routing optimization, memory-computation pipeline overlap, dynamic query reduction, GPU-CPU sync elimination

<!-- resource-id: distributed-parallel-training__deepseek-v3-from-roofline-to-reality -->
- **[DeepSeek-V3: from roofline to reality](https://deepseek-v3.ezyang.com/index.html)** · `Blog` · Edward Z. Yang · *—*
  A series landing page outlining how to refine a simple DeepSeek-V3 roofline model into more realistic training-performance predictions. It frames hardware limits, correction factors, and profiling as a worked methodology for understanding MoE training trade-offs.
  *Key concepts:* Roofline model, MoE, Training performance, GPU profiling, Parallelism


### Research infrastructure & ecosystem
<!-- resource-id: thinking-machines-lab__thinking-machines-lab-and-nvidia-announce-long-term-gigawatt-scale-strategic-partnership -->
- **[Thinking Machines Lab and NVIDIA Announce Long-Term Gigawatt-Scale Strategic Partnership](https://thinkingmachines.ai/news/nvidia-partnership/)** · `News` · Thinking Machines · *2026-03-10*
  A multi-year partnership to deploy at least one gigawatt of NVIDIA Vera Rubin systems for frontier model training, paired with a significant NVIDIA investment, aimed at delivering customizable and open AI to enterprises and researchers.
  *Key concepts:* gigawatt-scale infrastructure, frontier model training, NVIDIA Vera Rubin platform, customizable/open AI, strategic capital investment

<!-- resource-id: distributed-parallel-training__impactful-scheduling-for-gpu-clusters -->
- **[Impactful scheduling for GPU clusters](https://allenai.org/blog/impactful-scheduling)** · `Blog` · Jeremy Tryba / Ai2 · *2026-10-09*
  Explains Ai2's move from job priorities to GPU-time budgets, hierarchical fair sharing, and a preemption contract. Separates availability, occupancy, research impact, and hardware utilization so cluster allocation is not confused with kernel efficiency.
  *Key concepts:* GPU scheduling, Fair-share allocation, Preemption, Distributed training, Cluster utilization

