/**
 * Shared star-audio instance for every plaza SFX and music hook.
 *
 * One Howler pool keeps Chrome from exhausting WebMediaPlayers in the
 * Devvit iframe. Manifest keys preload once and are reused by every hook.
 *
 * @module components/world/domains/managingWorldPlazaStarAudio
 */

import { createStarAudio, type Manifest, type StarAudio } from 'star-audio';

let managingWorldPlazaStarAudioInstance: StarAudio | null = null;
let managingWorldPlazaStarAudioAcquireCount = 0;
let managingWorldPlazaStarAudioPageUnloadHookRegistered = false;
const preloadedWorldPlazaStarAudioManifestKeys = new Set<string>();

function destroyingWorldPlazaStarAudioInstance(): void {
  managingWorldPlazaStarAudioInstance?.destroy();
  managingWorldPlazaStarAudioInstance = null;
  managingWorldPlazaStarAudioAcquireCount = 0;
  preloadedWorldPlazaStarAudioManifestKeys.clear();
}

function registeringWorldPlazaStarAudioPageUnloadHook(): void {
  if (
    managingWorldPlazaStarAudioPageUnloadHookRegistered ||
    typeof window === 'undefined'
  ) {
    return;
  }

  managingWorldPlazaStarAudioPageUnloadHookRegistered = true;
  window.addEventListener('pagehide', destroyingWorldPlazaStarAudioInstance);
}

function ensuringWorldPlazaStarAudioInstance(): StarAudio {
  if (!managingWorldPlazaStarAudioInstance) {
    managingWorldPlazaStarAudioInstance = createStarAudio({
      unlockWith: 'auto',
      suspendOnHidden: true,
    });
    registeringWorldPlazaStarAudioPageUnloadHook();
  }

  return managingWorldPlazaStarAudioInstance;
}

/** Returns the shared plaza star-audio instance, creating it when needed. */
export function acquiringWorldPlazaStarAudio(): StarAudio {
  managingWorldPlazaStarAudioAcquireCount += 1;
  return ensuringWorldPlazaStarAudioInstance();
}

/**
 * Releases one plaza star-audio consumer.
 *
 * The shared instance stays alive for the page session. star-audio warms 17
 * procedural presets as blob URLs on init; destroying during React StrictMode
 * remounts revokes those URLs while Howler is still loading them, which spams
 * `ERR_FILE_NOT_FOUND` in the Devvit iframe. Teardown runs on `pagehide`.
 */
export function releasingWorldPlazaStarAudio(): void {
  managingWorldPlazaStarAudioAcquireCount = Math.max(
    0,
    managingWorldPlazaStarAudioAcquireCount - 1
  );
}

/**
 * Preloads manifest entries that are not already warmed on the shared instance.
 */
export async function preloadingWorldPlazaStarAudioManifest(
  manifest: Manifest
): Promise<void> {
  const starAudio = ensuringWorldPlazaStarAudioInstance();
  const pendingManifest: Manifest = {};

  for (const [manifestKey, manifestEntry] of Object.entries(manifest)) {
    if (!preloadedWorldPlazaStarAudioManifestKeys.has(manifestKey)) {
      pendingManifest[manifestKey] = manifestEntry;
    }
  }

  const pendingManifestKeys = Object.keys(pendingManifest);

  if (pendingManifestKeys.length === 0) {
    return;
  }

  try {
    await starAudio.preload(pendingManifest);

    for (const manifestKey of pendingManifestKeys) {
      preloadedWorldPlazaStarAudioManifestKeys.add(manifestKey);
    }
  } catch {
    // Runtime hooks retry when their components mount.
  }
}
