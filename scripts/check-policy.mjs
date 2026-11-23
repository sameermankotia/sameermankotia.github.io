/**
 * Asserts the shipped policy engine against the dissertation.
 *
 * `src/data/policy.ts` is imported directly — the same module the page loads —
 * so this verifies the thing that ships rather than a copy of it. Each case
 * cites the section of the proposal that states the expected outcome. Run with
 * `npm run test:policy`; it exits non-zero on any mismatch.
 */
import { subjects, objects, actions, rules, evaluate } from "../src/data/policy.ts";

const L = (arr, key, v) => arr.find(x => x[key] === v);
const ask = (fn, verb, variable) => {
  const s = L(subjects, "fn", fn), o = L(objects, "variable", variable), a = L(actions, "verb", verb);
  const d = evaluate(s.label, o.label, a.label);
  return { ok: d.allowed, rule: d.ruleIndex };
};

// Expected outcomes, each cited to dissertation section 3.4.4 / 3.4.5.
const cases = [
  ["calibrate", "read",  "baseline",      true,  "3.4.5 permitted via 01 00 111"],
  ["calibrate", "write", "sensor_values", true,  "3.4.5 permitted via 01 01 101"],
  ["calibrate", "write", "baseline",      false, "3.4.5 the exploit: denied"],
  ["compute_average", "read",  "sensor_values", true,  "3.4.5 permitted via 10 01 111"],
  ["compute_average", "write", "average",       true,  "3.4.5 permitted via 10 10 101"],
  ["compute_average", "write", "sensor_values", false, "3.4.4 analytics cannot write sensors"],
  ["read_sensor",     "read",  "threshold",     false, "3.4.4 sensor_ops cannot touch statistics"],
  ["get_status",      "write", "status",        false, "3.4.4 analytics cannot write system globals"],
  ["init_system",     "write", "status",        true,  "3.4.3 system_ops write system_data"],
];

let fail = 0;
for (const [fn, verb, v, want, why] of cases) {
  const got = ask(fn, verb, v);
  const pass = got.ok === want;
  if (!pass) fail++;
  console.log(`${pass ? "ok  " : "FAIL"}  ${fn}() ${verb} ${v.padEnd(14)} -> ${got.ok ? "ALLOW" : "DENY "} ${got.rule >= 0 ? "rule " + got.rule : "     "}  ${why}`);
}

// Totals across the whole cross-product of the three primary trees.
let allow = 0, deny = 0;
for (const s of subjects) for (const o of objects) for (const a of actions)
  evaluate(s.label, o.label, a.label).allowed ? allow++ : deny++;
console.log(`\ncross-product: ${allow} allow / ${deny} deny of ${allow + deny}`);
console.log(fail ? `\n${fail} FAILED` : "\nall expected decisions match the dissertation");
process.exit(fail ? 1 : 0);
