/**
 * Gates player damage on docile wildlife. Docile stock cannot be hurt.
 *
 * @module components/world/wildlife/domains/gatingWildlifeDocileAttackDamage
 */

import { checkingWildlifeSpeciesIsDocile } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsDocile';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type GatingWildlifeDocileAttackDamageParams = {
  store: ManagingWildlifeInstanceStore;
  instanceId: string;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

export type GatingWildlifeDocileAttackDamageResult =
  | { allowed: true }
  | { allowed: false };

/**
 * Allows damage when the target is missing, dead, or non-docile.
 * Living docile animals always block player damage.
 */
export function gatingWildlifeDocileAttackDamage({
  store,
  instanceId,
  resolveSpecies,
}: GatingWildlifeDocileAttackDamageParams): GatingWildlifeDocileAttackDamageResult {
  const instance = gettingWildlifeInstance(store, instanceId);

  if (!instance || instance.isDead) {
    return { allowed: true };
  }

  const species = resolveSpecies(instance.speciesId);

  if (!checkingWildlifeSpeciesIsDocile(species)) {
    return { allowed: true };
  }

  return { allowed: false };
}
