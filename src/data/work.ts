/**
 * .data — the public repositories, as entries in a symbol table.
 *
 * Selected from 45 repositories on the account. The cut is: does it carry a
 * result someone could check? Six of these are the replication packages for
 * papers, and four are tools built because the research needed them to exist.
 * Course projects, clones and challenge submissions are left out.
 *
 * Every claim here was read out of the repository's own README, not inferred
 * from its name. `metric` is a number the repository itself reports.
 *
 * The dissertation toolchain — FlexSiMArch, BHPol, UICC — is not in this list
 * because it is not public. It is the figure at the top of the page, and the
 * policy section is it running.
 */

export type Entry = {
  /** Repository name, as GitHub spells it. */
  symbol: string;
  /** Display name, where the repository name is not the readable one. */
  title?: string;
  /** What it is, in one line. */
  kind: string;
  repo: string;
  /** A live deployment, where there is one. */
  demo?: string;
  /** The paper this is the replication package for, if any. */
  paper?: string;
  body: string;
  /** The checkable fact the repository itself reports. */
  metric?: { value: string; of: string };
  stack: readonly string[];
  track: "research" | "tooling" | "platform";
};

export const entries: readonly Entry[] = [
  {
    symbol: "Beyond-Accuracy",
    kind: "Measurement-theoretic evaluation of LLM annotation",
    repo: "https://github.com/sameermankotia/Beyond-Accuracy",
    paper: "IEEE Access · accepted",
    body: "Language models are evaluated almost entirely on accuracy — whether the output matches a gold label. Accuracy is silent on whether the same item gets the same label twice, which is the property that governs measurement error and statistical power in anything built on top of those annotations. This measures it: twelve models, a 500-item task, five repeated calls per item. Among the six most accurate models, between 9% and 37% of items come back with a different label across five identical calls.",
    metric: { value: "ICC 0.23 – 0.95", of: "across 12 models, where accuracy spans only 0.48 – 0.85" },
    stack: ["Python", "ICC", "Measurement theory", "12 model APIs"],
    track: "research",
  },
  {
    symbol: "Benchmarking-Agentic-AI-Generated-Code-Against-Human-Written-Code",
    title: "Agentic vs. human code benchmark",
    kind: "Replication package and analysis harness",
    repo: "https://github.com/sameermankotia/Benchmarking-Agentic-AI-Generated-Code-Against-Human-Written-Code",
    paper: "IEEE Access · under review",
    body: "One deterministic pipeline over all 18 study subjects, rendering every table the paper quotes. Five quality dimensions — functional correctness, cyclomatic and cognitive complexity, maintainability, security density with CWE mapping, and duplication — each tested for significance against the human baseline of the same pair with Mann-Whitney U, Fisher's exact, and an exact rate test with LOC exposure. The point is that the numbers are recomputed from the frozen artifact rather than transcribed.",
    metric: { value: "18 subjects · 5 dimensions", of: "every figure in the paper computed by one command" },
    stack: ["Python", "pytest", "Radon", "Bandit", "pylint", "PMD"],
    track: "research",
  },
  {
    symbol: "sovereign-model-loop",
    title: "Sovereign Model Loop",
    kind: "Fully local GRPO fine-tuning with a health diagnostic",
    repo: "https://github.com/sameermankotia/sovereign-model-loop",
    paper: "ACM TIST 2026",
    body: "Reinforcement-learning fine-tuning that no cloud provider can revoke and no rate limit can interrupt. Every edge in the feedback graph — optimizer to logger to observer to intervenor and back — is local IPC, and the whole cycle closes in under 100 ms on consumer silicon. It contributes a terminal-native observability layer, a scalar optimizer-health diagnostic, deterministic auditable reward functions, and an agentic co-observer that replaces the human in the loop without replacing the audit trail.",
    metric: { value: "< 100 ms", of: "closed feedback cycle, entirely on-device · 70 tests passing" },
    stack: ["Python", "GRPO", "Local inference", "Terminal observability"],
    track: "research",
  },
  {
    symbol: "Memory-mirror",
    title: "Mirrors that Remember",
    kind: "Measuring self-image sycophancy under persistent memory",
    repo: "https://github.com/sameermankotia/Memory-mirror",
    paper: "NeurIPS 2026 workshop · AI and the Self",
    body: "A large literature shows models agree with what users believe about the world. This measures something narrower and harder to dismiss: whether storing a user's beliefs about themselves makes a model affirm those beliefs past what the evidence supports — and whether persistent memory turns a one-time affirmation into a standing one. The design holds the self-claim fixed and varies only what memory says, across four conditions rather than the usual three, so the mere presence of a memory note is controlled for separately from its content.",
    metric: { value: "5 metrics", of: "baseline bias, memory effect, sign-tracking, presence control, evidence fidelity" },
    stack: ["Python", "Evaluation design", "Probe sets"],
    track: "research",
  },
  {
    symbol: "MoE-Former-",
    title: "MoE-Former++",
    kind: "Expert routing and load balancing for sparse models",
    repo: "https://github.com/sameermankotia/MoE-Former-",
    paper: "ICML 2026 · under review",
    body: "Mixture-of-Experts models waste capacity when routing collapses onto a few experts. This models token-to-expert assignment as a graph problem — a neural network over the affinity between them — rather than a per-token softmax, and pairs it with adaptive load balancing. With Bhaskar Rimal and Daniel Conte de Leon.",
    metric: { value: "96%", of: "expert utilization through graph-guided routing" },
    stack: ["Python", "PyTorch", "Graph neural networks", "MoE"],
    track: "research",
  },
  {
    symbol: "Fedrated_Learning",
    title: "FedPrIDS",
    kind: "Privacy-preserving federated intrusion detection",
    repo: "https://github.com/sameermankotia/Fedrated_Learning",
    paper: "Journal of Cybersecurity and Privacy · published",
    body: "Lets organisations that cannot pool their network traffic still train a shared intrusion-detection model on it, with configurable differential privacy and aggregation weighted by data quality rather than volume. Evaluated across three standard intrusion datasets so the result is not an artifact of one capture.",
    metric: { value: "3 datasets", of: "CICIDS2017, UNSW-NB15 and Bot-IoT, under differential privacy" },
    stack: ["Python", "Federated learning", "Differential privacy"],
    track: "research",
  },
  {
    symbol: "Flakegate",
    kind: "A reliability gate for LLM calls in CI",
    repo: "https://github.com/sameermankotia/Flakegate",
    body: "Any team shipping an LLM feature has the same unsolved problem: the same prompt returns a materially different answer on the next run, and nothing in the pipeline measures it. Flakegate runs a prompt k times, scores how consistent the outputs are, and fails the build when consistency drops below a threshold. One command, one number in the report, a non-zero exit code. It is the reliability research above turned into something a team can adopt on a Tuesday — pytest for LLM consistency, not another eval framework to learn.",
    metric: { value: "exit 1", of: "a consistency regression fails the build like any other flaky test" },
    stack: ["Python", "CLI", "CI/CD", "LLM evaluation"],
    track: "tooling",
  },
  {
    symbol: "DevPulse",
    kind: "Developer productivity intelligence platform",
    repo: "https://github.com/sameermankotia/DevPulse",
    body: "Reads pull request, review and CI data from GitHub, reconstructs the lifecycle of every change, and shows where delivery time is actually lost. Three of the five stages in a pull request's life are queues, and in most organisations the queues dominate — so removing a wait costs no engineering effort, and DevPulse ranks queue bottlenecks ahead of work bottlenecks when their overage is comparable. A stage with a missing boundary is recorded as not observed, never zero, because counting an unreviewed PR as zero pickup time hides exactly the problem being looked for.",
    metric: { value: "4 DORA metrics", of: "plus stage-level bottleneck ranking across the PR lifecycle" },
    stack: ["Python", "FastAPI", "SQLAlchemy", "React", "TypeScript", "PostgreSQL"],
    track: "tooling",
  },
  {
    symbol: "ACMRS-AI-Code-Review-Mentor-System",
    title: "ACMRS",
    kind: "AI-augmented code review with technical debt scoring",
    repo: "https://github.com/sameermankotia/ACMRS-AI-Code-Review-Mentor-System",
    body: "Pairs static analysis with LLM semantic review, scores technical debt by category, and keeps the human in the loop by collecting reviewer feedback on its own findings and tracking how review performance moves over time. The earliest version of the argument the firmware work makes at a lower level: a review is worth something when it carries evidence and someone checks it.",
    stack: ["Python", "Streamlit", "Static analysis", "LLM review"],
    track: "tooling",
  },
  {
    symbol: "FlowLedger",
    kind: "ERP and CRM data integration pipeline",
    repo: "https://github.com/sameermankotia/FlowLedger",
    demo: "https://sameermankotia.github.io/FlowLedger/",
    body: "A Python and PostgreSQL pipeline that integrates customer, project and invoice data across two business systems that disagree, then reports on the result. The interesting part is not that it loads CSV files: the source extracts are deliberately dirty, and the pipeline tells you exactly what it could not reconcile and why, instead of quietly dropping the rows.",
    metric: { value: "Live report", of: "the pipeline's own output, published and browsable" },
    stack: ["Python", "PostgreSQL", "ETL", "Data quality"],
    track: "platform",
  },
  {
    symbol: "Network-Management-System",
    kind: "Campus network monitoring and management",
    repo: "https://github.com/sameermankotia/Network-Management-System",
    body: "Device inventory, live availability and utilization, topology, alerting with an acknowledgment workflow, on-demand diagnostics and reporting for a university campus network. A background poller probes every device on its own interval, stores a sample, re-derives device and link state, and pushes the change to connected clients over SignalR rather than having them poll for it.",
    metric: { value: "Live state", of: "server-pushed over SignalR, not client polling" },
    stack: ["React", "TypeScript", ".NET 8", "PostgreSQL", "SignalR"],
    track: "platform",
  },
];

/** Section headings for the three tracks, in display order. */
export const tracks = [
  {
    id: "research",
    label: "Research · replication packages",
    note: "Each of these is the code behind a paper. The numbers the papers quote are recomputed from the repository, not transcribed into it.",
  },
  {
    id: "tooling",
    label: "Tooling · research made usable",
    note: "Built because the research needed them to exist, then generalised enough that someone else can run them.",
  },
  {
    id: "platform",
    label: "Platforms",
    note: "Full-stack systems with real operators and real data.",
  },
] as const;
