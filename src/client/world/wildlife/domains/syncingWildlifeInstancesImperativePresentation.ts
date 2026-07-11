/**
 * Imperative wildlife sprite transforms to avoid React position churn.
 *
 * @module components/world/wildlife/domains/syncingWildlifeInstancesImperativePresentation
 */

import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET } from '@/components/world/depth';
import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { updatingWorldPlazaAvatarGroundShadowGraphics } from '@/components/world/domains/drawingWorldPlazaAvatarGroundShadowOnGraphics';
import { computingWildlifeCorpseFadeAlpha } from '@/components/world/wildlife/domains/computingWildlifeCorpseFadeAlpha';
import {
  computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx,
  computingWildlifeGroundShadowSizeScale,
} from '@/components/world/wildlife/domains/computingWildlifeGroundShadowLayout';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { computingWildlifeJumpArcLiftPx } from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import { resolvingWildlifeSpeciesSpritePresentation } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSpritePresentation';
import { resolvingWildlifeInstanceStandingLayerAtPoint } from '@/components/world/wildlife/domains/syncingWildlifeInstanceStandingLayer';
import type { Graphics, Sprite } from 'pixi.js';

export type SyncingWildlifeInstanceImperativePresentationEntry = {
  spriteRef: { current: Sprite | null };
  shadowGraphicsRef: { current: Graphics | null };
  speciesId: string;
  sizeScale: number;
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  jumpArcPeakPx: number;
};

export type SyncingWildlifeInstancesImperativePresentationRegistry = Map<
  string,
  SyncingWildlifeInstanceImperativePresentationEntry
>;

/**
 * Registers one wildlife instance for imperative transform updates.
 */
export function registeringWildlifeInstanceImperativePresentation(
  registry: SyncingWildlifeInstancesImperativePresentationRegistry,
  instanceId: string,
  entry: SyncingWildlifeInstanceImperativePresentationEntry
): void {
  registry.set(instanceId, entry);
}

/**
 * Removes one wildlife instance from the imperative registry.
 */
export function unregisteringWildlifeInstanceImperativePresentation(
  registry: SyncingWildlifeInstancesImperativePresentationRegistry,
  instanceId: string
): void {
  registry.delete(instanceId);
}

/**
 * Updates registered wildlife sprites from live simulation instances.
 */
export function syncingWildlifeInstancesImperativePresentation(input: {
  readonly registry: SyncingWildlifeInstancesImperativePresentationRegistry;
  readonly instances: readonly DefiningWildlifeInstance[];
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  readonly nowMs: number;
}): void {
  for (const instance of input.instances) {
    const entry = input.registry.get(instance.instanceId);

    if (!entry) {
      continue;
    }

    const species = resolvingWildlifeSpeciesDefinition(entry.speciesId);

    if (!species) {
      continue;
    }

    const standingLayer = resolvingWildlifeInstanceStandingLayerAtPoint(
      instance.position,
      input.placedBlocks,
      input.placedBlocksByTile
    );
    const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: instance.position.x,
      y: instance.position.y,
    });
    const standingLayerOffsetPx =
      computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
    const anchoredScreenY = screenPoint.y + standingLayerOffsetPx;
    const jumpLiftPx = instance.aiState.jumpState
      ? computingWildlifeJumpArcLiftPx(
          entry.jumpArcPeakPx,
          instance.aiState.jumpState.progress
        )
      : 0;
    const spriteAlpha = instance.isDead
      ? computingWildlifeCorpseFadeAlpha(instance.diedAtMs, input.nowMs)
      : 1;
    const sortKey = resolvingWorldDepthAvatarBodySortKey(
      {
        x: instance.position.x,
        y: instance.position.y,
        layer: standingLayer,
      },
      {
        placedBlocks: input.placedBlocks,
        placedBlocksByTile: input.placedBlocksByTile,
      }
    );
    const sprite = entry.spriteRef.current;

    if (sprite) {
      sprite.position.set(screenPoint.x, anchoredScreenY - jumpLiftPx);
      sprite.zIndex = sortKey;
      sprite.alpha = spriteAlpha;
      sprite.visible = !(instance.isDead && spriteAlpha <= 0);
    }

    const shadowGraphics = entry.shadowGraphicsRef.current;

    if (shadowGraphics && !instance.isDead) {
      const spritePresentation =
        resolvingWildlifeSpeciesSpritePresentation(species);
      const shadowSizeScale = computingWildlifeGroundShadowSizeScale(
        entry.sizeScale,
        entry.speciesId
      );
      const shadowFootOffsetPx =
        computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx(
          entry.sizeScale,
          spritePresentation.frameHeightPx,
          spritePresentation.footYNormalized,
          spritePresentation.anchorYNormalized,
          entry.speciesId
        );

      shadowGraphics.position.set(screenPoint.x, anchoredScreenY);
      shadowGraphics.zIndex =
        sortKey +
        DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET;
      shadowGraphics.visible = true;
      updatingWorldPlazaAvatarGroundShadowGraphics(
        shadowGraphics,
        -jumpLiftPx,
        entry.jumpArcPeakPx,
        entry.facingDirection,
        shadowFootOffsetPx,
        shadowSizeScale
      );
    } else if (shadowGraphics) {
      shadowGraphics.visible = false;
    }
  }
}
