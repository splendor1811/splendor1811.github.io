# Decision Models

[[Library|← Back to Library index]] · Related: [[Data & Evaluation]] · [[Post-Training & Alignment]] · [[Agents, Memory & Retrieval]]

Models and interfaces that turn state into bounded, machine-consumable decisions: classes, scores, routes, probabilities, or rubric positions. This domain separates vendor claims from independent evaluation and treats calibration, thresholds, abstention, and failure analysis as first-class engineering concerns.

**Suggested reading order:** classifier history → TypeSafe's Jev introduction → independent Jev benchmark → Perplexity Decider explainer → fine-tuning notebooks → threshold tuning and calibration for evals.

### Foundations & model interfaces
<!-- resource-id: foundations-math__language-models-for-text-classification-from-bag-of-words-to-jev -->
- **[Language Models for Text Classification: From Bag-of-Words to Jev](https://magazine.sebastianraschka.com/p/classifier-history-and-jev)** · `Blog` · Sebastian Raschka · *2026-09-29*
  Places modern decision APIs in the history of text classification, from bag-of-words methods to Transformer classification heads and text-to-text predictions. Contrasts task-specific classifiers with general-purpose decision models; discussion of Jev's undisclosed internals is explicitly interpretation, not confirmed architecture documentation.
  *Key concepts:* Text classification, Bag of words, Classification heads, Text-to-text prediction, Decision models

<!-- resource-id: decision-models__introducing-system-one-models-and-jev -->
- **[Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)** · `Blog` · Diogo Almeida / TypeSafe AI · *2026-09-15* · ⭐
  TypeSafe's launch article defines Jev as a non-generative model that maps unstructured state and typed questions to bounded probabilistic decisions. It introduces the vendor's RLCD framing, parallel sampling, and automation use cases; latency, cost, calibration, and intelligence comparisons remain company-reported claims and should be read alongside independent evaluation.
  *Key concepts:* Jev, System One models, Typed decisions, Calibrated probabilities, RLCD, Parallel sampling

<!-- resource-id: synthetic-data-evaluation__perplexity-decider-decision-model-explainer -->
- **[Decision Models: How Perplexity's Decider Works](https://isaacflath.com/research/perplexity-decider)** · `Blog` · Isaac Flath · *2026-10-28*
  Explains the decision-model abstraction through Perplexity's Decider: a small model receives a natural-language decision rule plus context and returns a score for routing or classification. The article is useful for the interface and training intuition, but references to proprietary internals should be treated as an informed explanation rather than complete implementation disclosure.
  *Key concepts:* Decision models, Routing, Classification, Natural-language criteria, Small language models, Model-based scoring

### Evaluation, calibration & limits
<!-- resource-id: decision-models__evaluating-and-benchmarking-jev -->
- **[Evaluating and Benchmarking the System One Model Jev](https://arxiv.org/abs/2609.37647)** · `Paper` · Tobias Deußer, Rajkumar Ramamurthy, Lorenz Sparrenberg and Rafet Sifa · *2026-09-29* · ⭐
  Evaluates Jev 1.13 zero-shot across 37 datasets and 346,009 requests, with released code and raw responses. The study finds strong classification and selective-prediction results while documenting weaker low-resource language, fine-grained label, rubric, and sequential-control behavior; tuned thresholds materially change binary-task results, so default probabilities should not be treated as deployment-ready policy.
  *Key concepts:* Jev, Decision-model evaluation, Calibration, Selective prediction, Threshold tuning, Sequential decisions

<!-- resource-id: synthetic-data-evaluation__how-to-use-decision-models-for-evals -->
- **[How To Use Decision Models for Evals](https://hamel.dev/blog/posts/decision-model-evals/)** · `Blog` · Hamel Husain and Antaripa Saha · *2026-10-20*
  Compares six decision-model options on 100 human-labeled apartment-leasing agent traces. Shows why a default 0.5 cutoff can miss failures, then demonstrates cross-validated threshold tuning, precision–recall trade-offs, cost comparison, and probability calibration. Results are task- and sample-specific, not a general model ranking.
  *Key concepts:* Decision-model evaluation, Failure detection, Threshold tuning, Precision–recall, Calibration

### Training & implementation
<!-- resource-id: post-training-alignment__liquid-ai-decision-model-finetuning-notebooks -->
- **[Liquid AI decision-model fine-tuning notebooks](https://github.com/Liquid4All/cookbook/tree/main/finetuning/notebooks)** · `Repo` · Liquid AI / Liquid4All · *—*
  Two official cookbook notebooks show supervised fine-tuning of a decision model with Unsloth and with TRL. They are implementation examples for preparing decision-model data and training, not a general comparison of post-training methods; notebooks were inspected at repository level, not executed.
  *Key concepts:* Decision models, Supervised fine-tuning, Unsloth, TRL, Training data
