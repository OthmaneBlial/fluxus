# Changelog

Changes to versions are recorded here. A version heading does not establish publication; check the npm registry and GitHub Releases for the current release status.

## Unreleased

No changes are listed yet.

## 0.1.0 — 19 September 2026

Published as [`@othmaneblial/fluxus@0.1.0`](https://www.npmjs.com/package/@othmaneblial/fluxus), with the checked tarball attached to [GitHub Release v0.1.0](https://github.com/OthmaneBlial/fluxus/releases/tag/v0.1.0). The [public workbench](https://othmaneblial.github.io/fluxus/) is built from the verified tag.

- Added an explicit synchronous action/reducer/store contract with typed action unions, middleware, subscriptions and selector caching.
- Hardened special action names, invalid actions, reducer failures, listener behavior, immutable helpers and selector memory behavior with 40 unit tests.
- Prepared a scoped `@othmaneblial/fluxus` package with ESM, CommonJS and NodeNext declarations; verified its nine-file tarball from an isolated consumer.
- Added a task workbench demo, browser interaction walkthrough, mobile and keyboard checks, and real screenshots.
- Added API, integration, comparison and benchmark documentation, contribution and security guidance, and a Node 22/24 GitHub CI matrix.
- Replaced the old build/test dependency chain after Dependabot alerts; local Yarn audit and GitHub Dependabot reported no open advisories at the recorded checkpoint.

Migration: this would be the first published release of this project, so there is no prior published Fluxus API to migrate from. The unrelated unscoped `fluxus` npm package is not a predecessor of this one.
