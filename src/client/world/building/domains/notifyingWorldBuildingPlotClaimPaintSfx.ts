import {
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_PLACE_SFX_VOLUME_MULTIPLIER,
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_REMOVE_SFX_VOLUME_MULTIPLIER,
} from '@/components/world/building/domains/definingWorldBuildingPlotClaimConstants';
import { playingWorldPlazaInventoryBagSfx } from '@/components/world/inventory/domains/playingWorldPlazaInventoryBagSfx';

/**
 * Plays the inventory item-move clip after a successful claim paint.
 */
export function notifyingWorldBuildingPlotClaimPainted(): void {
  playingWorldPlazaInventoryBagSfx({
    actionId: 'move',
    volumeMultiplier:
      DEFINING_WORLD_BUILDING_PLOT_CLAIM_PLACE_SFX_VOLUME_MULTIPLIER,
  });
}

/**
 * Plays a quieter inventory item-move clip after a successful unclaim.
 */
export function notifyingWorldBuildingPlotClaimRemoved(): void {
  playingWorldPlazaInventoryBagSfx({
    actionId: 'move',
    volumeMultiplier:
      DEFINING_WORLD_BUILDING_PLOT_CLAIM_REMOVE_SFX_VOLUME_MULTIPLIER,
  });
}
