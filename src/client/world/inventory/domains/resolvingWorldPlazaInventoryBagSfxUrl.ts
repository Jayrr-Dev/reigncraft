import {
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_PICKUP_ASSET_BASE_URL,
  type DefiningWorldPlazaInventoryBagSfxClipId,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagSfxConstants';

const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_FILE_NAME_BY_CLIP_ID: Record<
  DefiningWorldPlazaInventoryBagSfxClipId,
  string
> = {
  strap_tighten: 'strap-tighten-03.ogg',
};

/**
 * Builds a browser-safe public URL for one inventory bag clip.
 */
export function resolvingWorldPlazaInventoryBagSfxUrl(
  clipId: DefiningWorldPlazaInventoryBagSfxClipId
): string {
  const encodedBaseUrl =
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_PICKUP_ASSET_BASE_URL.split('/')
      .filter((segment) => segment.length > 0)
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_FILE_NAME_BY_CLIP_ID[clipId])}`;
}
