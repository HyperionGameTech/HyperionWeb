// Copies the editor's icons into docs-src/icons, so docs pages can show them with :icon[name].
// Usage: npm run sync-icons [-- path/to/hyperion-engine]   (defaults to ../hyperion-engine)
// The icons come from Codicons (CC BY 4.0) and Material Symbols (Apache 2.0).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const engine = path.resolve(ROOT, process.argv[2] || '../hyperion-engine');
const from = path.join(engine, 'Source', 'Editor', 'Managed', 'Assets', 'Icons');
const to = path.join(ROOT, 'docs-src', 'icons');

if (!fs.existsSync(from)) {
  console.error(`sync-icons: no editor icons at ${from}`);
  process.exit(1);
}

fs.mkdirSync(to, { recursive: true });
const icons = fs.readdirSync(from).filter((file) => file.endsWith('.svg'));
for (const file of icons) fs.copyFileSync(path.join(from, file), path.join(to, file));
console.log(`sync-icons: copied ${icons.length} icons into docs-src/icons`);
