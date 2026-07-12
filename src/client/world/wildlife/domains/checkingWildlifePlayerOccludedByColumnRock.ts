/**
 * Whether a mega-boulder blocks wildlife sight to the player.
 *
 * @module components/world/wildlife/domains/checkingWildlifePlayerOccludedByColumnRock
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import {
  checkingWorldPlazaColumnRockBaseDiamondContainsGridPoint,
  resolvingWorldPlazaColumnRockBaseDiamondFromMetadata,
  type DefiningWorldPlazaColumnRockBaseDiamond,
} from '@/components/world/domains/resolvingWorldPlazaColumnRockBaseDiamondFromMetadata';
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex';
import { DEFINING_WILDLIFE_BOULDER_COVER_SIGHT_SAMPLE_STEP_GRID } from '@/components/world/wildlife/domains/definingWildlifeBoulderCoverConstants';

export type CheckingWildlifeSightLineOccludedByDiamondsParams = {
  observerPosition: DefiningWorldPlazaWorldPoint;
  targetPosition: DefiningWorldPlazaWorldPoint;
  diamonds: readonly DefiningWorldPlazaColumnRockBaseDiamond[];
  sampleStepGrid?: number;
};

/**
 * Returns true when any diamond intersects the open segment between observer and target.
 *
 * Endpoints are excluded so standing next to a rock does not count as cover; the
 * boulder must sit between the two points along the sight line.
 */
export function checkingWildlifeSightLineOccludedByDiamonds({
  observerPosition,
  targetPosition,
  diamonds,
  sampleStepGrid = DEFINING_WILDLIFE_BOULDER_COVER_SIGHT_SAMPLE_STEP_GRID,
}: CheckingWildlifeSightLineOccludedByDiamondsParams): boolean {
  if (diamonds.length === 0) {
    return false;
  }

  const deltaX = targetPosition.x - observerPosition.x;
  const deltaY = targetPosition.y - observerPosition.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance < sampleStepGrid) {
    return false;
  }

  const steps = Math.max(1, Math.ceil(distance / sampleStepGrid));

  for (let stepIndex = 1; stepIndex < steps; stepIndex += 1) {
    const progress = stepIndex / steps;
    const sampleX = observerPosition.x + deltaX * progress;
    const sampleY = observerPosition.y + deltaY * progress;

    for (const diamond of diamonds) {
      if (
        checkingWorldPlazaColumnRockBaseDiamondContainsGridPoint(
          diamond,
          sampleX,
          sampleY
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Returns true when a procedural column rock blocks sight from animal to player.
 *
 * No-ops when the Features toggle {@link DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_BOULDER_COVER}
 * is off.
 */
export function checkingWildlifePlayerOccludedByColumnRock(
  observerPosition: DefiningWorldPlazaWorldPoint,
  playerPosition: DefiningWorldPlazaWorldPoint
): boolean {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_BOULDER_COVER
    )
  ) {
    return false;
  }

  const deltaX = playerPosition.x - observerPosition.x;
  const deltaY = playerPosition.y - observerPosition.y;
  const distance = Math.hypot(deltaX, deltaY);
  const sampleStepGrid = DEFINING_WILDLIFE_BOULDER_COVER_SIGHT_SAMPLE_STEP_GRID;

  if (distance < sampleStepGrid) {
    return false;
  }

  const steps = Math.max(1, Math.ceil(distance / sampleStepGrid));
  const diamondsByAnchorKey = new Map<
    string,
    DefiningWorldPlazaColumnRockBaseDiamond
  >();

  for (let stepIndex = 1; stepIndex < steps; stepIndex += 1) {
    const progress = stepIndex / steps;
    const sampleX = observerPosition.x + deltaX * progress;
    const sampleY = observerPosition.y + deltaY * progress;
    const metadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
      Math.floor(sampleX),
      Math.floor(sampleY)
    );

    if (!metadata) {
      continue;
    }

    const anchorKey = formattingWorldPlazaTileIndexCacheKey(
      metadata.anchorTileX,
      metadata.anchorTileY
    );

    if (!diamondsByAnchorKey.has(anchorKey)) {
      diamondsByAnchorKey.set(
        anchorKey,
        resolvingWorldPlazaColumnRockBaseDiamondFromMetadata(metadata)
      );
    }

    const diamond = diamondsByAnchorKey.get(anchorKey);

    if (
      diamond &&
      checkingWorldPlazaColumnRockBaseDiamondContainsGridPoint(
        diamond,
        sampleX,
        sampleY
      )
    ) {
      return true;
    }
  }

  return false;
}
