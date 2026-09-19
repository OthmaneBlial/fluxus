# Package contract and local evidence

The unscoped `fluxus` name belongs to another project. The manifest uses `@othmaneblial/fluxus`; version `0.1.1` is published under the authenticated `othmaneblial` account and was verified through the registry's version metadata and tarball URL. The release asset and registry tarball have the same SHA-256.

`package.json` exposes `dist/index.mjs` for ESM and `dist/index.js` for CommonJS, with corresponding `.d.mts` and `.d.ts` declarations. `main`, `module` and `types` serve older tooling. The package declares no runtime dependencies, marks modules as side effect free, and sets a minimum Node version of 22. The initial packaging check used Node v25.9.0; subsequent local checks and GitHub CI covered Node 22 and 24 as recorded in [validation evidence](VALIDATION.md).

Run `yarn build` and `yarn test:package` from the repository. `prepack` also runs the build for a normal `npm pack`. The package check creates a temporary consumer, packs the real distribution, asserts the tarball file list, installs the tarball without registry access, executes both module formats, compiles `.mts` and `.cts` fixtures against the installed declarations, and bundles only `memoize` for a browser with esbuild. The check cleans its own temporary workspace.

The build uses esbuild for the CommonJS and ESM bundles and `dts-bundle-generator` for a checked, single-file TypeScript declaration. The latter is copied to `.d.mts` for NodeNext ESM consumers. TypeScript is pinned to `5.9.3` for declaration generation because a newer transitive compiler did not expose the API required by the generator; the installed consumer check verifies both declaration paths.

On 19 September 2026, `npm pack --dry-run --json` listed exactly 9 entries: `LICENSE`, `README.md`, `package.json`, the two JavaScript outputs and their source maps, and the two declaration files. The packed tarball was about 11 KB in the local consumer checks; its exact size changes with the README. The bundle check confirmed that unrelated reducer code was absent from a single-helper import. This is evidence for one local setup, not a general size or performance claim.

There is no CLI or native binary to download. A versioned npm tarball is the distribution artifact. The `0.1.1` package and GitHub release archive are available and verified; `0.1.0` remains available as the first published release. Use the release procedure for future versions.
