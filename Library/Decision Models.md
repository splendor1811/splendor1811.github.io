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

### LinkedIn saves · Aug–Nov 2026
<!-- resource-id: linkedin-saved-7521520296999260161 -->
- **[Milestone unlocked 🎉 Our open‑source project vllm‑jev has hit 800 GitHub stars.](https://github.com/mode-io/vllm-jev)** · `Repo` · ZIYI CHEN / LinkedIn · *2026-10-29* · ⚠️unverified
  Saved by the owner from a LinkedIn post by ZIYI CHEN. The post exposed the linked source used above; the LinkedIn permalink is retained in provenance.
  *Key concepts:* Decision models, LinkedIn saved post

<!-- resource-id: linkedin-saved-7517955309672357888 -->
- **[How to Build a Decision Model Like Jev – Oumi Blog](https://oumi.ai/blog/how-to-build-a-decision-model-like-jev)** · `Blog` · Jeremiah Greer / LinkedIn · *2026-10-19* · ⚠️unverified
  Saved by the owner from a LinkedIn post by Jeremiah Greer. The post exposed the linked source used above; the LinkedIn permalink is retained in provenance.
  *Key concepts:* Decision models, LinkedIn saved post

<!-- resource-id: linkedin-saved-7517861114525745152 -->
- **[Can you train an LLM to say “I don’t know” without it saying it all the time?](https://www.linkedin.com/feed/update/urn:li:activity:7517861114525745152/)** · `Blog` · Maxime Labonne / LinkedIn · *2026-10-19* · ⚠️unverified
  Saved by the owner from a LinkedIn post by Maxime Labonne. No external source URL was exposed in the expanded card, so the post permalink is retained as the resource URL.
  *Key concepts:* Decision models, LinkedIn saved post

<!-- resource-id: linkedin-saved-7513253147360841729 -->
- **[Introducing d1: The most capable decision model, now with vision | Blog](https://www.liquid.ai/blog/d1-decision-model)** · `Blog` · Richie S. / LinkedIn · *2026-10-06* · ⚠️unverified
  Saved by the owner from a LinkedIn post by Richie S.. The post exposed the linked source used above; the LinkedIn permalink is retained in provenance.
  *Key concepts:* Decision models, LinkedIn saved post

<!-- resource-id: linkedin-saved-7516760353339523072 -->
- **[How do you 𝗳𝗶𝗻𝗲-𝘁𝘂𝗻𝗲 𝗮 𝗱𝗲𝗰𝗶𝘀𝗶𝗼𝗻 𝗺𝗼𝗱𝗲𝗹 on your own data?](https://github.com/Liquid4All/cookbook/blob/main/finetuning/notebooks/sft_for_decision_models_with_unsloth.ipynb)** · `Repo` · Leonie Monigatti / LinkedIn · *2026-10-16* · ⚠️unverified
  Saved by the owner from a LinkedIn post by Leonie Monigatti. The post exposed 2 source links; the first is used above; the LinkedIn permalink is retained in provenance.
  *Key concepts:* Decision models, LinkedIn saved post

<!-- resource-id: linkedin-saved-7516323851065069569 -->
- **[Everyone is talking about 'System One models' like Jev: given a state, question, and set of options, they return a calibrated decision at a fraction o](https://arxiv.org/abs/2610.17205)** · `Paper` · Jonathan Geuter / LinkedIn · *2026-10-15* · ⚠️unverified
  Saved by the owner from a LinkedIn post by Jonathan Geuter. The post exposed 4 source links; the first is used above; the LinkedIn permalink is retained in provenance.
  *Key concepts:* Decision models, LinkedIn saved post

<!-- resource-id: linkedin-saved-7513861287236268032 -->
- **[Fine-tuning a small model into a usable decision model used to mean a serious GPU budget.](https://www.linkedin.com/feed/update/urn:li:activity:7513861287236268032/)** · `Blog` · Mustafa Başar / LinkedIn · *2026-10-08* · ⚠️unverified
  Saved by the owner from a LinkedIn post by Mustafa Başar. No external source URL was exposed in the expanded card, so the post permalink is retained as the resource URL.
  *Key concepts:* Decision models, LinkedIn saved post

<!-- resource-id: linkedin-saved-7515425154684928002 -->
- **[transformers serve is now able to turn any LLM or VLM into a decision model with a `/v1/systemone` endpoint 🤯 We are in the process of standardizing](https://www.linkedin.com/feed/update/urn:li:activity:7515425154684928002/)** · `Blog` · Julien Chaumond / LinkedIn · *2026-10-12* · ⚠️unverified
  Saved by the owner from a LinkedIn post by Julien Chaumond. No external source URL was exposed in the expanded card, so the post permalink is retained as the resource URL.
  *Key concepts:* Decision models, LinkedIn saved post

<!-- resource-id: linkedin-saved-7514676443411505152 -->
- **[You can now train your own Decision model!](https://www.linkedin.com/feed/update/urn:li:activity:7514676443411505152/)** · `Blog` · Sumanth P / LinkedIn · *2026-10-10* · ⚠️unverified
  Saved by the owner from a LinkedIn post by Sumanth P. No external source URL was exposed in the expanded card, so the post permalink is retained as the resource URL.
  *Key concepts:* Decision models, LinkedIn saved post

<!-- resource-id: linkedin-saved-7512188799133855744 -->
- **[Is It Okay to Skip Calibration for FP8 Quantization?](https://www.jaebok-lee.com/posts/en/fp8-quantization)** · `Blog` · Jaebok Lee / LinkedIn · *2026-10-03* · ⚠️unverified
  Saved by the owner from a LinkedIn post by Jaebok Lee. The post exposed the linked source used above; the LinkedIn permalink is retained in provenance.
  *Key concepts:* Decision models, LinkedIn saved post
