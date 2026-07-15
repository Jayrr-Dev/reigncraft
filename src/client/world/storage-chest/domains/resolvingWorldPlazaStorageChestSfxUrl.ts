import {
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_ASSET_BASE_URL,
  type DefiningWorldPlazaStorageChestSfxClipId,
} from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestSfxConstants';

const DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_FILE_NAME_BY_CLIP_ID: Record<
  DefiningWorldPlazaStorageChestSfxClipId,
  string
> = {
  chest_open: 'chest-open.ogg',
  chest_close: 'chest-close-01.ogg',
};

/**
 * Builds a browser-safe public URL for one storage chest lid clip.
 */
export function resolvingWorldPlazaStorageChestSfxUrl(
  clipId: DefiningWorldPlazaStorageChestSfxClipId
): string {
  const encodedBaseUrl =
    DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_ASSET_BASE_URL.split('/')
      .filter((segment) => segment.length > 0)
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_FILE_NAME_BY_CLIP_ID[clipId])}`;
}
