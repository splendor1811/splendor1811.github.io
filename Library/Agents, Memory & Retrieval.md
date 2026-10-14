# Agents, Memory & Retrieval

[[Library|← Back to Library index]] · Related: [[Reinforcement Learning & Reasoning]] · [[Data & Evaluation]] · [[Inference & Serving]]

Agent architectures, coding harnesses, memory, retrieval, and context management. Recursive language models are organized here around their interaction with external context.

### Recursive language models & context management
<!-- resource-id: reinforcement-learning__recursive-language-models -->
- **[Recursive Language Models](https://arxiv.org/abs/2512.24601)** · `Paper` · arXiv (Alex L. Zhang, Tim Kraska & Omar Khattab) · *2025-12-31*
  Treats long prompts as an external environment that a model can inspect, decompose, and revisit through recursive calls. The current abstract reports long-context improvements over several different baselines and a small-model post-training experiment; these are distinct comparisons, not one universal gain. First submitted December 31, 2025; the examined v3 was revised May 11, 2026.
  *Key concepts:* inference-time scaling, recursive language models, external context management, REPL-based decomposition, long-context evaluation, post-training

<!-- resource-id: reinforcement-learning__recursive-language-model-primeintellect-blog -->
- **[Recursive Language Model (PrimeIntellect blog)](https://www.primeintellect.ai/blog/rlm)** · `Blog` · Prime Intellect · *2026-01-01*
  Prime Intellect's exploration of RLMs as a way for LLM agents to manage their own context — delegating work to Python scripts and sub-LLMs rather than stuffing everything into the main window.
  *Key concepts:* context folding, recursive LMs with persistent REPL, sub-LM delegation, scaffolding architecture, context rot, token-efficiency trade-offs

<!-- resource-id: reinforcement-learning__recursive-language-model-author-writeup -->
- **[Recursive Language Model (author writeup)](https://alexzhang13.github.io/blog/2025/rlm/)** · `Blog` · Alex Zhang · *2025-10*
  The author's original writeup framing RLMs as recursive interaction with unbounded context via Python REPL environments, emphasizing that the recursive strategies are learnable via RL — a new axis for test-time scaling.
  *Key concepts:* recursive REPL decomposition, context-centric vs. problem-centric decomposition, context rot mitigation, test-time inference scaling, emergent interaction strategies

<!-- resource-id: agents-memory-retrieval__context-engineering-for-agents -->
- **[Context engineering in agents](https://docs.langchain.com/oss/python/langchain/context-engineering)** · `Blog` · LangChain documentation · *—*
  Organizes agent behavior around what the model sees, which tools it can use, and how context and state change across the execution loop. The guide provides implementation patterns for controlling model-call and tool-call context in LangChain.
  *Key concepts:* Context engineering, Agent state, Tool use, Memory, Agent workflows

<!-- resource-id: agents-memory-retrieval__on-the-nature-of-the-swarm -->
- **[On the Nature of the Swarm](https://hallerite.com/posts/on-the-nature-of-the-swarm)** · `Blog` · Konstantin Dunas / hallerite · *2026-10-06*
  Argues that persistent multi-agent systems are a structured form of inference-time scaling, extending context capacity across separate working contexts. Contrasts compaction, external memory, and persistent agents while emphasizing communication costs and tasks that still require joint context; this is a conceptual argument, not a universal scaling guarantee.
  *Key concepts:* Multi-agent systems, Context management, Compaction, Persistent memory, Test-time compute

<!-- resource-id: agents-memory-retrieval__sleep-time-compute-beyond-inference-scaling-at-test-time -->
- **[Sleep-time Compute: Beyond Inference Scaling at Test-time](https://arxiv.org/abs/2504.13171)** · `Paper` · Kevin Lin, Charlie Snell et al. / arXiv · *2025-04-17*
  Proposes doing useful computation over a context before the user's query arrives, then reusing that work across related questions. The paper evaluates the latency/cost trade-off on modified reasoning tasks and an agentic case study, emphasizing that gains depend on how predictable future queries are.
  *Key concepts:* Sleep-time compute, Context preprocessing, Amortized inference, Agent memory, Query prediction


### Agent foundations & courses
<!-- resource-id: agents-memory-retrieval__harvard-cs2680-modern-ai-systems-fall-2026 -->
- **[Harvard CS2680: Modern AI Systems — Agents and System Optimizations (Fall 2026)](https://cs2680.seas.harvard.edu/)** · `Course` · Juncheng Yang / Harvard SEAS · *2026*
  Follows one agentic system from coding-agent use, loop design and evaluation down to deployment and serving. Five connected assignments move from observing an agent to building its harness, measuring token costs, serving an open-weight model on GPUs and optimizing the full stack. The official syllabus links currently available slides and assignments; later schedule entries are tentative, and individual lectures were not exhaustively reviewed.
  *Key concepts:* agent loops, harness design, agent evaluation, token cost, LLM serving, KV-cache reuse, routing, quantization, speculative decoding

<!-- resource-id: foundations-interviews-meta__agentic-ai-cmu-11-768-ai-agents -->
- **[Agentic AI (CMU 11-768, AI Agents)](https://www.cmu-agents.com/#/)** · `Course` · cmu-agents.com (CMU) · *—*
  Course site for CMU's AI Agents class, focused on building and understanding LLM-based autonomous agents — agent architectures, tool use, and autonomous decision-making.
  *Key concepts:* AI agents, agent architectures, tool use, autonomous decision-making, LLM orchestration

<!-- resource-id: agents-memory-retrieval__llm-powered-autonomous-agents -->
- **[LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)** · `Blog` · Lilian Weng / Lil'Log · *2023-06-23*
  A foundational overview of LLM-centered agents organized around planning, memory, and tool use. It connects decomposition, reflection, retrieval, and external APIs through early case studies; its examples are a 2023 research snapshot rather than current production guidance.
  *Key concepts:* Agents, Planning, Memory, Tool use, Retrieval

<!-- resource-id: agents-memory-retrieval__prompt-engineering -->
- **[Prompt Engineering](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/)** · `Blog` · Lilian Weng / Lil'Log · *2023-03-15*
  Surveys ways to steer autoregressive language models without changing weights, including zero/few-shot examples, instructions, self-consistency, and chain-of-thought. It discusses example selection and ordering as empirical variables and connects prompting to retrieval and external tools.
  *Key concepts:* Prompting, In-context learning, Chain-of-thought, Self-consistency, Tool use

<!-- resource-id: agents-memory-retrieval__hugging-face-ai-agents-course -->
- **[Hugging Face AI Agents Course](https://huggingface.co/learn/agents-course/unit0/introduction)** · `Course` · Ben Burtenshaw, Sergio Paniego and course contributors / Hugging Face · *—*
  Outlines a course moving from agent loops and tools to framework-based implementations, use cases, and a benchmark assignment. The syllabus includes smolagents, LlamaIndex, LangGraph, and bonus material on function calling, observability, and evaluation. The inspected introduction specifies basic Python and LLM knowledge as prerequisites; this note describes the curriculum, not a completed review of every lesson.
  *Key concepts:* Agent loops, Tool use, Agent frameworks, Observability, Agent evaluation

<!-- resource-id: agents-memory-retrieval__advanced-large-language-model-agents-spring-2025 -->
- **[Advanced Large Language Model Agents — Spring 2025](https://rdi.berkeley.edu/adv-llm-agents/sp25)** · `Course` · Dawn Song, Xinyun Chen and Kaiyu Yang / UC Berkeley · *—*
  An advanced course map linking inference-time reasoning, post-training, search and planning to coding agents, formal mathematics, and agent security. The weekly syllabus points to recordings, slides, and primary readings on open training recipes, web agents, theorem proving, and privilege control. Best used to plan a structured research reading sequence after introductory machine learning.
  *Key concepts:* Agentic reasoning, Search and planning, Theorem proving, Autoformalization, Agent security


### Coding agents & harnesses
<!-- resource-id: foundations-interviews-meta__a-component-of-a-coding-agent-sebastian-raschka -->
- **[A Component of a Coding Agent (Sebastian Raschka)](https://substack.com/@rasbt/p-193137515)** · `Blog` · Ahead of AI / Substack (Sebastian Raschka) · *2026-04-04*
  A concise write-up of the building blocks behind coding agents — repo context, tool use, memory, and delegation — accompanied by a minimal, readable Python harness that implements the core components.
  *Key concepts:* coding agents, repo context, tool use, agent memory, task delegation, minimal agent harness

<!-- resource-id: agents-memory-retrieval__a-guide-to-claude-code-2-0-and-using-coding-agents -->
- **[A Guide to Claude Code 2.0 and getting better at using coding agents](https://sankalp.bearblog.dev/my-experience-with-claude-code-20-and-how-to-get-better-at-using-coding-agents)** · `Blog` · Sankalp · *2025-12-27*
  An experience-based guide to coding-agent workflows, covering planning, subagents, context management, tools, hooks, and skills. Its product observations are a snapshot of late 2025, while the broader value is how the author organizes exploration, execution, and review.
  *Key concepts:* Coding agents, Context engineering, Subagents, Tool use, Agent workflows

<!-- resource-id: agents-memory-retrieval__harness-engineering-for-self-improvement -->
- **[Harness Engineering for Self-Improvement](https://lilianweng.github.io/posts/2026-07-04-harness/)** · `Blog` · Lilian Weng / Lil'Log · *2026-07-04*
  Surveys how an agent's surrounding runtime—context, memory, tools, workflow, and evaluation—can itself become an optimization target. It compares context and workflow search with broader self-improving harnesses, emphasizing held-out validation, bounded editable surfaces, and security controls outside the optimization loop.
  *Key concepts:* Agent harnesses, Context engineering, Self-improvement, Evaluation, Tool use

<!-- resource-id: agents-memory-retrieval__the-next-scaling-problem -->
- **[The Next Scaling Problem](https://tetral.ai/blog/the-next-scaling-problem)** · `Blog` · Yang Li / Tetral · *2026-09-06*
  An engineering account of the limits of scaling a complete agent runtime inside each execution sandbox. Motivates separating durable task state and orchestration from short-lived tool environments, with attention to lifecycle management, observability, and credentials.
  *Key concepts:* Agent runtimes, Sandboxing, Durable execution, Orchestration, Observability

<!-- resource-id: agents-memory-retrieval__composer-2-technical-report -->
- **[Composer 2 Technical Report](https://arxiv.org/abs/2603.24477)** · `Paper` · Cursor Research / arXiv · *2026-03-25*
  Describes continued pretraining followed by large-scale reinforcement learning for an agentic coding model, with training environments and tools aligned to its deployed Cursor harness. The abstract reports gains on CursorBench and public coding benchmarks in that harness; these are author-reported, harness-dependent results, not an independently reproduced ranking.
  *Key concepts:* Coding agents, Continued pretraining, Reinforcement learning, Harness alignment, Software engineering evaluation


### Tool design & evaluation

<!-- resource-id: agents-memory-retrieval__writing-effective-tools-for-agents -->
- **[Writing Effective Tools for Agents](https://anthropic.com/engineering/writing-tools-for-agents)** · `Blog` · Anthropic engineering · *2025-09-11*
  Anthropic presents an iterative workflow for designing agent tools around realistic evaluations. It emphasizes clear tool boundaries, useful and compact return values, descriptive specifications, and verifiers that recognize valid alternative solutions.
  *Key concepts:* Tool use, Agent evaluation, Tool design, Context efficiency, API design

<!-- resource-id: agents-memory-retrieval__post-training-open-weight-models-for-large-scale-code-search -->
- **[Post-training open-weight models for large-scale code search](https://turbopuffer.com/blog/large-scale-code-search)** · `Blog` · Edward Yu and Jacob Phillips / Applied Compute / turbopuffer · *2026-09-04*
  Describes training a specialized search model to use precomputed indexes across a large collection of repositories. The setup contrasts narrow and open-ended code-search tasks and illustrates the joint design of retrieval tools, RL environments, and evaluation; cost and latency comparisons remain specific to the reported setup.
  *Key concepts:* Code search, Retrieval indexes, Agentic RL, Tool use, Search evaluation

<!-- resource-id: agents-memory-retrieval__high-stakes-retrieval -->
- **[High-Stakes Retrieval](https://convogo.com/blog/high-stakes-retrieval)** · `Blog` · Evan Cater, Matt Cooper and Michael Gillett / Convogo · *2025-09-29*
  A retrieval case study about finding grounded quotations in executive-coaching interviews, comparing embedding retrieval and reranking with frontier-LLM extraction and task decomposition. Its evaluation uses eight hand-labeled reports and explicitly trades latency and cost for quality, so the reported gains should not be generalized into a claim that RAG is obsolete.
  *Key concepts:* Retrieval evaluation, Quote grounding, Reranking, Task decomposition, Cost-quality trade-offs

### Retrieval & knowledge graphs

<!-- resource-id: agents-memory-retrieval__knowledge-graph-extractor -->
- **[Knowledge Graph Extractor](https://github.com/hanxiao/knowledge-graph-extractor)** · `Repo` · Han Xiao · *—*
  Builds an interactive graph from document chunks using a self-hosted language model, attaching source spans and metadata to extracted subject–predicate–object edges. Combines semantic deduplication, normalized entities, persistent jobs, and JSONL export. The attached evidence and confidence fields support inspection; they are not proof that the model's extracted relations are true.
  *Key concepts:* Knowledge graphs, Information extraction, Evidence spans, Semantic deduplication, Self-hosted inference

### World models & planning

<!-- resource-id: agents-memory-retrieval__agentic-world-models -->
- **[Agentic World Models](https://cameronrwolfe.substack.com/p/agentic-world-models)** · `Blog` · Cameron R. Wolfe · *2026-07-20*
  Distinguishes an agent's actions from its observations and surveys training models to predict tool responses. Contrasts separate simulators with a shared model optimized for both decisions and environment prediction. The ECHO discussion explains how normally masked observation tokens can provide an auxiliary supervised objective alongside action-token reinforcement learning, including useful feedback from unsuccessful trajectories.
  *Key concepts:* World models, Agentic RL, Observation prediction, Action masking, ECHO
