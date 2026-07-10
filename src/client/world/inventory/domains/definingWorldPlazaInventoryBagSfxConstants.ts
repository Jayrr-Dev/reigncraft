/**
 * Inventory pickup and drop SFX for plaza world items.
 *
 * Pickup uses FilmCow Recorded (`public/sfx/filmcow-recorded/`).
 * Drop uses 400 Sounds item equip (`public/sfx/400-sounds-items/`).
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBagSfxConstants
 */

/** Public URL prefix for shipped 400 Sounds drop clips. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_DROP_ASSET_BASE_URL =
  '/sfx/400-sounds-items' as const;

/** Public URL prefix for shipped FilmCow pickup clips. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_PICKUP_ASSET_BASE_URL =
  '/sfx/filmcow-recorded' as const;

/** Inventory interaction that plays a clip. */
export type DefiningWorldPlazaInventoryBagSfxActionId = 'pickup' | 'drop';

/** Stable ids for every bundled inventory clip. */
export type DefiningWorldPlazaInventoryBagSfxClipId =
  | 'strap_tighten'
  | 'item_equip';

/** Maps each inventory interaction to its shipped clip id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_CLIP_ID_BY_ACTION: Record<
  DefiningWorldPlazaInventoryBagSfxActionId,
  DefiningWorldPlazaInventoryBagSfxClipId
> = {
  pickup: 'strap_tighten',
  drop: 'item_equip',
};

/** Base one-shot volume before the SFX volume slider is applied. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_TARGET_VOLUME_BY_ACTION: Record<
  DefiningWorldPlazaInventoryBagSfxActionId,
  number
> = {
  pickup: 0.58,
  drop: 0.55,
};
