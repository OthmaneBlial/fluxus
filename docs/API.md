# API reference

The package exposes one top-level entry point, `@othmaneblial/fluxus`, for ESM and CommonJS. Its core is synchronous and has no runtime dependencies. This page describes the current source and locally packed tarball; it does not imply an npm publication.

## Actions and reducers

| Export | Contract |
| --- | --- |
| `createAction(type)` | Returns a creator with a `.type` string. Calling with no argument returns `{ type }` with no own `payload` key. Calling with one argument owns `payload`, even if it is `undefined`. |
| `createAction(type).withPayload<T>()` | Declares a required payload type while retaining the literal action type in TypeScript. It returns the same runtime creator; it is not payload validation. |
| `createReducer(initialState, handlers)` | Maps action strings to state transition functions. Unknown actions return the current state. An `undefined` state uses `initialState`. Only own handler keys are considered, including an explicitly defined own `__proto__`. |
| `Action`, `ActionCreator`, `Reducer` | Public TypeScript types. An explicit union of `ReturnType` values can constrain handler payloads and store dispatch. |

`createReducer` and `Store.dispatch` reject an action without its own string `type` with `TypeError`. A matched reducer that returns `undefined` throws. The library does not validate payload values at runtime. [Type examples](TYPES.md) show the strict variant; the [runtime contract](CORE_CONTRACT.md) documents unusual action names and errors.

## Store

`createStore(reducer, initialState, middlewares?)` returns a `Store`. `new Store(...)` is also exported. Both hold one in-memory state value and expose:

| Method | Contract |
| --- | --- |
| `getState()` | Returns the current state reference. Treat it as immutable. |
| `dispatch(action)` | Runs the reducer synchronously, commits its result, then notifies subscribers. Returns `void`. A reducer error preserves the previous state reference and skips notification. |
| `subscribe(listener)` | Registers a callback and returns an idempotent unsubscribe function. Notifications use a listener snapshot; a listener removed before its turn is skipped. A successful dispatch notifies even if the state reference is unchanged. |
| `select(selector)` | Returns a derived value. One result per stable selector function and current state reference is cached; a new state reference recomputes. Selectors that are no longer referenced can be collected. |

Nested dispatch from a subscriber is allowed; dispatch inside a reducer is rejected. If a subscriber throws, the state is already committed and the error propagates; later subscribers in that notification do not run. State is not frozen or cloned for you, so reducers must return a new object for a change. See [helper and cache rules](HELPERS.md).

## Middleware

`Middleware<S, A>` has the shape `({ getState, dispatch }) => next => action => void`. The store composes middleware in array order around dispatch: with `[first, second]`, the call order is `first → second → reducer → second → first`. Calling `next(action)` forwards the action; skipping it suppresses the reducer and subscribers. `api.dispatch` goes through the enhanced store dispatch. The exported `applyMiddleware(middlewares, store)` returns an enhanced dispatch with the same contract. Middleware must handle its own asynchronous work; the core does not provide an async protocol.

## Optional helpers

| Export | Contract |
| --- | --- |
| `memoize(fn)` | Caches only the latest one-argument call using `Object.is`; a new argument evicts the old pair. |
| `updateObject(obj, updates)` | Shallowly copies a plain object and applies enumerable own string and symbol keys, including new keys. It rejects arrays and non-plain objects. |
| `updateArray(array, index, value)` | Shallowly copies an array and replaces one in-bounds integer index; other sparse holes remain holes. |
| `lazy(computation)` | Returns `{ get() }`; the first successful `get()` computes and caches the value, including `undefined`. |
| `measureTime(fn)` | Runs `fn` and returns `[result, elapsedMilliseconds]` using `performance.now()`. It is a helper, not a benchmark or performance guarantee. |

The [helper contract](HELPERS.md) gives prototype, symbol, mutation and memory details. The [integration guide](INTEGRATIONS.md) shows view subscription cleanup; the [benchmark](BENCHMARKS.md) records measured workloads and limitations.
