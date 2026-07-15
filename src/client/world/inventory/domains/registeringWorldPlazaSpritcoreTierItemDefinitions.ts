/**
 * Builds inventory item definitions for legacy Spritcore drop tiers.
 * New drops use the shared pool; these rows keep old saves / ground loot valid.
 *
 * @module components/world/inventory/domains/registeringWorldPlazaSpritcoreTierItemDefinitions
 */

import { DEFINING_INVENTORY_UNLIMITED_STACK_SIZE } from '@/components/inventory/domains/definingInventoryStackConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_SPRITCORE_STACK_QUANTITY_DISPLAY } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreConstants';
import { DEFINING_WORLD_PLAZA_SPRITCORE_DROP_TIER_DEFINITIONS } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreDropTierConstants';
import { resolvingWorldPlazaSpritcoreSpriteSheetIconForOrbStep } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreSpriteSheetConstants';
import { resolvingWorldPlazaSpritcoreStackPresentation } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreStackPresentation';

/** Item type rows for legacy Spritcore tier ids (migrated on inventory load). */
export function registeringWorldPlazaSpritcoreTierItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_SPRITCORE_DROP_TIER_DEFINITIONS.map(
    (tierDefinition) => {
      const presentation = resolvingWorldPlazaSpritcoreStackPresentation(
        tierDefinition.minDropAmountInclusive
      );

      return {
        typeId: tierDefinition.legacyItemTypeId,
        name: tierDefinition.displayName,
        rarity: presentation.rarity,
        iconSpriteSheet: resolvingWorldPlazaSpritcoreSpriteSheetIconForOrbStep(
          tierDefinition.orbStep
        ),
        iconSpriteOverlayColor: tierDefinition.overlayColor ?? undefined,
        maxStack: DEFINING_INVENTORY_UNLIMITED_STACK_SIZE,
        isDroppable: true,
        isStackable: true,
        stackQuantityDisplay:
          DEFINING_WORLD_PLAZA_SPRITCORE_STACK_QUANTITY_DISPLAY,
      };
    }
  );
}
