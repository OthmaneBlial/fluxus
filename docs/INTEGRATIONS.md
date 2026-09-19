# Integration decisions for the first release

Fluxus targets small JavaScript and TypeScript interfaces without a UI framework. The [task workbench](../examples/workbench.js) is the working integration example: one store feeds a filtered list, progress summary and detachable event observer through independent subscriptions. Pausing the observer calls its unsubscribe function; the other subscribers continue to update.

For a smaller view in a source checkout after `yarn build`, save the following module inside `examples/` and use it from a page served over HTTP containing `<span id="count"></span><button id="increment">Increase</button>`:

```js
import { createAction, createReducer, createStore } from '../dist/index.mjs';

const increment = createAction('counter/increment');
const initialState = { count: 0 };
const reducer = createReducer(initialState, {
  [increment.type]: (state) => ({ count: state.count + 1 }),
});
const store = createStore(reducer, initialState);
const selectCount = (state) => state.count;

function mountCounter(element) {
  const render = () => { element.textContent = String(store.select(selectCount)); };
  const unsubscribe = store.subscribe(render);
  render();
  return unsubscribe; // call when the element or view is removed
}

const unmount = mountCounter(document.getElementById('count'));
document.getElementById('increment').addEventListener('click', () => store.dispatch(increment()));
// Later, when removing this view: unmount();
```

The stable selector function lets `select` reuse its cached value while the state reference is unchanged. Store state lives in memory and should be replaced immutably by reducers. `subscribe` fires after every successful dispatch, even if the state reference is unchanged. See [the core contract](CORE_CONTRACT.md).

| Option | First-release decision | Reason and revisit trigger |
| --- | --- | --- |
| Vanilla DOM recipe | Include and maintain. | It directly serves the intended user and has a rendered working example. |
| React adapter or hook | Defer; keep React out of the core package. | No independent usage evidence yet. Revisit if multiple users need a tested `useSyncExternalStore` adapter; ship it separately with mount/unmount tests. |
| Persistence or server sync | Defer. | The product is explicitly an in-memory store. Revisit only with a concrete recovery/sync use case and a migration policy. |
| DevTools/time travel | Defer. | An inspector UI in the demo shows current state but is not a DevTools integration. Revisit if tracing becomes an adoption blocker and the API can remain stable. |

These are scope decisions, not claims that integrations exist. Feedback from independent use should drive any additional adapter.
