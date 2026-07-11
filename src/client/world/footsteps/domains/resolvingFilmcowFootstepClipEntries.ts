import type { DefiningWorldPlazaSfxClipEntry } from '@/components/world/audio/definingWorldPlazaSfxClipEntry';
import {
  mappingWorldPlazaSfxClipEntryIds,
  resolvingWorldPlazaSfxClipEntryId,
  resolvingWorldPlazaSfxClipEntryVolume,
  resolvingWorldPlazaSfxVolumeMultiplier,
} from '@/components/world/audio/resolvingWorldPlazaSfxClipEntry';
import type {
  DefiningFilmcowFootstepClipId,
  DefiningFilmcowFootstepSurfaceDefinition,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

/** Which surface volume group is playing. */
export type DefiningFilmcowFootstepVolumeGroupKind = 'walk' | 'run' | 'landing';

export type DefiningFilmcowFootstepClipEntry =
  DefiningWorldPlazaSfxClipEntry<DefiningFilmcowFootstepClipId>;

export const resolvingFilmcowFootstepClipEntryId =
  resolvingWorldPlazaSfxClipEntryId<DefiningFilmcowFootstepClipId>;

export const resolvingFilmcowFootstepClipEntryVolume =
  resolvingWorldPlazaSfxClipEntryVolume<DefiningFilmcowFootstepClipId>;

export const mappingFilmcowFootstepClipEntryIds =
  mappingWorldPlazaSfxClipEntryIds<DefiningFilmcowFootstepClipId>;

/**
 * Resolves surface × group × clip volume multipliers (default each = 1).
 */
export function resolvingFilmcowFootstepSurfaceVolumeMultiplier(
  surfaceDefinition: DefiningFilmcowFootstepSurfaceDefinition,
  volumeGroupKind: DefiningFilmcowFootstepVolumeGroupKind,
  clipEntry: DefiningFilmcowFootstepClipEntry
): number {
  const groupVolume =
    volumeGroupKind === 'walk'
      ? surfaceDefinition.walkVolume
      : volumeGroupKind === 'run'
        ? surfaceDefinition.runVolume
        : surfaceDefinition.landingVolume;

  return resolvingWorldPlazaSfxVolumeMultiplier(
    surfaceDefinition,
    groupVolume,
    clipEntry
  );
}
