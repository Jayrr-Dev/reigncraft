import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_TARGET_VOLUME_BY_ACTION,
  type DefiningWorldPlazaStorageChestSfxActionId,
} from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestSfxConstants';

/**
 * Resolves storage chest lid volume after applying the SFX volume slider.
 */
export function computingWorldPlazaStorageChestSfxEffectiveVolume(
  actionId: DefiningWorldPlazaStorageChestSfxActionId,
  clipVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_TARGET_VOLUME_BY_ACTION[actionId],
    multipliers: [clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
