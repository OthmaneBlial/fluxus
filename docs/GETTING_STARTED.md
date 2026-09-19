# Getting started from the repository

The npm package has not been published or verified yet. These instructions use the actual repository and a locally built tarball of `@othmaneblial/fluxus`. They were checked with Node 22.23.2 and 24.21.0 plus Yarn 1.22.22 on macOS; [GitHub CI results](VALIDATION.md#github-ci-19-september-2026) are recorded separately.

## Run the browser example

```bash
git clone https://github.com/OthmaneBlial/fluxus.git
cd fluxus
yarn install --frozen-lockfile
yarn build
python3 -m http.server 8000
```

Open `http://localhost:8000/examples/workbench.html` and follow the [workbench walkthrough](DEMO.md). The page imports `../dist/index.mjs`, so build first and serve the repository root over HTTP. Opening the HTML directly as a `file://` URL can fail to load the module. Stop the local server with Ctrl+C when finished.

## Install the local tarball in a separate folder

From the repository root after `yarn install --frozen-lockfile`:

```bash
npm pack
mkdir ../fluxus-try
cd ../fluxus-try
npm init -y
npm install ../fluxus/othmaneblial-fluxus-0.1.0.tgz
```

Create `demo.mjs` in `fluxus-try`:

```js
import { createAction, createReducer, createStore } from '@othmaneblial/fluxus';

const increment = createAction('counter/increment');
const initial = { count: 0 };
const reducer = createReducer(initial, {
  [increment.type]: (state) => ({ count: state.count + 1 }),
});
const store = createStore(reducer, initial);
const unsubscribe = store.subscribe(() => console.log(store.getState().count));

store.dispatch(increment()); // prints 1
unsubscribe();
```

Run `node demo.mjs`; the expected output is `1`. The local [consumer check](../test/consumer/check-package.mjs) also installs the tarball in a fresh temporary project and exercises ESM, CommonJS and TypeScript imports. Do not substitute `npm install fluxus`: that unscoped name is a different project. The scoped registry command should only be added after a published version is verified.

## Next steps

- [API reference](API.md) for runtime behavior and optional helpers.
- [TypeScript contract](TYPES.md) for discriminated action unions and checked dispatch.
- [Vanilla integration](INTEGRATIONS.md) for subscribing a view and cleaning it up.
- `yarn verify` for the local lint, type-check, test, build and package checks.

The store is synchronous and in memory. Reloading the browser discards demo changes. There is no authentication or backend in these examples.
