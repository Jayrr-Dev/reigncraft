import {
  DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_THRESHOLDS,
  type DefiningFilmcowFootstepWildlifeSizeTier,
} from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';

/**
 * Maps one visual size multiplier to a wildlife footstep tier.
 */
export function resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier(
  visualSizeMultiplier: number
): DefiningFilmcowFootstepWildlifeSizeTier {
  for (const threshold of DEFINING_FILMCOW_FOOTSTEP_WILDLIFE_SIZE_TIER_THRESHOLDS) {
    if (visualSizeMultiplier >= threshold.minVisualSizeMultiplier) {
      return threshold.tier;
    }
  }

  return 'tiny';
}
