# Package contract and local evidence

The unscoped `fluxus` name belongs to another project. The manifest uses `@othmaneblial/fluxus`; on 19 September 2026 the authenticated npm identity returned `othmaneblial` and a registry query for that scoped package returned `E404`. This is **not** evidence of a published release. No npm publish was performed.

`package.json` exposes `dist/index.mjs` for ESM and `dist/index.js` for CommonJS, with corresponding `.d.mts` and `.d.ts` declarations. `main`, `module` and `types` serve older tooling. The package declares no runtime dependencies, marks modules as side effect free, and sets a minimum Node version of 22. CI validation on supported Node versions is a later roadmap task; this local check used Node v25.9.0.

Run `yarn build` and `yarn test:package` from the repository. `prepack` also runs the build for a normal `npm pack`. The package check creates a temporary consumer, packs the real distribution, asserts the tarball file list, installs the tarball without registry access, executes both module formats, compiles `.mts` and `.cts` fixtures against the installed declarations, and bundles only `memoize` for a browser with esbuild. The check cleans its own temporary workspace.

On 19 September 2026, `npm pack --dry-run --json` listed exactly 9 entries: `LICENSE`, `README.md`, `package.json`, the two JavaScript outputs and their source maps, and the two declaration files. The packed tarball was about 11 KB in the local consumer checks; its exact size changes with the README. The bundle check confirmed that unrelated reducer code was absent from a single-helper import. This is evidence for one local setup, not a general size or performance claim.

There is no CLI or native binary to download. A versioned npm tarball is the distribution artifact. Published package installation and the GitHub release archive remain pending release preparation and external verification.
