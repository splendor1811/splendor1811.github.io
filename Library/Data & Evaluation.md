# Data & Evaluation

[[Library|← Back to Library index]] · Related: [[Post-Training & Alignment]] · [[Reinforcement Learning & Reasoning]] · [[Agents, Memory & Retrieval]]

Training data generation, expert data curation, verifiers, judges, and evaluation methodology. Sources are organized by the data or measurement problem they address.

### Evaluation tools & harnesses
<!-- resource-id: efficient-inference-serving__harness-optimization-hf-space -->
- **[harness-optimization (HF Space)](https://huggingface.co/spaces/joelniklaus/harness-optimization)** · `Repo` · Hugging Face Spaces · *—* · ⚠️unverified
  A Space titled "Don't Train the Model, Evolve the Harness," exploring improving system performance by optimizing/evolving the inference-and-eval harness rather than retraining the model itself.
  *Key concepts:* harness optimization, evolutionary search, eval infrastructure, inference-time improvement

<!-- resource-id: synthetic-data-evaluation__demystifying-evals-for-ai-agents -->
- **[Demystifying Evals for AI Agents](https://anthropic.com/engineering/demystifying-evals-for-ai-agents)** · `Blog` · Anthropic engineering · *2026-01-09*
  Anthropic distinguishes tasks, repeated trials, transcripts, outcomes and graders for multi-turn agents. It recommends measuring outcomes in clean environments, calibrating model graders against humans, and selecting pass@k versus pass^k according to whether success once or consistency matters.
  *Key concepts:* Agent evaluation, LLM-as-a-judge, Pass@k, Pass^k, Regression testing

### Synthetic data
<!-- resource-id: synthetic-data-evaluation__autodata-an-agentic-data-scientist-to-create-high-quality-synthetic-data -->
- **[Autodata: An agentic data scientist to create high quality synthetic data](https://arxiv.org/pdf/2606.25996)** · `Paper` · arXiv · *2026-07-07*
  Autodata frames synthetic data creation as an agentic workflow in which LLM agents plan, generate, evaluate, and iteratively refine datasets in the manner of a data scientist, targeting high-quality output across multiple domains.
  *Key concepts:* agentic data generation, autonomous LLM agents, iterative refinement, quality assessment loops, multi-domain synthetic data

<!-- resource-id: synthetic-data-evaluation__synthetic-data-playbook-finephrase -->
- **[Synthetic Data Playbook (FinePhrase)](https://huggingface.co/spaces/HuggingFaceFW/finephrase)** · `Repo` · Hugging Face (FineWeb team) · *—* · ⚠️unverified
  A Hugging Face Space presenting a playbook for generating synthetic training data at massive scale ("trillions of the finest tokens"), focused on scalable, quality-optimized token production pipelines.
  *Key concepts:* synthetic data at scale, token generation pipelines, quality optimization, FineWeb/HuggingFaceFW tooling

<!-- resource-id: synthetic-data-evaluation__generate-synthetic-datasets-for-ai-evals -->
- **[Generate Synthetic Datasets for AI Evals](https://www.decodingai.com/p/generate-synthetic-datasets-for-ai-evals)** · `Blog` · Decoding AI · *2026-02-24*
  A practical guide to building diverse synthetic evaluation datasets when production data is scarce, presenting five strategies from dimension-based generation to evolutionary complexity, advocating generating only synthetic inputs while letting the real application produce actual traces.
  *Key concepts:* cold-start problem, dimension modeling (persona/feature/scenario), mode-collapse prevention, metamorphic testing, Evol-Instruct, reverse workflow for RAG

<!-- resource-id: synthetic-data-evaluation__synthetic-pretraining -->
- **[Synthetic pretraining](https://vintagedata.org/blog/posts/synthetic-pretraining)** · `Blog` · Vintage Data (Pierre-Carl Langlais) · *2026-02-01*
  Argues that frontier labs are shifting toward deliberately designed synthetic data across the entire pretraining phase, making data design as central as architecture. Frames synthetic compilation as three stages: memory enhancement via rephrasing, hardwiring logic through formal exercises, and simulating agent trajectories/environments.
  *Key concepts:* synthetic pretraining, data-as-architecture, rephrasing/curation, logical hardwiring, agent trajectory simulation, small-model data generators

<!-- resource-id: synthetic-data-evaluation__codemidas-scaling-agentic-coding-rl-environments-from-code-itself -->
- **[CodeMidas: Scaling Agentic Coding RL Environments from Code Itself](https://arxiv.org/abs/2609.22068)** · `Paper` · Bowen Ye, Lei Li et al. / arXiv · *2026-09-18*
  Constructs executable coding environments directly from repository functionality, using agents to formulate specifications, build tests, and filter tasks through execution. The abstract reports a multilingual task collection and GRPO improvements on several coding benchmarks; the contribution connects environment quality and verification to agent training.
  *Key concepts:* RL environments, Coding agents, Synthetic data, Executable verification, GRPO


### LLM-as-a-judge & evaluation
<!-- resource-id: synthetic-data-evaluation__fine-tuning-open-llm-judges-to-outperform-gpt-5-2 -->
- **[Fine-tuning open LLM judges to outperform GPT-5.2](https://www.together.ai/blog/fine-tuning-open-llm-judges-to-outperform-gpt-5-2)** · `Blog` · Together AI (Zain Hasan et al.) · *2026-02-02*
  Shows that GPT-OSS 120B fine-tuned with DPO on ~5,400 RewardBench 2 preference pairs matches or beats GPT-5.2 as an evaluation judge at ~15x lower cost and ~14x faster, arguing judging is generally easier than generating.
  *Key concepts:* LLM-as-judge, DPO, RewardBench 2, preference pairs, GPT-OSS 120B, cost/latency tradeoffs

<!-- resource-id: synthetic-data-evaluation__our-llm-judge-passed-everything-it-was-wrong-how-to-evaluate-the-evaluator -->
- **[Our LLM Judge Passed Everything. It Was Wrong. (how to evaluate the evaluator)](https://www.decodingai.com/p/how-to-evaluate-the-evaluator-validate-llm-judge)** · `Blog` · Decoding AI · *2026-03-10*
  Argues that an LLM judge which appears to work can be quietly misaligned with human judgment, producing false confidence, and lays out a validation method: split data train/dev/test, measure judge–expert alignment, and iteratively refine before deployment.
  *Key concepts:* judge–expert alignment, 60/20/20 data partitioning, precision/recall/F1, iterative few-shot refinement, pass@k vs pass^k, non-determinism handling

<!-- resource-id: synthetic-data-evaluation__evaluating-netflix-show-synopses-with-llm-as-a-judge -->
- **[Evaluating Netflix Show Synopses with LLM-as-a-Judge](https://netflixtechblog.com/evaluating-netflix-show-synopses-with-llm-as-a-judge-6269251e6f28)** · `Blog` · Netflix Tech Blog · *2026-04-10*
  Netflix built an LLM-as-a-judge system to score show-synopsis quality at scale, combining expert creative rubrics with member behavioral metrics and reaching over 85% agreement with professional writers.
  *Key concepts:* dual quality metrics (creative + engagement), inference-time scaling, agents-as-a-judge, golden evaluation dataset (~600 labels), behavioral validation, consensus scoring

<!-- resource-id: synthetic-data-evaluation__llm-as-a-verifier-eval-reference -->
- **[LLM as a Verifier (eval reference)](https://llm-as-a-verifier.notion.site/)** · `Blog` · Notion · *—* · ⚠️unverified
  A reference compilation on using LLMs as verifiers for evaluation and reward signals, covering how models check correctness of candidate outputs.
  *Key concepts:* LLM verifiers, output correctness checking, reward modeling, verification vs generation, eval reference material

<!-- resource-id: synthetic-data-evaluation__the-three-model-problem-can-an-llm-spot-other-llms -->
- **[The Three-Model Problem: Can an LLM Spot Other LLMs?](https://chinmaykarkar.com/blog/blogger_blog/)** · `Blog` · Chinmay Karkar · *—*
  An RL experiment testing whether a model can distinguish text from Claude, ChatGPT, and Gemini; RL plateaued near 40% accuracy while supervised fine-tuning reached 100%, suggesting provider discrimination hinges on shallow stylometric patterns.
  *Key concepts:* stylometric features (em-dashes, hedging), sparse-reward signal-to-noise, class collapse in multi-class RL, SFT vs RL, self-distillation (STaR/RLSD), cold-start initialization

<!-- resource-id: synthetic-data-evaluation__audio-models-as-judges-vs-human-in-the-loop-evaluation -->
- **[Can Large Audio Language Models reliably judge speech-to-speech models?](https://research.withdavid.ai/blog/lalm-as-judge-vs-hitl)** · `Blog` · David AI Research · *2026-07-24*
  David AI studies whether audio-model judges track human assessments of speech-to-speech output. It distinguishes absolute and comparative ratings and warns that aggregate preference agreement can coexist with weak agreement on individual acoustic judgments.
  *Key concepts:* Audio evaluation, LLM-as-a-judge, Human evaluation, Preference ratings, Calibration

<!-- resource-id: synthetic-data-evaluation__ai-evals-everything-you-need-to-know -->
- **[AI Evals: Everything You Need to Know](https://hamel.dev/blog/posts/evals-faq)** · `Blog` · Hamel Husain & Shreya Shankar · *—*
  A practitioner FAQ organized around discovering failure modes from traces, designing targeted tests, and calibrating automated graders with domain expertise. It treats evaluation as an iterative product-improvement process and explicitly frames its advice as context-dependent rather than universal.
  *Key concepts:* Evaluation, Error analysis, LLM-as-a-judge, Human evaluation, Agent traces

### Expert data & task evaluation
<!-- resource-id: thinking-machines-lab__learning-to-replicate-expert-judgment-in-financial-tasks -->
- **[Learning to Replicate Expert Judgment in Financial Tasks](https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/)** · `News` · Thinking Machines · *2026-06-30*
  A collaboration with Bridgewater AIA Labs showing that custom-trained models beat frontier LLMs on financial document classification, reaching 84.7% accuracy versus 78.2% while cutting inference cost 13.8x, via careful expert-labeled data curation plus specialized training techniques.
  *Key concepts:* expert dataset curation, interleaved batching, CISPO loss with asymmetric clipping, on-policy distillation, financial task taxonomy

<!-- resource-id: synthetic-data-evaluation__thinking-about-high-quality-human-data -->
- **[Thinking about High-Quality Human Data](https://lilianweng.github.io/posts/2024-02-05-human-data-quality/)** · `Blog` · Lilian Weng / Lil'Log · *2024-02-05*
  Connects annotation operations—task design, rater selection, training, and aggregation—to the quality of human-generated labels. It discusses rater agreement and disagreement alongside model-based diagnostics for noisy or influential training examples.
  *Key concepts:* Data quality, Human annotation, Rater agreement, RLHF, Training data

### Long-context & factuality evaluation

<!-- resource-id: synthetic-data-evaluation__context-rot-how-increasing-input-tokens-impacts-llm-performance -->
- **[Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://research.trychroma.com/context-rot)** · `Blog` · Chroma Research · *2025-07-14*
  Chroma varies context length while holding simple task difficulty fixed and observes uneven performance across 18 language models. Extensions to lexical retrieval, distractors and repeated-word tasks expose limits that a single needle-in-a-haystack score can miss. The experiments measure behavior and do not by themselves establish its internal cause.
  *Key concepts:* Long context, Context rot, Retrieval evaluation, Distractors, Benchmarking

<!-- resource-id: synthetic-data-evaluation__extrinsic-hallucinations-in-llms -->
- **[Extrinsic Hallucinations in LLMs](https://lilianweng.github.io/posts/2024-07-07-hallucination/)** · `Blog` · Lilian Weng / Lil'Log · *2024-07-07*
  Focuses on factual claims not grounded in external knowledge, distinguishing them from contradictions of provided context. It surveys data and fine-tuning causes, retrieval-based and sampling-based detection, uncertainty calibration, and factuality interventions; no single metric establishes universal reliability.
  *Key concepts:* Hallucinations, Factuality evaluation, RAG, Calibration, Fine-tuning
