/**
 * Pure checks for whether terrain layers may run given generation feature flags.
 *
 * @module components/world/domains/checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled
 */

import type { DefiningWorldPlazaGenerationFeatureId } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';

/**
 * Returns true when no feature gate is declared, or at least one required
 * generation feature is currently enabled.
 *
 * @param requiredFeatureIds - Feature ids that may unlock the layer.
 */
export function checkingWorldPlazaTerrainLayerGenerationFeaturesEnabled(
  requiredFeatureIds:
    | readonly DefiningWorldPlazaGenerationFeatureId[]
    | undefined
): boolean {
  if (!requiredFeatureIds || requiredFeatureIds.length === 0) {
    return true;
  }

  for (const featureId of requiredFeatureIds) {
    if (checkingWorldPlazaGenerationFeatureEnabled(featureId)) {
      return true;
    }
  }

  return false;
}
