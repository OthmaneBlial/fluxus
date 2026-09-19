# Fluxus 0.1.0

The package, registry tarball, GitHub Release and public workbench were verified on 19 September 2026. The registry tarball and release asset share SHA-256 `26de30bf41f610082e68a3d2e0a3d45bc722ea2ce9e3a25f0f1f22103bb2a21e`.

Fluxus is a small JavaScript/TypeScript state store for framework-free browser interfaces that need named transitions and several views of the same in-memory state. The [task workbench](../examples/workbench.html) demonstrates task actions updating a list, progress summary and detachable event observer.

## Included

- Synchronous actions, reducer, store, middleware and subscriptions with documented error and notification behavior.
- Stable selector-function caching by state reference and optional immutable, memoization, lazy and timing helpers.
- ESM and CommonJS bundles, TypeScript declarations and no runtime dependencies. The package includes no CLI or native executable.
- 40 unit tests, an isolated installed-tarball consumer test, and GitHub CI on Node 22 and 24.
- README onboarding, API and type reference, honest comparison and raw benchmark evidence, contribution/security policies, and actual desktop/mobile screenshots.

## Limits and compatibility

State exists only in memory. There is no persistence, authentication, remote sync, React hook or DevTools integration. Browser QA was performed locally in Chrome; [compatibility evidence](COMPATIBILITY.md) names the Node versions tested. The [benchmark](BENCHMARKS.md) does not prove a general speed or memory advantage.

This is intended as the first published version under the scoped name `@othmaneblial/fluxus`. There is no migration from an earlier published version of this package. The unscoped `fluxus` name belongs to a different project.

## Release artifacts

The [release check](RELEASE.md) prepares `release/othmaneblial-fluxus-0.1.0.tgz`, `release/SHA256SUMS` and `release/release-manifest.json` from a clean commit. The checked copies are attached to the [GitHub Release](https://github.com/OthmaneBlial/fluxus/releases/tag/v0.1.0). Install the published exact version in a fresh project and report vulnerabilities through the [private channel](../SECURITY.md).

## Live demo

Open the [public task workbench](https://othmaneblial.github.io/fluxus/) to see one store drive the task list, progress summary and detachable event observer. State is in memory and resets on reload.
