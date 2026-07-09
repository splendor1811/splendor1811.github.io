# On-Policy Distillation

[[Library|← Back to Library index]] · Related: [[Reinforcement Learning]] · [[Async & Infrastructure RL]] · [[Thinking Machines Lab]]

On-Policy Distillation (OPD) blends the on-policy sampling of RL with the dense, per-token supervision of distillation: the student generates its own rollouts and a teacher grades every token via reverse-KL. This library collects first-principles derivations, the distributional intuition behind it, multi-teacher and cross-family recipes, and the failure modes (prefix drift, position bias, myopic gradients) that decide when it actually helps.

**Suggested reading order:** On-Policy Distillation from First Principles → On-Policy Distillation (Thinking Machines) ⭐ → SFT, RL, and OPD Through a Distributional Lens → MOPD (multi-teacher) → Unmasking On-Policy Distillation (pitfalls).

### Foundations & first principles
- **[On-Policy Distillation from First Principles](https://yanta.site/c/on-policy-distillation-from-first-principles-82m6)** · `Blog` · yanta.site · *2026-06-13*
  Derives OPD by decomposing the reverse-KL loss into an entropy term (spread probability) and a cross-entropy term (only where the teacher assigns mass), showing how teacher sharpness propagates to the student and how predictable prefixes can trigger repetition collapse.
  *Key concepts:* reverse-KL decomposition, entropy vs. cross-entropy tension, mode-seeking behavior, repetition collapse, teacher sharpness propagation
- **[On-Policy Distillation](https://thinkingmachines.ai/blog/on-policy-distillation/)** · `Blog` · Thinking Machines Lab · *2025-10-27* · ⭐
  The canonical write-up: combine student sampling with dense per-token teacher supervision (reverse-KL) to get RL's relevance plus distillation's information density, achieving 9-30x cost reductions on math reasoning and personalized-assistant tasks while preserving prior capabilities.
  *Key concepts:* reverse-KL per-token loss, dense vs. sparse reward (N bits vs. 1 bit), on-policy sampling, process supervision, continual learning / catastrophic forgetting
- **[SFT, RL, and On-Policy Distillation Through a Distributional Lens](https://nrehiew.github.io/blog/sft_rl_opd/)** · `Blog` · nrehiew · *2026-01-01*
  Views LMs as distributions over sequences and argues that on-policy data (not explicit KL regularization) is what lets RL and OPD preserve capabilities better than SFT, showing empirically that OPD students can match or exceed their teachers.
  *Key concepts:* distributional view of post-training, forward vs. reverse KL, on-policy sampling as implicit regularization, catastrophic forgetting, SFT→RL→OPD pipelines
- **[The Imitation Game: State of Policy Distillation in LM Training](https://chinmaykarkar.com/blog/OPD_blog/)** · `Blog` · Chinmay Karkar · *2026-01-01*
  A survey of OPD and on-policy self-distillation (OPSD) as post-training techniques, arguing they beat off-policy distillation on catastrophic forgetting and error compounding, and cataloging open problems like cross-tokenizer alignment and verifier calibration.
  *Key concepts:* OPD/OPSD, mode-seeking vs. mode-covering, exposure bias / error compounding, privileged-information self-distillation, prefix drift, cross-tokenizer alignment
- **[Understanding Self-Distillation and Privileged Information Distillation](https://emilianopp.github.io/Privileged-Information-Distillation-and-Self-Distillation/)** · `Blog` · Emiliano Penaloza · *2026-02-01*
  Explores how a model can exploit privileged context (solutions, feedback, documents) unavailable at inference to teach a deployment student, framed through RL-as-inference and variational EM.
  *Key concepts:* privileged information distillation, reverse- vs. forward-KL, reward-tilted self-distillation, variational EM, π-Distill (shared-parameter α interpolation), RL-as-inference

### Techniques & multi-teacher
- **[MOPD: Multi-Teacher On-Policy Distillation for Capability Integration in LLM Post-Training](https://arxiv.org/abs/2606.30406)** · `Paper` · arXiv · *2026-06-29*
  Trains separate domain-specialized RL teachers in parallel, then distills all of them into one student via on-policy learning, inheriting nearly all of each teacher's capability while eliminating exposure bias.
  *Key concepts:* multi-teacher distillation, domain-specialized RL teachers, on-policy knowledge transfer, exposure-bias elimination, dense optimization signal, parallel teacher development
- **[Multi-Teacher On-Policy Distillation: A New Post-Training Primitive](https://yumoxu.notion.site/multi-teacher-on-policy-distillation)** · `Blog` · Yumo Xu (Notion) · *—* · ⚠️unverified
  Positions multi-teacher OPD as a general post-training primitive that merges several specialist teachers into a single student through on-policy rollouts and per-token supervision, as an alternative to model merging or sequential fine-tuning.
  *Key concepts:* multi-teacher OPD, capability integration, on-policy rollouts, per-token teacher supervision, post-training primitives
- **[Unlocking On-Policy Distillation for Any Model Family](https://huggingface.co/spaces/HuggingFaceH4/on-policy-distillation)** · `Blog` · Hugging Face H4 · *—*
  Demonstrates an OPD recipe generalized across heterogeneous model families, lowering the barrier to applying reverse-KL student-sampled distillation regardless of the teacher/student architecture pairing.
  *Key concepts:* on-policy distillation, cross-model-family generalization, knowledge distillation tooling, teacher-student pairing
- **[Distilling 100B+ Models 40x Faster with TRL](https://huggingface.co/spaces/HuggingFaceTB/trl-distillation-trainer)** · `Blog` · Hugging Face (SmolLM/TB) · *—*
  Shows a TRL-based distillation trainer that compresses 100B+ teacher models into smaller students roughly 40x faster than baseline pipelines, packaging OPD-style training as reusable infrastructure.
  *Key concepts:* TRL distillation trainer, 100B+ teacher compression, 40x speedup, large-model optimization, distillation tooling
- **[On Policy Self Distillation](https://x.com/ar0cket1/status/2054108160450064571)** · `Blog` · @ar0cket1 (X) · *—* · ⚠️unverified
  A thread introducing on-policy self-distillation (OPSD), where a single model conditioned on privileged information (answers, hints, longer context) supervises its own no-context rollouts, avoiding the need for a stronger external teacher.
  *Key concepts:* on-policy self-distillation, privileged-context conditioning, self-supervision, reverse-KL, teacher-free distillation
- **[Solving OPSD](https://x.com/ar0cket1/status/2065772402622263701)** · `Blog` · @ar0cket1 (X) · *—* · ⚠️unverified
  A follow-up thread tackling practical failure modes of OPSD—unreliable self-supervision on drifted prefixes and long-horizon degradation—and proposing fixes such as trajectory filtering and reweighting.
  *Key concepts:* OPSD failure modes, prefix drift, long-horizon degradation, trajectory filtering, token reweighting

### Critical analysis & pitfalls
- **[Unmasking On-Policy Distillation: Where It Helps, Where It Hurts, and Why](https://arxiv.org/pdf/2605.10889)** · `Paper` · arXiv · *2026-05-12*
  Provides theory and experiments dissecting when OPD improves vs. degrades a student, tracing the difference to teacher-student distribution mismatch and alignment-score distributions across reasoning and instruction-following tasks.
  *Key concepts:* OPD in RL settings, distribution mismatch, alignment-score analysis, policy optimization with distillation objectives, when-it-helps-vs-hurts framework
- **[On-Policy Distillation: Promise, Pitfalls, and Prospects](https://louieworth.github.io/blog/opd_reflection/)** · `Blog` · Louie Worth · *2026-06-08*
  Identifies three OPD failure modes—noisy teacher supervision on off-manifold prefixes, teacher reliability decay over long horizons, and myopic per-token gradients that only reward correction onsets—and proposes Trajectory-Refined Distillation plus RLVR integration.
  *Key concepts:* local noise in teacher supervision, horizon-induced coverage decay, myopic gradient problem, Trajectory-Refined Distillation (TRD), RLVR integration, OPSD
- **[On the Position Bias of On-Policy Distillation](https://yannx1e.github.io/IW-OPD/)** · `Blog` · yannx1e · *2026-06-01*
  Shows OPD supervision is not uniform across positions—early tokens carry more useful signal than late ones as prefixes drift from the teacher—and introduces Importance-Weighted OPD (IW-OPD) to reweight token advantages by prefix compatibility.
  *Key concepts:* position bias, finite-budget constrained optimization, prefix importance weighting, cumulative unsigned discrepancy, teacher-student continuation gap, IW-OPD

### Threads, talks & collections
- **[On SFT, RL, and on-policy distillation (thread)](https://x.com/willccbb/status/2050038277454143918)** · `Blog` · @willccbb (X) · *—* · ⚠️unverified
  A widely-shared thread contrasting SFT, RL, and OPD as post-training regimes, arguing OPD occupies the sweet spot of dense supervision plus on-policy data and explaining intuitively why it resists forgetting.
  *Key concepts:* SFT vs. RL vs. OPD, dense per-token supervision, on-policy data, capability preservation, post-training tradeoffs
- **[Blackboard explanation of On-Policy Distillation](https://x.com/dwarkesh_sp/status/2062353335529935114)** · `Video` · @dwarkesh_sp (X) · *—* · ⚠️unverified
  A whiteboard/blackboard-style walkthrough breaking down the OPD training loop—student rollout, teacher scoring, reverse-KL update—for a general technical audience.
  *Key concepts:* OPD training loop, student rollout, teacher scoring, reverse-KL, intuition-building explainer
- **[The Magic of LLM Distillation — Rishabh Agarwal, Google DeepMind](https://www.youtube.com/watch?v=O1AR4iL30mg)** · `Video` · YouTube (Rishabh Agarwal, DeepMind) · *—* · ⚠️unverified
  A talk surveying LLM distillation from a leading researcher on generalized knowledge distillation (GKD), covering why on-policy student-generated data and teacher feedback outperform off-policy imitation for training capable smaller models.
  *Key concepts:* generalized knowledge distillation (GKD), on-policy distillation, teacher feedback, off-policy imitation limits, small-model training
- **[AwesomeOPD (curated repo)](https://github.com/thinkwee/AwesomeOPD)** · `Repo` · GitHub (thinkwee) · *2026-06-23*
  A curated awesome-list cataloging OPD research across white-box, black-box, self-distillation, and OPD-RL hybrid categories, annotated along four design dimensions with both foundational and recent papers.
  *Key concepts:* OPD, OPSD, white-box vs. black-box supervision, trajectory-level refinement (TRD, FiRe-OPD), OPD-RL hybrids (GRPO/PPO), privileged-context mechanisms
- **[Why Self-Distillation Is Taking Over LLM Post-Training (w/ the researchers behind it)](https://www.youtube.com/watch?v=OgEGV7apEzI)** · `Video` · Yacine Mahdid (YouTube) · *2026-04-28* · ⚠️unverified
  An interview with researchers Idan Shenfeld and Jonas Hübotter on self-distillation as a post-training paradigm, where the model acts as its own teacher by conditioning on privileged feedback or demonstrations. Covers SDPO for RL with rich feedback and SDFT for continual learning without catastrophic forgetting.
  *Key concepts:* self-distillation, on-policy distillation, SDPO, SDFT, dense reward signal, continual learning
