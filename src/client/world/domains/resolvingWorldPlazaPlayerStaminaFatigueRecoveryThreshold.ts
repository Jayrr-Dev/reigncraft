import {
  DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_TIER_CONFIG,
  type DefiningWorldPlazaPlayerStaminaFatigueTier,
} from '@/components/world/domains/definingWorldPlazaPlayerStaminaFatigueConstants';

/**
 * How much the bar must refill after a full empty before stamina actions unlock.
 */
export function resolvingWorldPlazaPlayerStaminaFatigueUseUnlockRatio(
  fatigueTier: DefiningWorldPlazaPlayerStaminaFatigueTier
): number {
  return DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_TIER_CONFIG[fatigueTier]
    .useUnlockRatio;
}
