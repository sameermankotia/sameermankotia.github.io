/**
 * .init — the work history, and the three systems built inside it.
 *
 * Roles are the spine; the cards are what the roles produced. Two of the three
 * are reachable — the OCR dashboard and MyUI are both live — and the third is
 * in a private university repository, so its card says so rather than offering
 * a link that would 404.
 *
 * Drawn from the resume, and in Nexus's case from the `ui-insight/reactfast`
 * repository it grew out of.
 */

export type Role = {
  title: string;
  org: string;
  span: string;
  /** Running now. */
  current: boolean;
  note: string;
};

export const roles: readonly Role[] = [
  {
    title: "Graduate Research Assistant",
    org: "University of Idaho · sponsored by Schweitzer Engineering Laboratories",
    span: "Jan 2024 — present",
    current: true,
    note: "The dissertation: the toolchain at the top of this page, from the compiler through to enforcement on every instruction.",
  },
  {
    title: "Developer Intern",
    org: "Institute for Interdisciplinary Data Sciences",
    span: "Jan 2025 — present",
    current: true,
    note: "Built the OCR evaluation harness and dashboard, and Nexus, the platform that automates pre-award and accounts-payable work. Wrote the documentation and ran the training sessions so other teams could operate both without me.",
  },
  {
    title: "Software Developer Intern",
    org: "University of Idaho · Office of Information Technology",
    span: "Jan 2023 — Jan 2025",
    current: false,
    note: "Started on requirements, writing user stories for the MyUI card feature, then moved into building them. Playwright coverage, team code review, and a pass over the platform's slower SQL queries.",
  },
  {
    title: "Software Developer Intern",
    org: "IBM · Cisco · Defence Research and Development Organisation, India",
    span: "Earlier",
    current: false,
    note: "Three industry internships before graduate school.",
  },
];

export type Project = {
  id: "ocr" | "nexus" | "myui";
  name: string;
  org: string;
  /** Where it can be seen, if it can. */
  href?: string;
  /** What the link is, read back as written. */
  hrefLabel?: string;
  /** Stated when there is no link, so the absence is explained. */
  closed?: string;
  summary: string;
  /** What the plate beside it shows, for anyone not looking at it. */
  plateAlt: string;
  /** Two or three things the system actually does, as bullet points. */
  points: readonly string[];
  stack: readonly string[];
};

export const projects: readonly Project[] = [
  {
    id: "ocr",
    name: "OCR evaluation harness",
    org: "Institute for Interdisciplinary Data Sciences",
    href: "https://ocr-evaluation-dashboard.k8s-dev.hpc.uidaho.edu/",
    hrefLabel: "ocr-evaluation-dashboard.k8s-dev.hpc.uidaho.edu",
    summary:
      "Choosing an OCR model is an empirical question, and it only gets a real answer if every model sees exactly the same documents and is scored exactly the same way. This runs that experiment: one pipeline takes documents in, puts them through as many model configurations as you like, normalises what comes back, and scores every document separately.",
    plateAlt:
      "One set of documents fans out to several OCR model configurations, each result is normalised the same way, scored, and shown on a dashboard where any aggregate number can be traced back to the individual document behind it.",
    points: [
      "Identical inputs to every configuration, so a difference in the score is a difference in the model and not in the harness.",
      "Normalisation and scoring are configurable, and reproducible — the same run twice gives the same numbers.",
      "Every aggregate on the dashboard traces back to the individual documents behind it, which is what makes a disagreement investigable instead of just visible.",
      "Exposed as importable Python and React pieces, so other researchers can benchmark inside their own workflows.",
    ],
    stack: ["Python", "React", "Kubernetes", "Evaluation design"],
  },
  {
    id: "nexus",
    name: "Nexus",
    org: "Institute for Interdisciplinary Data Sciences",
    closed: "Private university repository — grew out of ui-insight/reactfast",
    summary:
      "An internal platform that automates pre-award and accounts-payable workflows. A React front end over a FastAPI service, with background workers for the jobs that should not block a request, containerised with Docker Compose and shipped through Azure Pipelines.",
    plateAlt:
      "A React front end talks to a FastAPI service through an access-control gate backed by Microsoft Entra groups. The service and its background workers both persist to a relational database.",
    points: [
      "Access control is role-based against Microsoft Entra group mappings, so permissions follow the university's existing directory rather than a second list that drifts.",
      "Secrets are externalised rather than configured in place, and the environment is split three ways across development, test and production.",
      "Nothing reaches production without review: work happens on short-lived branches, merges to test by pull request with checks, and only then to main.",
      "Jest and React Testing Library on the front end; pytest on the service.",
    ],
    stack: [
      "React",
      "TypeScript",
      "FastAPI",
      "Docker Compose",
      "Azure Pipelines",
      "Entra ID",
    ],
  },
  {
    id: "myui",
    name: "MyUI cards",
    org: "University of Idaho · Office of Information Technology",
    href: "https://my.uidaho.edu/",
    hrefLabel: "my.uidaho.edu",
    summary:
      "The university's student dashboard. I wrote the user stories for the card feature and then built the cards: React and Node components pulling live, role-based data from the Campus Labs REST API, so a student and a member of staff open the same dashboard and are shown different things.",
    plateAlt:
      "Data from the Campus Labs REST API passes into a MyUI card, which branches on the viewer's role and renders either the student view or the staff view.",
    points: [
      "One card, two audiences: the role decides what is fetched and what is rendered, rather than shipping two components that drift apart.",
      "Playwright coverage, because a dashboard that silently shows the wrong person's data is the failure that matters.",
      "Reviewed in team code review in both directions — giving feedback and applying it.",
      "A pass over the platform's slower SQL, which is where the page's load time actually was.",
    ],
    stack: ["React", "Node.js", "REST API", "Playwright", "SQL"],
  },
];
