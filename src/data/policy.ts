/**
 * The sensor-monitoring case study, as a queryable policy set.
 *
 * Source: dissertation §3.4, and Case Study 2 of the UICC Compiler paper.
 * Eleven pragma rules cover eight functions, nine variables and two actions.
 *
 * A note on labels. §3.4 fixes the group labels through its policy rules —
 * system_data is 00, sensor_data is 01, stats_data is 10 — and §3.4.5 confirms
 * them against the worked trace ("baseline, whose object label is 00.10",
 * sensor_values at 01.00, average at 10.00). Table 1 of the IEEE Access draft
 * prints a different object column, in which every variable is numbered under
 * 10; that table disagrees with the rules printed two pages later and cannot
 * be the one the compiler emitted. The §3.4 convention is used here, since it
 * is the one the paper's own worked examples verify.
 */

export type Subject = {
  fn: string;
  group: string;
  label: string;
};

export type ObjectVar = {
  variable: string;
  group: string;
  label: string;
  decl: string;
};

export type Action = {
  verb: string;
  label: string;
};

export type Rule = {
  subject: string;
  object: string;
  action: string;
  /** The pragma comment as written in the source. */
  intent: string;
};

/** Subject tree: functions, grouped by operational role. */
export const subjects: readonly Subject[] = [
  { fn: "init_system", group: "system_ops", label: "00.00" },
  { fn: "reset_system", group: "system_ops", label: "00.01" },
  { fn: "read_sensor", group: "sensor_ops", label: "01.00" },
  { fn: "write_sensor", group: "sensor_ops", label: "01.01" },
  { fn: "calibrate", group: "sensor_ops", label: "01.10" },
  { fn: "compute_average", group: "analytics", label: "10.00" },
  { fn: "detect_anomaly", group: "analytics", label: "10.01" },
  { fn: "get_status", group: "analytics", label: "10.10" },
];

/** Object tree: globals, grouped by what kind of data they hold. */
export const objects: readonly ObjectVar[] = [
  { variable: "status", group: "system_data", label: "00.00", decl: "int status" },
  { variable: "error_count", group: "system_data", label: "00.01", decl: "int error_count" },
  { variable: "baseline", group: "system_data", label: "00.10", decl: "int baseline" },
  { variable: "sensor_values", group: "sensor_data", label: "01.00", decl: "int sensor_values[8]" },
  { variable: "sensor_ids", group: "sensor_data", label: "01.01", decl: "int sensor_ids[8]" },
  { variable: "read_count", group: "sensor_data", label: "01.10", decl: "int read_count" },
  { variable: "average", group: "stats_data", label: "10.00", decl: "int average" },
  { variable: "anomaly_count", group: "stats_data", label: "10.01", decl: "int anomaly_count" },
  { variable: "threshold", group: "stats_data", label: "10.10", decl: "int threshold" },
];

/** Action tree. The case study's policies use the two memory operations. */
export const actions: readonly Action[] = [
  { verb: "read", label: "111" },
  { verb: "write", label: "101" },
];

/** Group names, keyed by the label the tree assigns them. */
export const subjectGroups: Record<string, string> = {
  "00": "system_ops",
  "01": "sensor_ops",
  "10": "analytics",
};

export const objectGroups: Record<string, string> = {
  "00": "system_data",
  "01": "sensor_data",
  "10": "stats_data",
};

/** The eleven rules, in source order. Default is deny. */
export const rules: readonly Rule[] = [
  { subject: "00", object: "00", action: "111", intent: "system_ops read system_data" },
  { subject: "00", object: "00", action: "101", intent: "system_ops write system_data" },
  { subject: "00", object: "01", action: "101", intent: "system_ops write sensor_data" },
  { subject: "00", object: "10", action: "101", intent: "system_ops write stats_data" },
  { subject: "01", object: "01", action: "111", intent: "sensor_ops read sensor_data" },
  { subject: "01", object: "01", action: "101", intent: "sensor_ops write sensor_data" },
  { subject: "01", object: "00", action: "111", intent: "sensor_ops read system_data" },
  { subject: "10", object: "01", action: "111", intent: "analytics read sensor_data" },
  { subject: "10", object: "00", action: "111", intent: "analytics read system_data" },
  { subject: "10", object: "10", action: "111", intent: "analytics read stats_data" },
  { subject: "10", object: "10", action: "101", intent: "analytics write stats_data" },
];

/**
 * Preset queries, so the first thing a visitor sees is a decision rather than
 * three empty selects. The second is the exploit scenario from §3.4.5: an
 * attacker who has redirected `calibrate` into a write it was never granted.
 */
export type Preset = {
  title: string;
  blurb: string;
  fn: string;
  verb: string;
  variable: string;
};

export const presets: readonly Preset[] = [
  {
    title: "Calibration reads the baseline",
    blurb: "Legitimate cross-group read. Covered by a group-level rule.",
    fn: "calibrate",
    verb: "read",
    variable: "baseline",
  },
  {
    title: "The same function, redirected",
    blurb: "A hijacked calibrate tries to overwrite the baseline it may only read.",
    fn: "calibrate",
    verb: "write",
    variable: "baseline",
  },
  {
    title: "Analytics writes to the sensors",
    blurb: "Analytics may read sensor data. It has no business steering hardware.",
    fn: "compute_average",
    verb: "write",
    variable: "sensor_values",
  },
  {
    title: "Analytics writes its own statistics",
    blurb: "Same function, its own working space. This is what it is for.",
    fn: "compute_average",
    verb: "write",
    variable: "average",
  },
];

/**
 * Prefix match at the group boundary.
 *
 * A stored label covers a query label when it is a prefix of it, split on the
 * dot so a partial symbol can never match. `01` covers `01.00`, `01.01` and
 * `01.10`; it does not cover `10.00`, because the first group fixes the branch.
 * Returns the relationship so the UI can say which kind of match it found.
 */
export function matchLabel(
  stored: string,
  query: string,
): "exact" | "ancestor" | "none" {
  if (stored === query) return "exact";
  const s = stored.split(".");
  const q = query.split(".");
  if (s.length > q.length) return "none";
  return s.every((sym, i) => sym === q[i]) ? "ancestor" : "none";
}

export type Decision = {
  allowed: boolean;
  /** Index of the rule that covered the query, or -1 if none did. */
  ruleIndex: number;
  subjectMatch: "exact" | "ancestor" | "none";
  objectMatch: "exact" | "ancestor" | "none";
  actionMatch: "exact" | "ancestor" | "none";
};

/**
 * Evaluate one access against the whole table.
 *
 * Deny by default: the query must be covered on all three columns by a single
 * entry, either exactly or through hierarchical inheritance. Finding no match
 * is not an error state — it is the decision.
 */
export function evaluate(
  subjectLabel: string,
  objectLabel: string,
  actionLabel: string,
): Decision {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]!;
    const s = matchLabel(rule.subject, subjectLabel);
    const o = matchLabel(rule.object, objectLabel);
    const a = matchLabel(rule.action, actionLabel);
    if (s !== "none" && o !== "none" && a !== "none") {
      return {
        allowed: true,
        ruleIndex: i,
        subjectMatch: s,
        objectMatch: o,
        actionMatch: a,
      };
    }
  }
  return {
    allowed: false,
    ruleIndex: -1,
    subjectMatch: "none",
    objectMatch: "none",
    actionMatch: "none",
  };
}
