/**
 * FIG. 1 — the UICC to BHPol toolchain, from the system design of Nov 2026.
 *
 * Two roads leave the same front end, and the symbol table is the hinge both
 * hang off. The compile road is what an experiment actually runs; the JSON
 * road exists so the tree structure is an artifact someone can check rather
 * than an implementation detail buried in the compiler. Both label through
 * the same module — the dashed link in the plate — so a label in an ELF and a
 * label in a transform report cannot drift apart.
 *
 * Every box names the file that owns that stage, as the source spells it. No
 * step is in this list without one.
 */

export type Step = {
  /** Two-digit step, as it appears in the bracketed tag on the plate. */
  step: string;
  name: string;
  /** The module that owns the stage. */
  component: string;
  /** Which road owns it. `shared` is the front end both roads read from. */
  road: "shared" | "compile" | "json";
  note: string;
};

export const steps: readonly Step[] = [
  {
    step: "01",
    name: "Preprocess",
    component: "Preprocessor.py",
    road: "shared",
    note: "Ordinary C preprocessing, and on the way through it collects every policy #pragma into one dictionary. The pragmas are stripped before the parser sees the file, so nothing policy-related survives into the token stream — the policy travels beside the code rather than inside it. Two older pragma forms are now refused loudly instead of ignored, because a stale file quietly changing what a build means is worse than a build that stops.",
  },
  {
    step: "02",
    name: "Parse",
    component: "uicc.py · CParser",
    road: "shared",
    note: "Turns the preprocessed C into tokens. Nothing in this stage knows what a label or a policy is, and that is deliberate: this stage decides where a variable lives, the labeling stage decides what that variable is called in the policy. Changing the label format never touches code generation.",
  },
  {
    step: "03",
    name: "Symbol table",
    component: "symtab.py",
    road: "shared",
    note: "The hinge of the whole design — the one place where the C-level facts and the policy-level facts meet. Every entry carries its type and size, where it lives (section, register, offset, address), which policy group it belongs to, and the labels filled in next. Both roads read from here, which is why they cannot disagree about what the program contains.",
  },
  {
    step: "04",
    name: "Canonical labeling",
    component: "bhpol_labels.py",
    road: "shared",
    note: "One source of truth for what every node is called, and therefore for what a policy is allowed to name. A label is a fixed six bits — three two-bit symbols — read left to right as the path down from the root. Symbol 00 means “the node itself”, so it is never handed to a child: that caps a node at three children and makes a label like 01.00.10 a name for nothing. Two rules fall straight out. A policy on the all-zero root would cover every node in its tree, so it is refused. And a rule that cannot be resolved is dropped and recorded — never widened into something that would resolve.",
  },
  {
    step: "05",
    name: "Code generation",
    component: "uicc.py · RISCVGenerator",
    road: "compile",
    note: "Emits RISC-V and runs a peephole pass over it. Two long-standing compiler bugs were fixed here during this work — a while loop that never terminated, and a crash on global struct access — so the test corpora compile without hand-patching.",
  },
  {
    step: "06",
    name: "ELF and data tags",
    component: "elf_gen.py · data_tags.py",
    road: "compile",
    note: "Writes two things an ordinary toolchain would not. A .policy_meta section holds the resolved policy as JSON, so a loader needs neither the source nor the pragmas. And a parallel tag section gives every byte of data a tag: the first byte of an object carries its type, every later byte repeats it with a continuation bit, and bytes belonging to nothing carry zero. Arrays repeat the pattern per element so element boundaries stay visible; struct padding stays untagged. Every case is built twice — once plain, once tagged.",
  },
  {
    step: "07",
    name: "Corpora",
    component: "generators · 2,460 cases",
    road: "compile",
    note: "Generated, never hand-maintained — which is what made the policy rework tractable, since the pragma header is one template per generator rather than 2,460 files to edit. 1,435 attack cases across 34 CWE classes, and 1,025 benign twins with the same buffers, types and access shape but every access in bounds. Without the twins a detection rate means nothing, because there is no way to see the false positives.",
  },
  {
    step: "08",
    name: "Run and measure",
    component: "FlexSiMArch",
    road: "compile",
    note: "Each case runs twice on the simulator: once with enforcement off, to record what the vulnerable program actually does to the machine, and once with it on, capturing every policy decision at the simulator's own enforcement point — the object label, the action, the address and the program counter. The simulator is imported and not modified, so the comparison is against it as it ships.",
  },
  {
    step: "09",
    name: "Serialize and verify",
    component: "bhpol_pipeline.py",
    road: "json",
    note: "Serialises the whole symbol table and the pragma data to JSON, checks that it holds together — do the pragma assignments name real symbols, do struct members fit inside their structs — then rebuilds the subject, object and action hierarchies from the flat data using a deliberately generic labeling scheme. Generic on purpose: it is the “before” that makes the next step legible.",
  },
  {
    step: "10",
    name: "Canonical transform",
    component: "bhpol_transform.py",
    road: "json",
    note: "Takes the generic trees to canonical BHPol through three named fixes: labels go from variable width to one fixed width, fan-out is capped at three with the overflow pushed under synthetic group nodes, and every node gets a real address. The address rule is what ties a label to memory — the tag sits in the high bits, so “is this address inside group G” becomes a prefix mask rather than a tree walk. After the rework this file no longer owns the label algebra; it extends the shared labeler and adds only the addresses.",
  },
  {
    step: "11",
    name: "Trees and reports",
    component: "bhpol_visualize.py",
    road: "json",
    note: "Renders each tree as an image with the nodes a policy mentions highlighted, and writes a report listing every rule that resolved and every one that was refused. This is the point of the second road: the tree structure becomes something a reviewer can look at and disagree with.",
  },
];

