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

## Dependency and build-tool update (19 September 2026)

Enabling Dependabot alerts exposed 38 open alerts on the old lockfile, including two critical Vitest development-tool advisories. The build and test toolchain was updated: Vitest 4.1.11, Vite 8.3.0, ESLint 10.11.0, TypeScript 5.9.3, esbuild 0.28.2 and `dts-bundle-generator` 9.5.1. The vulnerable `tsup`/`sucrase` chain was removed. `yarn audit --json` exited zero with zero advisories across its reported 219-package dependency graph; GitHub's Dependabot API subsequently returned zero open alerts on `main`. These are point-in-time advisory results, not proof that every dependency is risk-free.

The new build produces the same nine-file CJS/ESM/declaration tarball. A local Node 22.23.2 `yarn verify` passed all 40 tests and the installed consumer check. The [Verify run for commit `96eab7e`](https://github.com/OthmaneBlial/fluxus/actions/runs/35444547000) completed successfully for both Node 22 and 24 on GitHub-hosted Ubuntu. The API/package consumer check includes ESM, CJS, NodeNext `.mts`/`.cts` declarations and a browser single-helper bundle.

After the build-tool update, the benchmark was repeated in three separate Node 25 processes with esbuild 0.28.2. The new raw runs and the preserved older snapshot are linked from [the benchmark report](BENCHMARKS.md). The broad spread between processes is kept visible; no general performance claim was added.

The [Verify run for `2cf4526`](https://github.com/OthmaneBlial/fluxus/actions/runs/35444735272) completed successfully for Node 22 and 24 after the runner image was pinned to Ubuntu 24.04. A real [pull-request run](https://github.com/OthmaneBlial/fluxus/actions/runs/35444676358) from Dependabot PR #6 also completed successfully, exercising the configured PR trigger; that does not imply the dependency update was reviewed or merged. The public README loaded the live Verify badge, and the Dependabot API returned zero open alerts on `main` after the toolchain update. These checks verify CI and advisory status at this commit, not npm publication.

## Prepared release candidate and GitHub metadata (19 September 2026)

At clean commit `c775e0c`, `yarn release:check` passed lint, 84 local Markdown links in 24 files, type-check, 40 tests, build and the installed package consumer checks. Its own `npm pack --dry-run` and archive inspection found exactly nine intended files. The generated `release/othmaneblial-fluxus-0.1.0.tgz` was 11,695 bytes; `shasum -a 256 -c release/SHA256SUMS` passed with SHA-256 `9b3283c372a7dd40338e48bd802f2a9c4658d3300793d2972003bc68d78733f8`. The command installed that exact tarball offline in a fresh temporary directory and imported it through CJS and ESM. A targeted inspection of all nine archive files found no private-key header, npm/GitHub token pattern, AWS access key pattern, absolute local user path or `.npmrc` marker; this is not a comprehensive secret audit. The [GitHub Verify run](https://github.com/OthmaneBlial/fluxus/actions/runs/35444973251) for that commit succeeded on both Node 22 and 24. The tarball is local and has not been attached to a GitHub Release or published to npm.

At that checkpoint, the public repository description had been changed from an unsubstantiated performance claim to the README's framework-free state-transition proposition. Topics included `flux`, `state-management`, `typescript`, `vanilla-javascript` and `redux`. GitHub's Social preview settings page displayed the uploaded [cover derived from the real workbench](assets/README.md). The homepage and hosted interactive demo were still unset at that earlier checkpoint; the current publication and demo verification is recorded below. The authenticated npm account returned `othmaneblial`, while the earlier query returned `E404` before publication.

The README and release notes were then made accurate before and after publication: the npm command is conditional on the exact version being available, and the local tarball path remains usable until then. At commit `2d97f9a`, `yarn release:check` again passed the full 40-test suite, package consumer checks and archive inspection. The resulting nine-file tarball was 11,756 bytes with SHA-256 `26de30bf41f610082e68a3d2e0a3d45bc722ea2ce9e3a25f0f1f22103bb2a21e`. This supersedes the earlier 11,695-byte candidate; no registry version or GitHub Release is claimed.

A `npm publish --dry-run` with a bare `release/...tgz` path failed because npm treated it as a Git URL. The same dry run with `./release/...tgz` succeeded and described the intended 11,756-byte, nine-file package. The release procedure and `release:check` now use that exact path form; the complete check passed at commit `f059df0`. This was a dry run, with no npm upload.

## Staged public-demo path (19 September 2026)

The manual [Demo Pages workflow](../.github/workflows/demo-pages.yml) checks out a release tag, requires the matching npm version, runs the verification suite, and stages only the real examples and built ESM bundle. `actionlint` accepted its YAML. A local copy of its staged file tree was served through HTTP: the root redirected to `examples/workbench.html`; adding a fourth task changed the list, open count and progress summary; completing it changed the open/done counts to 2/2 and progress to 50%. Chrome reported no console errors. The repository's Pages API returned 404 before setup, and no workflow deployment or public URL is claimed.

## Published release and public demo (19 September 2026)

The exact local artifact from commit `69d1ed8` was published as `@othmaneblial/fluxus@0.1.0`. The npm registry's `/latest` metadata returned the package, version, tarball URL, SHA-1 and integrity. The downloaded registry tarball was 11,756 bytes and had SHA-256 `26de30bf41f610082e68a3d2e0a3d45bc722ea2ce9e3a25f0f1f22103bb2a21e`, identical to the local artifact and the GitHub Release asset. A fresh consumer installed that registry tarball and loaded CJS and ESM exports. A second clean temporary consumer installed the package by the public specifier `@othmaneblial/fluxus@0.1.0` and loaded both module formats. The second publication attempt was rejected with `You cannot publish over the previously published versions: 0.1.0`, corroborating that the version exists; no token or credential was printed.

The annotated tag `v0.1.0` dereferenced to commit `69d1ed8`. GitHub Release [v0.1.0](https://github.com/OthmaneBlial/fluxus/releases/tag/v0.1.0) is public, non-draft and non-prerelease, with the tarball, `SHA256SUMS` and `release-manifest.json`; the downloaded tarball hash matched. GitHub Pages was enabled with the workflow source. The corrected [Demo Pages run](https://github.com/OthmaneBlial/fluxus/actions/runs/35446052920) succeeded for both build and deploy after its npm check was changed from the CLI's inconsistent scoped-package lookup to the registry `/latest` endpoint. The public URL returned HTTP 200 and loaded `examples/workbench.html`. Chrome tested add, complete, open filtering, observer pause, reset and a 390 px viewport; the list, counts and progress changed as expected and the console had no errors. The public URL is `https://othmaneblial.github.io/fluxus/`.
