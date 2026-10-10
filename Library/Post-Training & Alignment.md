# Post-Training & Alignment

[[Library|← Back to Library index]] · Related: [[Reinforcement Learning & Reasoning]] · [[Data & Evaluation]] · [[LLM Architecture & Scaling]]

Supervised fine-tuning, preference optimization, parameter-efficient adaptation, and distillation. On-policy distillation lives here as a method within the wider post-training pipeline.

**Suggested reading order:** RLHF Book → LoRA Without Regret → On-Policy Distillation from First Principles → On-Policy Distillation → multi-teacher techniques and failure modes.

### Distillation: foundations & first principles
<!-- resource-id: on-policy-distillation__on-policy-distillation-from-first-principles -->
- **[On-Policy Distillation from First Principles](https://yanta.site/c/on-policy-distillation-from-first-principles-82m6)** · `Blog` · yanta.site · *2026-06-13*
  Derives OPD by decomposing the reverse-KL loss into an entropy term (spread probability) and a cross-entropy term (only where the teacher assigns mass), showing how teacher sharpness propagates to the student and how predictable prefixes can trigger repetition collapse.
  *Key concepts:* reverse-KL decomposition, entropy vs. cross-entropy tension, mode-seeking behavior, repetition collapse, teacher sharpness propagation

<!-- resource-id: on-policy-distillation__on-policy-distillation -->
- **[On-Policy Distillation](https://thinkingmachines.ai/blog/on-policy-distillation/)** · `Blog` · Kevin Lu / Thinking Machines Lab · *2025-10-27* · ⭐
  Combines student-generated rollouts with dense teacher feedback, using per-token reverse KL in this implementation. In the math-reasoning experiment, estimated compute savings versus the SFT comparison range from 9x to 30x depending on whether teacher-generated data costs are counted; a separate personalization experiment studies recovering instruction-following behavior after mid-training.
  *Key concepts:* reverse-KL per-token loss, dense vs. sparse reward (N bits vs. 1 bit), on-policy sampling, process supervision, continual learning / catastrophic forgetting

<!-- resource-id: on-policy-distillation__sft-rl-and-on-policy-distillation-through-a-distributional-lens -->
- **[SFT, RL, and On-Policy Distillation Through a Distributional Lens](https://nrehiew.github.io/blog/sft_rl_opd/)** · `Blog` · nrehiew · *2026-01-01*
  Views LMs as distributions over sequences and argues that on-policy data (not explicit KL regularization) is what lets RL and OPD preserve capabilities better than SFT, showing empirically that OPD students can match or exceed their teachers.
  *Key concepts:* distributional view of post-training, forward vs. reverse KL, on-policy sampling as implicit regularization, catastrophic forgetting, SFT→RL→OPD pipelines

<!-- resource-id: on-policy-distillation__the-imitation-game-state-of-policy-distillation-in-lm-training -->
- **[The Imitation Game: State of Policy Distillation in LM Training](https://chinmaykarkar.com/blog/OPD_blog/)** · `Blog` · Chinmay Karkar · *2026-01-01*
  A survey of OPD and on-policy self-distillation (OPSD) as post-training techniques, arguing they beat off-policy distillation on catastrophic forgetting and error compounding, and cataloging open problems like cross-tokenizer alignment and verifier calibration.
  *Key concepts:* OPD/OPSD, mode-seeking vs. mode-covering, exposure bias / error compounding, privileged-information self-distillation, prefix drift, cross-tokenizer alignment

<!-- resource-id: on-policy-distillation__understanding-self-distillation-and-privileged-information-distillation -->
- **[Understanding Self-Distillation and Privileged Information Distillation](https://emilianopp.github.io/Privileged-Information-Distillation-and-Self-Distillation/)** · `Blog` · Emiliano Penaloza · *2026-02-01*
  Explores how a model can exploit privileged context (solutions, feedback, documents) unavailable at inference to teach a deployment student, framed through RL-as-inference and variational EM.
  *Key concepts:* privileged information distillation, reverse- vs. forward-KL, reward-tilted self-distillation, variational EM, π-Distill (shared-parameter α interpolation), RL-as-inference

<!-- resource-id: on-policy-distillation__on-llm-knowledge-distillation-a-comparison-between-forward-kl-and-reverse-kl -->
- **[On LLM Knowledge Distillation - A Comparison between Forward KL and Reverse KL](https://d2jud02ci9yv69.cloudfront.net/2025-04-28-llm-knowledge-distil-157/blog/llm-knowledge-distil/)** · `Blog` · Unknown · *2026-08-23*
  On LLM Knowledge Distillation - A Comparison between Forward KL and Reverse KL
  *Key concepts:* —

<!-- resource-id: on-policy-distillation__on-policy-distillation-using-llms-to-train-better-llms -->
- **[ On Policy Distillation - Using LLMs to train better LLMs](https://www.youtube.com/watch?v=ARRD9itTMgw)** · `Video` · Unknown · *2026-08-24* · ⭐
   On Policy Distillation - Using LLMs to train better LLMs
  *Key concepts:* —

<!-- resource-id: thinking-machines-lab__on-policy-distillation -->
- **[On-Policy Distillation](https://thinkingmachines.ai/blog/on-policy-distillation/)** · `Blog` · Kevin Lu / Thinking Machines Lab · *2025-10-27* · ⭐
  Studies dense teacher supervision on student-generated trajectories, using reverse KL for the reported implementation. The math experiment reports compute savings whose size depends on cost accounting; a separate internal-assistant experiment uses distillation to recover behavior after learning company knowledge. These are task-specific results, not a guarantee against forgetting. See [[On-Policy Distillation]].
  *Key concepts:* reverse KL divergence, dense per-token reward, on-policy sampling, continual learning without catastrophic forgetting, process supervision / forking tokens, logprob-based distillation

### Distillation: techniques & multi-teacher
<!-- resource-id: on-policy-distillation__mopd-multi-teacher-on-policy-distillation-for-capability-integration-in-llm-post-training -->
- **[MOPD: Multi-Teacher On-Policy Distillation for Capability Integration in LLM Post-Training](https://arxiv.org/abs/2606.30406)** · `Paper` · arXiv · *2026-06-29*
  Trains separate domain-specialized RL teachers in parallel, then distills all of them into one student via on-policy learning, inheriting nearly all of each teacher's capability while eliminating exposure bias.
  *Key concepts:* multi-teacher distillation, domain-specialized RL teachers, on-policy knowledge transfer, exposure-bias elimination, dense optimization signal, parallel teacher development

<!-- resource-id: on-policy-distillation__multi-teacher-on-policy-distillation-a-new-post-training-primitive -->
- **[Multi-Teacher On-Policy Distillation: A New Post-Training Primitive](https://yumoxu.notion.site/multi-teacher-on-policy-distillation)** · `Blog` · Yumo Xu (Notion) · *—* · ⚠️unverified
  Positions multi-teacher OPD as a general post-training primitive that merges several specialist teachers into a single student through on-policy rollouts and per-token supervision, as an alternative to model merging or sequential fine-tuning.
  *Key concepts:* multi-teacher OPD, capability integration, on-policy rollouts, per-token teacher supervision, post-training primitives

<!-- resource-id: on-policy-distillation__unlocking-on-policy-distillation-for-any-model-family -->
- **[Unlocking On-Policy Distillation for Any Model Family](https://huggingface.co/spaces/HuggingFaceH4/on-policy-distillation)** · `Blog` · Hugging Face H4 · *—*
  Demonstrates an OPD recipe generalized across heterogeneous model families, lowering the barrier to applying reverse-KL student-sampled distillation regardless of the teacher/student architecture pairing.
  *Key concepts:* on-policy distillation, cross-model-family generalization, knowledge distillation tooling, teacher-student pairing

<!-- resource-id: on-policy-distillation__distilling-100b-models-40x-faster-with-trl -->
- **[Distilling 100B+ Models 40x Faster with TRL](https://huggingface.co/spaces/HuggingFaceTB/trl-distillation-trainer)** · `Blog` · Hugging Face (SmolLM/TB) · *—*
  Shows a TRL-based distillation trainer that compresses 100B+ teacher models into smaller students roughly 40x faster than baseline pipelines, packaging OPD-style training as reusable infrastructure.
  *Key concepts:* TRL distillation trainer, 100B+ teacher compression, 40x speedup, large-model optimization, distillation tooling

<!-- resource-id: on-policy-distillation__on-policy-self-distillation -->
- **[On Policy Self Distillation](https://x.com/ar0cket1/status/2054108160450064571)** · `Blog` · @ar0cket1 (X) · *—* · ⚠️unverified
  A thread introducing on-policy self-distillation (OPSD), where a single model conditioned on privileged information (answers, hints, longer context) supervises its own no-context rollouts, avoiding the need for a stronger external teacher.
  *Key concepts:* on-policy self-distillation, privileged-context conditioning, self-supervision, reverse-KL, teacher-free distillation

<!-- resource-id: on-policy-distillation__solving-opsd -->
- **[Solving OPSD](https://x.com/ar0cket1/status/2065772402622263701)** · `Blog` · @ar0cket1 (X) · *—* · ⚠️unverified
  A follow-up thread tackling practical failure modes of OPSD—unreliable self-supervision on drifted prefixes and long-horizon degradation—and proposing fixes such as trajectory filtering and reweighting.
  *Key concepts:* OPSD failure modes, prefix drift, long-horizon degradation, trajectory filtering, token reweighting

<!-- resource-id: on-policy-distillation__open-multi-teacher-on-policy-distillation -->
- **[Open Multi-teacher On-Policy Distillation](https://bytedtsinghua-sia.github.io/Open-MOPD/)** · `Blog` · Huan-ang Gao, Haohan Chi et al. / Tsinghua AIR–ByteDance SIA-Lab · *—* · ⭐
  Presents an open recipe combining mixed-domain SFT, specialist RL teachers, and routed multi-teacher distillation. It diagnoses unequal response-token budgets and rewards becoming stale during repeated updates, then balances domain contributions and refreshes student-dependent rewards. The project page links the paper, code, models, and data but does not display its own publication date.
  *Key concepts:* multi-teacher on-policy distillation, domain routing, token-share balancing, teacher-student gap, reward refresh, PPO minibatch updates

### Distillation: critical analysis & pitfalls
<!-- resource-id: on-policy-distillation__unmasking-on-policy-distillation-where-it-helps-where-it-hurts-and-why -->
- **[Unmasking On-Policy Distillation: Where It Helps, Where It Hurts, and Why](https://arxiv.org/pdf/2605.10889)** · `Paper` · arXiv · *2026-05-12*
  Provides theory and experiments dissecting when OPD improves vs. degrades a student, tracing the difference to teacher-student distribution mismatch and alignment-score distributions across reasoning and instruction-following tasks.
  *Key concepts:* OPD in RL settings, distribution mismatch, alignment-score analysis, policy optimization with distillation objectives, when-it-helps-vs-hurts framework

<!-- resource-id: on-policy-distillation__on-policy-distillation-promise-pitfalls-and-prospects -->
- **[On-Policy Distillation: Promise, Pitfalls, and Prospects](https://louieworth.github.io/blog/opd_reflection/)** · `Blog` · Li Jiang · *2026-06-08*
  Identifies three OPD failure modes—noisy teacher supervision on off-manifold prefixes, teacher reliability decay over long horizons, and myopic per-token gradients that only reward correction onsets—and proposes Trajectory-Refined Distillation plus RLVR integration.
  *Key concepts:* local noise in teacher supervision, horizon-induced coverage decay, myopic gradient problem, Trajectory-Refined Distillation (TRD), RLVR integration, OPSD

<!-- resource-id: on-policy-distillation__on-the-position-bias-of-on-policy-distillation -->
- **[On the Position Bias of On-Policy Distillation](https://yannx1e.github.io/IW-OPD/)** · `Blog` · yannx1e · *2026-06-01*
  Shows OPD supervision is not uniform across positions—early tokens carry more useful signal than late ones as prefixes drift from the teacher—and introduces Importance-Weighted OPD (IW-OPD) to reweight token advantages by prefix compatibility.
  *Key concepts:* position bias, finite-budget constrained optimization, prefix importance weighting, cumulative unsigned discrepancy, teacher-student continuation gap, IW-OPD

### Distillation: threads, talks & collections
<!-- resource-id: on-policy-distillation__on-sft-rl-and-on-policy-distillation-thread -->
- **[On SFT, RL, and on-policy distillation (thread)](https://x.com/willccbb/status/2050038277454143918)** · `Blog` · @willccbb (X) · *—* · ⚠️unverified
  A widely-shared thread contrasting SFT, RL, and OPD as post-training regimes, arguing OPD occupies the sweet spot of dense supervision plus on-policy data and explaining intuitively why it resists forgetting.
  *Key concepts:* SFT vs. RL vs. OPD, dense per-token supervision, on-policy data, capability preservation, post-training tradeoffs

<!-- resource-id: on-policy-distillation__blackboard-explanation-of-on-policy-distillation -->
- **[Blackboard explanation of On-Policy Distillation](https://x.com/dwarkesh_sp/status/2062353335529935114)** · `Video` · @dwarkesh_sp (X) · *—* · ⚠️unverified
  A whiteboard/blackboard-style walkthrough breaking down the OPD training loop—student rollout, teacher scoring, reverse-KL update—for a general technical audience.
  *Key concepts:* OPD training loop, student rollout, teacher scoring, reverse-KL, intuition-building explainer

<!-- resource-id: on-policy-distillation__the-magic-of-llm-distillation-rishabh-agarwal-google-deepmind -->
- **[The Magic of LLM Distillation — Rishabh Agarwal, Google DeepMind](https://www.youtube.com/watch?v=O1AR4iL30mg)** · `Video` · YouTube (Rishabh Agarwal, DeepMind) · *—* · ⚠️unverified
  A talk surveying LLM distillation from a leading researcher on generalized knowledge distillation (GKD), covering why on-policy student-generated data and teacher feedback outperform off-policy imitation for training capable smaller models.
  *Key concepts:* generalized knowledge distillation (GKD), on-policy distillation, teacher feedback, off-policy imitation limits, small-model training

<!-- resource-id: on-policy-distillation__awesomeopd-curated-repo -->
- **[AwesomeOPD (curated repo)](https://github.com/thinkwee/AwesomeOPD)** · `Repo` · GitHub (thinkwee) · *2026-06-23*
  A curated awesome-list cataloging OPD research across white-box, black-box, self-distillation, and OPD-RL hybrid categories, annotated along four design dimensions with both foundational and recent papers.
  *Key concepts:* OPD, OPSD, white-box vs. black-box supervision, trajectory-level refinement (TRD, FiRe-OPD), OPD-RL hybrids (GRPO/PPO), privileged-context mechanisms

<!-- resource-id: on-policy-distillation__why-self-distillation-is-taking-over-llm-post-training-w-the-researchers-behind-it -->
- **[Why Self-Distillation Is Taking Over LLM Post-Training (w/ the researchers behind it)](https://www.youtube.com/watch?v=OgEGV7apEzI)** · `Video` · Yacine Mahdid (YouTube) · *2026-04-28* · ⚠️unverified
  An interview with researchers Idan Shenfeld and Jonas Hübotter on self-distillation as a post-training paradigm, where the model acts as its own teacher by conditioning on privileged feedback or demonstrations. Covers SDPO for RL with rich feedback and SDFT for continual learning without catastrophic forgetting.
  *Key concepts:* self-distillation, on-policy distillation, SDPO, SDFT, dense reward signal, continual learning

### RLHF & preference optimization
<!-- resource-id: reinforcement-learning__rlhf-post-training-course-nathan-lambert -->
- **[RLHF & Post-Training Course (Nathan Lambert)](https://www.youtube.com/watch?v=jQPiH-KB4B0&list=PLL1tdVxB1CpVpEtMHxwuR4uI4Lxjw00_y)** · `Video` · YouTube · *—* · ⚠️unverified
  A free video lecture series accompanying Nathan Lambert's RLHF Book, following the book chapter-by-chapter with slides and added lectures. Aimed at early PhD/master's level but designed to be accessible without prior RL or language-modeling background.
  *Key concepts:* RLHF pipeline overview, instruction tuning, reward models, rejection sampling, RL math, RL implementation

<!-- resource-id: reinforcement-learning__rlhf-book-nathan-lambert -->
- **[RLHF Book (Nathan Lambert)](https://rlhfbook.com/book.pdf)** · `Book` · rlhfbook.com · *2026-07-07*
  A comprehensive, continuously-updated guide to reinforcement learning from human feedback and modern LLM post-training, moving from foundations through the full RLHF pipeline to open research challenges.
  *Key concepts:* instruction tuning, reward modeling, policy gradients (PPO/GRPO), direct alignment (DPO), rejection sampling, synthetic data & evaluation

<!-- resource-id: reinforcement-learning__rlhf-course-nathan-lambert -->
- **[RLHF Course - Nathan Lambert](https://rlhfbook.com/course)** · `Course` · Nathan Lambert · *2026-08-08* · ⭐
  Comprehensive course of Reinforcement Learning ưith Human Feedback LLM
  *Key concepts:* —

<!-- resource-id: post-training-alignment__online-versus-offline-rl-for-llms -->
- **[Online versus Offline RL for LLMs](https://cameronrwolfe.substack.com/p/online-rl)** · `Blog` · Cameron R. Wolfe · *2025-09-08*
  Reviews online and offline alignment approaches, focusing on how fresh on-policy samples affect learning compared with fixed datasets. It discusses PPO's systems costs and semi-online alternatives without treating every preference-optimization method as reinforcement learning.
  *Key concepts:* RLHF, On-policy sampling, Offline alignment, PPO, Preference optimization

### Fine-tuning & training recipes
<!-- resource-id: post-training-playbooks-reports__how-to-train-a-small-model-lfm2-5 -->
- **[How to train a small Model — LFM2.5](https://www.youtube.com/watch?v=fLUtUkqYHnQ)** · `Video` · Maxime Labonne, Liquid AI (YouTube) · *2026-04-29* · ⚠️unverified
  Maxime Labonne shares lessons from training Liquid AI's frontier small models (LFM2 / LFM2.5, down to 230M params) that follow instructions and call tools on-device under 1GB, detailing the pipeline: tempered decoupled Top-K knowledge distillation, difficulty-ordered curriculum, and a three-stage SFT → length-normalized preference optimization → model-merging recipe.
  *Key concepts:* small/edge models, LFM2.5, knowledge distillation, curriculum learning, preference optimization, model merging, on-device tool use

<!-- resource-id: post-training-alignment__finetuning-with-sampling-sft-learns-better-than-you-think -->
- **[Finetuning with Sampling: SFT Learns Better Than You Think](https://aakaran.github.io/finetuning_with_sampling)** · `Paper` · Aayush Karan, Sitan Chen and Yilun Du / Harvard · *—*
  Proposes transforming expert traces with MCMC-based projection sampling before supervised fine-tuning, making the training examples more compatible with the learner's distribution. The project reports improved generalization and reduced forgetting in its evaluated tasks, suggesting a data-shaping alternative to changing the learning objective.
  *Key concepts:* Supervised fine-tuning, MCMC, Projection sampling, On-policy learning, Catastrophic forgetting


### Post-training overviews
<!-- resource-id: post-training-playbooks-reports__slide-post-training -->
- **[SLIDE POST TRAINING](https://kawine.github.io/assets/aiesi_post-training_public.pdf)** · `News` · Kawin Ethayarajh · *2026-8-23*
  Post-TRaining LLM
  *Key concepts:* —

<!-- resource-id: post-training-alignment__olmo-3-and-the-open-llm-renaissance -->
- **[Olmo 3 and the Open LLM Renaissance](https://cameronrwolfe.substack.com/p/olmo-3)** · `Blog` · Cameron R. Wolfe · *2025-12-15*
  Explains Olmo 3's model architecture and the progression from pretraining and midtraining to instruction and reasoning variants. It distinguishes fully released training artifacts from open weights alone; the survey's comparative performance claims remain tied to its cited report.
  *Key concepts:* Olmo 3, Pretraining, Post-training, Open models, Training data

### Fine-tuning tools & ecosystem
<!-- resource-id: thinking-machines-lab__tinker-call-for-community-projects -->
- **[Tinker: Call for Community Projects](https://thinkingmachines.ai/news/call-for-community-projects/)** · `News` · Thinking Machines · *2025-11-07*
  An invitation for researchers and builders to submit Tinker-based projects for featured blog coverage — reimplementations, novel ML methods, fine-tuned domain models, prototypes, datasets, and infrastructure — prioritizing rigorous evaluation over novelty.
  *Key concepts:* community-driven fine-tuning, constitutional AI / RLAIF, self-distillation and transfer learning, rigorous evaluation standards, open reporting

<!-- resource-id: thinking-machines-lab__tinker-announcing-research-and-teaching-grants -->
- **[Tinker: Announcing Research and Teaching Grants](https://thinkingmachines.ai/news/tinker-research-and-teaching-grants/)** · `News` · Thinking Machines · *2025-10-29*
  Grants to support Tinker adoption: $250-per-student teaching grants for academic courses and research grants starting at $5,000, reviewed on a rolling ~one-week basis.
  *Key concepts:* teaching grants ($250/student), research grants ($5,000+), open-weight LLM training, personalized LLMs and RL, open science

<!-- resource-id: thinking-machines-lab__announcing-tinker -->
- **[Announcing Tinker](https://thinkingmachines.ai/news/announcing-tinker/)** · `News` · Thinking Machines · *2025-10-01*
  Launch of Tinker, a managed API for fine-tuning open-weight LLMs that abstracts away distributed-training infrastructure while exposing low-level primitives and an open-source cookbook of post-training methods.
  *Key concepts:* managed fine-tuning API, distributed training abstraction, LoRA cost efficiency, low-level primitives (forward_backward, sample), Tinker Cookbook

### Parameter-efficient fine-tuning
<!-- resource-id: thinking-machines-lab__lora-without-regret -->
- **[LoRA Without Regret](https://thinkingmachines.ai/blog/lora/)** · `Blog` · Thinking Machines · *2025-09-29*
  An empirical study of when LoRA matches full fine-tuning, finding that with proper hyperparameters and application to all layers (especially MLP/MoE), LoRA achieves the same sample efficiency and final performance as full fine-tuning.
  *Key concepts:* low-rank decomposition, all-layer application, learning-rate scaling (~10x), capacity bounds (1 bit/token vs 1 bit/episode), batch-size sensitivity, FLOP efficiency

<!-- resource-id: post-training-alignment__lora-without-regret-trl-implementation-guide -->
- **[LoRA Without Regret: TRL Implementation Guide](https://huggingface.co/docs/trl/main/en/lora_without_regret)** · `Blog` · Hugging Face TRL documentation · *—*
  This TRL guide reproduces configurations from Thinking Machines' LoRA study and relates adapter settings to fine-tuning quality and compute. It is an implementation companion to the original research. Configuration guidance should be matched to the TRL version and workload.
  *Key concepts:* LoRA, Fine-tuning, Hyperparameters, Compute efficiency, TRL

<!-- resource-id: post-training-alignment__lora-vs-full-fine-tuning-an-illusion-of-equivalence -->
- **[LoRA vs Full Fine-tuning: An Illusion of Equivalence](https://arxiv.org/abs/2410.21228)** · `Paper` · Reece Shuttleworth, Jacob Andreas, Antonio Torralba & Pratyusha Sharma · *2024-10-28*
  Analyzes the spectral structure of weights after LoRA versus full fine-tuning and identifies new singular-vector directions associated with LoRA. The revised abstract reports interventions linking these directions to forgetting and discusses accumulation during continual learning.
  *Key concepts:* LoRA, Full fine-tuning, Singular value decomposition, Catastrophic forgetting, Continual learning

### Alignment safety & robustness

<!-- resource-id: post-training-alignment__adversarial-attacks-on-llms -->
- **[Adversarial Attacks on LLMs](https://lilianweng.github.io/posts/2023-10-25-adv-attack-llm/)** · `Blog` · Lilian Weng / Lil'Log · *2023-10-25*
  A research survey of inference-time attacks on fixed language models, organized by threat model and the attacker's access. It covers token perturbations, gradient-based attacks, jailbreak prompting, and human/model red-teaming while distinguishing this scope from poisoning and training-data extraction.
  *Key concepts:* Red teaming, Adversarial robustness, Threat modeling, Alignment, Safety evaluation
