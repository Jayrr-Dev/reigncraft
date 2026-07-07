import {
  DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_TIER_CONFIG,
  type DefiningWorldPlazaPlayerStaminaFatigueTier,
} from '@/components/world/domains/definingWorldPlazaPlayerStaminaFatigueConstants';

/**
 * Fatigue-tier multiplier on passive stamina regeneration (collapsed is 50% speed).
 */
export function resolvingWorldPlazaPlayerStaminaFatigueRegenMultiplier(
  fatigueTier: DefiningWorldPlazaPlayerStaminaFatigueTier
): number {
  return DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_TIER_CONFIG[fatigueTier]
    .regenMultiplier;
}
