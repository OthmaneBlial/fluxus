# Fluxus

Fluxus is a small, framework-independent state store built around explicit actions and reducers. It is intended for JavaScript and TypeScript interfaces that need to share predictable in-memory state without adopting a UI framework.

**Status:** early development. The package manifest says `0.1.0`, but this repository has not yet verified a release of this code on npm. The unscoped npm name [`fluxus`](https://www.npmjs.com/package/fluxus) currently points to a different project. Do not use `npm install fluxus` to install this repository. See [the roadmap](ROADMAP.md) for the work required before a release.

## What it does

- Create one in-memory store from a reducer and initial state.
- Dispatch plain actions and subscribe to updates.
- Read derived values with `select`; the current implementation memoizes by state reference.
- Add middleware to the dispatch path.
- Use optional helpers for immutable updates, memoization, lazy values, and timing. These helpers are separate from the store contract.

The [helper contracts](docs/HELPERS.md) state their cache limits and shallow-copy behavior.
For a TypeScript action union and checked dispatch, see the [typed example](docs/TYPES.md).

Fluxus does **not** currently provide persistence, real authentication, a network layer, a React hook, or DevTools integration. Its performance and memory use have not been compared in a reproducible benchmark. [Product scope](docs/PRODUCT_SCOPE.md) explains the intended first release and its limits.

## Try the source checkout

Requirements: Node.js and Yarn 1. The local lint, type-check, tests and build passed from a frozen installation in a clean temporary copy; see [validation evidence](docs/VALIDATION.md). These commands build the local source and run its unit tests:

```bash
git clone https://github.com/OthmaneBlial/fluxus.git
cd fluxus
yarn install --frozen-lockfile
yarn test
yarn build
```

The build creates `dist/index.mjs` and `dist/index.js`. From the repository root, this small example uses the locally built ESM file:

```js
import { createAction, createReducer, createStore } from './dist/index.mjs';

const add = createAction('counter/add');
const initialState = { count: 0 };
const reducer = createReducer(initialState, {
  [add.type]: (state, action) => ({ count: state.count + action.payload }),
});
const store = createStore(reducer, initialState);

const unsubscribe = store.subscribe(() => {
  console.log(store.getState().count);
});
store.dispatch(add(2)); // 2
unsubscribe();
```

The [`examples/`](examples/) directory contains browser pages with local styles. After a build, serve the repository root over HTTP (for example, `python3 -m http.server 8000`) and open `http://localhost:8000/examples/todo.html`. They import `../dist/index.mjs`. The pages have been [checked locally](docs/EXAMPLE_QA.md), but are not yet a hosted product demo; `auth.html` is a **local session-state simulation**, not an authentication solution.

## Choosing Fluxus

The current API favors named actions and one reducer over a mutable state setter. That can help when transitions should be easy to follow in a small framework-free interface. This is a design choice, not a measured advantage over other libraries. See the [source-backed comparison](docs/COMPARISON.md) for concrete trade-offs and the [`ROADMAP.md`](ROADMAP.md) for planned validation.

## Contributing and license

Issues and pull requests are welcome. The contribution, security, test, and release guides are part of the roadmap and are not in place yet. Fluxus is licensed under the [MIT License](LICENSE).
