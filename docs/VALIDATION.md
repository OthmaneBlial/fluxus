# Local validation record

## TypeScript and lint gate (19 September 2026)

The checkout uses Yarn 1.22.22 and was validated locally with Node v25.9.0. A temporary copy omitted both `node_modules/` and `dist/`; `yarn install --frozen-lockfile --non-interactive`, `yarn lint`, `yarn type-check`, `yarn test`, and `yarn build` all passed in that order. Vitest reported 7 files and 36 passing tests. The build emitted CommonJS, ESM and both declaration files without `TS18003`.

For a negative check, `const intentionalTypeFailure: number = "wrong";` was appended to `src/index.ts` **only in the temporary copy**. `yarn build` then exited nonzero with `TS2322`; the checkout was not changed by this probe. This establishes that the build gate propagates a TypeScript error. The declarations still contain broad public types, which are addressed in roadmap task 2.2.

`bench/cache-profile.mjs` is linted and run separately after a build. It imports `dist/index.mjs`, so the clean prebuild TypeScript check intentionally covers source, tests and TypeScript configuration files, not that runtime benchmark script.

These checks are local. No CI run, package installation by a separate consumer, or published release is claimed here.
