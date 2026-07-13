import {
  DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_ORDER,
  type DefiningWildlifeStaminaFatigueTier,
} from '@/components/world/wildlife/domains/definingWildlifeStaminaFatigueConstants';

/**
 * Returns the next fatigue tier after a full stamina depletion, capped at spent.
 */
export function advancingWildlifeStaminaFatigueTier(
  currentTier: DefiningWildlifeStaminaFatigueTier
): DefiningWildlifeStaminaFatigueTier {
  const currentIndex =
    DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_ORDER.indexOf(currentTier);
  const nextIndex = Math.min(
    currentIndex + 1,
    DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_ORDER.length - 1
  );

  return DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_ORDER[nextIndex];
}
