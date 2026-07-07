import {
  DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_TIER_ORDER,
  type DefiningWorldPlazaPlayerStaminaFatigueTier,
} from '@/components/world/domains/definingWorldPlazaPlayerStaminaFatigueConstants';

/**
 * Returns the next fatigue tier after a full stamina depletion, capped at collapsed.
 */
export function advancingWorldPlazaPlayerStaminaFatigueTier(
  currentTier: DefiningWorldPlazaPlayerStaminaFatigueTier
): DefiningWorldPlazaPlayerStaminaFatigueTier {
  const currentIndex =
    DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_TIER_ORDER.indexOf(currentTier);
  const nextIndex = Math.min(
    currentIndex + 1,
    DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_TIER_ORDER.length - 1
  );

  return DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_TIER_ORDER[nextIndex];
}
