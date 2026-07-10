/**
 * star-audio eagerly preloads 17 procedural synth presets as blob: URLs on init.
 * Reddit's Devvit webview iframe rejects those fetches (ERR_FILE_NOT_FOUND).
 * Reigncraft uses file-based manifests only, so the preset warm-up is skipped.
 */
const STAR_AUDIO_PRESET_PRELOAD_BLOCK =
  /for \(const presetName of Object\.keys\(PRESET_DEFINITIONS\)\) \{\s*this\._loadProceduralSound\(presetName, presetName\)\.catch\(\(err\) => \{\s*console\.warn\(`\[StarAudio\] Failed to auto-preload preset \$\{presetName\}:`, err\);\s*\}\);\s*\}/;

/** @returns {import('vite').Plugin} */
export function vitePatchingStarAudioForDevvitIframe() {
  return {
    name: 'vite-patching-star-audio-for-devvit-iframe',
    enforce: 'pre',
    transform(code, id) {
      const normalizedId = id.replace(/\\/g, '/');
      if (!normalizedId.endsWith('star-audio/dist/index.mjs')) {
        return null;
      }

      if (!STAR_AUDIO_PRESET_PRELOAD_BLOCK.test(code)) {
        return null;
      }

      return {
        code: code.replace(
          STAR_AUDIO_PRESET_PRELOAD_BLOCK,
          '/* preset blob preloads skipped for Devvit iframe compatibility */'
        ),
        map: null,
      };
    },
  };
}
