import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import { dirname, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { build } from 'esbuild';
import { configureStore, createSelector, createSlice } from '@reduxjs/toolkit';
import { createStore as createZustandStore } from 'zustand/vanilla';
import { createAction, createReducer, createStore as createFluxusStore } from '../dist/index.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const iterations = 200_000;
const warmupIterations = 20_000;
const trials = 5;

const fluxusIncrement = createAction('counter/increment');
const fluxusReducer = createReducer({ count: 0 }, {
  [fluxusIncrement.type]: (state) => ({ count: state.count + 1 }),
});
const toolkitSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: { increment: (state) => { state.count += 1; } },
});
const double = (state) => state.count * 2;

const factories = {
  Fluxus() {
    const store = createFluxusStore(fluxusReducer, { count: 0 });
    return {
      increment: () => store.dispatch(fluxusIncrement()),
      read: () => store.getState().count,
      select: () => store.select(double),
      subscribe: (listener) => store.subscribe(listener),
    };
  },
  'Redux Toolkit'() {
    const store = configureStore({
      reducer: toolkitSlice.reducer,
      middleware: () => [],
      devTools: false,
    });
    const selectDouble = createSelector([(state) => state.count], (count) => count * 2);
    return {
      increment: () => store.dispatch(toolkitSlice.actions.increment()),
      read: () => store.getState().count,
      select: () => selectDouble(store.getState()),
      subscribe: (listener) => store.subscribe(listener),
    };
  },
  Zustand() {
    const store = createZustandStore(() => ({ count: 0 }));
    return {
      increment: () => store.setState((state) => ({ count: state.count + 1 })),
      read: () => store.getState().count,
      select: () => double(store.getState()),
      subscribe: (listener) => store.subscribe(listener),
    };
  },
};

function exercise(factory, workload, count) {
  const app = factory();
  let observed = 0;
  const listener = () => { observed += 1; };
  if (workload === 'dispatchWithSubscriber') app.subscribe(listener);
  if (workload === 'readState' || workload === 'selectDerived') app.increment();

  const started = performance.now();
  if (workload === 'dispatch' || workload === 'dispatchWithSubscriber') {
    for (let index = 0; index < count; index += 1) app.increment();
  } else if (workload === 'subscribeUnsubscribe') {
    for (let index = 0; index < count; index += 1) app.subscribe(listener)();
  } else if (workload === 'readState') {
    for (let index = 0; index < count; index += 1) observed += app.read();
  } else if (workload === 'selectDerived') {
    for (let index = 0; index < count; index += 1) observed += app.select();
  }
  const durationMs = performance.now() - started;

  if (workload === 'dispatch') assert.equal(app.read(), count);
  if (workload === 'dispatchWithSubscriber') {
    assert.equal(app.read(), count);
    assert.equal(observed, count);
  }
  if (workload === 'subscribeUnsubscribe') {
    app.increment();
    assert.equal(observed, 0);
  }
  if (workload === 'readState') assert.equal(observed, count);
  if (workload === 'selectDerived') assert.equal(observed, count * 2);
  return Number(durationMs.toFixed(3));
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

const workloads = ['dispatch', 'dispatchWithSubscriber', 'subscribeUnsubscribe', 'readState', 'selectDerived'];
const timings = {};
for (const workload of workloads) {
  timings[workload] = {};
  const names = Object.keys(factories);
  for (const [name, factory] of Object.entries(factories)) {
    exercise(factory, workload, warmupIterations);
    timings[workload][name] = { samplesMs: [] };
  }
  for (let trial = 0; trial < trials; trial += 1) {
    for (let offset = 0; offset < names.length; offset += 1) {
      const name = names[(offset + trial) % names.length];
      timings[workload][name].samplesMs.push(exercise(factories[name], workload, iterations));
    }
  }
  for (const name of names) {
    timings[workload][name].medianMs = median(timings[workload][name].samplesMs);
  }
}

const bundleSources = {
  Fluxus: `import { createAction, createReducer, createStore } from './dist/index.mjs';
const add = createAction('add'); const reducer = createReducer({ count: 0 }, { add: (s) => ({ count: s.count + 1 }) });
const store = createStore(reducer, { count: 0 }); window.counter = { add: () => store.dispatch(add()), read: () => store.getState().count };`,
  'Redux Toolkit': `import { configureStore, createSlice } from '@reduxjs/toolkit';
const slice = createSlice({ name: 'counter', initialState: { count: 0 }, reducers: { add: (s) => { s.count += 1; } } });
const store = configureStore({ reducer: slice.reducer, middleware: () => [], devTools: false });
window.counter = { add: () => store.dispatch(slice.actions.add()), read: () => store.getState().count };`,
  Zustand: `import { createStore } from 'zustand/vanilla';
const store = createStore(() => ({ count: 0 }));
window.counter = { add: () => store.setState((s) => ({ count: s.count + 1 })), read: () => store.getState().count };`,
};

const bundles = {};
for (const [name, contents] of Object.entries(bundleSources)) {
  const result = await build({
    stdin: { contents, resolveDir: root, sourcefile: `${name.replaceAll(' ', '-')}.js` },
    bundle: true, minify: true, treeShaking: true, write: false,
    platform: 'browser', format: 'esm', target: 'es2018',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const bytes = result.outputFiles[0].contents;
  bundles[name] = { minifiedBytes: bytes.length, gzipBytes: gzipSync(bytes).length };
}

const ownPackage = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const output = {
  dateUtc: new Date().toISOString(),
  environment: {
    node: process.version,
    platform: os.platform(),
    arch: os.arch(),
    cpu: os.cpus()[0]?.model,
    ramGiB: Number((os.totalmem() / 1024 ** 3).toFixed(1)),
    versions: {
      Fluxus: ownPackage.version,
      'Redux Toolkit': require('@reduxjs/toolkit/package.json').version,
      Zustand: require('zustand/package.json').version,
      esbuild: require('esbuild/package.json').version,
    },
  },
  method: {
    iterationsPerTrial: iterations,
    warmupIterations,
    trials,
    executionOrder: 'One warmup per library/workload, then trials interleaved with rotated library order',
    timingUnit: 'milliseconds; lower is faster',
    bundle: 'Equivalent counter API, browser ESM, esbuild minified production define, gzip default',
    caveat: 'Different store semantics and selector caching; microbenchmarks do not predict application performance.',
  },
  timings,
  bundles,
};
console.log(JSON.stringify(output, null, 2));
