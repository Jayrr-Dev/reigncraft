import type { DefiningWorldPlazaInventoryBagSfxClipId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagSfxConstants';

/** Prefix for NOX backpack ids inside the star-audio manifest. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_STAR_AUDIO_ID_PREFIX =
  'inventory-bag' as const;

/**
 * Stable star-audio manifest key for one NOX backpack clip.
 */
export function resolvingWorldPlazaInventoryBagSfxStarAudioId(
  clipId: DefiningWorldPlazaInventoryBagSfxClipId
): string {
  return `${DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_STAR_AUDIO_ID_PREFIX}.${clipId}`;
}
