import type { DefiningWorldPlazaStorageChestSfxClipId } from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestSfxConstants';

/** Prefix for storage chest lid ids inside the star-audio manifest. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_STAR_AUDIO_ID_PREFIX =
  'storage-chest' as const;

/**
 * Stable star-audio manifest key for one storage chest lid clip.
 */
export function resolvingWorldPlazaStorageChestSfxStarAudioId(
  clipId: DefiningWorldPlazaStorageChestSfxClipId
): string {
  return `${DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_STAR_AUDIO_ID_PREFIX}.${clipId}`;
}
