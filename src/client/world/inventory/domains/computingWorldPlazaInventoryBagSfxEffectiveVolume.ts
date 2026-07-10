import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_TARGET_VOLUME_BY_ACTION,
  type DefiningWorldPlazaInventoryBagSfxActionId,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagSfxConstants';

/**
 * Resolves bag pickup/drop volume after applying the SFX volume slider.
 */
export function computingWorldPlazaInventoryBagSfxEffectiveVolume(
  actionId: DefiningWorldPlazaInventoryBagSfxActionId
): number {
  return (
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_TARGET_VOLUME_BY_ACTION[actionId] *
    gettingWorldPlazaSfxVolume()
  );
}
