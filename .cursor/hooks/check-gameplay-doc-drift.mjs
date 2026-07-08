#!/usr/bin/env node
/**
 * stop hook: if agent changed mechanic code but not matching gameplay docs,
 * request one follow-up turn to sync documentation.
 */
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { stdin } from 'node:process';

const PROJECT_DIR = process.env.CURSOR_PROJECT_DIR || process.cwd();
const MANIFEST_PATH = 'gameplay/doc-triggers.json';

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

function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: PROJECT_DIR,
    encoding: 'utf8',
  });

  if (result.status !== 0 || !result.stdout) {
    return [];
  }

  return result.stdout
    .split('\n')
    .map((line) => line.trim().replace(/\\/g, '/'))
    .filter(Boolean);
}

function listingChangedFiles() {
  const files = new Set([
    ...runGit(['diff', '--name-only', 'HEAD']),
    ...runGit(['diff', '--cached', '--name-only']),
    ...runGit(['ls-files', '--others', '--exclude-standard']),
  ]);

  return [...files];
}

function loadingManifest() {
  const absolutePath = `${PROJECT_DIR}/${MANIFEST_PATH}`.replace(/\\/g, '/');

  if (!existsSync(absolutePath)) {
    return null;
  }

  return JSON.parse(readFileSync(absolutePath, 'utf8'));
}

function normalizingPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function checkingSuffixSkip(filePath, suffixes) {
  return suffixes.some((suffix) => filePath.endsWith(suffix));
}

function checkingPathSkip(filePath, prefixes) {
  return prefixes.some((prefix) => filePath.startsWith(prefix));
}

function matchingWatch(filePath, watch) {
  const includes = watch.pathIncludes ?? [];

  return includes.some((fragment) => filePath.includes(fragment));
}

function matchingDocFolder(filePath, docFolder) {
  const normalizedFolder = docFolder.endsWith('/')
    ? docFolder
    : `${docFolder}/`;

  return (
    filePath.startsWith(normalizedFolder) || filePath === docFolder.slice(0, -1)
  );
}

function resolvingWatchHits(changedFiles, trigger, manifest) {
  const skipSuffixes = manifest.skipChangedSuffixes ?? [];
  const skipPaths = manifest.skipChangedPaths ?? [];

  return changedFiles.filter((filePath) => {
    if (checkingPathSkip(filePath, skipPaths)) {
      return false;
    }

    if (checkingSuffixSkip(filePath, skipSuffixes)) {
      return false;
    }

    return matchingWatch(filePath, trigger.watch);
  });
}

function resolvingDocHits(changedFiles, docFolder) {
  return changedFiles.filter((filePath) => matchingDocFolder(filePath, docFolder));
}

function checkingRequiredFilesExist(docFolder, requiredFiles) {
  const missing = [];

  for (const fileName of requiredFiles) {
    const relativePath = `${docFolder}${fileName}`.replace(/\\/g, '/');
    const absolutePath = `${PROJECT_DIR}/${relativePath}`;

    if (!existsSync(absolutePath)) {
      missing.push(relativePath);
    }
  }

  return missing;
}

function buildingFollowupMessage(violations) {
  const lines = [
    'Gameplay doc sync required before finishing.',
    '',
    'You changed mechanic code but did not update the matching `gameplay/mechanics/` docs in this session.',
    '',
    'For each item below:',
    '1. If the doc folder is missing, copy `gameplay/_template/` and fill it in.',
    '2. Update glossary, mechanics, and catalog (when applicable) to match the code change.',
    '3. Add a row to `gameplay/mechanics/README.md` if this is a new context.',
    '',
  ];

  for (const violation of violations) {
    lines.push(`### ${violation.label} (${violation.id})`);
    lines.push(`- Code touched: ${violation.watchHits.join(', ')}`);
    lines.push(`- Doc folder: \`${violation.docFolder}\``);

    if (violation.missingRequiredFiles.length > 0) {
      lines.push(
        `- Missing files: ${violation.missingRequiredFiles.map((file) => `\`${file}\``).join(', ')}`
      );
    } else {
      lines.push('- Existing docs were not edited this session.');
    }

    lines.push('');
  }

  lines.push('See `gameplay/README.md` and `.cursor/rules/gameplay-docs.mdc`.');
  return lines.join('\n');
}

async function main() {
  const payload = await readStdinJson();
  const status = payload.status ?? 'completed';
  const loopCount = payload.loop_count ?? 0;

  if (status !== 'completed' || loopCount > 0) {
    process.stdout.write('{}\n');
    return;
  }

  const manifest = loadingManifest();

  if (!manifest) {
    process.stdout.write('{}\n');
    return;
  }

  const changedFiles = listingChangedFiles().map(normalizingPath);

  if (changedFiles.length === 0) {
    process.stdout.write('{}\n');
    return;
  }

  const violations = [];

  for (const trigger of manifest.triggers ?? []) {
    const watchHits = resolvingWatchHits(changedFiles, trigger, manifest);

    if (watchHits.length === 0) {
      continue;
    }

    const docFolder = trigger.docs.folder;
    const requiredFiles = trigger.docs.requiredFiles ?? [];
    const docHits = resolvingDocHits(changedFiles, docFolder);
    const missingRequiredFiles = checkingRequiredFilesExist(
      docFolder,
      requiredFiles
    );

    if (docHits.length > 0 && missingRequiredFiles.length === 0) {
      continue;
    }

    violations.push({
      id: trigger.id,
      label: trigger.label,
      watchHits,
      docFolder,
      missingRequiredFiles,
    });
  }

  if (violations.length === 0) {
    process.stdout.write('{}\n');
    return;
  }

  process.stdout.write(
    `${JSON.stringify({
      followup_message: buildingFollowupMessage(violations),
    })}\n`
  );
}

main().catch(() => {
  process.stdout.write('{}\n');
});
