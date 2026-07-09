/**
 * Gates player damage on unauthorized docile wildlife until Attack? confirm.
 *
 * @module components/world/wildlife/domains/gatingWildlifeDocileAttackDamage
 */

import { checkingWildlifeSpeciesIsDocile } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsDocile';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { checkingWildlifeDocileAttackIsAuthorized } from '@/components/world/wildlife/domains/managingWildlifeDocileAttackAuthorizationStore';
import type { ManagingWildlifeDocileAttackConfirmPending } from '@/components/world/wildlife/domains/managingWildlifeDocileAttackConfirmStore';
import {
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type GatingWildlifeDocileAttackDamageParams = {
  store: ManagingWildlifeInstanceStore;
  instanceId: string;
  damageAmount: number;
  projectileArchetypeId?: string;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

export type GatingWildlifeDocileAttackDamageResult =
  | { allowed: true }
  | { allowed: false; pending: ManagingWildlifeDocileAttackConfirmPending };

/**
 * Allows damage when the target is missing, non-docile, or already authorized.
 * Otherwise returns a pending Attack? payload (no damage yet).
 */
export function gatingWildlifeDocileAttackDamage({
  store,
  instanceId,
  damageAmount,
  projectileArchetypeId,
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

  if (checkingWildlifeDocileAttackIsAuthorized(instanceId)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    pending: {
      instanceId,
      displayName: species?.displayName ?? 'animal',
      damageAmount,
      ...(projectileArchetypeId ? { projectileArchetypeId } : {}),
    },
  };
}
