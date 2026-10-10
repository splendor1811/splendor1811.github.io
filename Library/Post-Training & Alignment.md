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
- **[SFT, RL, and On-Policy Distillation Through a Distributional Lens](https://nrehiew.github.io/blog/sft_rl_opd/)** · `Blog` · nrehiew · *—* · ⚠️ unverified
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

<!-- resource-id: post-training-alignment__a-survey-of-on-policy-distillation-for-large-language-models -->
- **[A Survey of On-Policy Distillation for Large Language Models](https://arxiv.org/abs/2604.00626)** · `Paper` · Mingyang Song and Mao Zheng / arXiv · *2026-04-01*
  Organizes on-policy distillation around objectives, supervision sources, and training stabilization. It connects student-generated trajectories with exposure bias, divergence choice, and KL-constrained RL, providing a literature map rather than a single experimentally validated recipe.
  *Key concepts:* On-policy distillation, Exposure bias, Divergence objectives, Teacher feedback, KL regularization

<!-- resource-id: post-training-alignment__on-policy-distillation-of-language-models-learning-from-self-generated-mistakes -->
- **[On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes](https://arxiv.org/abs/2306.13649)** · `Paper` · Rishabh Agarwal, Nino Vieillard et al. / arXiv · *2023-06-23*
  Introduces generalized knowledge distillation using teacher feedback on the student's own generated sequences. The method targets train–inference distribution mismatch, permits alternative divergence losses, and can be combined with RL fine-tuning; evaluations span several sequence-generation tasks.
  *Key concepts:* Generalized knowledge distillation, On-policy learning, Distribution shift, Sequence generation, Teacher feedback

<!-- resource-id: post-training-alignment__minillm-on-policy-distillation-of-large-language-models -->
- **[MiniLLM: On-Policy Distillation of Large Language Models](https://arxiv.org/abs/2306.08543)** · `Paper` · Yuxian Gu, Li Dong, Furu Wei and Minlie Huang / arXiv · *2023-06-14*
  Explores reverse-KL distillation of white-box language models with an on-policy optimization procedure. The abstract motivates reducing student probability on unlikely teacher continuations and reports instruction-following, calibration, and long-generation comparisons against the selected baselines.
  *Key concepts:* MiniLLM, Reverse KL, On-policy distillation, Calibration, Exposure bias


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

<!-- resource-id: post-training-alignment__nemotron-cascade-2-post-training-llms-with-cascade-rl-and-multi-domain-on-policy-distillation -->
- **[Nemotron-Cascade 2: Post-Training LLMs with Cascade RL and Multi-Domain On-Policy Distillation](https://arxiv.org/abs/2603.19220)** · `Paper` · Zhuolin Yang, Zihan Liu et al. / NVIDIA · *2026-03-19*
  Describes a staged recipe combining supervised fine-tuning, domain-wise Cascade RL, and on-policy distillation from strong intermediate specialists. The report frames distillation as a way to recover domain regressions and consolidate capabilities in one model; its benchmark outcomes are specific to the reported training setup.
  *Key concepts:* Cascade RL, Multi-teacher distillation, On-policy distillation, Capability consolidation, Post-training

<!-- resource-id: post-training-alignment__self-distilled-reasoner-on-policy-self-distillation-for-large-language-models -->
- **[Self-Distilled Reasoner: On-Policy Self-Distillation for Large Language Models](https://arxiv.org/abs/2601.18734)** · `Paper` · Siyan Zhao, Zhihui Xie et al. / arXiv · *2026-01-26*
  Uses one language model as both teacher and student, giving only the teacher privileged context such as a verified solution. Training aligns their token distributions on student-generated rollouts, with the paper evaluating the approach on mathematical reasoning benchmarks.
  *Key concepts:* Self-distillation, Privileged information, On-policy rollouts, Token-level supervision, Mathematical reasoning

<!-- resource-id: post-training-alignment__rlcsd-reinforcement-learning-with-contrastive-on-policy-self-distillation -->
- **[RLCSD: Reinforcement Learning with Contrastive On-Policy Self-Distillation](https://arxiv.org/abs/2606.11709)** · `Paper` · Leyi Pan, Shuchang Tao et al. / arXiv · *2026-06-10*
  Diagnoses privileged-context self-distillation signals that emphasize stylistic shortening instead of task-relevant tokens. RLCSD contrasts teacher–student gaps under correct and incorrect hints to reduce this effect, with evaluations on reasoning and additional agent tasks.
  *Key concepts:* Self-distillation, Contrastive supervision, Privileged information, Style drift, Token-level rewards

<!-- resource-id: post-training-alignment__dopd-dual-on-policy-distillation -->
- **[DOPD: Dual On-policy Distillation](https://arxiv.org/abs/2606.30626)** · `Paper` · Xinlei Yu, Gen Li et al. / arXiv · *2026-06-29*
  Examines how privileged information can make a teacher-student information gap look like transferable capability during on-policy distillation. DOPD routes token-level supervision between privileged teacher and student policies using advantage and probability signals; claimed improvements are limited to the paper's evaluated LLM and VLM settings.
  *Key concepts:* On-policy distillation, Privileged information, Token-level supervision, Advantage estimation, Teacher-student learning

<!-- resource-id: post-training-alignment__weak-to-strong-generalization-via-direct-on-policy-distillation -->
- **[Weak-to-Strong Generalization via Direct On-Policy Distillation](https://arxiv.org/abs/2607.05394)** · `Paper` · Shiyuan Feng, Huan-ang Gao et al. / arXiv · *2026-07-06*
  Transfers a smaller teacher's RL-induced policy change rather than directly imitating its final policy. Direct-OPD compares post-RL and pre-RL teacher checkpoints to produce dense supervision on a stronger student's own trajectories; the abstract reports weak-to-strong transfer in the evaluated reasoning setups, not unrestricted capability transfer.
  *Key concepts:* On-policy distillation, Weak-to-strong generalization, Policy shifts, Implicit rewards, Teacher-student learning

<!-- resource-id: post-training-alignment__self-distillation-enables-continual-learning -->
- **[Self-Distillation Enables Continual Learning](https://arxiv.org/abs/2601.19897)** · `Paper` · Idan Shenfeld, Mehul Damani, Jonas Hübotter and Pulkit Agrawal / arXiv · *2026-01-27*
  Uses a demonstration-conditioned copy of a model as the teacher for its own on-policy learning. The abstract presents Self-Distillation Fine-Tuning as a way to acquire new skills while reducing interference with earlier capabilities, compared with supervised fine-tuning. The reported continual-learning results are task-specific evidence, not a guarantee against forgetting in arbitrary deployments.
  *Key concepts:* Self-distillation, Continual learning, Demonstration conditioning, On-policy rollouts, Catastrophic forgetting


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
- **[On the Position Bias of On-Policy Distillation](https://yannx1e.github.io/IW-OPD/)** · `Blog` · Yan Xie, Sijie Zhu, Tiansheng Wen, Bo Chen and Yifei Wang · *2026-06*
  Studies how teacher supervision changes as student-generated prefixes drift away from teacher-compatible contexts. The companion post motivates importance-weighted OPD through prefix compatibility and a constrained-update view, with controlled experiments showing that token positions are not interchangeable. It does not claim that early tokens are always superior or that suffix supervision is inherently useless.
  *Key concepts:* On-policy distillation, Position bias, Prefix importance weighting, Teacher-student mismatch, Constrained optimization

<!-- resource-id: post-training-alignment__how-to-steal-reasoning-without-reasoning-traces -->
- **[How to Steal Reasoning Without Reasoning Traces](https://arxiv.org/abs/2603.07267)** · `Paper` · Tingwei Zhang, John X. Morris and Vitaly Shmatikov / arXiv · *2026-03-07*
  Studies synthetic reasoning-trace reconstruction from questions, final answers, and optional summaries. The abstract reports that such traces can improve student reasoning, highlighting a limit of hiding intermediate traces as a barrier to capability transfer; generated traces are not direct access to private internal reasoning.
  *Key concepts:* Knowledge distillation, Synthetic reasoning, Black-box models, Trace inversion, Capability transfer

<!-- resource-id: post-training-alignment__why-does-self-distillation-sometimes-degrade-the-reasoning-capability-of-llms -->
- **[Why Does Self-Distillation (Sometimes) Degrade the Reasoning Capability of LLMs?](https://arxiv.org/abs/2603.24472)** · `Paper` · Jeonghye Kim, Xufang Luo et al. / arXiv · *2026-03-25*
  Investigates cases where self-distillation shortens reasoning but harms mathematical performance. The abstract links this to suppressed uncertainty expression under rich teacher context and limited task coverage, especially out of distribution; it is a conditional failure analysis, not a universal rejection of self-distillation.
  *Key concepts:* Self-distillation, Uncertainty, Out-of-distribution generalization, Reasoning traces, Failure analysis

<!-- resource-id: post-training-alignment__trajectory-refined-distillation -->
- **[Trajectory-Refined Distillation](https://arxiv.org/abs/2606.08432)** · `Paper` · Li Jiang, Haoran Xu, Yichuan Ding and Amy Zhang / arXiv · *2026-06-07*
  Attributes a failure mode of token-level on-policy distillation to problematic student prefixes and proposes teacher-guided trajectory correction before the distillation step. TRD aims to repair the context that produces fragmented supervision and expose alternative valid reasoning paths. The abstract reports gains across selected models and benchmarks; the mechanism and comparisons remain unvalidated here beyond that account.
  *Key concepts:* On-policy distillation, Prefix failure, Trajectory correction, Teacher-guided exploration, Self-distillation

<!-- resource-id: post-training-alignment__rethinking-on-policy-distillation-of-large-language-models-phenomenology-mechanism-and-recipe -->
- **[Rethinking On-Policy Distillation of Large Language Models: Phenomenology, Mechanism, and Recipe](https://arxiv.org/abs/2604.13016)** · `Paper` · Yaxuan Li, Yuxin Zuo et al. / arXiv · *2026-04-14*
  Investigates OPD failures in relation to teacher–student thinking-pattern compatibility and whether the teacher contributes capabilities new to the student. The abstract connects successful runs to token-probability alignment on student-visited states and proposes off-policy cold starts and teacher-aligned prompts; these findings concern the studied setups, not universal conditions for distillation success.
  *Key concepts:* On-policy distillation, Teacher-student compatibility, Token-level alignment, Off-policy cold start, Prompt selection


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

<!-- resource-id: post-training-alignment__reward-models -->
- **[Reward Models](https://cameronrwolfe.substack.com/p/reward-models)** · `Blog` · Cameron R. Wolfe · *2025-06-30*
  Introduces preference scoring through Bradley–Terry comparisons, reward-model architecture, and a pairwise training loop. Relates learned rewards to RLHF, verifiable rewards, direct preference optimization, and best-of-N selection. Its evaluation discussion distinguishes pairwise benchmark accuracy from downstream usefulness, highlighting data difficulty, reward exploitation, and why a larger reward model need not improve the trained policy.
  *Key concepts:* Reward modeling, Bradley–Terry model, Preference data, RewardBench, Best-of-N sampling


### Fine-tuning & training recipes
<!-- resource-id: post-training-playbooks-reports__how-to-train-a-small-model-lfm2-5 -->
- **[How to train a small Model — LFM2.5](https://www.youtube.com/watch?v=fLUtUkqYHnQ)** · `Video` · Maxime Labonne, Liquid AI (YouTube) · *2026-04-29* · ⚠️unverified
  Maxime Labonne shares lessons from training Liquid AI's frontier small models (LFM2 / LFM2.5, down to 230M params) that follow instructions and call tools on-device under 1GB, detailing the pipeline: tempered decoupled Top-K knowledge distillation, difficulty-ordered curriculum, and a three-stage SFT → length-normalized preference optimization → model-merging recipe.
  *Key concepts:* small/edge models, LFM2.5, knowledge distillation, curriculum learning, preference optimization, model merging, on-device tool use

<!-- resource-id: post-training-alignment__finetuning-with-sampling-sft-learns-better-than-you-think -->
- **[Finetuning with Sampling: SFT Learns Better Than You Think](https://aakaran.github.io/finetuning_with_sampling)** · `Paper` · Aayush Karan, Sitan Chen and Yilun Du / Harvard · *—*
  Proposes transforming expert traces with MCMC-based projection sampling before supervised fine-tuning, making the training examples more compatible with the learner's distribution. The project reports improved generalization and reduced forgetting in its evaluated tasks, suggesting a data-shaping alternative to changing the learning objective.
  *Key concepts:* Supervised fine-tuning, MCMC, Projection sampling, On-policy learning, Catastrophic forgetting

<!-- resource-id: post-training-alignment__reducing-doom-loops-with-final-token-preference-optimization -->
- **[Reducing Doom Loops with Final Token Preference Optimization](https://liquid.ai/blog/antidoom)** · `Blog` · Liquid AI · *2026-07-07*
  Describes Antidoom, a targeted preference-training procedure for the token that starts a repetitive generation loop. Contrasts this intervention with inference-time repetition penalties and explains how mined failures yield chosen/rejected examples; reported improvements concern the tested checkpoint and prompt mix.
  *Key concepts:* Preference optimization, Repetition loops, Reasoning stability, Failure mining, Token-level training

<!-- resource-id: post-training-alignment__prism-demystifying-retention-and-interaction-in-mid-training -->
- **[PRISM: Demystifying Retention and Interaction in Mid-Training](https://arxiv.org/abs/2603.17074)** · `Paper` · Bharat Runwal, Ashish Agrawal, Anurag Roy and Rameswar Panda / arXiv · *2026-03-17*
  Studies how mid-training data mixtures affect reasoning gains, capability retention, and the effectiveness of later RL across several model families. The abstract contrasts broad mid-training representation changes with more localized RL updates; its retention and interaction findings remain bounded by the tested models and data pipeline.
  *Key concepts:* Mid-training, Capability retention, Data mixtures, Representation analysis, RL post-training


### Post-training overviews
<!-- resource-id: post-training-playbooks-reports__slide-post-training -->
- **[SLIDE POST TRAINING](https://kawine.github.io/assets/aiesi_post-training_public.pdf)** · `News` · Kawin Ethayarajh · *2026-8-23*
  Post-TRaining LLM
  *Key concepts:* —

<!-- resource-id: post-training-alignment__olmo-3-and-the-open-llm-renaissance -->
- **[Olmo 3 and the Open LLM Renaissance](https://cameronrwolfe.substack.com/p/olmo-3)** · `Blog` · Cameron R. Wolfe · *2025-12-15*
  Explains Olmo 3's model architecture and the progression from pretraining and midtraining to instruction and reasoning variants. It distinguishes fully released training artifacts from open weights alone; the survey's comparative performance claims remain tied to its cited report.
  *Key concepts:* Olmo 3, Pretraining, Post-training, Open models, Training data

<!-- resource-id: post-training-alignment__llama-nemotron-efficient-reasoning-models -->
- **[Llama-Nemotron: Efficient Reasoning Models](https://arxiv.org/abs/2505.00949)** · `Paper` · Akhiad Bercovich, Itay Levy et al. / NVIDIA · *2025-05-02*
  Describes the Llama-Nemotron family through architecture search, distillation, continued pretraining, supervised fine-tuning, and RL. The report connects dynamic reasoning controls to an open model/data/tooling release and presents efficiency comparisons for the evaluated model configurations.
  *Key concepts:* Post-training, Knowledge distillation, Continued pretraining, Reasoning control, Model compression

<!-- resource-id: post-training-alignment__olmo-3 -->
- **[Olmo 3](https://arxiv.org/abs/2512.13961)** · `Paper` · Team Olmo / Ai2 · *2025-12-15*
  Introduces the Olmo 3 model family and its release of the training lifecycle, including checkpoints, data, stages, and dependencies. The abstract positions the models for reasoning, coding, tool use, and instruction following; it is a primary model-flow reference rather than independent confirmation of the release's performance ranking.
  *Key concepts:* Open models, Training lifecycle, Reasoning, Post-training, Reproducibility


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

<!-- resource-id: post-training-alignment__trl-training-customization -->
- **[TRL training customization](https://huggingface.co/docs/trl/main/en/customization)** · `Blog` · Hugging Face / TRL contributors · *—*
  Demonstrates post-training customization through optimizer and scheduler injection, callbacks, evaluation metrics, and subclassed trainer losses. The examples distinguish training-loop reuse from changes to objectives and batch formats; they target the evolving main branch and require version checks before use.
  *Key concepts:* TRL, DPO, Training objectives, Callbacks, Gradient accumulation

<!-- resource-id: post-training-alignment__trl-transformers-reinforcement-learning-toolkit -->
- **[TRL: Transformers Reinforcement Learning toolkit](https://huggingface.co/docs/trl/en/index)** · `Repo` · Hugging Face / TRL contributors · *—*
  Documents a Transformers-integrated toolkit for supervised fine-tuning, preference optimization, reward modeling, online RL, and distillation. Its overview distinguishes standard trainers from experimental ones, which is useful when selecting an implementation but is not evidence that all listed methods have equal maturity.
  *Key concepts:* TRL, SFT, DPO, GRPO, Distillation

<!-- resource-id: post-training-alignment__open-instruct-open-instruction-tuning-and-post-training -->
- **[Open Instruct: open instruction tuning and post-training](https://github.com/allenai/open-instruct)** · `Repo` · Ai2 / Open Instruct contributors · *—*
  A research codebase for instruction tuning, preference optimization, and reinforcement learning with verifiable rewards on public datasets. The README connects training recipes with contamination checks and model artifacts, while warning about backward compatibility and directing maintained evaluations to OLMES.
  *Key concepts:* Instruction tuning, DPO, RLVR, Data contamination, Open training recipes


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

<!-- resource-id: post-training-alignment__stealing-reasoning-traces-from-proprietary-llm-apis -->
- **[Stealing Reasoning Traces from Proprietary LLM APIs](https://arxiv.org/abs/2608.09867)** · `Paper` · Alexander Panfilov, David Schmotz et al. / arXiv · *2026-08-10*
  Reports security risks in client-side encrypted reasoning artifacts, including cross-context reuse, private-data exposure, and hidden prompt-injection channels. The abstract motivates stronger cryptographic and system boundaries after responsible disclosure; it does not establish which provider configurations remain affected at review time.
  *Key concepts:* Reasoning privacy, Cryptographic binding, Prompt injection, Data leakage, Responsible disclosure
