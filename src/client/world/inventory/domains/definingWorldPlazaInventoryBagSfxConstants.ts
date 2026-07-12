/**
 * Inventory pickup and drop SFX for plaza world items.
 *
 * Pickup, drop, and slot moves all use FilmCow Recorded
 * (`public/inventory/sfx/filmcow-recorded/`). Drop and move play quieter.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBagSfxConstants
 */

/** Public URL prefix for shipped FilmCow inventory bag clips. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_PICKUP_ASSET_BASE_URL =
  '/inventory/sfx/filmcow-recorded' as const;

/** Inventory interaction that plays a clip. */
export type DefiningWorldPlazaInventoryBagSfxActionId =
  | 'pickup'
  | 'drop'
  | 'move';

/** Stable ids for every bundled inventory clip. */
export type DefiningWorldPlazaInventoryBagSfxClipId = 'strap_tighten';

/** Maps each inventory interaction to its shipped clip id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_CLIP_ID_BY_ACTION: Record<
  DefiningWorldPlazaInventoryBagSfxActionId,
  DefiningWorldPlazaInventoryBagSfxClipId
> = {
  pickup: 'strap_tighten',
  /** Same FilmCow strap as pickup; quieter when dropping to the ground. */
  drop: 'strap_tighten',
  /** Same FilmCow strap as pickup; quieter for slot rearranges. */
  move: 'strap_tighten',
};

/** Base one-shot volume before the SFX volume slider is applied. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_TARGET_VOLUME_BY_ACTION: Record<
  DefiningWorldPlazaInventoryBagSfxActionId,
  number
> = {
  pickup: 0.58,
  /** Quieter reuse of the pickup clip when dropping items to the ground. */
  drop: 0.32,
  /** Quieter reuse of the pickup clip when dragging items between slots. */
  move: 0.28,
};
