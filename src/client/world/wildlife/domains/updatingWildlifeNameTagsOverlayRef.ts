/**
 * In-place wildlife name-tag overlay updates with label caching and distance culling.
 *
 * @module components/world/wildlife/domains/updatingWildlifeNameTagsOverlayRef
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeNameTagShouldReveal } from '@/components/world/wildlife/domains/checkingWildlifeNameTagShouldReveal';
import { checkingWildlifePointWithinRadiusGrid } from '@/components/world/wildlife/domains/checkingWildlifePointWithinRadiusGrid';
import { DEFINING_WILDLIFE_NAME_TAG_VISIBLE_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeNameTagOverlay } from '@/components/world/wildlife/domains/definingWildlifeNameTagTypes';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeSpriteSheetFrameHeightPx } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetFrameHeightByFolder';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSizeScale } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { resolvingWildlifeInstanceNameTagLabel } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceNameTagLabel';
import { computingWildlifeJumpArcLiftPx } from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import { resolvingWildlifeInstanceStandingLayerAtPoint } from '@/components/world/wildlife/domains/syncingWildlifeInstanceStandingLayer';

export type UpdatingWildlifeNameTagLabelCacheEntry = {
  displayLabel: string;
  textColor: string;
  customDisplayName: string | null;
  packAlphaInstanceId: string | null;
};

export type UpdatingWildlifeNameTagsOverlayRefParams = {
  outRef: DefiningWildlifeNameTagOverlay[];
  instances: readonly DefiningWildlifeInstance[];
  playerPosition: DefiningWorldPlazaWorldPoint;
  playerFacingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  playerUserId: string | null;
  nowMs: number;
  hoveredInstanceId: string | null;
  wildlifeDamagedPlayerAtMsByInstanceId: ReadonlyMap<string, number>;
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  placedBlocksByTile: IndexingWorldBuildingPlacedBlocksByTile | undefined;
  labelCache: Map<string, UpdatingWildlifeNameTagLabelCacheEntry>;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

export type UpdatingWildlifeNameTagsOverlayRefResult = {
  didMountSetChange: boolean;
};

function resolvingCachedWildlifeNameTagLabel(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  labelCache: Map<string, UpdatingWildlifeNameTagLabelCacheEntry>
): UpdatingWildlifeNameTagLabelCacheEntry {
  const customDisplayName = instance.customDisplayName?.trim() || null;
  const packAlphaInstanceId = instance.packAlphaInstanceId ?? null;
  const cached = labelCache.get(instance.instanceId);

  if (
    cached &&
    cached.customDisplayName === customDisplayName &&
    cached.packAlphaInstanceId === packAlphaInstanceId
  ) {
    return cached;
  }

  const resolved = resolvingWildlifeInstanceNameTagLabel(instance, species);
  const nextEntry: UpdatingWildlifeNameTagLabelCacheEntry = {
    displayLabel: resolved.displayLabel,
    textColor: resolved.textColor,
    customDisplayName,
    packAlphaInstanceId,
  };

  labelCache.set(instance.instanceId, nextEntry);

  return nextEntry;
}

/**
 * Updates the live name-tag overlay ref without reallocating entries each tick.
 */
export function updatingWildlifeNameTagsOverlayRef({
  outRef,
  instances,
  playerPosition,
  playerFacingDirection = DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION,
  playerUserId,
  nowMs,
  hoveredInstanceId,
  wildlifeDamagedPlayerAtMsByInstanceId,
  placedBlocks,
  placedBlocksByTile,
  labelCache,
  resolveSpecies,
}: UpdatingWildlifeNameTagsOverlayRefParams): UpdatingWildlifeNameTagsOverlayRefResult {
  let writeIndex = 0;
  let didMountSetChange = false;
  const activeInstanceIds = new Set<string>();

  for (const instance of instances) {
    if (instance.isDead) {
      continue;
    }

    if (
      !checkingWildlifePointWithinRadiusGrid(
        instance.position,
        playerPosition,
        DEFINING_WILDLIFE_NAME_TAG_VISIBLE_RADIUS_GRID
      )
    ) {
      continue;
    }

    const species = resolveSpecies(instance.speciesId);

    if (!species) {
      continue;
    }

    activeInstanceIds.add(instance.instanceId);

    const label = resolvingCachedWildlifeNameTagLabel(
      instance,
      species,
      labelCache
    );
    const layer = resolvingWildlifeInstanceStandingLayerAtPoint(
      instance.position,
      placedBlocks,
      placedBlocksByTile
    );
    const sizeScale = resolvingWildlifeInstanceSizeScale(species, instance);
    const frameHeightPx = resolvingWildlifeSpriteSheetFrameHeightPx(
      species.spriteFolder
    );
    const jumpArcOffsetPx = instance.aiState.jumpState
      ? computingWildlifeJumpArcLiftPx(
          species.jump.jumpArcPeakPx,
          instance.aiState.jumpState.progress
        )
      : 0;
    const isRevealed = checkingWildlifeNameTagShouldReveal({
      instance,
      playerPosition,
      playerFacingDirection,
      playerUserId,
      nowMs,
      hoveredInstanceId,
      wildlifeDamagedPlayerAtMs:
        wildlifeDamagedPlayerAtMsByInstanceId.get(instance.instanceId) ?? null,
    });
    const existing = outRef[writeIndex];

    if (
      !existing ||
      existing.instanceId !== instance.instanceId ||
      existing.displayLabel !== label.displayLabel ||
      existing.textColor !== label.textColor
    ) {
      didMountSetChange = true;
    }

    if (existing && existing.instanceId === instance.instanceId) {
      existing.gridX = instance.position.x;
      existing.gridY = instance.position.y;
      existing.layer = layer;
      existing.sizeScale = sizeScale;
      existing.frameHeightPx = frameHeightPx;
      existing.jumpArcOffsetPx = jumpArcOffsetPx;
      existing.isRevealed = isRevealed;
    } else {
      outRef[writeIndex] = {
        instanceId: instance.instanceId,
        displayLabel: label.displayLabel,
        textColor: label.textColor,
        gridX: instance.position.x,
        gridY: instance.position.y,
        layer,
        sizeScale,
        frameHeightPx,
        jumpArcOffsetPx,
        isRevealed,
      };
    }

    writeIndex += 1;
  }

  if (outRef.length !== writeIndex) {
    didMountSetChange = true;
  }

  outRef.length = writeIndex;

  for (const instanceId of labelCache.keys()) {
    if (!activeInstanceIds.has(instanceId)) {
      labelCache.delete(instanceId);
    }
  }

  return { didMountSetChange };
}
