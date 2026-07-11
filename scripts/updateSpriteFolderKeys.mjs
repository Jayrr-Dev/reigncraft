/**
 * Updates only spriteFolder values in wildlife species registry.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

function toKebabCase(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

const filePath = path.join(
  repoRoot,
  'src/client/world/wildlife/domains/definingWildlifeSpeciesRegistry.ts'
);

let content = await readFile(filePath, 'utf8');

content = content.replace(/spriteFolder: '([^']+)'/g, (_, folder) => {
  return `spriteFolder: '${toKebabCase(folder)}'`;
});

content = content.replace(
  /definingWildlifePassiveFarmSpecies\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,/g,
  (_, id, display, folder) =>
    `definingWildlifePassiveFarmSpecies('${id}', '${display}', '${toKebabCase(folder)}',`
);

content = content.replace(
  /definingWildlifeHerbivoreSpecies\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,/g,
  (_, id, display, folder) =>
    `definingWildlifeHerbivoreSpecies('${id}', '${display}', '${toKebabCase(folder)}',`
);

await writeFile(filePath, content);
console.log('species registry spriteFolder values updated');
