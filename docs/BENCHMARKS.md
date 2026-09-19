# Local benchmark: scope and raw evidence

These numbers describe **one Apple M2, macOS arm64, 16 GiB RAM, Node v25.9.0** on 19 September 2026. Node 25 was the installed measurement runtime, not a statement of release support. Fluxus is the local `0.1.0` build; the benchmark pins Redux Toolkit `2.12.0`, Zustand `5.0.15`, and esbuild `0.23.1` in `yarn.lock`.

Run from a checkout with Yarn 1:

```bash
yarn install --frozen-lockfile
yarn build
node bench/run.mjs > result.json
node --expose-gc bench/cache-profile.mjs
```

The script checks state values and subscriber counts before accepting a timing. It warms each library and workload with 20,000 operations, then records five trials of 200,000 operations. Library order rotates between trials. Three separate process runs are preserved as [run 1](../bench/results/2026-09-19-apple-m2-node25-run1.json), [run 2](../bench/results/2026-09-19-apple-m2-node25-run2.json), and [run 3](../bench/results/2026-09-19-apple-m2-node25-run3.json). The table gives the range of the three **per-run medians**, in milliseconds; lower is faster for this exact task.

| 200,000 operations | Fluxus | Redux Toolkit | Zustand vanilla |
| --- | ---: | ---: | ---: |
| Increment state | 46.6–60.8 | 910.8–1108.3 | 63.6–77.4 |
| Increment with one subscriber | 69.3–95.4 | 1131.9–1298.0 | 74.8–87.6 |
| Subscribe then unsubscribe | 91.0–107.3 | 156.0–219.0 | 69.2–71.9 |
| Read current count | 2.7–6.2 | 3.3–4.6 | 3.6–6.5 |
| Read derived double count | 10.7–20.3 | 13.5–53.3 | 9.7–17.5 |

For the same minimal counter API, esbuild minified a production browser ESM bundle and gzip compressed the output. Fluxus: **1,720 bytes minified / 763 bytes gzip**; Redux Toolkit: **23,134 / 8,931**; Zustand vanilla: **435 / 298**. These include different implementations and feature sets, and do not measure a whole application or a published package download.

The dispatch implementations are deliberately idiomatic, not feature equivalent. Fluxus uses a manual immutable reducer, Redux Toolkit uses `createSlice` with Immer but has default middleware and DevTools disabled for this test, and Zustand uses `setState`. Fluxus and Redux Toolkit cache the derived selector; the Zustand row invokes a direct selector on the current state. Those differences prevent a general speed ranking. The short read workloads also vary substantially across runs, and the benchmark does not measure rendering, asynchronous work, browser interaction, or a large application.

The separate [GC-forced cache profile](../bench/results/2026-09-19-cache-profile.json) sampled Fluxus heap after 100,000 new selectors and states: 3.01 MiB after warmup, then 3.88 MiB in each of four 25,000-iteration rounds. It is a single local diagnostic, not a cross-library memory comparison or a leak guarantee. Do not describe Fluxus as generally faster or lower-memory on this evidence.
