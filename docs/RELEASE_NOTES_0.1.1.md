# Fluxus 0.1.1

Fluxus 0.1.1 is a documentation and release metadata patch over 0.1.0. The runtime API and browser behavior are unchanged.

## Included

- The package README points to the published package, GitHub Release and public task workbench.
- The release procedure detects a published version whose local candidate has drifted instead of reusing the version silently.
- The onboarding, comparison, compatibility and product-scope pages identify the current published version consistently.

## Verification

- `yarn verify` passes on Node 22 and Node 24 in GitHub Actions.
- `yarn release:check` built the exact nine-file package and installed it in an isolated consumer before publication.
- The GitHub Release includes the package tarball, `SHA256SUMS` and `release-manifest.json`.
- The public workbench was tested for add, complete, filtering, observer pause, reset and a 390 px viewport.

## Limits

Fluxus remains an in-memory store for framework-free JavaScript and TypeScript interfaces. It does not provide persistence, authentication, server synchronization, framework adapters or DevTools integration. Independent user journeys are tracked separately in [`docs/USER_FEEDBACK.md`](USER_FEEDBACK.md).
