# Compatibility and versioning

The package manifest currently says `@othmaneblial/fluxus@0.1.0`, but publication to npm has not been verified. A version in the repository is not evidence of a released package.

## Tested environments

| Surface | Current evidence |
| --- | --- |
| Package development and installed-tarball checks | Local Node 22.23.2 and 24.21.0 with Yarn 1.22.22; [validation record](VALIDATION.md) |
| Browser workbench | Local Chrome desktop and responsive widths 390/320 px; [browser QA](ACCESSIBILITY_QA.md) |
| Other Node or browser versions | Not independently validated yet |

The manifest's `node >=22` engine range expresses an installation floor. It does not mean every future Node version has passed the test suite. The library has no runtime dependencies. Redux Toolkit and Zustand are development-only benchmark tools; esbuild is used for the build, package consumer check and benchmarks.

## API changes

Until `1.0.0`, a minor release may contain an intentional breaking change, but every such change must be called out in the changelog and release notes with a migration example. Patch releases should fix behavior without an intentional public break. After `1.0.0`, follow standard SemVer major/minor/patch meaning. A public API change should have an issue or design discussion, runtime and type tests, an updated API reference, a tarball consumer check and a migration note. Deprecate before removal where practical.

No release cadence or support lifetime is promised. Release notes will name the supported versions once a published release exists. The [security policy](../SECURITY.md) distinguishes the current branch from published versions.
