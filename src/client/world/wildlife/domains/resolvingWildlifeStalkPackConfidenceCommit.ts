/**
 * Pack-size confidence chance and seeded commit rolls after the shadow phase.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPackConfidenceCommit
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_STALK_CONFIDENCE_COMMIT_BUCKET_MS,
  DEFINING_WILDLIFE_STALK_CONFIDENCE_COMMIT_CHANCE_BY_PACK_COUNT,
  DEFINING_WILDLIFE_STALK_CONFIDENCE_COMMIT_SALT,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

/**
 * Commit chance for a pack of this size after the opening shadow.
 * Larger packs are braver; 5+ sits at the high end of the table.
 */
export function resolvingWildlifeStalkPackConfidenceCommitChance(
  stalkPackCount: number
): number {
  const chances =
    DEFINING_WILDLIFE_STALK_CONFIDENCE_COMMIT_CHANCE_BY_PACK_COUNT;
  const index = Math.min(
    chances.length - 1,
    Math.max(0, Math.floor(stalkPackCount) - 1)
  );

  return chances[index] ?? 0;
}

function hashingWildlifeStalkConfidencePreySalt(preyTargetId: string): number {
  let hash = 0;

  for (let index = 0; index < preyTargetId.length; index += 1) {
    hash = (hash * 31 + preyTargetId.charCodeAt(index)) | 0;
  }

  return Math.abs(hash);
}

export type CheckingWildlifeStalkConfidenceCommitParams = {
  stalkPackCount: number;
  preyTargetId: string;
  stalkingPreySinceMs: number;
  nowMs: number;
};

/**
 * Seeded roll shared by the whole pack: after the shadow phase, may they
 * commit without a prey-weakness trigger?
 */
export function checkingWildlifeStalkConfidenceCommit({
  stalkPackCount,
  preyTargetId,
  stalkingPreySinceMs,
  nowMs,
}: CheckingWildlifeStalkConfidenceCommitParams): boolean {
  const chance =
    resolvingWildlifeStalkPackConfidenceCommitChance(stalkPackCount);

  if (chance <= 0) {
    return false;
  }

  if (chance >= 1) {
    return true;
  }

  const timeBucket = Math.floor(
    Math.max(0, nowMs - stalkingPreySinceMs) /
      DEFINING_WILDLIFE_STALK_CONFIDENCE_COMMIT_BUCKET_MS
  );
  const preySalt = hashingWildlifeStalkConfidencePreySalt(preyTargetId);
  const roll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    preySalt % 10_000,
    Math.floor(stalkingPreySinceMs / 1_000) % 10_000,
    DEFINING_WILDLIFE_STALK_CONFIDENCE_COMMIT_SALT +
      timeBucket * 7 +
      stalkPackCount
  );

  return roll < chance;
}
