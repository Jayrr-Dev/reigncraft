/**
 * star-audio eagerly preloads 17 procedural synth presets as blob: URLs on init.
 * Reddit's Devvit webview iframe rejects those fetches (ERR_FILE_NOT_FOUND).
 * Reigncraft uses file-based manifests only, so the preset warm-up is skipped.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STAR_AUDIO_PRESET_PRELOAD_BLOCK =
  /for \(const presetName of Object\.keys\(PRESET_DEFINITIONS\)\) \{\s*this\._loadProceduralSound\(presetName, presetName\)\.catch\(\(err\) => \{\s*console\.warn\(`\[StarAudio\] Failed to auto-preload preset \$\{presetName\}:`, err\);\s*\}\);\s*\}/;

const STAR_AUDIO_DEVVIT_PATCH_MARKER =
  '/* preset blob preloads skipped for Devvit iframe compatibility */';

const STAR_AUDIO_ENDED_LISTENER_BLOCK =
  /self\._endTimers\[sound\._id\] = function\(\) \{\s*self\._ended\(sound\);\s*node\.removeEventListener\("ended", self\._endTimers\[sound\._id\], false\);\s*\};/;

const STAR_AUDIO_ENDED_LISTENER_PATCH_MARKER =
  '/* retain ended listener before _ended clears timer */';

/**
 * @param {string} source
 * @returns {string}
 */
export function patchingStarAudioSourceForDevvitIframe(source) {
  let patchedSource = source;

  if (
    !patchedSource.includes(STAR_AUDIO_DEVVIT_PATCH_MARKER) &&
    STAR_AUDIO_PRESET_PRELOAD_BLOCK.test(patchedSource)
  ) {
    patchedSource = patchedSource.replace(
      STAR_AUDIO_PRESET_PRELOAD_BLOCK,
      STAR_AUDIO_DEVVIT_PATCH_MARKER
    );
  }

  if (
    !patchedSource.includes(STAR_AUDIO_ENDED_LISTENER_PATCH_MARKER) &&
    STAR_AUDIO_ENDED_LISTENER_BLOCK.test(patchedSource)
  ) {
    patchedSource = patchedSource.replace(
      STAR_AUDIO_ENDED_LISTENER_BLOCK,
      `${STAR_AUDIO_ENDED_LISTENER_PATCH_MARKER}
                self._endTimers[sound._id] = function() {
                  var endedListener = self._endTimers[sound._id];
                  self._ended(sound);
                  if (typeof endedListener === "function") {
                    node.removeEventListener("ended", endedListener, false);
                  }
                };`
    );
  }

  return patchedSource;
}

/**
 * @param {string} projectRoot
 * @returns {string}
 */
export function resolvingStarAudioPackageEntryPath(projectRoot) {
  return path.join(projectRoot, 'node_modules/star-audio/dist/index.mjs');
}

/**
 * Patches the installed star-audio package in node_modules.
 *
 * Devvit's Rolldown game bundle resolves star-audio from node_modules directly,
 * so Vite aliases alone do not remove the preset warm-up loop from game.js.
 *
 * @param {string} projectRoot
 * @returns {boolean} true when the on-disk package was updated
 */
export function patchingStarAudioPackageInNodeModules(projectRoot) {
  const sourcePath = resolvingStarAudioPackageEntryPath(projectRoot);
  const source = readFileSync(sourcePath, 'utf8');
  const patched = patchingStarAudioSourceForDevvitIframe(source);

  if (patched === source) {
    return false;
  }

  writeFileSync(sourcePath, patched);
  return true;
}

/**
 * Writes a patched star-audio entry module and returns its path for Vite aliasing.
 *
 * @param {string} projectRoot
 * @returns {string}
 */
export function resolvingPatchedStarAudioModulePath(projectRoot) {
  patchingStarAudioPackageInNodeModules(projectRoot);

  const sourcePath = resolvingStarAudioPackageEntryPath(projectRoot);
  const cacheDir = path.join(projectRoot, 'node_modules/.cache/reigncraft');
  const patchedPath = path.join(cacheDir, 'star-audio-devvit.mjs');

  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(patchedPath, readFileSync(sourcePath, 'utf8'));

  return patchedPath;
}

/**
 * @param {string} projectRoot
 * @returns {import('vite').Plugin}
 */
export function vitePatchingStarAudioForDevvitIframe(projectRoot) {
  return {
    name: 'vite-patching-star-audio-for-devvit-iframe',
    enforce: 'pre',
    config() {
      resolvingPatchedStarAudioModulePath(projectRoot);
    },
    resolveId(source) {
      if (source === 'star-audio') {
        return resolvingPatchedStarAudioModulePath(projectRoot);
      }

      return null;
    },
    transform(code, id) {
      const normalizedId = id.replace(/\\/g, '/');
      if (
        !normalizedId.includes('/star-audio/') ||
        !normalizedId.endsWith('.mjs')
      ) {
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

const isPostinstallEntry =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isPostinstallEntry) {
  const projectRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..'
  );
  const patched = patchingStarAudioPackageInNodeModules(projectRoot);

  if (patched) {
    console.log(
      'Patched star-audio for Devvit iframe compatibility.'
    );
  }
}
