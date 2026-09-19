# Release procedure

This procedure prepares a local artifact and describes the external checks. A `package.json` version is not proof of npm publication, a Git tag or a GitHub Release; check those services directly.

## Prepare from a clean checkout

Use a supported Node 22 or 24 patch release and Yarn 1.22.22. Review [the changelog](../CHANGELOG.md), [draft notes](RELEASE_NOTES_0.1.0.md), [compatibility policy](COMPATIBILITY.md), and the latest [CI run](https://github.com/OthmaneBlial/fluxus/actions/workflows/ci.yml). Check that `git status --short` is empty, then run:

```bash
yarn install --frozen-lockfile
yarn release:check
```

`release:check` requires a clean tracked worktree. It runs `yarn verify`, checks the `npm pack --dry-run` list against the nine expected files, creates the exact tarball in ignored `release/`, checks its archive entries and package manifest, installs that tarball offline into a new temporary project, and runs both CJS and ESM imports. It writes `release/SHA256SUMS` and `release/release-manifest.json` with the commit, package version, file list, byte count and SHA-256. The consumer test in `yarn verify` also checks TypeScript declarations and a single-helper browser bundle. Review the contents of `README.md`, `dist/` and the source maps for accidental secrets; a file allowlist is not a comprehensive secret scan.

From the `release/` directory, `shasum -a 256 -c SHA256SUMS` must report the tarball as OK. The tarball is a JavaScript library distribution; no native binary is expected. Keep the tarball and checksum together when attaching assets. Do not substitute a rebuilt tarball without repeating the check.

## Publication gate

Before publication, check that `npm config get registry` names the intended registry, `npm whoami` is `othmaneblial`, and `npm view @othmaneblial/fluxus@0.1.0` does not return an existing version. An `E404` alone cannot prove future publishing rights; check the scope in the npm account as well. Review the tarball and notes, obtain publication approval, then publish **that exact archive** with `npm publish release/othmaneblial-fluxus-0.1.0.tgz --access public` using existing authenticated npm access. A trusted publishing identity with provenance is preferable when configured and verified; the current repository does not claim that setup. Do not print tokens or put them in Git, docs or release assets.

After publishing, verify the registry's name, version and tarball URL. Download that exact registry tarball, compare its SHA-256 with `release/SHA256SUMS`, install it in a fresh directory and repeat an ESM/CJS/TypeScript consumer check. Only then create the `v0.1.0` tag at the validated commit and a GitHub Release with [the notes](RELEASE_NOTES_0.1.0.md), the checked tarball and checksum. Verify the remote tag target, release assets and hashes, then confirm the README's conditional registry instructions and current maturity statement remain accurate. If a public demo is hosted, deploy the same tagged build and test its URL in a browser. A successful upload alone is not verification.

If npm ownership, publication, a clean consumer install, the tag, assets or a public demo check fails, leave the README and roadmap explicit about the unverified step. Do not claim a release from local CI or a `package.json` version alone.
