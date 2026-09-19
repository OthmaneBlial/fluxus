# Changelog

Changes to published versions will be recorded here. The version below is a prepared release candidate, not evidence of an npm publication or GitHub Release.

## Unreleased

No changes are listed yet.

## 0.1.0 — release candidate

- Added an explicit synchronous action/reducer/store contract with typed action unions, middleware, subscriptions and selector caching.
- Hardened special action names, invalid actions, reducer failures, listener behavior, immutable helpers and selector memory behavior with 40 unit tests.
- Prepared a scoped `@othmaneblial/fluxus` package with ESM, CommonJS and NodeNext declarations; verified its nine-file tarball from an isolated consumer.
- Added a task workbench demo, browser interaction walkthrough, mobile and keyboard checks, and real screenshots.
- Added API, integration, comparison and benchmark documentation, contribution and security guidance, and a Node 22/24 GitHub CI matrix.
- Replaced the old build/test dependency chain after Dependabot alerts; local Yarn audit and GitHub Dependabot reported no open advisories at the recorded checkpoint.

Migration: this would be the first published release of this project, so there is no prior published Fluxus API to migrate from. The unrelated unscoped `fluxus` npm package is not a predecessor of this one.
