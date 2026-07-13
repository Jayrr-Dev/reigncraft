/**
 * Smooths the continuous danger-sense sample ring toward fresh targets.
 *
 * @module components/world/domains/advancingWorldPlazaDangerSenseHudSampleIntensities
 */

import {
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_FALL_MS,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_RISE_MS,
} from '@/components/world/domains/definingWorldPlazaDangerSenseHudConstants';

/**
 * Exponential approach with asymmetric rise/fall. Mutates `previous` in place
 * and returns it for chaining.
 */
export function advancingWorldPlazaDangerSenseHudSampleIntensities(
  previous: Float32Array,
  target: Float32Array,
  deltaMs: number
): Float32Array {
  const safeDeltaMs = Math.max(0, deltaMs);
  const sampleCount = Math.min(previous.length, target.length);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const from = previous[sampleIndex] ?? 0;
    const to = target[sampleIndex] ?? 0;
    const blendMs =
      to > from
        ? DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_RISE_MS
        : DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_FALL_MS;
    const alpha = 1 - Math.exp(-safeDeltaMs / Math.max(1, blendMs));
    previous[sampleIndex] = from + (to - from) * alpha;
  }

  return previous;
}
