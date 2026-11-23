/**
 * FIG. 1 parts — the unified security framework, source to runtime.
 *
 * Every part here is a component named in the dissertation or in one of the
 * three papers. Nothing in this list is invented for the drawing: `component`
 * is the identifier as the source spells it, and a step may not be added
 * without one. Where a claim carries a number, the number is cited.
 *
 * Step numbering runs 01 through 12 along the flow. Steps 01–06 are the
 * compiler; 07–12 are the simulator. The boundary between them is the ELF
 * binary, which is the whole point of the design: the policy crosses that
 * boundary inside the artifact rather than beside it.
 */

export type Step = {
  /** Two-digit step, as it appears in the bracketed tag on the plate. */
  step: string;
  /** Short name, used as the control's accessible label. */
  name: string;
  /** The identifier the source uses, shown beneath the name on the plate. */
  component: string;
  /** Which half of the toolchain owns this step. */
  side: "compile" | "runtime";
  /** What the part does. No claim here is unsupported by the papers. */
  note: string;
};

export const steps: readonly Step[] = [
  {
    step: "01",
    name: "Annotated C source",
    component: "*.c",
    side: "compile",
    note: "One file. The security rules sit in the same C file as the code they govern, written as ordinary #pragma lines. That is the whole point: a rule kept in a separate config file drifts away from the code over time, and nothing at runtime notices when it has.",
  },
  {
    step: "02",
    name: "Preprocessor",
    component: "Preprocessor.py",
    side: "compile",
    note: "Reads the file and pulls out the security rules before the compiler proper sees it. Four kinds of line: how deep the hierarchy goes, which functions belong to which group, which variables belong to which group, and the rules themselves.",
  },
  {
    step: "03",
    name: "Parse and symbols",
    component: "CParser · RISCVGenerator",
    side: "compile",
    note: "Turns the C into RISC-V instructions and builds the symbol table — the list of every function and variable in the program. By the time it finishes, each entry also knows which security group it belongs to.",
  },
  {
    step: "04",
    name: "Three labeled trees",
    component: "Subject · Action · Object",
    side: "compile",
    note: "Three hierarchies: who is acting, what they are touching, and what they are doing. Each is a tree, and each node's name extends its parent's. That one trick is what makes the check fast — asking \"is A inside B\" becomes a prefix comparison, and a rule written for a whole group automatically covers everything under it.",
  },
  {
    step: "05",
    name: "Address resolution",
    component: "CompilerObjectTreeGenerator",
    side: "compile",
    note: "Every name becomes a real memory address, at compile time. Globals land at their section's base plus an offset; stack variables count down from the top. You write sensor_ops and sensor_data; the binary carries addresses.",
  },
  {
    step: "06",
    name: "Policy-carrying ELF",
    component: ".policy_meta · .text_tag",
    side: "compile",
    note: "The finished program file. Alongside the usual code and data, it carries two extra sections: the full policy table, and a label for every single instruction saying which function owns it. The rules now travel inside the program, so copying it somewhere else cannot leave them behind.",
  },
  {
    step: "07",
    name: "Loader",
    component: "BIOS · ELF loader",
    side: "runtime",
    note: "Opens the program file, loads it into memory, and reads the policy table out of it — all before the first instruction runs. There is never a moment when the program is executing without its rules in force.",
  },
  {
    step: "08",
    name: "Sparse memory",
    component: "RAM (RV64)",
    side: "runtime",
    note: "Memory kept as a dictionary of addresses that actually hold something, so the huge empty gaps between code, data and the stack cost nothing. Swapping in a different memory model — a cache, say — means extending one class.",
  },
  {
    step: "09",
    name: "Hardware thread",
    component: "Hart_RV32 · Hart_RV64",
    side: "runtime",
    note: "Fetch, decode, execute. Instructions are described in a table rather than hard-coded, so teaching it a new one takes a few lines: 45 vector instructions took 184 lines and about a day, against an estimated several weeks in the standard simulators.",
  },
  {
    step: "10",
    name: "Policy enforcement",
    component: "BHPol policy manager",
    side: "runtime",
    note: "The contribution. Before any read or write reaches memory, it is stopped and three questions are asked — which function is running, what address is it touching, is it reading or writing — and the answer is looked up in the table. The lookup is a prefix comparison, so it costs the same no matter how big the policy is.",
  },
  {
    step: "11",
    name: "Permitted",
    component: "match · access proceeds",
    side: "runtime",
    note: "If some rule covers the access, it goes through. In the sensor example, 56 of 7,381 possible combinations are allowed.",
  },
  {
    step: "12",
    name: "Denied",
    component: "no match · exception",
    side: "runtime",
    note: "If nothing covers it, it is blocked and an exception is raised — the write never lands. The default is deny, so forgetting to write a rule is itself a decision rather than an accidental permission. That is the remaining 7,325 combinations.",
  },
];

/** The claim the plate is making, stated in text for anyone not looking at it. */
export const figureDescription =
  "A C file with security rules written into it goes through six compiler stages, and comes out as a program that carries those rules inside itself. The simulator then loads the program, reads the rules out of it before anything runs, and checks every single memory access against them. Anything the rules do not explicitly allow is blocked before it reaches memory.";
