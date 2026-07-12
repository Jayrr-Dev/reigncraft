/**
 * Starts fairy soft departure after a player betrayal hit attempt.
 *
 * Immortal fairies take no HP damage, so this stamps flee+despawn even when
 * applied health damage is zero.
 *
 * @module components/world/wildlife/domains/applyingWildlifeFairyBetrayalDeparture
 */

import { checkingWildlifeSpeciesWandersAwayAtDaybreak } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesWandersAwayAtDaybreak';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeFairyDaybreakWanderAwayIntent } from '@/components/world/wildlife/domains/resolvingWildlifeFairyDaybreakWanderAwayIntent';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type ApplyingWildlifeFairyBetrayalDepartureParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  threatPoint: { x: number; y: number; layer?: number };
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  nowMs: number;
};

/**
 * Ends companion follow and locks a flee intent; soft-despawn tick finishes it.
 */
export function applyingWildlifeFairyBetrayalDeparture({
  instance,
  species,
  threatPoint,
  hazardSampling,
  nowMs,
}: ApplyingWildlifeFairyBetrayalDepartureParams): DefiningWildlifeInstance {
  if (!checkingWildlifeSpeciesWandersAwayAtDaybreak(species.speciesId)) {
    return instance;
  }

  const fleeIntent = resolvingWildlifeFairyDaybreakWanderAwayIntent({
    position: instance.position,
    playerPosition: {
      x: threatPoint.x,
      y: threatPoint.y,
      layer: threatPoint.layer ?? instance.position.layer,
    },
    species,
    hazardSampling,
  });

  return {
    ...instance,
    softDepartureStartedAtMs: instance.softDepartureStartedAtMs ?? nowMs,
    softDepartureReason: 'betrayal',
    aiState: {
      ...instance.aiState,
      docileFollowUntilMs: null,
      intent: fleeIntent,
      fleeTargetPoint:
        fleeIntent.mode === 'flee' ? (fleeIntent.targetPoint ?? null) : null,
      lastThinkAtMs: nowMs,
      steeringCache: null,
    },
  };
}
