# Local validation record

## TypeScript and lint gate (19 September 2026)

The checkout uses Yarn 1.22.22 and was validated locally with Node v25.9.0. A temporary copy omitted both `node_modules/` and `dist/`; `yarn install --frozen-lockfile --non-interactive`, `yarn lint`, `yarn type-check`, `yarn test`, and `yarn build` all passed in that order. Vitest reported 7 files and 36 passing tests. The build emitted CommonJS, ESM and both declaration files without `TS18003`.

For a negative check, `const intentionalTypeFailure: number = "wrong";` was appended to `src/index.ts` **only in the temporary copy**. `yarn build` then exited nonzero with `TS2322`; the checkout was not changed by this probe. This establishes that the build gate propagates a TypeScript error. The declarations still contain broad public types, which are addressed in roadmap task 2.2.

`bench/cache-profile.mjs` is linted and run separately after a build. It imports `dist/index.mjs`, so the clean prebuild TypeScript check intentionally covers source, tests and TypeScript configuration files, not that runtime benchmark script.

These checks are local. No CI run, package installation by a separate consumer, or published release is claimed here.

## Public types (19 September 2026)

`yarn type-check` compiled `test/types/public-contract.ts`, including expected failures for wrong payloads, missing payloads, an unknown dispatched action and an invalid selector field. `yarn lint`, 37 runtime tests and `yarn build` passed. The generated `dist/index.d.ts` and `dist/index.d.mts` were inspected for the same action, reducer, middleware and store signatures. The later installed-tarball check is recorded below.

## Package consumer (19 September 2026)

`npm pack --dry-run --json` ran `prepack` and listed only 9 intended files. `yarn test:package` installed the resulting tarball in a temporary consumer and passed ESM/CJS runtime imports, `.mts`/`.cts` TypeScript resolution, and a browser esbuild check for a single helper. See [the package contract](PACKAGING.md). This check used the local Node runtime; the later GitHub CI result is recorded below.

## Full boundary and package suite (19 September 2026)

Two more store tests cover an exception from a subscriber after state commit and a selector that throws before a value can be cached. A reducer test proves an own `__proto__` handler runs while inherited names remain ignored. The package consumer test rejects an unexported subpath with `ERR_PACKAGE_PATH_NOT_EXPORTED`.

`yarn verify` passed in the checkout and in a separate temporary copy after `yarn install --frozen-lockfile --non-interactive`: lint, type-check, 40 unit tests, build, and installed-tarball checks. The separate copy had been created without `node_modules/` or `dist/`; its dependency install was first performed for the phase 2.1 clean check, then revalidated against the current manifest and lockfile before this run. This is a local suite, not evidence of GitHub CI or another operating system.

## Node version and documentation checks (19 September 2026)

The complete `yarn verify` sequence passed locally under Node 22.23.2 and 24.21.0, selected through the npm `node` package, with Yarn 1.22.22. After the README and getting-started rewrite, `yarn docs:links` checked 48 relative Markdown links in 17 files on both Node versions. `yarn test:package` also compiled the exact TypeScript block extracted from the README and executed the JavaScript block extracted from `docs/GETTING_STARTED.md` against an installed tarball on both versions. The README at commit `8614da2` rendered on the public GitHub repository on 19 September 2026: headings, command blocks, the capability table and links were present. Clicking its API reference link opened the rendered `docs/API.md`. The later GitHub CI result is recorded below.

## Benchmarks (19 September 2026)

Redux Toolkit, Zustand and esbuild were added as pinned development dependencies. The benchmark script completed three separate 200,000-operation runs per workload with five rotated trials each, and saved raw JSON results in `bench/results/`. The GC-forced cache profile was also saved. The environment, measured ranges, semantic differences and limitations are in [BENCHMARKS.md](BENCHMARKS.md). After the dependency change, `yarn verify` passed again locally with 40 tests and the 9-file installed tarball check.

## Visual evidence (19 September 2026)

Chrome captured the built local workbench at 1280 px in its initial state and after adding and completing a task, plus an initial 390 px mobile layout. Each full-page PNG was inspected. A 1280 × 640 social cover was rendered from `docs/assets/social-preview.html` with the actual initial screenshot in its inset. Source revision, dimensions and SHA-256 hashes are recorded in [the image provenance](assets/README.md); each PNG is under 122 KB. After commit `62cc606` was pushed, the public GitHub README loaded the initial image at its original width, and the rendered `docs/DEMO.md` loaded all three screenshots. This verifies repository-hosted images, not a public interactive demo or the GitHub social-preview setting.

## Contribution and private reports (19 September 2026)

The contribution guide uses the same frozen Yarn install and `yarn verify` path already exercised in a clean temporary checkout for the phase 2 package check. After commit `5e7832c`, `yarn docs:links` checked 69 links in 21 files and Ruby's YAML parser loaded all three issue form configuration files. GitHub rendered the issue chooser with Bug report, Feature proposal and the private security link. Opening Bug report showed the four required fields and the warnings against posting secrets; no issue was submitted. GitHub's repository security settings showed private vulnerability reporting disabled before it was enabled, then showed the Disable control. No response-time or released-version support is claimed.

## GitHub CI (19 September 2026)

The first [Verify run](https://github.com/OthmaneBlial/fluxus/actions/runs/35444079229) completed with `success` at commit `1405522`. Its Node 22 and Node 24 jobs both completed successfully on GitHub-hosted Ubuntu runners: checkout, Node setup, Yarn 1.22.22 installation, frozen dependency installation and `yarn verify`. The workflow has `push` on `main`, `pull_request` and manual triggers with read-only repository contents permission. The push path is verified by this run; a real pull-request event has not been exercised. The repository's Dependabot version-update configuration covers npm/Yarn dependencies and GitHub Actions weekly, and the security settings showed Dependabot alerts enabled after the change. No automatic dependency-update PR result is claimed.
