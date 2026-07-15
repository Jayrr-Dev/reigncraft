/**
 * Resolves Spritcore stack visuals (sprite cell + overlay + name) from quantity.
 *
 * @module components/world/spritcore/domains/resolvingWorldPlazaSpritcoreStackPresentation
 */

import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_DROP_TIER_DEFINITIONS,
  type DefiningWorldPlazaSpritcoreColorCycleId,
  type DefiningWorldPlazaSpritcoreDropTierDefinition,
  type DefiningWorldPlazaSpritcoreOrbStepId,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreDropTierConstants';
import { resolvingWorldPlazaSpritcoreSpriteSheetIconForOrbStep } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreSpriteSheetConstants';
import { resolvingWorldPlazaSpritcoreDropTierDefinition } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreDropTier';

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

export type ResolvingWorldPlazaSpritcoreStackPresentation = {
  readonly displayName: string;
  readonly rarity: DefiningWorldPlazaInventoryItemRarity;
  readonly iconSpriteSheet: DefiningWorldPlazaInventorySpriteSheetIcon;
  readonly overlayColor: string | null;
  readonly tier: DefiningWorldPlazaSpritcoreDropTierDefinition;
};

function buildingWorldPlazaSpritcoreStackPresentation(
  tierDefinition: DefiningWorldPlazaSpritcoreDropTierDefinition
): ResolvingWorldPlazaSpritcoreStackPresentation {
  return {
    displayName: tierDefinition.displayName,
    rarity:
      DEFINING_WORLD_PLAZA_SPRITCORE_TIER_RARITY_BY_CYCLE_AND_ORB[
        tierDefinition.cycleId
      ][tierDefinition.orbStep],
    iconSpriteSheet: resolvingWorldPlazaSpritcoreSpriteSheetIconForOrbStep(
      tierDefinition.orbStep
    ),
    overlayColor: tierDefinition.overlayColor,
    tier: tierDefinition,
  };
}

/** Stack visuals for a Spritcore quantity (shared pool, quantity-banded art). */
export function resolvingWorldPlazaSpritcoreStackPresentation(
  quantity: number
): ResolvingWorldPlazaSpritcoreStackPresentation {
  return buildingWorldPlazaSpritcoreStackPresentation(
    resolvingWorldPlazaSpritcoreDropTierDefinition(quantity)
  );
}

/** Stack visuals for a legacy per-tier item type id, if known. */
export function resolvingWorldPlazaSpritcoreStackPresentationForLegacyItemTypeId(
  itemTypeId: string
): ResolvingWorldPlazaSpritcoreStackPresentation | null {
  const tierDefinition =
    DEFINING_WORLD_PLAZA_SPRITCORE_DROP_TIER_DEFINITIONS.find(
      (entry) => entry.legacyItemTypeId === itemTypeId
    );

  if (!tierDefinition) {
    return null;
  }

  return buildingWorldPlazaSpritcoreStackPresentation(tierDefinition);
}
