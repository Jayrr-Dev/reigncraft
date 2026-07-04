import type { DefiningWorldPlazaEntityHealthFloatTextKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Maps a damage outcome tier to the matching combat float text kind.
 */
export function mappingWorldPlazaDamageOutcomeTierToFloatTextKind(
  tier: DefiningWorldPlazaDamageOutcomeTier
): DefiningWorldPlazaEntityHealthFloatTextKind {
  if (tier === 'fatal') {
    return 'damage_fatal';
  }

  if (tier === 'lethal') {
    return 'damage_lethal';
  }

  if (tier === 'critical') {
    return 'damage_critical';
  }

  if (tier === 'true_strike') {
    return 'damage_true_strike';
  }

  if (tier === 'softened') {
    return 'damage_softened';
  }

  if (tier === 'blocked') {
    return 'damage_roll_blocked';
  }

  if (tier === 'dodged') {
    return 'damage_dodged';
  }

  return 'damage';
}
