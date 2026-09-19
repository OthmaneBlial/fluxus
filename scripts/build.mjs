import { spawnSync } from 'node:child_process';
import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const [format, filename] of [['cjs', 'index.js'], ['esm', 'index.mjs']]) {
  await build({
    entryPoints: [resolve(root, 'src/index.ts')],
    outfile: resolve(dist, filename),
    bundle: true,
    format,
    platform: 'neutral',
    target: 'es2018',
    sourcemap: true,
    logLevel: 'warning',
  });
}

const declarations = spawnSync(resolve(root, 'node_modules/.bin/dts-bundle-generator'), [
  '--no-banner', '--project', 'tsconfig.build.json',
  '--out-file', 'dist/index.d.ts', 'src/index.ts',
], { cwd: root, encoding: 'utf8' });

if (declarations.status !== 0) {
  throw new Error(`Declaration build failed:\n${declarations.stdout}\n${declarations.stderr}`);
}

await copyFile(resolve(dist, 'index.d.ts'), resolve(dist, 'index.d.mts'));
console.log('Built CJS, ESM, and checked TypeScript declarations.');
