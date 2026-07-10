/**
 * star-audio eagerly preloads 17 procedural synth presets as blob: URLs on init.
 * Reddit's Devvit webview iframe rejects those fetches (ERR_FILE_NOT_FOUND).
 * Reigncraft uses file-based manifests only, so the preset warm-up is skipped.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const STAR_AUDIO_PRESET_PRELOAD_BLOCK =
  /for \(const presetName of Object\.keys\(PRESET_DEFINITIONS\)\) \{\s*this\._loadProceduralSound\(presetName, presetName\)\.catch\(\(err\) => \{\s*console\.warn\(`\[StarAudio\] Failed to auto-preload preset \$\{presetName\}:`, err\);\s*\}\);\s*\}/;

/**
 * @param {string} source
 * @returns {string}
 */
export function patchingStarAudioSourceForDevvitIframe(source) {
  if (!STAR_AUDIO_PRESET_PRELOAD_BLOCK.test(source)) {
    return source;
  }

  return source.replace(
    STAR_AUDIO_PRESET_PRELOAD_BLOCK,
    '/* preset blob preloads skipped for Devvit iframe compatibility */'
  );
}

/**
 * Writes a patched star-audio entry module and returns its path for Vite aliasing.
 *
 * @param {string} projectRoot
 * @returns {string}
 */
export function resolvingPatchedStarAudioModulePath(projectRoot) {
  const sourcePath = path.join(
    projectRoot,
    'node_modules/star-audio/dist/index.mjs'
  );
  const cacheDir = path.join(projectRoot, 'node_modules/.cache/reigncraft');
  const patchedPath = path.join(cacheDir, 'star-audio-devvit.mjs');

  mkdirSync(cacheDir, { recursive: true });

  const source = readFileSync(sourcePath, 'utf8');
  const patched = patchingStarAudioSourceForDevvitIframe(source);

  writeFileSync(patchedPath, patched);

  return patchedPath;
}

/** @returns {import('vite').Plugin} */
export function vitePatchingStarAudioForDevvitIframe() {
  return {
    name: 'vite-patching-star-audio-for-devvit-iframe',
    enforce: 'pre',
    transform(code, id) {
      const normalizedId = id.replace(/\\/g, '/');
      if (!normalizedId.includes('/star-audio/dist/index.mjs')) {
        return null;
      }

      const patched = patchingStarAudioSourceForDevvitIframe(code);

      if (patched === code) {
        return null;
      }

      return {
        code: patched,
        map: null,
      };
    },
  };
}
