# Choosing between Fluxus, Redux Toolkit, and Zustand

Checked on 19 September 2026 against this repository's commit `5ab9472`, the [Redux Toolkit documentation](https://redux-toolkit.js.org/introduction/getting-started), the [Redux selector documentation](https://redux.js.org/usage/deriving-data-selectors), and the [Zustand vanilla-store documentation](https://zustand.docs.pmnd.rs/reference/apis/create-store). The npm registry reported Redux Toolkit `2.12.0` and Zustand `5.0.15` on that date. Recheck versions and APIs before using this page for a future release.

This is a comparison of **design and available APIs**, not a speed, memory, bundle-size, or adoption ranking. The unscoped npm package named `fluxus` is an unrelated project; this repository's manifest version `0.1.0` is not evidence of its publication.

## The same small task

Each example starts at zero, increments once, and reads back one. The Fluxus example uses the local build of this repository and has been run as part of this comparison. The other examples follow their projects' official API documentation; they are illustrative and are not benchmark inputs.

### Fluxus, current repository

```js
import { createAction, createReducer, createStore } from '../dist/index.mjs';

const increment = createAction('counter/increment');
const initialState = { count: 0 };
const reducer = createReducer(initialState, {
  [increment.type]: (state) => ({ count: state.count + 1 }),
});
const store = createStore(reducer, initialState);
store.dispatch(increment());
console.log(store.select((state) => state.count)); // 1
```

### Redux Toolkit 2.12.0

```js
import { configureStore, createSlice } from '@reduxjs/toolkit';

const counter = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: { increment(state) { state.count += 1; } },
});
const store = configureStore({ reducer: counter.reducer });
store.dispatch(counter.actions.increment());
console.log(store.getState().count); // 1
```

The [official `createSlice` reference](https://redux-toolkit.js.org/api/createSlice) says it creates the action creator and type from the slice's reducer name. Fluxus currently requires an explicit type string and action creator. Redux Toolkit also offers [`createSelector`](https://redux.js.org/usage/deriving-data-selectors), middleware defaults, DevTools integration, and optional RTK Query through documented APIs. The old claim in this repository that Redux has no built-in selector memoization or always requires hand-written action creators is inaccurate for Redux Toolkit.

### Zustand 5.0.15, vanilla store

```js
import { createStore } from 'zustand/vanilla';

const store = createStore((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
store.getState().increment();
console.log(store.getState().count); // 1
```

The [official vanilla-store reference](https://zustand.docs.pmnd.rs/reference/apis/create-store) documents `getState`, `setState`, and `subscribe`; the [selector-subscription middleware](https://zustand.docs.pmnd.rs/reference/middlewares/subscribe-with-selector) and [React hook](https://zustand.docs.pmnd.rs/learn/getting-started/introduction) are additional options. Fluxus currently has no bundled framework hook and uses named actions/reducers rather than a direct `set` function. Zustand has a standalone, framework-independent store too, so that alone is not a unique feature of Fluxus.

## Decision table

| Need | Fluxus at this commit | Redux Toolkit 2.12.0 | Zustand 5.0.15 |
| --- | --- | --- | --- |
| Explicit named transitions | `createAction` + `createReducer`, manually connected | `createSlice` generates action creators/types; `createAction` is also available | Typically state methods and `set`; no reducer required for the example |
| Read and subscribe to state | `getState`, whole-store `subscribe`, `select` | Store `getState`/`subscribe`; selectors including `createSelector` | Vanilla `getState`/`subscribe`; optional `subscribeWithSelector` |
| Browser UI framework | No built-in adapter yet | Official React-Redux integration documented | React hook and vanilla store documented |
| Persistence, DevTools, network helpers | Not provided here | DevTools defaults and optional RTK Query documented | Persistence and DevTools middleware documented in [official reference](https://zustand.docs.pmnd.rs/reference/index) |
| Published installation of **this** repository | Not verified; the unscoped name is occupied | Published package at the version checked | Published package at the version checked |

## Where Fluxus might fit

The current product hypothesis is a small vanilla application whose developer wants to see every state change as a named action handled by one reducer. The trade-off is more setup than a direct setter, fewer integrations, and a much less mature validation and release process. Redux Toolkit or Zustand may be a better choice for framework integration, established extensions, or features already documented by those projects. Fluxus should be chosen only after its tests, package, and example satisfy the [release gates](PRODUCT_SCOPE.md).

No performance winner is named here. A fair benchmark must use the same tasks, pinned versions, production builds, correctness checks, repeated samples, environment details, and memory observations. That work is scheduled in [ROADMAP.md](../ROADMAP.md).
