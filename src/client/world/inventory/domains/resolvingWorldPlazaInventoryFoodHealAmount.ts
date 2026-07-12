/**
 * Resolves HP healed when eating one food item from stamped heal + size.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealAmount
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_APEX_FRAME_MULTIPLIER,
  DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_OBESE_FRAME_MULTIPLIER,
  DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_SIZE_TIER_MULTIPLIER,
  type DefiningWorldPlazaInventoryFoodHealDeclaration,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryFoodHealConstants';
import type { DefiningWildlifeLargeSizeFrame } from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import {
  DEFINING_WILDLIFE_MEAT_LARGE_SIZE_FRAME_METADATA_KEY,
  DEFINING_WILDLIFE_MEAT_SIZE_TIER_METADATA_KEY,
} from '@/components/world/wildlife/domains/definingWildlifeMeatSizeMetadataConstants';
import type { DefiningWildlifeSizeTier } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';

function resolvingFoodHealSizeTierFromMetadata(
  foodItemMetadata: Readonly<Record<string, unknown>> | undefined
): DefiningWildlifeSizeTier {
  const rawTier =
    foodItemMetadata?.[DEFINING_WILDLIFE_MEAT_SIZE_TIER_METADATA_KEY];

  if (
    typeof rawTier === 'number' &&
    Number.isFinite(rawTier) &&
    rawTier >= -2 &&
    rawTier <= 3
  ) {
    return Math.round(rawTier) as DefiningWildlifeSizeTier;
  }

  return 0;
}

function resolvingFoodHealLargeSizeFrameFromMetadata(
  foodItemMetadata: Readonly<Record<string, unknown>> | undefined
): DefiningWildlifeLargeSizeFrame | null {
  const rawFrame =
    foodItemMetadata?.[DEFINING_WILDLIFE_MEAT_LARGE_SIZE_FRAME_METADATA_KEY];

  if (rawFrame === 'obese' || rawFrame === 'apex') {
    return rawFrame;
  }

  return null;
}

function resolvingFoodHealFrameMultiplier(
  largeSizeFrame: DefiningWildlifeLargeSizeFrame | null
): number {
  if (largeSizeFrame === 'obese') {
    return DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_OBESE_FRAME_MULTIPLIER;
  }

  if (largeSizeFrame === 'apex') {
    return DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_APEX_FRAME_MULTIPLIER;
  }

  return 1;
}

export type ResolvingWorldPlazaInventoryFoodHealAmountParams = {
  readonly healthHeal: DefiningWorldPlazaInventoryFoodHealDeclaration;
  readonly effectiveMaxHealth: number;
  readonly foodItemMetadata?: Readonly<Record<string, unknown>>;
};

/**
 * Uses stamped flat + % of the eater's effective max, then kill size multipliers.
 */
export function resolvingWorldPlazaInventoryFoodHealAmount({
  healthHeal,
  effectiveMaxHealth,
  foodItemMetadata,
}: ResolvingWorldPlazaInventoryFoodHealAmountParams): number {
  if (
    effectiveMaxHealth <= 0 ||
    (healthHeal.baseFlat <= 0 && healthHeal.percentOfMax <= 0)
  ) {
    return 0;
  }

  const sizeTier = resolvingFoodHealSizeTierFromMetadata(foodItemMetadata);
  const largeSizeFrame =
    resolvingFoodHealLargeSizeFrameFromMetadata(foodItemMetadata);
  const baseline =
    healthHeal.baseFlat + effectiveMaxHealth * healthHeal.percentOfMax;
  const scaled =
    baseline *
    DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_SIZE_TIER_MULTIPLIER[sizeTier] *
    resolvingFoodHealFrameMultiplier(largeSizeFrame);

  return Math.max(0, Math.round(scaled));
}
