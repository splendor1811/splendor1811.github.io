# Synthetic Data & Evaluation

[[Library|← Back to Library index]] · Related: [[Reinforcement Learning]] · [[On-Policy Distillation]] · [[Post-Training Playbooks & Reports]]

A working library on producing evaluation and training data at scale, and on trusting the systems that grade it. Covers agentic and playbook-style synthetic data generation, LLM-as-a-judge validation, and verifier reliability. Emphasis throughout is on methodology: aligning judges to human experts, preventing mode collapse, and measuring consistency.

### Synthetic data
- **[Autodata: An agentic data scientist to create high quality synthetic data](https://arxiv.org/pdf/2606.25996)** · `Paper` · arXiv · *2026-07-07*
  Autodata frames synthetic data creation as an agentic workflow in which LLM agents plan, generate, evaluate, and iteratively refine datasets in the manner of a data scientist, targeting high-quality output across multiple domains.
  *Key concepts:* agentic data generation, autonomous LLM agents, iterative refinement, quality assessment loops, multi-domain synthetic data
- **[Synthetic Data Playbook (FinePhrase)](https://huggingface.co/spaces/HuggingFaceFW/finephrase)** · `Repo` · Hugging Face (FineWeb team) · *—* · ⚠️unverified
  A Hugging Face Space presenting a playbook for generating synthetic training data at massive scale ("trillions of the finest tokens"), focused on scalable, quality-optimized token production pipelines.
  *Key concepts:* synthetic data at scale, token generation pipelines, quality optimization, FineWeb/HuggingFaceFW tooling
- **[Generate Synthetic Datasets for AI Evals](https://www.decodingai.com/p/generate-synthetic-datasets-for-ai-evals)** · `Blog` · Decoding AI · *2026-02-24*
  A practical guide to building diverse synthetic evaluation datasets when production data is scarce, presenting five strategies from dimension-based generation to evolutionary complexity, advocating generating only synthetic inputs while letting the real application produce actual traces.
  *Key concepts:* cold-start problem, dimension modeling (persona/feature/scenario), mode-collapse prevention, metamorphic testing, Evol-Instruct, reverse workflow for RAG

- **[Synthetic pretraining](https://vintagedata.org/blog/posts/synthetic-pretraining)** · `Blog` · Vintage Data (Pierre-Carl Langlais) · *2026-02-01*
  Argues that frontier labs are shifting toward deliberately designed synthetic data across the entire pretraining phase, making data design as central as architecture. Frames synthetic compilation as three stages: memory enhancement via rephrasing, hardwiring logic through formal exercises, and simulating agent trajectories/environments.
  *Key concepts:* synthetic pretraining, data-as-architecture, rephrasing/curation, logical hardwiring, agent trajectory simulation, small-model data generators

### LLM-as-a-judge & evaluation
- **[Fine-tuning open LLM judges to outperform GPT-5.2](https://www.together.ai/blog/fine-tuning-open-llm-judges-to-outperform-gpt-5-2)** · `Blog` · Together AI (Zain Hasan et al.) · *2026-02-02*
  Shows that GPT-OSS 120B fine-tuned with DPO on ~5,400 RewardBench 2 preference pairs matches or beats GPT-5.2 as an evaluation judge at ~15x lower cost and ~14x faster, arguing judging is generally easier than generating.
  *Key concepts:* LLM-as-judge, DPO, RewardBench 2, preference pairs, GPT-OSS 120B, cost/latency tradeoffs
- **[Our LLM Judge Passed Everything. It Was Wrong. (how to evaluate the evaluator)](https://www.decodingai.com/p/how-to-evaluate-the-evaluator-validate-llm-judge)** · `Blog` · Decoding AI · *2026-03-10*
  Argues that an LLM judge which appears to work can be quietly misaligned with human judgment, producing false confidence, and lays out a validation method: split data train/dev/test, measure judge–expert alignment, and iteratively refine before deployment.
  *Key concepts:* judge–expert alignment, 60/20/20 data partitioning, precision/recall/F1, iterative few-shot refinement, pass@k vs pass^k, non-determinism handling
- **[Evaluating Netflix Show Synopses with LLM-as-a-Judge](https://netflixtechblog.com/evaluating-netflix-show-synopses-with-llm-as-a-judge-6269251e6f28)** · `Blog` · Netflix Tech Blog · *2026-04-10*
  Netflix built an LLM-as-a-judge system to score show-synopsis quality at scale, combining expert creative rubrics with member behavioral metrics and reaching over 85% agreement with professional writers.
  *Key concepts:* dual quality metrics (creative + engagement), inference-time scaling, agents-as-a-judge, golden evaluation dataset (~600 labels), behavioral validation, consensus scoring
- **[LLM as a Verifier (eval reference)](https://llm-as-a-verifier.notion.site/)** · `Blog` · Notion · *—* · ⚠️unverified
  A reference compilation on using LLMs as verifiers for evaluation and reward signals, covering how models check correctness of candidate outputs.
  *Key concepts:* LLM verifiers, output correctness checking, reward modeling, verification vs generation, eval reference material
- **[The Three-Model Problem: Can an LLM Spot Other LLMs?](https://chinmaykarkar.com/blog/blogger_blog/)** · `Blog` · Chinmay Karkar · *—*
  An RL experiment testing whether a model can distinguish text from Claude, ChatGPT, and Gemini; RL plateaued near 40% accuracy while supervised fine-tuning reached 100%, suggesting provider discrimination hinges on shallow stylometric patterns.
  *Key concepts:* stylometric features (em-dashes, hedging), sparse-reward signal-to-noise, class collapse in multi-class RL, SFT vs RL, self-distillation (STaR/RLSD), cold-start initialization
