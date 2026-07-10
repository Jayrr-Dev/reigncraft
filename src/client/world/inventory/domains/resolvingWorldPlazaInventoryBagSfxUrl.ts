import {
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_ASSET_BASE_URL,
  type DefiningWorldPlazaInventoryBagSfxClipId,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagSfxConstants';

const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_FILE_NAME_BY_CLIP_ID: Record<
  DefiningWorldPlazaInventoryBagSfxClipId,
  string
> = {
  item_equip: 'item-equip.wav',
};

/**
 * Builds a browser-safe public URL for one inventory item clip.
 */
export function resolvingWorldPlazaInventoryBagSfxUrl(
  clipId: DefiningWorldPlazaInventoryBagSfxClipId
): string {
  const encodedBaseUrl =
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_ASSET_BASE_URL.split('/')
      .filter((segment) => segment.length > 0)
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_FILE_NAME_BY_CLIP_ID[clipId])}`;
}
