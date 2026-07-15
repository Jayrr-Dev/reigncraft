/**
 * Survival sprite pack pipeline (creating-sprites skill).
 *
 * 1. Generate row strips + world utilities with GenerateImage (see tmp/survival-sprites/source/).
 * 2. Run: python scripts/processingSurvivalSpritesFromGeneratedRows.py
 *
 * Outputs:
 * - public/inventory/sprites/inventory-survival-sprites.webp (5×4 @ 32px, 19 icons)
 * - public/inventory/sprites/inventory-survival-shelter-sprites.webp (5×1 recipe icons)
 * - public/environment/sprites/utilities/survival-*.webp (5 world utilities)
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const processor = path.join(
  ROOT,
  'scripts',
  'processingSurvivalSpritesFromGeneratedRows.py'
);

const result = spawnSync('python', [processor], {
  stdio: 'inherit',
  cwd: ROOT,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
