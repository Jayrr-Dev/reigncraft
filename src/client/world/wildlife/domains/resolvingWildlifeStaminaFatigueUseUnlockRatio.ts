import {
  DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_CONFIG,
  type DefiningWildlifeStaminaFatigueTier,
} from '@/components/world/wildlife/domains/definingWildlifeStaminaFatigueConstants';

/**
 * Absolute stamina ratio required to leave exhaustion for the current fatigue tier.
 */
export function resolvingWildlifeStaminaFatigueUseUnlockRatio(
  fatigueTier: DefiningWildlifeStaminaFatigueTier,
  maxStaminaRatio = 1
): number {
  return (
    DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_CONFIG[fatigueTier].useUnlockRatio *
    maxStaminaRatio
  );
}
