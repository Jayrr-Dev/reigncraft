/**
 * Builds inventory item definitions for all Spritcore drop tiers.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaSpritcoreTierItemDefinitions
 */

import { DEFINING_INVENTORY_UNLIMITED_STACK_SIZE } from '@/components/inventory/domains/definingInventoryStackConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_SPRITCORE_STACK_QUANTITY_DISPLAY } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreConstants';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_DROP_TIER_DEFINITIONS,
  type DefiningWorldPlazaSpritcoreColorCycleId,
  type DefiningWorldPlazaSpritcoreOrbStepId,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreDropTierConstants';
import { resolvingWorldPlazaSpritcoreSpriteSheetIconForOrbStep } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreSpriteSheetConstants';

const DEFINING_WORLD_PLAZA_SPRITCORE_TIER_RARITY_BY_CYCLE_AND_ORB: Readonly<
  Record<
    DefiningWorldPlazaSpritcoreColorCycleId,
    Record<
      DefiningWorldPlazaSpritcoreOrbStepId,
      DefiningWorldPlazaInventoryItemRarity
    >
  >
> = {
  violet: {
    1: 'rare',
    2: 'epic',
    3: 'legendary',
    4: 'godly',
  },
  crimson: {
    1: 'epic',
    2: 'legendary',
    3: 'godly',
    4: 'godly',
  },
  gold: {
    1: 'legendary',
    2: 'godly',
    3: 'godly',
    4: 'godly',
  },
};

/** Item type rows for every Spritcore drop tier across color cycles. */
export function registeringWorldPlazaSpritcoreTierItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_SPRITCORE_DROP_TIER_DEFINITIONS.map(
    (tierDefinition) => ({
      typeId: tierDefinition.itemTypeId,
      name: tierDefinition.displayName,
      rarity:
        DEFINING_WORLD_PLAZA_SPRITCORE_TIER_RARITY_BY_CYCLE_AND_ORB[
          tierDefinition.cycleId
        ][tierDefinition.orbStep],
      iconSpriteSheet: resolvingWorldPlazaSpritcoreSpriteSheetIconForOrbStep(
        tierDefinition.orbStep
      ),
      iconSpriteOverlayColor: tierDefinition.overlayColor ?? undefined,
      maxStack: DEFINING_INVENTORY_UNLIMITED_STACK_SIZE,
      isDroppable: false,
      isStackable: true,
      stackQuantityDisplay:
        DEFINING_WORLD_PLAZA_SPRITCORE_STACK_QUANTITY_DISPLAY,
    })
  );
}
