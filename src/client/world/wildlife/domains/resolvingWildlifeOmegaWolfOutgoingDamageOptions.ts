/**
 * Omega Wolf melee EV options: lean damage rolls toward critical.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeOmegaWolfOutgoingDamageOptions
 */

import type { DefiningWorldPlazaEntityHealthDamageOptions } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  DEFINING_WILDLIFE_OMEGA_WOLF_OUTGOING_CRITICAL_BIAS,
  DEFINING_WILDLIFE_OMEGA_WOLF_OUTGOING_CRITICAL_BIAS_MODIFIER_ID,
  checkingWildlifeOmegaWolfSpecies,
} from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';

/**
 * Returns attacker damage-roll options when the attacker is an Omega Wolf.
 */
export function resolvingWildlifeOmegaWolfOutgoingDamageOptions(
  speciesId: string
): Pick<
  DefiningWorldPlazaEntityHealthDamageOptions,
  'skipDamageRoll' | 'attackerDamageRollModifiers'
> | null {
  if (!checkingWildlifeOmegaWolfSpecies(speciesId)) {
    return null;
  }

  return {
    skipDamageRoll: false,
    attackerDamageRollModifiers: [
      {
        id: DEFINING_WILDLIFE_OMEGA_WOLF_OUTGOING_CRITICAL_BIAS_MODIFIER_ID,
        kind: 'critical_bias',
        value: DEFINING_WILDLIFE_OMEGA_WOLF_OUTGOING_CRITICAL_BIAS,
        expiresAtMs: null,
      },
    ],
  };
}
