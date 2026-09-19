# Release procedure

This procedure prepares a local artifact and describes the external checks. Fluxus `0.1.0` is published and verified; the current checkout prepares `0.1.1` as the next release candidate. Future versions must repeat the same registry, tag, asset and public-demo checks. A `package.json` version alone is never proof of a release.

## Prepare from a clean checkout

Use a supported Node 22 or 24 patch release and Yarn 1.22.22. Review [the changelog](../CHANGELOG.md), [release notes](RELEASE_NOTES_0.1.1.md), [compatibility policy](COMPATIBILITY.md), and the latest [CI run](https://github.com/OthmaneBlial/fluxus/actions/workflows/ci.yml). Check that `git status --short` is empty, then run:

```bash
yarn install --frozen-lockfile
yarn release:check
```

`release:check` requires a clean tracked worktree. It runs `yarn verify`, checks the `npm pack --dry-run` list against the nine expected files, creates the exact tarball in ignored `release/`, checks its archive entries and package manifest, and installs it offline into a new temporary project with both CJS and ESM imports. For an unpublished version it also runs `npm publish --dry-run`; for a version already published, it verifies the registry manifest and downloads the registry tarball to compare its SHA-256 with the local artifact. A mismatch is a deliberate failure: bump the package version before publishing source or documentation changes. It writes `release/SHA256SUMS` and `release/release-manifest.json` with the commit, package version, file list, byte count and SHA-256. The consumer test in `yarn verify` also checks TypeScript declarations and a single-helper browser bundle. Review the contents of `README.md`, `dist/` and the source maps for accidental secrets; a file allowlist is not a comprehensive secret scan.

From the `release/` directory, `shasum -a 256 -c SHA256SUMS` must report the tarball as OK. The tarball is a JavaScript library distribution; no native binary is expected. Keep the tarball and checksum together when attaching assets. Do not substitute a rebuilt tarball without repeating the check.

## Publication gate

Before a future publication, check that `npm config get registry` names the intended registry, `npm whoami` is the expected publisher, and the exact version is not already present. Review the tarball and notes, obtain publication approval, then publish **that exact archive** with `npm publish ./release/<package-file>.tgz --access public` using authenticated npm access. The leading `./` is required here: npm interpreted a bare `release/...tgz` as a Git URL in an earlier dry run. A trusted publishing identity with provenance is preferable when configured and verified. Do not print tokens or put them in Git, docs or release assets.

After publishing, verify the registry's name, version and tarball URL. Download that exact registry tarball, compare its SHA-256 with `release/SHA256SUMS`, install it in a fresh directory and repeat an ESM/CJS/TypeScript consumer check. Only then create a tag at the validated commit and a GitHub Release with the release notes, checked tarball and checksum. Verify the remote tag target, release assets and hashes, then confirm the README and current maturity statement remain accurate. A successful upload alone is not verification. The `v0.1.0` sequence is recorded in [validation evidence](VALIDATION.md); the `0.1.1` candidate will be recorded only after those checks complete.

For a public interactive demo, enable GitHub Pages with **GitHub Actions** as the source. Manually run [Demo Pages](../.github/workflows/demo-pages.yml) with the verified tag. The workflow checks out the tag, confirms its package version through npm registry metadata, runs `yarn verify`, and uploads only the real examples and built ESM bundle. Poll the exact workflow run to success, then open the public URL and exercise add, complete, filter, detach observer and reset in a browser. Check console errors and mobile layout before adding the URL to repository metadata. The `v0.1.0` deployment is verified at `https://othmaneblial.github.io/fluxus/`.

If npm ownership, publication, a clean consumer install, the tag, assets or a public demo check fails, leave the README and roadmap explicit about the unverified step. Do not claim a release from local CI or a `package.json` version alone.
