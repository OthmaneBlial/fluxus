# Optional helper contracts

The helpers are exported for small use cases but are not required to create a Fluxus store. They do not prove that Fluxus is faster or uses less memory than another library.

## `memoize(fn)` and `store.select(selector)`

`memoize` accepts a one-argument function and caches **only its latest** argument and result. It compares arguments with `Object.is`, caches `undefined` results, and recomputes after an intervening different argument. This bounds each memoized function to one cached input/output pair; the cached pair remains reachable while the memoized function remains reachable.

`Store.select` uses a `WeakMap` keyed by selector function, with one such memoized function per live selector. A selector that is no longer referenced by application code can be collected with its cache. Passing a new inline selector function on every call prevents reuse of the result. Reuse a stable selector function when caching matters:

```js
const selectCount = (state) => state.count;
store.select(selectCount);
store.select(selectCount); // same state reference and selector: cached
```

Selectors assume immutable state transitions. Mutating the current state object in place can return a stale cached result and is outside this contract.

## `updateObject` and `updateArray`

`updateObject(obj, updates)` makes a **shallow** copy of a plain object (`Object.prototype` or a null prototype). It applies enumerable own string and symbol properties from `updates`, including new properties, and always returns a fresh object. Inherited and non-enumerable properties are not copied; nested objects retain their references. Class instances, arrays, and special built-in objects are rejected instead of creating an object with missing internal fields. An own `__proto__` key is copied as data, without altering the resulting prototype.

`updateArray(array, index, value)` makes a shallow copy and replaces exactly one element. `index` must be an integer in `[0, array.length)`; invalid values throw `Error('Index out of bounds')`. Sparse holes outside the replaced index remain holes. Nested values are shared with the original array.

## Memory diagnostic

After `yarn build`, run `node --expose-gc bench/cache-profile.mjs` to sample V8 heap across 100,000 temporary arguments and selector functions. The script uses explicit GC, prints Node version and samples, and makes no pass/fail or competitor claim. Absolute bytes vary with runtime and machine. The bounded one-entry cache and weak selector keys are the design mechanisms; this diagnostic can reveal a regression worth investigating, but it cannot prove that no memory leak exists in a real application.

One local run on 19 September 2026 with Node `v25.9.0` reported heap samples `[3.01, 3.88, 3.88, 3.88, 3.88]` MiB after forced GC. This is a single diagnostic observation, not a cross-platform result or a comparison with another library.
