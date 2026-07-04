import { mappingWorldPlazaDamageOutcomeTierToFloatTextKindFromRegistry } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import type { DefiningWorldPlazaEntityHealthFloatTextKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Maps a damage outcome tier to the matching combat float text kind.
 */
export function mappingWorldPlazaDamageOutcomeTierToFloatTextKind(
  tier: DefiningWorldPlazaDamageOutcomeTier
): DefiningWorldPlazaEntityHealthFloatTextKind {
  return mappingWorldPlazaDamageOutcomeTierToFloatTextKindFromRegistry(tier);
}
