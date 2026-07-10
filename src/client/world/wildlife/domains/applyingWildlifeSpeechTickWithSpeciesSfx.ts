/**
 * Advances speech state and emits paired species vocal SFX.
 *
 * @module components/world/wildlife/domains/applyingWildlifeSpeechTickWithSpeciesSfx
 */

import { advancingWildlifeSpeechTick } from '@/components/world/wildlife/domains/advancingWildlifeSpeechTick';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpeechState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { notifyingWildlifeSpeciesSfxFromSpeechEmission } from '@/components/world/wildlife/domains/notifyingWildlifeSpeciesSfxFromSimulation';

export type ApplyingWildlifeSpeechTickWithSpeciesSfxParams = {
  instance: DefiningWildlifeInstance;
  nowMs: number;
};

/**
 * Runs the speech tick and notifies species vocals when a bubble emits.
 */
export function applyingWildlifeSpeechTickWithSpeciesSfx({
  instance,
  nowMs,
}: ApplyingWildlifeSpeechTickWithSpeciesSfxParams): DefiningWildlifeSpeechState {
  const previousSpeechState = instance.speechState;
  const nextSpeechState = advancingWildlifeSpeechTick({ instance, nowMs });

  notifyingWildlifeSpeciesSfxFromSpeechEmission({
    instanceId: instance.instanceId,
    speciesId: instance.speciesId,
    worldPoint: instance.position,
    previousSpeechState,
    nextSpeechState,
  });

  return nextSpeechState;
}
