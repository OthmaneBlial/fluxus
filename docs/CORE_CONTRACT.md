# Core runtime contract

This contract describes the implemented core runtime behavior. [Helper caching and update rules](HELPERS.md), [public types](TYPES.md), [packaging](PACKAGING.md) and [browser behavior](DEMO.md) have their own records.

## Actions and reducers

- `createAction(type)()` returns an object with only a `type` property. If the caller provides one argument, the result also owns `payload`, even when that value is `undefined`. The creator's `.type` is the supplied string; Fluxus does not generate unique types.
- `createReducer(initialState, handlers)` uses `initialState` when called with an `undefined` state and returns the current state for an unknown string action type.
- A handler is invoked only when its type is an **own property** of `handlers`. Inherited keys such as `toString` and `constructor` are ignored unless explicitly defined as own handlers.
- An action without a string `type` throws `TypeError`. A matched handler that returns `undefined` throws `Error` instead of silently corrupting the store.
- Reducers should return a new value for a change and leave existing state untouched. Fluxus does not freeze input state or undo mutations made by a reducer that later throws.

## Dispatch, subscribers, and middleware

- `dispatch` validates that the action owns a string `type`. A reducer runs synchronously; a successful result replaces state before subscribers are notified. A reducer error or `undefined` result leaves the store's state reference unchanged and does not notify subscribers.
- A successful dispatch notifies subscribers **even when the reducer returns the same state reference**. A middleware may choose not to call `next`; in that case the reducer and subscribers are skipped.
- `subscribe(listener)` returns an idempotent unsubscribe function. Each notification uses a snapshot of listeners. A listener added during notification waits for the next dispatch; one removed before its turn is skipped. A listener may dispatch a new action, but dispatch from inside a reducer is rejected.
- Middleware receives `{ getState, dispatch }`, then `next`, then an action. When `[first, second]` is supplied, calls nest as `first → second → reducer → second → first`. `api.dispatch` uses the store's enhanced dispatch. The exported `applyMiddleware` helper uses the same contract around a store's current dispatch.
- Fluxus does not log actions or state by default. If a subscriber throws, the state has already committed and the error propagates to the caller; subsequent subscribers in that notification are not called.

These rules are backed by exact-shape, reserved-key, middleware-order, and dispatch-error tests in `test/core/`.
