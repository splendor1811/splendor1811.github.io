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


### Agent foundations & courses
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


### Tool design & evaluation

<!-- resource-id: agents-memory-retrieval__writing-effective-tools-for-agents -->
- **[Writing Effective Tools for Agents](https://anthropic.com/engineering/writing-tools-for-agents)** · `Blog` · Anthropic engineering · *2025-09-11*
  Anthropic presents an iterative workflow for designing agent tools around realistic evaluations. It emphasizes clear tool boundaries, useful and compact return values, descriptive specifications, and verifiers that recognize valid alternative solutions.
  *Key concepts:* Tool use, Agent evaluation, Tool design, Context efficiency, API design

<!-- resource-id: agents-memory-retrieval__post-training-open-weight-models-for-large-scale-code-search -->
- **[Post-training open-weight models for large-scale code search](https://turbopuffer.com/blog/large-scale-code-search)** · `Blog` · Edward Yu and Jacob Phillips / Applied Compute / turbopuffer · *2026-09-04*
  Describes training a specialized search model to use precomputed indexes across a large collection of repositories. The setup contrasts narrow and open-ended code-search tasks and illustrates the joint design of retrieval tools, RL environments, and evaluation; cost and latency comparisons remain specific to the reported setup.
  *Key concepts:* Code search, Retrieval indexes, Agentic RL, Tool use, Search evaluation
