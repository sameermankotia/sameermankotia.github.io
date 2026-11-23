/**
 * .data — things built, as entries in a symbol table.
 *
 * Two kinds only: tools, and platforms that run for real people.
 *
 * The replication packages for the papers are deliberately not here. Every
 * one of them is already one click away in `.rodata`, on the paper it belongs
 * to, where it means more — code beside the claim it produced. Listing them
 * twice would pad this section and say nothing new.
 *
 * The dissertation toolchain is not here either, for a different reason: it
 * is sponsored and not public. It is the figure at the top of the page, and
 * the policy section is it running.
 *
 * Every claim below was read out of the repository's own README, not inferred
 * from its name. `metric` is a number the repository itself reports.
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
  track: "tooling" | "platform";
};

export const entries: readonly Entry[] = [
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
