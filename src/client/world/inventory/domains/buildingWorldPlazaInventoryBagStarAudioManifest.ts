import {
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_CLIP_ID_BY_ACTION,
  type DefiningWorldPlazaInventoryBagSfxClipId,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagSfxConstants';
import { resolvingWorldPlazaInventoryBagSfxStarAudioId } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagSfxStarAudioId';
import { resolvingWorldPlazaInventoryBagSfxUrl } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagSfxUrl';
import type { Manifest } from 'star-audio';

/**
 * Builds the star-audio preload manifest for inventory pickup/drop clips.
 */
export function buildingWorldPlazaInventoryBagStarAudioManifest(): Manifest {
  const manifest: Manifest = {};
  const uniqueClipIds = new Set<DefiningWorldPlazaInventoryBagSfxClipId>(
    Object.values(DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_CLIP_ID_BY_ACTION)
  );

  for (const clipId of uniqueClipIds) {
    manifest[resolvingWorldPlazaInventoryBagSfxStarAudioId(clipId)] = {
      src: resolvingWorldPlazaInventoryBagSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
