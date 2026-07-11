import {
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_DROP_ASSET_BASE_URL,
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_PICKUP_ASSET_BASE_URL,
  type DefiningWorldPlazaInventoryBagSfxClipId,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagSfxConstants';

const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_FILE_NAME_BY_CLIP_ID: Record<
  DefiningWorldPlazaInventoryBagSfxClipId,
  string
> = {
  strap_tighten: 'strap-tighten-03.ogg',
  item_equip: 'item-equip.ogg',
};

const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_ASSET_BASE_URL_BY_CLIP_ID: Record<
  DefiningWorldPlazaInventoryBagSfxClipId,
  string
> = {
  strap_tighten: DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_PICKUP_ASSET_BASE_URL,
  item_equip: DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_DROP_ASSET_BASE_URL,
};

/**
 * Builds a browser-safe public URL for one inventory pickup/drop clip.
 */
export function resolvingWorldPlazaInventoryBagSfxUrl(
  clipId: DefiningWorldPlazaInventoryBagSfxClipId
): string {
  const encodedBaseUrl =
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_ASSET_BASE_URL_BY_CLIP_ID[clipId]
      .split('/')
      .filter((segment) => segment.length > 0)
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_FILE_NAME_BY_CLIP_ID[clipId])}`;
}
