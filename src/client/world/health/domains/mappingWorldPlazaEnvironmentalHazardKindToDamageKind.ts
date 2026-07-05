import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEnvironmentalHazardKind } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';

/**
 * Maps a resolved environmental hazard kind to its damage source category.
 */
export function mappingWorldPlazaEnvironmentalHazardKindToDamageKind(
  kind: DefiningWorldPlazaEnvironmentalHazardKind
): DefiningWorldPlazaEntityDamageKind {
  if (kind === 'lava') {
    return 'environmental_lava';
  }

  if (kind === 'heat') {
    return 'environmental_heat';
  }

  return 'environmental_cold';
}
