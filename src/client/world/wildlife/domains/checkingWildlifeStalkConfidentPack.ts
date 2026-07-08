/**
 * Confident-pack predicates: 5+ hunters skip weakness triggers and assault
 * after a shared formation phase.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkConfidentPack
 */

import {
  DEFINING_WILDLIFE_STALK_CONFIDENT_FORMATION_MIN_MS,
  DEFINING_WILDLIFE_STALK_CONFIDENT_FORMATION_SPAN_MS,
  DEFINING_WILDLIFE_STALK_CONFIDENT_PACK_MIN_COUNT,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

/** True once enough hunters target the same prey to attack without weakness. */
export function checkingWildlifeStalkPackIsConfident(
  stalkPackCount: number
): boolean {
  return stalkPackCount >= DEFINING_WILDLIFE_STALK_CONFIDENT_PACK_MIN_COUNT;
}

function hashingWildlifeStalkPreySeedUnit(preyTargetId: string): number {
  let hash = 0;

  for (let index = 0; index < preyTargetId.length; index += 1) {
    hash = (hash * 31 + preyTargetId.charCodeAt(index)) >>> 0;
  }

  return (hash % 1000) / 1000;
}

/**
 * Formation phase length for one hunt (10-15s), seeded from the prey id so
 * every packmate shares the same countdown.
 */
export function resolvingWildlifeStalkConfidentFormationDurationMs(
  preyTargetId: string
): number {
  return (
    DEFINING_WILDLIFE_STALK_CONFIDENT_FORMATION_MIN_MS +
    Math.round(
      hashingWildlifeStalkPreySeedUnit(preyTargetId) *
        DEFINING_WILDLIFE_STALK_CONFIDENT_FORMATION_SPAN_MS
    )
  );
}

export type CheckingWildlifeStalkConfidentAssaultReadyParams = {
  stalkConfidentSinceMs: number | null | undefined;
  preyTargetId: string;
  nowMs: number;
};

/** True once the confident formation phase has fully elapsed. */
export function checkingWildlifeStalkConfidentAssaultReady({
  stalkConfidentSinceMs,
  preyTargetId,
  nowMs,
}: CheckingWildlifeStalkConfidentAssaultReadyParams): boolean {
  if (stalkConfidentSinceMs === null || stalkConfidentSinceMs === undefined) {
    return false;
  }

  return (
    nowMs - stalkConfidentSinceMs >=
    resolvingWildlifeStalkConfidentFormationDurationMs(preyTargetId)
  );
}
