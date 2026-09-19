# Contributing to Fluxus

Fluxus is a small in-memory store for browser interfaces with explicit actions, a reducer and subscriptions. Read the [product scope](docs/PRODUCT_SCOPE.md) and [API contract](docs/API.md) before proposing a new public primitive. A narrow, tested fix is easier to maintain than an optional feature that changes the core contract.

## Run the project

Use Node 22 or 24 and Yarn 1.22.22. From a clean clone:

```bash
git clone https://github.com/OthmaneBlial/fluxus.git
cd fluxus
yarn install --frozen-lockfile
yarn verify
```

`yarn verify` checks lint, local documentation links, types, unit tests, the build and an installed tarball in a temporary consumer. `yarn test:watch` runs the unit tests interactively. To inspect the [real workbench](docs/DEMO.md), run `yarn build`, then `python3 -m http.server 8000` and open `http://localhost:8000/examples/workbench.html`. Stop the server when finished. Do not use the unrelated unscoped `fluxus` npm package as a development dependency.

## Make a change

1. Open an issue for a change to the public API or behavior so the use case and compatibility cost are visible. Small bug fixes can go directly to a pull request.
2. Keep the implementation in `src/` focused. Add a regression test in `test/` for behavior or public types that changed. Update examples and docs if the user's observable contract changes.
3. Keep reducer transitions immutable. Document unusual action names, subscription order, failure behavior and cache invalidation where relevant. Avoid adding runtime dependencies without a clear need.
4. Run `yarn verify` before a pull request. For a packaging change, inspect `npm pack --dry-run --json` and the consumer check. Benchmarks are informative only: record the workload, versions, raw results and limitations rather than claiming universal speed.
5. Describe the problem, the observable change, tests performed, and any migration step in the pull request. For a breaking API change, follow the [compatibility policy](docs/COMPATIBILITY.md).

Use the repository's issue forms for reproducible bugs and feature proposals. Do not include credentials, private data or live exploit details in issues, logs or screenshots. Follow the [security policy](SECURITY.md) for vulnerabilities and the [code of conduct](CODE_OF_CONDUCT.md) for community interactions.

The maintainer reviews contributions as availability permits. Opening an issue or PR does not create a response-time commitment.
