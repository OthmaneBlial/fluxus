# Fluxus

[![Verify](https://github.com/OthmaneBlial/fluxus/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/OthmaneBlial/fluxus/actions/workflows/ci.yml)

**Explicit state for small browser interfaces.** Fluxus is a framework-independent JavaScript/TypeScript store built around named actions, a reducer and subscriptions. It fits widgets or pages where several views need to agree on the same in-memory state.

**Release status:** the scoped `@othmaneblial/fluxus` tarball has passed local consumer checks on Node 22 and 24, but this repository has **not published or verified it on npm**. The unscoped [`fluxus`](https://www.npmjs.com/package/fluxus) package belongs to another project. Use the source checkout or a locally packed tarball for now; do not install the unscoped package expecting this code.

## Try the real demo

The [task workbench](examples/workbench.html) adds, filters, completes and removes tasks. Its list, progress summary and detachable event observer read one store. The [walkthrough](docs/DEMO.md) explains the state transitions and exact expected results.

![The real local task workbench showing three sample tasks, progress derived from the same store and a separate event observer](docs/assets/workbench-initial.png)

This screenshot is from the built local demo. [See the state after two real actions and the mobile layout](docs/DEMO.md#captured-states).

```bash
git clone https://github.com/OthmaneBlial/fluxus.git
cd fluxus
yarn install --frozen-lockfile
yarn build
python3 -m http.server 8000
```

Open `http://localhost:8000/examples/workbench.html`. The demo uses the built `dist/index.mjs`, local CSS and sample data; it makes no third-party network request and resets on reload. The smaller [examples](examples/) show a counter, task list, cart and **local session-state simulation**. The session page does not authenticate anyone.

## Use the locally packed library

`npm pack` runs the type-checked build and creates `othmaneblial-fluxus-0.1.0.tgz` in the repository root. Install that file into a separate project:

```bash
npm pack
mkdir ../fluxus-try
cd ../fluxus-try
npm init -y
npm install ../fluxus/othmaneblial-fluxus-0.1.0.tgz
```

This TypeScript example is checked against the installed tarball by the [consumer test](test/consumer/check-package.mjs):

```ts
import { createAction, createReducer, createStore } from '@othmaneblial/fluxus';

const add = createAction('counter/add').withPayload<number>();
const reset = createAction('counter/reset');
type CounterAction = ReturnType<typeof add> | ReturnType<typeof reset>;

const initial = { count: 0 };
const reducer = createReducer<typeof initial, CounterAction>(initial, {
  [add.type]: (state, action) => ({ count: state.count + action.payload }),
  [reset.type]: () => initial,
});
const store = createStore(reducer, initial);
const unsubscribe = store.subscribe(() => console.log(store.getState().count));

store.dispatch(add(2)); // prints 2
store.select((state) => state.count); // 2
unsubscribe();
```

The [getting started guide](docs/GETTING_STARTED.md) includes a runnable JavaScript consumer and common setup problems. The package offers ESM and CommonJS entry points, TypeScript declarations and no runtime dependencies; [packaging evidence](docs/PACKAGING.md) records the actual tarball checks. There is no CLI or native binary.

## Contract and limits

| Capability | Current behavior |
| --- | --- |
| State transitions | Synchronous named actions handled by a reducer; `dispatch` notifies subscribers after a successful transition. |
| Selectors | Derived values cached by selector function and state reference; use a stable selector function and immutable state updates. |
| Middleware | Optional composition around dispatch. A middleware can inspect state, forward or suppress an action. |
| Helpers | Shallow immutable updates, one-entry memoization, lazy values and a timing helper are optional exports. |

Fluxus keeps state only in memory. It has no persistence, authentication, server sync, React hook or DevTools integration. Its small API is useful when named transitions matter in a framework-free interface; Redux Toolkit and Zustand offer other trade-offs. See the [API reference](docs/API.md), [type contract](docs/TYPES.md), [integration decisions](docs/INTEGRATIONS.md), [source-backed comparison](docs/COMPARISON.md) and [measured workloads](docs/BENCHMARKS.md). The benchmark does not establish a general speed or memory advantage.

## Develop and contribute

Use Node 22 or 24 and Yarn 1. `yarn verify` runs lint, type-check, 40 unit tests, the build and installed-tarball checks. The same suite passed locally under both Node versions; [validation evidence](docs/VALIDATION.md) distinguishes local checks from remote CI. Read the [contribution guide](CONTRIBUTING.md), [compatibility policy](docs/COMPATIBILITY.md), [security policy](SECURITY.md), [code of conduct](CODE_OF_CONDUCT.md), [changelog](CHANGELOG.md), [release procedure](docs/RELEASE.md) and [roadmap](ROADMAP.md) before a change.

Fluxus is licensed under the [MIT License](LICENSE).
