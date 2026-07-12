/**
 * Rotating clip indices for pooled girl voice SFX events.
 *
 * @module components/world/domains/managingWorldPlazaGirlSampleVoiceSfxRotationStore
 */

import type { DefiningWorldPlazaGirlSampleVoiceSfxEventKind } from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';

const managingWorldPlazaGirlSampleVoiceSfxRotationIndices: Record<
  DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
  number
> = {
  attack_swing: 0,
  jump_takeoff: 0,
  roll_dodge: 0,
  hit_taken: 0,
  pain: 0,
};

/**
 * Returns the current rotation index for one pooled girl voice event.
 */
export function gettingWorldPlazaGirlSampleVoiceSfxRotationIndex(
  eventKind: DefiningWorldPlazaGirlSampleVoiceSfxEventKind
): number {
  return managingWorldPlazaGirlSampleVoiceSfxRotationIndices[eventKind];
}

/**
 * Advances the rotation index after one pooled clip plays.
 */
export function advancingWorldPlazaGirlSampleVoiceSfxRotationIndex(
  eventKind: DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
  poolLength: number
): number {
  const nextIndex =
    (managingWorldPlazaGirlSampleVoiceSfxRotationIndices[eventKind] + 1) %
    poolLength;
  managingWorldPlazaGirlSampleVoiceSfxRotationIndices[eventKind] = nextIndex;
  return nextIndex;
}

/** Resets every rotation counter (used on hook teardown). */
export function resettingWorldPlazaGirlSampleVoiceSfxRotationIndices(): void {
  managingWorldPlazaGirlSampleVoiceSfxRotationIndices.attack_swing = 0;
  managingWorldPlazaGirlSampleVoiceSfxRotationIndices.jump_takeoff = 0;
  managingWorldPlazaGirlSampleVoiceSfxRotationIndices.roll_dodge = 0;
  managingWorldPlazaGirlSampleVoiceSfxRotationIndices.hit_taken = 0;
  managingWorldPlazaGirlSampleVoiceSfxRotationIndices.pain = 0;
}
