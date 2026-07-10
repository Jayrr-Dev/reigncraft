import { DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_BUILDERS } from '@/components/world/domains/definingWorldPlazaWorldBootStarAudioManifestRegistry';
import { createStarAudio } from 'star-audio';

/** Reports 0..1 completion for the world boot audio step. */
type PreloadingWorldPlazaWorldBootStarAudioProgressReporter = (
  completedRatio: number
) => void;

/**
 * Warms every shipped plaza sound through star-audio during world boot.
 *
 * Runtime SFX hooks still call `preload` on their own instances; by then the
 * browser cache already holds the decoded assets from this pass.
 */
export async function preloadingWorldPlazaWorldBootStarAudio(
  reportProgress: PreloadingWorldPlazaWorldBootStarAudioProgressReporter
): Promise<void> {
  const manifestBuilders =
    DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_BUILDERS;

  if (manifestBuilders.length === 0) {
    reportProgress(1);
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

      reportProgress((manifestIndex + 1) / manifestBuilders.length);
    }
  } finally {
    starAudio.destroy();
  }
}
