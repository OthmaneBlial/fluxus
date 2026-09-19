# Product scope for the first credible release

This document began as a product decision against commit `5ab9472` on 19 September 2026. The core, types, tarball and browser workbench are implemented and checked locally; the published `0.1.0` release and public demo are verified, while the `0.1.1` candidate and independent usage remain open gates.

## Intended user and job

The intended user is a developer maintaining a small browser interface or embedded widget with two or more views that must agree on the same state. Their job is to make state transitions explicit, update the views when a transition occurs, and derive a small value such as a remaining-task count without adding a UI framework solely for state management.

The first-release scenario is a task workspace: add a task, change its status, filter the visible list, and show counts from the same store. A developer should be able to clone the project, build it, run the example, and understand the action → reducer → state → subscriber path in about ten minutes. This is a target to test with independent users, not an observed time to success.

## Promise to prove

Fluxus provides a compact, predictable **in-memory action/reducer store** usable from plain JavaScript and TypeScript. The local tarball, action and subscription semantics, types, and browser workbench have been checked; external publication and independent use remain separate gates. No general claim of superior speed, smaller memory use, fewer rerenders, or fewer lines of code is part of this promise.

## First-release surface

| Part | Decision | Why |
| --- | --- | --- |
| `createStore`, `Store`, `dispatch`, `getState`, `subscribe`, `select` | Core public API, implemented and typed. | These form the state flow used by every example. |
| `createAction`, `createReducer` | Core public API with tested payload shapes and unknown action behavior. | Named transitions make state changes inspectable. |
| Middleware | One typed composition contract is implemented and tested. | It is a small extension point without a framework dependency. |
| `memoize`, `updateObject`, `updateArray`, `lazy`, `measureTime` | Keep exported for compatibility, but document as optional helpers, separate from the store's guarantees. | None is needed to create a store, and `measureTime` is not a benchmark. |
| Browser examples | One tested task-workspace demo plus small recipes. | A visitor needs one end-to-end use case. |

## Limits and explicit non-goals

- State is in memory and is lost on reload. Persistence, server sync, offline data recovery, and network requests are not provided.
- The store is not an authentication system. A browser-only page cannot verify credentials; `auth.html` now demonstrates only local session state with a display name and no password.
- There is no built-in React/Vue/Svelte binding, time-travel debugger, async workflow engine, or store DevTools integration. Any adapter should be separate from the core and justified by observed demand.
- Reducers must return a new state instead of mutating the existing object. Error behavior is specified in the [core contract](CORE_CONTRACT.md); runtime mutation is not prevented.
- Package availability is not inferred from `package.json`: the unscoped npm name `fluxus` is occupied by an unrelated package. The manifest uses `@othmaneblial/fluxus`; `0.1.0` is verified through the npm registry and its release tarball, while `0.1.1` is a local candidate.

## Release decision gates

1. The core preserves state and subscription correctness across ordinary, unknown, nested, and erroring actions.
2. Types, tests, lint, build, tarball installation, and browser example pass from clean environments.
3. Comparison and performance claims cite reproducible evidence; otherwise they are omitted.
4. The published package, release, and demo links are checked independently from local build success.
5. Independent developers can complete the task-workspace scenario and report concrete obstacles.

These gates favor a narrower, honest product over a large feature list with untested promises. They do not predict stars or adoption.
