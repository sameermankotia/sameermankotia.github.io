# sameermankotia.com

Personal site. Astro 7, Tailwind 4, no framework runtime — the three interactive
pieces are plain TypeScript modules that Astro bundles and inlines.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/ (static, ~250 KB including fonts)
npm run check    # astro check, must be 0 errors
```

## The idea

The page is laid out as an object file, because that is what the dissertation
produces: a binary that carries its own access-control policy. The sections are
real ELF section names and the addresses in the left rail are the base
addresses the UICC compiler assigns.

| Section        | Holds                                         |
| -------------- | --------------------------------------------- |
| `.text`        | The statement and FIG. 1, the toolchain plate  |
| `.policy_meta` | The BHPol policy table, queryable in-page      |
| `.data`        | Systems built                                  |
| `.rodata`      | Publications and the research timeline         |
| `.symtab`      | Where the names resolve to                     |

Two renderings, named for the two ends of the dissertation's title: **SOURCE**
is the file on disk, **RUNTIME** is the program executing. Neither is the other
inverted — the accent differs in kind, not just lightness, because an emerald
that has to carry small label text on near-white is not the phosphor green that
belongs on an instrument.

## Where the content lives

All copy is data. No prose is embedded in a component.

```
src/data/site.ts          identity, off-page links, the section map
src/data/toolchain.ts     FIG. 1 — the twelve steps and their notes
src/data/policy.ts        the sensor case study + the matching logic
src/data/work.ts          .data entries
src/data/publications.ts  .rodata papers and the timeline
```

To change what the site says, edit those five files. Components read them and
should not need touching.

## The policy query

`src/data/policy.ts` is not a mock. `evaluate()` is the real BHPol matching
rule — a prefix comparison at the group boundary, deny by default — running
against the eleven rules of the sensor-monitoring case study (dissertation
§3.4). The same module is imported by the page and by the test below, so the
thing shipped is the thing verified.

```bash
node scripts/check-policy.mjs
```

That asserts nine decisions against the worked examples in §3.4.4 and §3.4.5,
including the exploit case: a hijacked `calibrate()` attempting to write
`baseline` must be denied. If a rule is edited and a cited outcome changes, this
fails.

**On the label convention.** §3.4 fixes the group labels through its policy
rules — `system_data` is `00`, `sensor_data` is `01`, `stats_data` is `10` — and
§3.4.5 confirms them against the worked trace. Table 1 of the IEEE Access draft
prints a different object column in which every variable is numbered under `10`;
that table contradicts the rules printed two pages later, so it cannot be what
the compiler emitted. The §3.4 convention is used here. Worth fixing in the
paper before submission.

## Before this goes live

1. **Confirm three URLs** in `src/data/site.ts`. The resume carried GitHub,
   LinkedIn and Google Scholar as hyperlinks, so the labels were visible but the
   targets were not. The values there are the conventional spellings, not
   verified ones, and each is marked `verify: true`.
2. **Set the domain** in `astro.config.mjs` (`site:`), which drives the
   canonical URL and OG tags.
3. **Add an OG image** at `public/og.png`, 1200×630, and reference it in
   `src/layouts/Base.astro`. There is no `og:image` tag until you do.

## Deploying

Static output, so anything will host it.

```bash
npm run build && npx vercel deploy --prebuilt   # or: netlify deploy --dir dist
```

For GitHub Pages, set `base` in `astro.config.mjs` if it is not served from the
domain root.

## Conventions

- **Square corners.** The only curve in the system is the node dot on a wire.
- **No shadows.** The token layer clears the shadow namespaces outright, so a
  stray `shadow-lg` cannot render one.
- **Mono is structural.** Every label, identifier and address is IBM Plex Mono.
  Sans is for running prose only — the one thing here read in sentences rather
  than scanned in columns.
- **Figures are `aria-hidden`.** Everything a plate says is said in the table
  beneath it, which is the keyboard and screen-reader route. Pointing at a
  drawn part reads the same entry as pointing at its row.
- **Numbers are cited or absent.** An entry with no measured result says
  "in progress" rather than reaching for an adjective.
