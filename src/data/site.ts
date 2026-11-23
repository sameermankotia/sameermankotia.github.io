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
 * All four were confirmed by the person they belong to. Nothing here is a
 * guess any more, so `verify` is false throughout; keep the field, because the
 * next link added will start out unconfirmed.
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
    href: "https://scholar.google.com/citations?user=QGQA0RM2okMC&hl=en",
    handle: "scholar.google.com",
    note: "Papers and citations",
    verify: false,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/saameer24/",
    handle: "linkedin.com/in/saameer24",
    note: "Work history",
    verify: false,
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
  { id: ".init", addr: "0x40000", holds: "Where I have worked" },
  { id: ".rodata", addr: "0x50000", holds: "Papers" },
  { id: ".symtab", addr: "0x60000", holds: "Contact" },
];

/** The dissertation itself, named wherever the page refers to it. */
export const dissertation = {
  title:
    "A Unified Security Framework for Industrial Control Systems: Enforcing Fine-Grained Security Policies from Source Code to Runtime Execution",
  short: "A unified security framework for industrial control systems",
  degree: "Ph.D. Computer Science",
  expected: "December 2026",
} as const;
