import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import {
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_CLIP_ID_BY_ACTION,
  type DefiningWorldPlazaStorageChestSfxClipId,
} from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestSfxConstants';
import { resolvingWorldPlazaStorageChestSfxStarAudioId } from '@/components/world/storage-chest/domains/resolvingWorldPlazaStorageChestSfxStarAudioId';
import { resolvingWorldPlazaStorageChestSfxUrl } from '@/components/world/storage-chest/domains/resolvingWorldPlazaStorageChestSfxUrl';

/**
 * Builds the star-audio preload manifest for storage chest lid open/close.
 */
export function buildingWorldPlazaStorageChestStarAudioManifest(): Manifest {
  const manifest: Manifest = {};
  const uniqueClipIds = new Set<DefiningWorldPlazaStorageChestSfxClipId>(
    Object.values(DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_CLIP_ID_BY_ACTION)
  );

  for (const clipId of uniqueClipIds) {
    manifest[resolvingWorldPlazaStorageChestSfxStarAudioId(clipId)] = {
      src: resolvingWorldPlazaStorageChestSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
