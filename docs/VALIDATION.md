# Local validation record

## TypeScript and lint gate (19 September 2026)

The checkout uses Yarn 1.22.22 and was validated locally with Node v25.9.0. A temporary copy omitted both `node_modules/` and `dist/`; `yarn install --frozen-lockfile --non-interactive`, `yarn lint`, `yarn type-check`, `yarn test`, and `yarn build` all passed in that order. Vitest reported 7 files and 36 passing tests. The build emitted CommonJS, ESM and both declaration files without `TS18003`.

For a negative check, `const intentionalTypeFailure: number = "wrong";` was appended to `src/index.ts` **only in the temporary copy**. `yarn build` then exited nonzero with `TS2322`; the checkout was not changed by this probe. This establishes that the build gate propagates a TypeScript error. The declarations still contain broad public types, which are addressed in roadmap task 2.2.

`bench/cache-profile.mjs` is linted and run separately after a build. It imports `dist/index.mjs`, so the clean prebuild TypeScript check intentionally covers source, tests and TypeScript configuration files, not that runtime benchmark script.

These checks are local. No CI run, package installation by a separate consumer, or published release is claimed here.

## Public types (19 September 2026)

`yarn type-check` compiled `test/types/public-contract.ts`, including expected failures for wrong payloads, missing payloads, an unknown dispatched action and an invalid selector field. `yarn lint`, 37 runtime tests and `yarn build` passed. The generated `dist/index.d.ts` and `dist/index.d.mts` were inspected for the same action, reducer, middleware and store signatures. The later installed-tarball check is recorded below.

## Package consumer (19 September 2026)

`npm pack --dry-run --json` ran `prepack` and listed only 9 intended files. `yarn test:package` installed the resulting tarball in a temporary consumer and passed ESM/CJS runtime imports, `.mts`/`.cts` TypeScript resolution, and a browser esbuild check for a single helper. See [the package contract](PACKAGING.md). This check used the local Node runtime; the GitHub CI matrix is still pending.

## Full boundary and package suite (19 September 2026)

Two more store tests cover an exception from a subscriber after state commit and a selector that throws before a value can be cached. A reducer test proves an own `__proto__` handler runs while inherited names remain ignored. The package consumer test rejects an unexported subpath with `ERR_PACKAGE_PATH_NOT_EXPORTED`.

`yarn verify` passed in the checkout and in a separate temporary copy after `yarn install --frozen-lockfile --non-interactive`: lint, type-check, 40 unit tests, build, and installed-tarball checks. The separate copy had been created without `node_modules/` or `dist/`; its dependency install was first performed for the phase 2.1 clean check, then revalidated against the current manifest and lockfile before this run. This is a local suite, not evidence of GitHub CI or another operating system.
