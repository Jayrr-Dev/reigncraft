import {
  DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DEFERRED_MANIFEST_BUILDERS,
  DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_PRIORITY_MANIFEST_BUILDERS,
  type DefiningWorldPlazaWorldBootStarAudioManifestBuilder,
} from '@/components/world/domains/definingWorldPlazaWorldBootStarAudioManifestRegistry';
import { createStarAudio } from 'star-audio';

/** Reports 0..1 completion for the world boot audio step. */
type PreloadingWorldPlazaWorldBootStarAudioProgressReporter = (
  completedRatio: number
) => void;

async function preloadingWorldPlazaStarAudioManifestBuilders(
  manifestBuilders: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[],
  reportProgress?: PreloadingWorldPlazaWorldBootStarAudioProgressReporter
): Promise<void> {
  if (manifestBuilders.length === 0) {
    reportProgress?.(1);
    return;
  }

  const starAudio = createStarAudio({
    unlockWith: false,
    suspendOnHidden: false,
  });

  try {
    for (
      let manifestIndex = 0;
      manifestIndex < manifestBuilders.length;
      manifestIndex += 1
    ) {
      const buildManifest = manifestBuilders[manifestIndex];

      if (!buildManifest) {
        continue;
      }

      try {
        await starAudio.preload(buildManifest());
      } catch {
        // Runtime hooks retry when their components mount.
      }

      reportProgress?.((manifestIndex + 1) / manifestBuilders.length);
    }
  } finally {
    starAudio.destroy();
  }
}

/**
 * Warms plaza sounds through star-audio during world boot.
 *
 * Priority slices block the loading bar. Deferred slices continue in the
 * background so footsteps, ambience, and avatar feedback are ready first.
 */
export async function preloadingWorldPlazaWorldBootStarAudio(
  reportProgress: PreloadingWorldPlazaWorldBootStarAudioProgressReporter
): Promise<void> {
  await preloadingWorldPlazaStarAudioManifestBuilders(
    DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_PRIORITY_MANIFEST_BUILDERS,
    reportProgress
  );

  void preloadingWorldPlazaStarAudioManifestBuilders(
    DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DEFERRED_MANIFEST_BUILDERS
  );
}
