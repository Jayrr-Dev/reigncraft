/**
 * Resolves playable jump duration from the shared girl-sample baseline.
 *
 * @module components/world/domains/resolvingWorldPlazaJumpDurationMs
 */

import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS } from '@/components/world/domains/definingWorldPlazaGirlSampleJumpConstants';

/**
 * Returns jump duration in ms for one character's jump speed scale.
 * Scale 1 = girl-sample timing; higher = faster travel over the same distance.
 */
export function resolvingWorldPlazaJumpDurationMs(
  jumpSpeedScale: number
): number {
  return (
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS /
    Math.max(0.25, jumpSpeedScale)
  );
}
