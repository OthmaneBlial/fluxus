import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const workspace = await mkdtemp(join(tmpdir(), 'fluxus-consumer-'));
const packageName = '@othmaneblial/fluxus';

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NPM_TOKEN: process.env.NPM_TOKEN ?? 'unused' },
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed:\n${result.stdout}\n${result.stderr}`);
  }
  return result.stdout;
}

try {
  const [pack] = JSON.parse(run('npm', [
    'pack', '--ignore-scripts', '--json', '--pack-destination', workspace,
  ], root));
  const expectedFiles = [
    'LICENSE', 'README.md', 'package.json',
    'dist/index.js', 'dist/index.js.map', 'dist/index.mjs', 'dist/index.mjs.map',
    'dist/index.d.ts', 'dist/index.d.mts',
  ].sort();
  assert.deepEqual(pack.files.map((entry) => entry.path).sort(), expectedFiles);

  await writeFile(join(workspace, 'package.json'), JSON.stringify({
    name: 'fluxus-consumer-check', private: true, type: 'module',
  }));
  const tarball = join(workspace, pack.filename);
  run('npm', ['install', '--offline', '--no-save', '--ignore-scripts', '--no-audit', '--no-fund', tarball], workspace);

  await writeFile(join(workspace, 'esm.mjs'), `
import assert from 'node:assert/strict';
import { createAction, createReducer, createStore } from '${packageName}';
const add = createAction('add').withPayload();
const reducer = createReducer({ count: 0 }, { add: (state, action) => ({ count: state.count + action.payload }) });
const store = createStore(reducer, { count: 0 });
store.dispatch(add(2));
assert.equal(store.select((state) => state.count), 2);
`);
  await writeFile(join(workspace, 'cjs.cjs'), `
const assert = require('node:assert/strict');
const { createAction, createReducer, createStore } = require('${packageName}');
const add = createAction('add').withPayload();
const reducer = createReducer({ count: 0 }, { add: (state, action) => ({ count: state.count + action.payload }) });
const store = createStore(reducer, { count: 0 });
store.dispatch(add(2));
assert.equal(store.select((state) => state.count), 2);
`);
  run('node', ['esm.mjs'], workspace);
  run('node', ['cjs.cjs'], workspace);

  await writeFile(join(workspace, 'missing.mjs'), `import '${packageName}/dist/missing.js';`);
  const missingEntry = spawnSync('node', ['missing.mjs'], { cwd: workspace, encoding: 'utf8' });
  assert.notEqual(missingEntry.status, 0, 'An unpublished subpath should not resolve');
  assert.match(missingEntry.stderr, /ERR_PACKAGE_PATH_NOT_EXPORTED/);

  await writeFile(join(workspace, 'tree-shake.mjs'), `
import { memoize } from '${packageName}';
console.log(memoize((value) => value + 1)(1));
`);
  run(resolve(root, 'node_modules/.bin/esbuild'), [
    'tree-shake.mjs', '--bundle', '--format=esm', '--platform=browser',
    '--minify', '--outfile=tree-shake.bundle.mjs',
  ], workspace);
  const treeShakeBundle = await readFile(join(workspace, 'tree-shake.bundle.mjs'), 'utf8');
  assert.ok(Buffer.byteLength(treeShakeBundle) < 1_000, 'Single-helper browser bundle unexpectedly large');
  assert.ok(!treeShakeBundle.includes('Reducer returned undefined'), 'Unused reducer code was bundled');

  const typeFixture = `
import { createAction, createReducer, createStore } from '${packageName}';
const add = createAction('counter/add').withPayload<number>();
const reset = createAction('counter/reset');
type CounterAction = ReturnType<typeof add> | ReturnType<typeof reset>;
const initial = { count: 0 };
const reducer = createReducer<typeof initial, CounterAction>(initial, {
  [add.type]: (state, action) => ({ count: state.count + action.payload }),
  [reset.type]: () => initial,
});
const store = createStore(reducer, initial);
const value: number = store.select((state) => state.count);
store.dispatch(add(2));
// @ts-expect-error numeric payload required
add('two');
// @ts-expect-error unknown action rejected
store.dispatch({ type: 'counter/other' });
void value;
`;
  await writeFile(join(workspace, 'types.mts'), typeFixture);
  await writeFile(join(workspace, 'types.cts'), typeFixture);
  await writeFile(join(workspace, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      module: 'NodeNext', moduleResolution: 'NodeNext', target: 'ES2022',
      strict: true, noEmit: true, skipLibCheck: false,
    },
    include: ['types.mts', 'types.cts'],
  }));
  run(resolve(root, 'node_modules/.bin/tsc'), ['-p', 'tsconfig.json'], workspace);

  const installedManifest = JSON.parse(await readFile(
    join(workspace, 'node_modules', '@othmaneblial', 'fluxus', 'package.json'), 'utf8'
  ));
  assert.equal(installedManifest.name, packageName);
  assert.equal(installedManifest.version, pack.version);
  console.log(`Installed ${pack.filename}: ${pack.entryCount} files, ${pack.size} bytes; ESM, CJS, both TypeScript resolutions, rejected private subpath and a single-helper browser bundle passed.`);
} finally {
  await rm(workspace, { recursive: true, force: true });
}
