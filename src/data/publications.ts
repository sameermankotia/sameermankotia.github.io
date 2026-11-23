/**
 * .rodata — the publication record.
 *
 * Status is printed as it stands. "Under review" is not a quieter way of
 * saying published, and a reader judging this record is entitled to the
 * difference without going to look it up.
 *
 * `claim` is one plain sentence on what the paper found — not the abstract,
 * and not the title restated.
 *
 * Four states, not three. "In preparation" means drafted and not yet
 * submitted, which "under review" would overstate. Every status here was
 * confirmed by the author.
 */

export type Paper = {
  title: string;
  venue: string;
  year: string;
  status: "published" | "accepted" | "under review" | "in preparation";
  claim: string;
  /** The repository holding the code, where there is one. */
  code?: string;
  doi?: string;
};

export const papers: readonly Paper[] = [
  {
    title:
      "FlexSiMArch: An Extensible Simulator for Research and Development in Secure-by-Design Processor Technologies",
    venue: "IEEE MCSoC, Singapore",
    year: "2025",
    status: "published",
    claim:
      "A RISC-V processor simulator small enough to modify — about 3,500 lines against Gem5's 500,000 — that still passes all 1,025 official ISA tests. Adding 45 new instructions took a day.",
    doi: "10.1109/MCSoC67473.2025.00048",
  },
  {
    title:
      "Hierarchical Firmware-Level Security Policy for Industrial Control Systems",
    venue: "IEEE CARS, Grand Forks, ND",
    year: "2025",
    status: "published",
    claim:
      "BHPol: a way of writing security rules so that checking one is a single bit comparison, which makes it fast enough to run on every instruction of a power-grid relay.",
    doi: "10.1109/CARS67163.2025.11337876",
  },
  {
    title:
      "FedPrIDS: Privacy-Preserving Federated Learning for Collaborative Network Intrusion Detection in IoT",
    venue: "Journal of Cybersecurity and Privacy, MDPI",
    year: "2025",
    status: "published",
    claim:
      "Lets organisations train a shared intrusion-detection model together without any of them handing over the network traffic that would identify them.",
    code: "Fedrated_Learning",
  },
  {
    title:
      "Beyond Accuracy: A Measurement-Theoretic Framework for Quantifying and Optimizing Annotation Precision in Large Language Models",
    venue: "IEEE Access",
    year: "2026",
    status: "accepted",
    claim:
      "Accuracy scores hide a problem: ask the same model the same question five times and it often answers differently. Among the six most accurate models tested, 9% to 37% of items changed label.",
    code: "Beyond-Accuracy",
  },
  {
    title:
      "The Terminal Is Enough: Formalizing the Sovereign Model Loop for Fully Local Reinforcement Learning Fine-Tuning on Consumer Silicon",
    venue: "ACM Transactions on Intelligent Systems and Technology",
    year: "2026",
    status: "under review",
    claim:
      "You can fine-tune a model with reinforcement learning entirely on your own machine, watch it happen in a terminal, and close the whole feedback loop in under 100 milliseconds.",
    code: "sovereign-model-loop",
  },
  {
    title:
      "Policy-Annotated C Compilation for Hierarchical Access Control in Industrial Control Systems: Case Studies and Formal Foundations",
    venue: "IEEE Access",
    year: "2026",
    status: "under review",
    claim:
      "The full compiler, three worked case studies, and a machine-checked proof in Lean 4 that the rules behave the way the design says they do.",
  },
  {
    title:
      "Structural Quality and Security in Agentic Software Engineering: A Multi-Dimensional Empirical Evaluation",
    venue: "IEEE Access",
    year: "2026",
    status: "accepted",
    claim:
      "What AI-written code is actually like once you measure more than whether the tests pass — complexity, maintainability, security density and duplication, against a human baseline.",
    code: "Benchmarking-Agentic-AI-Generated-Code-Against-Human-Written-Code",
  },
  {
    title:
      "MoE-Former++: Intelligent Expert Routing and Adaptive Load Balancing for Trillion-Parameter Models via Graph-Guided Neural Optimization",
    venue: "IEEE Transactions on Parallel and Distributed Systems",
    year: "2026",
    status: "under review",
    claim:
      "Large sparse models waste capacity when routing collapses onto a few experts. Treating the routing decision as a graph problem gets utilization to 96%.",
    code: "MoE-Former-",
  },
  {
    title:
      "Mirrors that Remember: Measuring Self-Image Sycophancy in Language Models under Persistent Memory",
    venue: "NeurIPS workshop — AI and the Self, Paris",
    year: "2026",
    status: "accepted",
    claim:
      "Models are known to agree with what you believe about the world. This asks whether remembering what you believe about yourself makes them flatter you, and whether memory makes it stick.",
    code: "Memory-mirror",
  },
  {
    title:
      "Consistency as Uncertainty: Using Repeated Sampling Agreement to Guide Robust Knowledge Distillation into Small Language Models",
    venue: "MDPI",
    year: "2026",
    status: "in preparation",
    claim:
      "When a model disagrees with itself across repeated attempts, that disagreement is a usable signal — and you can steer the training of a smaller model with it.",
  },
];

export type Milestone = { when: string; what: string };

/** Research timeline, from the dissertation proposal. */
export const timeline: readonly Milestone[] = [
  { when: "2024", what: "Built the simulator everything else runs on." },
  {
    when: "Early 2025",
    what: "Got it passing all 1,025 official RISC-V tests against the reference model. Started on the compiler.",
  },
  {
    when: "Late 2025",
    what: "Compiler finished, with three worked case studies. Both conference papers published.",
  },
  {
    when: "Early 2026",
    what: "Wiring the policy checker into the simulator so it runs on every instruction.",
  },
  {
    when: "Now — Dec 2026",
    what: "Measuring it against six real vulnerability classes, then writing it all up.",
  },
];
