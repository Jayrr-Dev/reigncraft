/**
 * Whether a deer kill should tag its meat with hidden cooked-disease risk.
 *
 * @module components/world/wildlife/domains/checkingWildlifeInstanceQualifiesAsAggroDeerKill
 */

import { checkingWildlifePlayerRevengeAggroIsActive } from '@/components/world/wildlife/domains/checkingWildlifePlayerRevengeAggroIsActive';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type CheckingWildlifeInstanceQualifiesAsAggroDeerKillParams = {
  readonly instance: Pick<
    DefiningWildlifeInstance,
    'speciesId' | 'aggressionLevel' | 'aggroState'
  >;
  readonly species: DefiningWildlifeSpeciesDefinition;
  readonly killerTargetId: string;
  readonly playerUserId: string | null;
  readonly nowMs: number;
};

/** True when the local player killed a deer that was actively hostile. */
export function checkingWildlifeInstanceQualifiesAsAggroDeerKill({
  instance,
  species,
  killerTargetId,
  playerUserId,
  nowMs,
}: CheckingWildlifeInstanceQualifiesAsAggroDeerKillParams): boolean {
  if (instance.speciesId !== 'deer' || !playerUserId) {
    return false;
  }

  if (killerTargetId !== playerUserId) {
    return false;
  }

  if (
    instance.aggressionLevel === 'aggressive' &&
    species.diet === 'herbivore' &&
    instance.aggroState.activeTargetId !== null
  ) {
    return true;
  }

  if (instance.aggroState.activeTargetId !== playerUserId) {
    return false;
  }

  return checkingWildlifePlayerRevengeAggroIsActive({
    aggroState: instance.aggroState,
    playerUserId,
    nowMs,
  });
}
