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
const preloadedWorldPlazaStarAudioManifestKeys = new Set<string>();

function ensuringWorldPlazaStarAudioInstance(): StarAudio {
  if (!managingWorldPlazaStarAudioInstance) {
    managingWorldPlazaStarAudioInstance = createStarAudio({
      unlockWith: 'auto',
      suspendOnHidden: true,
    });
  }

  return managingWorldPlazaStarAudioInstance;
}

/** Returns the shared plaza star-audio instance, creating it when needed. */
export function acquiringWorldPlazaStarAudio(): StarAudio {
  managingWorldPlazaStarAudioAcquireCount += 1;
  return ensuringWorldPlazaStarAudioInstance();
}

/**
 * Releases one plaza star-audio consumer. Destroys the shared instance only
 * after every hook has unmounted.
 */
export function releasingWorldPlazaStarAudio(): void {
  managingWorldPlazaStarAudioAcquireCount = Math.max(
    0,
    managingWorldPlazaStarAudioAcquireCount - 1
  );

  if (managingWorldPlazaStarAudioAcquireCount > 0) {
    return;
  }

  managingWorldPlazaStarAudioInstance?.destroy();
  managingWorldPlazaStarAudioInstance = null;
  preloadedWorldPlazaStarAudioManifestKeys.clear();
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