export const figureDescription =
  "A C file with security rules written into it passes through a shared front end — preprocessing, parsing, and a symbol table — and then splits into two roads. The compile road labels the symbols, generates RISC-V, emits an ELF binary carrying both the policy and a per-byte tag section, builds a corpus of 2,460 test cases from it, and runs each one on the FlexSiMArch simulator. The JSON road serialises the same symbol table, verifies it, recovers the three hierarchies from it, and transforms them into canonical labeled trees with addresses. Both roads label through the same module, so a label in a binary and a label in a report cannot disagree.";

/**
 * What the runs actually showed, and the three properties of the simulator's
 * enforcement that bound what any such experiment can show.
 *
 * This is on the page because the honest version is the interesting one. A
 * detection rate quoted without the benign twins, or without B2, would be a
 * stronger-looking number and a weaker claim.
 */
export const findings = [
  {
    id: "B1",
    title: "Address computation",
    note: "The enforcement path read the base register and the immediate from the wrong operands, so every load and store resolved to no address at all and got classified by its program counter instead. Stock, no data object was ever actually checked. The harness can run with the fix in place or without it, so the difference is measurable rather than assumed.",
  },
  {
    id: "B2",
    title: "Object taxonomy",
    note: "There are only three object labels: inside the code, inside data, or outside every mapped section. There is no per-variable object, so an overflow that stays within .data carries exactly the same label as a legitimate write to .data. This is the ceiling on what the current taxonomy can detect, and it is the argument for the per-variable labeling the compile road produces.",
  },
  {
    id: "B3",
    title: "One rule per subject",
    note: "The lookup finds a subject match, tests object and action at that single entry, and the branches that would keep searching do nothing. A curated set of allow-rules cannot be expressed at all, which is why the shipped policies are only allow-everything or random.",
  },
] as const;

export const results = {
  caption: "Last recorded runs over the 1,435-case attack corpus",
  columns: ["Run", "Cases", "Caught", "Sound", "Inconclusive"],
  rows: [
    ["Confinement, address fix on", "1,435", "483", "38", "952"],
    ["Stock, fix off", "1,435", "831", "0", "604"],
    ["Benign twins, spot check", "10", "8", "0", "2"],
  ],
  reading:
    "Read these honestly. No policy compiled into a binary was ever consulted — the simulator does not read .policy_meta — so these measure a confinement decision over the simulator's own three labels, not the policy the compiler embedded. Eight of ten benign twins tripped the same decision, which is B2 showing through: a label that cannot tell a legitimate write to .data from an overflowing one cannot be a detector. The 38 sound detections are the cases whose address left every mapped region, where the verdict does not depend on the taxonomy at all. These runs also predate the labeling rework. The gap they expose — a binary that carries per-variable labels, a simulator that still classifies by section — is the argument for the work, not a result against it.",
} as const;
