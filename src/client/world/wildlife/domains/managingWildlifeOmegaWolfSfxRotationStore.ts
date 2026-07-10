/**
 * Rotating clip indices for pooled Omega Wolf SFX events.
 *
 * @module components/world/wildlife/domains/managingWildlifeOmegaWolfSfxRotationStore
 */

import type { DefiningWildlifeOmegaWolfSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfSfxConstants';

type DefiningWildlifeOmegaWolfSfxRotationKey = Extract<
  DefiningWildlifeOmegaWolfSfxEventKind,
  'howl' | 'chase_call' | 'territory_warn' | 'hit_taken'
>;

const managingWildlifeOmegaWolfSfxRotationIndices: Record<
  DefiningWildlifeOmegaWolfSfxRotationKey,
  number
> = {
  howl: 0,
  chase_call: 0,
  territory_warn: 0,
  hit_taken: 0,
};

/**
 * Returns the current rotation index for one pooled event kind.
 */
export function gettingWildlifeOmegaWolfSfxRotationIndex(
  eventKind: DefiningWildlifeOmegaWolfSfxRotationKey
): number {
  return managingWildlifeOmegaWolfSfxRotationIndices[eventKind];
}

/**
 * Advances the rotation index after one pooled clip plays.
 */
export function advancingWildlifeOmegaWolfSfxRotationIndex(
  eventKind: DefiningWildlifeOmegaWolfSfxRotationKey,
  poolLength: number
): number {
  const nextIndex =
    (managingWildlifeOmegaWolfSfxRotationIndices[eventKind] + 1) % poolLength;
  managingWildlifeOmegaWolfSfxRotationIndices[eventKind] = nextIndex;
  return nextIndex;
}

/** Resets every rotation counter (used on hook teardown). */
export function resettingWildlifeOmegaWolfSfxRotationIndices(): void {
  managingWildlifeOmegaWolfSfxRotationIndices.howl = 0;
  managingWildlifeOmegaWolfSfxRotationIndices.chase_call = 0;
  managingWildlifeOmegaWolfSfxRotationIndices.territory_warn = 0;
  managingWildlifeOmegaWolfSfxRotationIndices.hit_taken = 0;
}
