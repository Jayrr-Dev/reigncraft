#!/usr/bin/env node
/**
 * sessionStart hook: inject gameplay documentation conventions.
 */
import { readFileSync, existsSync } from 'node:fs';
import { stdin } from 'node:process';

const PROJECT_DIR = process.env.CURSOR_PROJECT_DIR || process.cwd();

async function readStdinJson() {
  const text = await new Promise((resolve) => {
    let data = '';
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk) => {
      data += chunk;
    });
    stdin.on('end', () => resolve(data));
  });

  if (!text.trim()) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function readingGameplayReadmeExcerpt() {
  const readmePath = `${PROJECT_DIR}/gameplay/README.md`;

  if (!existsSync(readmePath)) {
    return 'Gameplay docs live under `gameplay/`. Extend a mechanic → update matching `gameplay/mechanics/<context>/` docs.';
  }

  const content = readFileSync(readmePath, 'utf8');
  const lines = content.split('\n').slice(0, 40);

  return lines.join('\n');
}

async function main() {
  await readStdinJson();

  const additionalContext = [
    '## Gameplay documentation (required when extending mechanics)',
    '',
    readingGameplayReadmeExcerpt(),
    '',
    'When you add or change player-facing rules (diseases, buffs, wildlife, combat, hunger, etc.):',
    '1. Update the matching folder under `gameplay/mechanics/<context>/`.',
    '2. If the context is new, copy `gameplay/_template/` and register a trigger in `gameplay/doc-triggers.json`.',
    '3. Disease work → `gameplay/mechanics/disease/` (glossary, mechanics, catalog).',
    '4. A stop hook will auto-request doc sync if code changes without doc updates.',
  ].join('\n');

  process.stdout.write(
    `${JSON.stringify({
      additional_context: additionalContext,
    })}\n`
  );
}

main().catch(() => {
  process.stdout.write('{}\n');
});
