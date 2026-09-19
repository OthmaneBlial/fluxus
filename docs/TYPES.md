# TypeScript contract

Fluxus actions have a string `type`. `createAction('counter/reset')` creates a no-payload action. Declare a payload while preserving the literal type with `createAction('counter/add').withPayload<number>()`. The latter is a TypeScript typing step on the same runtime creator; it does not validate untrusted values at runtime.

```ts
import { createAction, createReducer, createStore } from '../src';

const add = createAction('counter/add').withPayload<number>();
const reset = createAction('counter/reset');
type CounterAction = ReturnType<typeof add> | ReturnType<typeof reset>;

const initialState = { count: 0 };
const reducer = createReducer<typeof initialState, CounterAction>(initialState, {
  [add.type]: (state, action) => ({ count: state.count + action.payload }),
  [reset.type]: () => initialState,
});
const store = createStore(reducer, initialState);
store.dispatch(add(2));
const count: number = store.select((state) => state.count);
```

The explicit action union tells `createReducer` which actions its map accepts and makes `store.dispatch` reject another type at compile time. A reducer created without that union accepts the general `Action` type, which is useful for JavaScript and loose integration but does not constrain dispatch. `createAction<number>('counter/add')` remains available for existing TypeScript code; its payload is checked, but its action type widens to `string` when only the payload type argument is supplied. Use `withPayload` when a discriminated union matters.

Reducers must return a new state value for changes. Fluxus does not freeze state, detect in-place mutations, or deep-clone reducer output. Selectors cache by state reference, so mutating the current state in place can produce stale results. See the [runtime contract](CORE_CONTRACT.md) for dispatch and subscription behavior.

The positive and negative compile checks are in [`test/types/public-contract.ts`](../test/types/public-contract.ts). The generated CommonJS and ESM declaration files are inspected during the build validation, and the installed tarball is checked with `.cts` and `.mts` consumers.
