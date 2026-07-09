/**
 * Aggression demotion, follow cancel, and flee after a player hits docile wildlife.
 *
 * @module components/world/wildlife/domains/applyingWildlifeDocilePlayerHitBehaviorResponse
 */

import { applyingWildlifeDocileAggressionLoss } from '@/components/world/wildlife/domains/applyingWildlifeDocileAggressionLoss';
import { checkingWildlifeSpeciesIsDocile } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsDocile';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeFleeFromThreatPointIntent } from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type ApplyingWildlifeDocilePlayerHitBehaviorResponseParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  threatPoint: { x: number; y: number; layer?: number };
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  nowMs: number;
};

/**
 * Demotes aggression one step, ends follow, and locks a flee intent toward the attacker.
 */
export function applyingWildlifeDocilePlayerHitBehaviorResponse({
  instance,
  species,
  threatPoint,
  hazardSampling,
  nowMs,
}: ApplyingWildlifeDocilePlayerHitBehaviorResponseParams): DefiningWildlifeInstance {
  if (!checkingWildlifeSpeciesIsDocile(species)) {
    return instance;
  }

  const fleeIntent = resolvingWildlifeFleeFromThreatPointIntent({
    position: instance.position,
    threatPoint,
    species,
    hazardSampling,
  });

  return {
    ...instance,
    aggressionLevel: applyingWildlifeDocileAggressionLoss(
      instance.aggressionLevel
    ),
    aiState: {
      ...instance.aiState,
      docileFollowUntilMs: null,
      intent: fleeIntent,
      fleeTargetPoint: fleeIntent.targetPoint ?? null,
      lastThinkAtMs: nowMs,
      steeringCache: null,
    },
  };
}
