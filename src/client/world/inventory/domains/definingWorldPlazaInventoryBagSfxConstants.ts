/**
 * 400 Sounds Pack item equip SFX for plaza inventory pickup and drop.
 *
 * Assets live under `public/sfx/400-sounds-items/`.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBagSfxConstants
 */

/** Public URL prefix for shipped 400 Sounds item clips. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_ASSET_BASE_URL =
  '/sfx/400-sounds-items' as const;

/** Inventory interaction that plays the equip clip. */
export type DefiningWorldPlazaInventoryBagSfxActionId = 'pickup' | 'drop';

/** Stable ids for every bundled inventory item clip. */
export type DefiningWorldPlazaInventoryBagSfxClipId = 'item_equip';

/** Maps each inventory interaction to its shipped clip id. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_CLIP_ID_BY_ACTION: Record<
  DefiningWorldPlazaInventoryBagSfxActionId,
  DefiningWorldPlazaInventoryBagSfxClipId
> = {
  pickup: 'item_equip',
  drop: 'item_equip',
};

/** Base one-shot volume before the SFX volume slider is applied. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_TARGET_VOLUME_BY_ACTION: Record<
  DefiningWorldPlazaInventoryBagSfxActionId,
  number
> = {
  pickup: 0.55,
  drop: 0.55,
};
