# Core runtime contract

This contract describes the behavior targeted for the first release. The action and reducer rules below are implemented; store and middleware edge cases remain under the [roadmap](../ROADMAP.md).

## Actions and reducers

- `createAction(type)()` returns an object with only a `type` property. If the caller provides one argument, the result also owns `payload`, even when that value is `undefined`. The creator's `.type` is the supplied string; Fluxus does not generate unique types.
- `createReducer(initialState, handlers)` uses `initialState` when called with an `undefined` state and returns the current state for an unknown string action type.
- A handler is invoked only when its type is an **own property** of `handlers`. Inherited keys such as `toString` and `constructor` are ignored unless explicitly defined as own handlers.
- An action without a string `type` throws `TypeError`. A matched handler that returns `undefined` throws `Error` instead of silently corrupting the store.
- Reducers should return a new value for a change and leave existing state untouched. State mutation detection and the exact notification policy are still being hardened.

These rules are backed by exact-shape and reserved-key regression tests in `test/core/`.
