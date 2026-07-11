import { DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_TIMEOUT_MS } from '@/components/world/domains/definingWorldPlazaWorldBootStarAudioConstants';
import {
  resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders,
  resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders,
  type DefiningWorldPlazaWorldBootStarAudioManifestBuilder,
} from '@/components/world/domains/definingWorldPlazaWorldBootStarAudioManifestRegistry';
import { preloadingWorldPlazaStarAudioManifest } from '@/components/world/domains/managingWorldPlazaStarAudio';

/** Reports 0..1 completion for the world boot audio step. */
type PreloadingWorldPlazaWorldBootStarAudioProgressReporter = (
  completedRatio: number
) => void;

function racingWorldPlazaWorldBootStarAudioManifestTimeout(
  preloadPromise: Promise<void>,
  timeoutMs: number
): Promise<void> {
  if (timeoutMs <= 0) {
    return preloadPromise;
  }

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve();
    }, timeoutMs);

    void preloadPromise.finally(() => {
      clearTimeout(timeoutId);
      resolve();
    });
  });
}

async function preloadingWorldPlazaStarAudioManifestBuilders(
  manifestBuilders: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[],
  reportProgress?: PreloadingWorldPlazaWorldBootStarAudioProgressReporter,
  options?: {
    readonly timeoutMs?: number;
  }
): Promise<void> {
  if (manifestBuilders.length === 0) {
    reportProgress?.(1);
    return;
  }

  const timeoutMs = options?.timeoutMs;

  for (
    let manifestIndex = 0;
    manifestIndex < manifestBuilders.length;
    manifestIndex += 1
  ) {
    const buildManifest = manifestBuilders[manifestIndex];

    if (!buildManifest) {
      continue;
    }

    const preloadPromise = preloadingWorldPlazaStarAudioManifest(
      buildManifest()
    ).catch(() => {
      // Runtime hooks retry when their components mount.
    });

    if (timeoutMs === undefined) {
      await preloadPromise;
    } else {
      await racingWorldPlazaWorldBootStarAudioManifestTimeout(
        preloadPromise,
        timeoutMs
      );
    }

    reportProgress?.((manifestIndex + 1) / manifestBuilders.length);
  }
}

/**
 * Warms plaza sounds through star-audio during world boot.
 *
 * Priority slices block the loading bar (with a per-slice timeout so a hung
 * Howler load cannot soft-lock mobile at ~79%). Deferred slices continue in
 * the background so footsteps and music stay first.
 */
export async function preloadingWorldPlazaWorldBootStarAudio(
  reportProgress: PreloadingWorldPlazaWorldBootStarAudioProgressReporter
): Promise<void> {
  await preloadingWorldPlazaStarAudioManifestBuilders(
    resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders(),
    reportProgress,
    {
      timeoutMs: DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_TIMEOUT_MS,
    }
  );

  void preloadingWorldPlazaStarAudioManifestBuilders(
    resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders()
  );
}
