/**
 * Fantasy UI lid open/close clips for craftable storage chests.
 *
 * Assets live under `public/home/sfx/fantasy-ui/`.
 *
 * @module components/world/storage-chest/domains/definingWorldPlazaStorageChestSfxConstants
 */

/** Public URL prefix for shipped Fantasy UI chest lid clips. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_ASSET_BASE_URL =
  '/home/sfx/fantasy-ui' as const;

/** Storage chest lid interaction that plays a clip. */
export type DefiningWorldPlazaStorageChestSfxActionId = 'open' | 'close';

/** Stable ids for every bundled storage chest lid clip. */
export type DefiningWorldPlazaStorageChestSfxClipId =
  | 'chest_open'
  | 'chest_close';

/** Maps each lid interaction to its shipped clip id. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_CLIP_ID_BY_ACTION: Record<
  DefiningWorldPlazaStorageChestSfxActionId,
  DefiningWorldPlazaStorageChestSfxClipId
> = {
  open: 'chest_open',
  close: 'chest_close',
};

/** Base one-shot volume before the SFX volume slider is applied. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_SFX_TARGET_VOLUME_BY_ACTION: Record<
  DefiningWorldPlazaStorageChestSfxActionId,
  number
> = {
  open: 0.52,
  close: 0.48,
};
