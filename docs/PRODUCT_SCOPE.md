# Product scope for the first credible release

This document is a product decision, not a claim that the release exists. It was written against commit `5ab9472` on 19 September 2026 and should be updated when the API changes.

## Intended user and job

The intended user is a developer maintaining a small browser interface or embedded widget with two or more views that must agree on the same state. Their job is to make state transitions explicit, update the views when a transition occurs, and derive a small value such as a remaining-task count without adding a UI framework solely for state management.

The first-release scenario is a task workspace: add a task, change its status, filter the visible list, and show counts from the same store. A developer should be able to clone the project, build it, run the example, and understand the action → reducer → state → subscriber path in about ten minutes. This is a target to test with independent users, not an observed time to success.

## Promise to prove

Fluxus should provide a compact, predictable **in-memory action/reducer store** usable from plain JavaScript and TypeScript. The important proof is a working, installable package; precise action and subscription semantics; good types; a real browser example; and clear failure behavior. No claim of superior speed, smaller memory use, fewer rerenders, or fewer lines of code is part of this promise until a fair comparison supports it.

## First-release surface

| Part | Decision | Why |
| --- | --- | --- |
| `createStore`, `Store`, `dispatch`, `getState`, `subscribe`, `select` | Core public API, to be made correct and typed. | These form the state flow used by every example. |
| `createAction`, `createReducer` | Core public API, with explicit contracts for payload shape and unknown action types. | Named transitions make state changes inspectable. |
| Middleware | Core extension point only after one type and one composition contract are tested. | Current duplicate definitions are not a trustworthy public API. |
| `memoize`, `updateObject`, `updateArray`, `lazy`, `measureTime` | Keep exported for compatibility, but document as optional helpers, separate from the store's guarantees. | None is needed to create a store, and `measureTime` is not a benchmark. |
| Browser examples | One main task-workspace demo plus small recipes if they remain safe. | A visitor needs one end-to-end use case. |

## Limits and explicit non-goals

- State is in memory and is lost on reload. Persistence, server sync, offline data recovery, and network requests are not provided.
- The store is not an authentication system. A browser-only page cannot verify credentials; the present `auth.html` must be removed or recast as a session-state simulation.
- There is no built-in React/Vue/Svelte binding, time-travel debugger, async workflow engine, or store DevTools integration. Any adapter should be separate from the core and justified by observed demand.
- Reducers are expected to return a new state instead of mutating the existing object. The exact invariant and error handling must be specified and tested before release.
- Package availability is not inferred from `package.json`: the unscoped npm name `fluxus` is occupied by an unrelated package. Choose and verify a publishable name before writing public installation instructions.

## Release decision gates

1. The core preserves state and subscription correctness across ordinary, unknown, nested, and erroring actions.
2. Types, tests, lint, build, tarball installation, and browser example pass from clean environments.
3. Comparison and performance claims cite reproducible evidence; otherwise they are omitted.
4. The published package, release, and demo links are checked independently from local build success.
5. Independent developers can complete the task-workspace scenario and report concrete obstacles.

These gates favor a narrower, honest product over a large feature list with untested promises. They do not predict stars or adoption.
