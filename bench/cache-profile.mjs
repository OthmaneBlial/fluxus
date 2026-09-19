// Diagnostic only: V8 heap samples are noisy and are not a performance claim.
import { createStore, memoize } from '../dist/index.mjs';

const collectGarbage = global.gc;
if (typeof collectGarbage !== 'function') {
  throw new Error('Run with node --expose-gc bench/cache-profile.mjs after yarn build');
}

const initialState = { value: 42 };
const store = createStore((state = initialState) => state, initialState);
const latestValue = memoize((state) => state.value);

function heapMiB() {
  if (typeof collectGarbage !== 'function') {
    throw new Error('Garbage collection is unavailable');
  }
  collectGarbage();
  return Number((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2));
}

/** @param {number} count */
function exercise(count) {
  for (let index = 0; index < count; index += 1) {
    latestValue({ value: index });
    store.select((state) => state.value + index);
  }
}

exercise(5_000); // warm up the runtime
const samples = [heapMiB()];
for (let round = 0; round < 4; round += 1) {
  exercise(25_000);
  samples.push(heapMiB());
}

console.log(JSON.stringify({
  node: process.version,
  iterationsAfterWarmup: 100_000,
  heapMiB: samples,
  note: 'One local GC-forced run; inspect the trend, not an absolute memory guarantee.',
}, null, 2));
