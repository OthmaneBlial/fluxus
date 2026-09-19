import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const releaseDir = resolve(root, 'release');
const env = { ...process.env, NPM_TOKEN: process.env.NPM_TOKEN ?? 'unused' };
const registryBase = (process.env.FLUXUS_REGISTRY_URL ?? 'https://registry.npmjs.org').replace(/\/$/, '');
const expectedFiles = [
  'LICENSE', 'README.md', 'package.json',
  'dist/index.js', 'dist/index.js.map', 'dist/index.mjs', 'dist/index.mjs.map',
  'dist/index.d.ts', 'dist/index.d.mts',
].sort();

function command(name, args, options = {}) {
  const result = spawnSync(name, args, {
    cwd: root, env, encoding: 'utf8', ...options,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${name} ${args.join(' ')} failed: ${result.error ?? result.stderr ?? result.status}`);
  }
  return result.stdout;
}

function commandResult(name, args, options = {}) {
  return spawnSync(name, args, {
    cwd: root, env, encoding: 'utf8', ...options,
  });
}

const changes = command('git', ['status', '--porcelain']);
assert.equal(changes.trim(), '', 'Commit source changes before preparing a release artifact');
const commit = command('git', ['rev-parse', 'HEAD']).trim();
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
assert.equal(manifest.name, '@othmaneblial/fluxus');
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
assert.equal(manifest.license, 'MIT');
assert.ok(!manifest.dependencies || Object.keys(manifest.dependencies).length === 0);

console.log(`Verifying ${manifest.name}@${manifest.version} at ${commit.slice(0, 7)}...`);
command('yarn', ['verify'], { stdio: 'inherit' });

const dryRun = JSON.parse(command('npm', [
  'pack', '--ignore-scripts', '--dry-run', '--json',
]))[0];
assert.equal(dryRun.name, manifest.name);
assert.equal(dryRun.version, manifest.version);
assert.deepEqual(dryRun.files.map((file) => file.path).sort(), expectedFiles);

await mkdir(releaseDir, { recursive: true });
const packed = JSON.parse(command('npm', [
  'pack', '--ignore-scripts', '--json', '--pack-destination', releaseDir,
]))[0];
assert.equal(packed.name, manifest.name);
assert.equal(packed.version, manifest.version);
assert.deepEqual(packed.files.map((file) => file.path).sort(), expectedFiles);
const tarball = join(releaseDir, packed.filename);
const bytes = await readFile(tarball);
assert.equal(bytes.length, packed.size);

const archiveFiles = command('tar', ['-tzf', tarball]).trim().split('\n').sort();
assert.deepEqual(archiveFiles, expectedFiles.map((file) => `package/${file}`).sort());
const archivedManifest = JSON.parse(command('tar', ['-xOf', tarball, 'package/package.json']));
assert.equal(archivedManifest.name, manifest.name);
assert.equal(archivedManifest.version, manifest.version);

const sha256 = createHash('sha256').update(bytes).digest('hex');

const publishDryRunResult = commandResult('npm', [
  'publish', `./release/${packed.filename}`, '--access', 'public',
  '--dry-run', '--ignore-scripts', '--json',
]);
if (publishDryRunResult.status === 0) {
  const publishDryRun = JSON.parse(publishDryRunResult.stdout)[0] ?? JSON.parse(publishDryRunResult.stdout);
  assert.equal(publishDryRun.id, `${manifest.name}@${manifest.version}`);
  assert.equal(publishDryRun.filename, packed.filename);
  assert.equal(publishDryRun.size, bytes.length);
  assert.deepEqual(publishDryRun.files.map((file) => file.path).sort(), expectedFiles);
  console.log('npm publish --dry-run passed for an unpublished version.');
} else {
  const metadataResponse = await globalThis.fetch(`${registryBase}/${encodeURIComponent(manifest.name)}/${manifest.version}`);
  if (!metadataResponse.ok) {
    throw new Error(`npm publish --dry-run failed and registry metadata was unavailable (${metadataResponse.status})`);
  }
  const metadata = await metadataResponse.json();
  assert.equal(metadata.name, manifest.name);
  assert.equal(metadata.version, manifest.version);
  assert.ok(metadata.dist?.tarball, 'Published package metadata must expose a tarball URL');
  const remoteResponse = await globalThis.fetch(metadata.dist.tarball);
  if (!remoteResponse.ok) {
    throw new Error(`Published tarball download failed with HTTP ${remoteResponse.status}`);
  }
  const remoteBytes = new Uint8Array(await remoteResponse.arrayBuffer());
  assert.equal(createHash('sha256').update(remoteBytes).digest('hex'), sha256);
  console.log(`npm version already published; registry tarball matches SHA-256 ${sha256}.`);
}

const consumer = await mkdtemp(join(tmpdir(), 'fluxus-release-'));
try {
  await writeFile(join(consumer, 'package.json'), JSON.stringify({
    name: 'fluxus-release-check', private: true, type: 'module',
  }));
  command('npm', [
    'install', '--offline', '--no-save', '--ignore-scripts', '--no-audit', '--no-fund', tarball,
  ], { cwd: consumer });
  command('node', ['-e', "const { createStore } = require('@othmaneblial/fluxus'); if (typeof createStore !== 'function') process.exit(1)"], { cwd: consumer });
  command('node', ['--input-type=module', '-e', "import { createStore } from '@othmaneblial/fluxus'; if (typeof createStore !== 'function') process.exit(1)"], { cwd: consumer });
} finally {
  await rm(consumer, { recursive: true, force: true });
}

await writeFile(join(releaseDir, 'SHA256SUMS'), `${sha256}  ${packed.filename}\n`);
await writeFile(join(releaseDir, 'release-manifest.json'), `${JSON.stringify({
  name: manifest.name,
  version: manifest.version,
  gitCommit: commit,
  filename: packed.filename,
  bytes: bytes.length,
  sha256,
  files: expectedFiles,
}, null, 2)}\n`);

console.log(`Prepared ${tarball} (${bytes.length} bytes, SHA-256 ${sha256}).`);
