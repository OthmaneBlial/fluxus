# Local benchmark: scope and raw evidence

These numbers describe **one Apple M2, macOS arm64, 16 GiB RAM, Node v25.9.0** on 19 September 2026. Node 25 was the installed measurement runtime, not a statement of release support. Fluxus is the local `0.1.0` build at commit `96eab7e`; the current lockfile pins Redux Toolkit `2.12.0`, Zustand `5.0.15`, and esbuild `0.28.2`. `NODE_ENV` was unset. [Earlier raw runs](../bench/results/2026-09-19-apple-m2-node25-run1.json) used esbuild `0.23.1`; they remain archived and are not combined with the table below.

Run from a checkout with Yarn 1:

```bash
yarn install --frozen-lockfile
yarn build
node bench/run.mjs > result.json
node --expose-gc bench/cache-profile.mjs
```

The script checks state values and subscriber counts before accepting a timing. It warms each library and workload with 20,000 operations, then records five trials of 200,000 operations. Library order rotates between trials. Three separate process runs with the current lockfile are preserved as [run 1](../bench/results/2026-09-19-apple-m2-node25-esbuild028-run1.json), [run 2](../bench/results/2026-09-19-apple-m2-node25-esbuild028-run2.json), and [run 3](../bench/results/2026-09-19-apple-m2-node25-esbuild028-run3.json). The table gives the range of the three **per-run medians**, in milliseconds; lower is faster for this exact task.

| 200,000 operations | Fluxus | Redux Toolkit | Zustand vanilla |
| --- | ---: | ---: | ---: |
| Increment state | 11.3–85.9 | 197.0–1515.4 | 11.6–72.1 |
| Increment with one subscriber | 17.1–25.0 | 226.1–384.5 | 17.0–25.3 |
| Subscribe then unsubscribe | 17.4–28.4 | 34.8–61.0 | 17.5–28.8 |
| Read current count | 1.5–2.8 | 1.8–3.4 | 1.7–3.5 |
| Read derived double count | 3.8–7.5 | 5.2–9.3 | 2.0–3.4 |

For the same minimal counter API, esbuild minified a production browser ESM bundle and gzip compressed the output. Fluxus: **1,720 bytes minified / 763 bytes gzip**; Redux Toolkit: **23,140 / 8,934**; Zustand vanilla: **437 / 297**. These include different implementations and feature sets, and do not measure a whole application or a published package download.

The dispatch implementations are deliberately idiomatic, not feature equivalent. Fluxus uses a manual immutable reducer, Redux Toolkit uses `createSlice` with Immer but has default middleware and DevTools disabled for this test, and Zustand uses `setState`. Fluxus and Redux Toolkit cache the derived selector; the Zustand row invokes a direct selector on the current state. Those differences prevent a general speed ranking. Even with the same versions and method, the first run's increment medians were several times larger than the later runs. The data do not establish the cause of that variation. The benchmark does not measure rendering, asynchronous work, browser interaction, or a large application.

The separate [GC-forced cache profile](../bench/results/2026-09-19-cache-profile-esbuild028.json) sampled Fluxus heap after 100,000 new selectors and states: 3.01 MiB after warmup, then 3.88 MiB in each of four 25,000-iteration rounds. It is a single local diagnostic, not a cross-library memory comparison or a leak guarantee. Do not describe Fluxus as generally faster or lower-memory on this evidence.
