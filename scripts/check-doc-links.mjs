import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const roots = ['.', 'docs'];
const files = roots.flatMap((directory) => readdirSync(directory)
  .filter((name) => name.endsWith('.md'))
  .map((name) => join(directory, name)));
const missing = [];
let checked = 0;

for (const file of files) {
  const markdown = readFileSync(file, 'utf8');
  for (const match of markdown.matchAll(/!?(?:\[[^\]]*\])\((<[^>]+>|[^)\s]+)\)/g)) {
    const raw = match[1].replace(/^<|>$/g, '');
    if (raw.startsWith('#') || /^[a-z][\d+a-z.-]*:/i.test(raw)) continue;
    const path = decodeURIComponent(raw.split(/[?#]/, 1)[0]);
    checked += 1;
    if (!existsSync(resolve(dirname(file), path))) missing.push(`${file}: ${raw}`);
  }
}

if (missing.length > 0) {
  console.error(`Missing local links:\n${missing.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${checked} local Markdown links in ${files.length} files.`);
}
