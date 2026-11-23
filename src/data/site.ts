/**
 * Identity, off-page references, and the section map.
 *
 * The section map is load-bearing twice over: it is the address rail on wide
 * screens and the status-bar navigation everywhere. Addresses are the base
 * addresses the UICC compiler assigns (dissertation §3.3.2), so the rail is
 * reporting something true rather than decorating with hex.
 */

export const person = {
  name: "Sameer Mankotia",
  initials: "SM",
  role: "AI researcher and workflow engineer",
  // Degree clock from the resume: Ph.D. expected Dec 2026.
  line: "Ph.D. candidate, Computer Science · University of Idaho",
  lab: "Center for Secure and Dependable Systems",
  location: "Pullman, WA",
  email: "sameerm@uidaho.edu",
  advisor: "Daniel Conte de Leon",
  funder: "Schweitzer Engineering Laboratories",
} as const;

/**
 * Off-page references.
 *
 * `handle` is the address read back as written, so a reader knows where a link
 * goes before following it.
 *
 * GitHub and the email are confirmed. Scholar points at a name search rather
 * than a profile, because a profile URL needs an opaque user id that was not
 * recoverable — swap in the real one and it becomes a better link. LinkedIn is
 * the conventional spelling of the handle and is the one entry here still
 * unverified; `verify: true` marks it.
 */
export const links = [
  {
    name: "GitHub",
    href: "https://github.com/sameermankotia",
    handle: "github.com/sameermankotia",
    note: "45 repositories — the projects above and everything else",
    verify: false,
  },
  {
    name: "Google Scholar",
    href: "https://scholar.google.com/scholar?q=%22Sameer+Mankotia%22",
    handle: "scholar.google.com",
    note: "Papers and citations",
    verify: false,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/sameer-mankotia",
    handle: "linkedin.com/in/sameer-mankotia",
    note: "Work history",
    verify: true,
  },
  {
    name: "Email",
    href: "mailto:sameerm@uidaho.edu",
    handle: "sameerm@uidaho.edu",
    note: "The fastest way to reach me",
    verify: false,
  },
] as const;

export type Section = {
  /** ELF section name, used as the heading and the rail entry. */
  id: string;
  /** Base address this section is loaded at, from the compiler's memory map. */
  addr: string;
  /** What this section of the page actually holds. */
  holds: string;
};

/**
 * Section names are ELF sections, but what they *hold* is said in plain
 * words — the conceit should reward a reader who knows it and cost nothing to
 * one who does not.
 */
export const sections: readonly Section[] = [
  { id: ".text", addr: "0x10000", holds: "My dissertation" },
  { id: ".policy_meta", addr: "0x20000", holds: "Try the policy engine" },
  { id: ".data", addr: "0x30000", holds: "Projects" },
  { id: ".rodata", addr: "0x40000", holds: "Papers" },
  { id: ".symtab", addr: "0x50000", holds: "Contact" },
];

/** The dissertation itself, named wherever the page refers to it. */
export const dissertation = {
  title:
    "A Unified Security Framework for Industrial Control Systems: Enforcing Fine-Grained Security Policies from Source Code to Runtime Execution",
  short: "A unified security framework for industrial control systems",
  degree: "Ph.D. Computer Science",
  expected: "December 2026",
} as const;
