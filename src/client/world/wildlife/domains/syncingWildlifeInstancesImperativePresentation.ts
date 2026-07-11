/**
 * Imperative wildlife sprite transforms to avoid React position churn.
 *
 * @module components/world/wildlife/domains/syncingWildlifeInstancesImperativePresentation
 */

import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET } from '@/components/world/depth';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import {
  resolvingWorldPlazaPlayerWorldLayer,
  type DefiningWorldPlazaWorldPoint,
} from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { updatingWorldPlazaAvatarGroundShadowGraphics } from '@/components/world/domains/drawingWorldPlazaAvatarGroundShadowOnGraphics';
import {
  formattingWorldPlazaClientCapturedError,
  loggingWorldPlazaClientError,
} from '@/components/world/domains/loggingWorldPlazaClientErrors';
import {
  applyingWorldPlazaCachedDisplayObjectZIndex,
  computingWorldPlazaPlacedBlocksDepthRevision,
  creatingWorldPlazaEntityDepthSortCache,
  resolvingWorldPlazaCachedAvatarBodySortKey,
  type ManagingWorldPlazaEntityDepthSortCache,
} from '@/components/world/domains/managingWorldPlazaEntityDepthSortCache';
import { computingWildlifeCorpseFadeAlpha } from '@/components/world/wildlife/domains/computingWildlifeCorpseFadeAlpha';
import {
  computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx,
  computingWildlifeGroundShadowSizeScale,
} from '@/components/world/wildlife/domains/computingWildlifeGroundShadowLayout';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  DEFINING_WILDLIFE_VITALS_BAR_LIFT_PX,
  DEFINING_WILDLIFE_VITALS_BAR_Z_INDEX_OFFSET,
} from '@/components/world/wildlife/domains/definingWildlifeVitalsBarConstants';
import { computingWildlifeJumpArcLiftPx } from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import { resolvingWildlifeSpeciesSpritePresentation } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSpritePresentation';
import type { Graphics, Sprite } from 'pixi.js';

export type SyncingWildlifeInstanceImperativePresentationEntry = {
  spriteRef: { current: Sprite | null };
  shadowGraphicsRef: { current: Graphics | null };
  vitalsGraphicsRef: { current: Graphics | null };
  speciesId: string;
  sizeScale: number;
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  jumpArcPeakPx: number;
  depthSortCache: ManagingWorldPlazaEntityDepthSortCache;
  bodyZIndexRef: { current: number };
  shadowZIndexRef: { current: number };
  vitalsZIndexRef: { current: number };
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
  entry: Omit<
    SyncingWildlifeInstanceImperativePresentationEntry,
    'depthSortCache' | 'bodyZIndexRef' | 'shadowZIndexRef' | 'vitalsZIndexRef'
  >
): void {
  registry.set(instanceId, {
    ...entry,
    depthSortCache: creatingWorldPlazaEntityDepthSortCache(),
    bodyZIndexRef: { current: Number.NaN },
    shadowZIndexRef: { current: Number.NaN },
    vitalsZIndexRef: { current: Number.NaN },
  });
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

function checkingWildlifeInstanceWithinPresentationRing(
  instancePosition: DefiningWorldPlazaWorldPoint,
  playerPosition: DefiningWorldPlazaWorldPoint | null,
  presentationCullGridRadius: number
): boolean {
  if (!playerPosition || presentationCullGridRadius >= 999) {
    return true;
  }

  return (
    Math.abs(instancePosition.x - playerPosition.x) <=
      presentationCullGridRadius &&
    Math.abs(instancePosition.y - playerPosition.y) <=
      presentationCullGridRadius
  );
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
  readonly playerPosition?: DefiningWorldPlazaWorldPoint | null;
  readonly presentationCullGridRadius?: number;
}): void {
  const placedBlocksRevision = computingWorldPlazaPlacedBlocksDepthRevision(
    input.placedBlocks.length,
    input.placedBlocks[input.placedBlocks.length - 1]?.blockId
  );
  const depthContext = {
    placedBlocks: input.placedBlocks,
    placedBlocksByTile: input.placedBlocksByTile,
  };
  const presentationCullGridRadius = input.presentationCullGridRadius ?? 999;

  for (const instance of input.instances) {
    try {
      const entry = input.registry.get(instance.instanceId);

      if (!entry) {
        continue;
      }

      const species = resolvingWildlifeSpeciesDefinition(entry.speciesId);

      if (!species) {
        continue;
      }

      const isWithinPresentationRing =
        checkingWildlifeInstanceWithinPresentationRing(
          instance.position,
          input.playerPosition ?? null,
          presentationCullGridRadius
        );
      const sprite = entry.spriteRef.current;
      const shadowGraphics = entry.shadowGraphicsRef.current;
      const vitalsGraphics = entry.vitalsGraphicsRef.current;

      if (!isWithinPresentationRing) {
        if (sprite) {
          sprite.visible = false;
        }

        if (shadowGraphics) {
          shadowGraphics.visible = false;
        }

        if (vitalsGraphics) {
          vitalsGraphics.visible = false;
        }

        continue;
      }

      // Simulation already resolves and stores terrain/block standing layers.
      // Re-scanning here multiplied that work by every visible animal and frame.
      const standingLayer = resolvingWorldPlazaPlayerWorldLayer(
        instance.position
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
      const sortKey = resolvingWorldPlazaCachedAvatarBodySortKey(
        {
          x: instance.position.x,
          y: instance.position.y,
          layer: standingLayer,
        },
        entry.depthSortCache,
        depthContext,
        placedBlocksRevision
      );

      if (sprite) {
        sprite.position.set(screenPoint.x, anchoredScreenY - jumpLiftPx);
        applyingWorldPlazaCachedDisplayObjectZIndex(
          sprite,
          sortKey,
          entry.bodyZIndexRef
        );
        sprite.alpha = spriteAlpha;
        sprite.visible = !(instance.isDead && spriteAlpha <= 0);
      }

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
        applyingWorldPlazaCachedDisplayObjectZIndex(
          shadowGraphics,
          sortKey +
            DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET,
          entry.shadowZIndexRef
        );
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

      if (vitalsGraphics) {
        const healthRatio =
          instance.healthState.baseMaxHealth > 0
            ? instance.healthState.currentHealth /
              instance.healthState.baseMaxHealth
            : 0;
        const showsVitalsBars =
          !instance.isDead &&
          (healthRatio < 0.999 || instance.staminaState.staminaRatio < 0.999);

        if (showsVitalsBars) {
          vitalsGraphics.position.set(
            screenPoint.x,
            anchoredScreenY -
              jumpLiftPx -
              DEFINING_WILDLIFE_VITALS_BAR_LIFT_PX * entry.sizeScale
          );
          applyingWorldPlazaCachedDisplayObjectZIndex(
            vitalsGraphics,
            sortKey + DEFINING_WILDLIFE_VITALS_BAR_Z_INDEX_OFFSET,
            entry.vitalsZIndexRef
          );
          vitalsGraphics.visible = true;
        } else {
          vitalsGraphics.visible = false;
        }
      }
    } catch (error) {
      loggingWorldPlazaClientError(
        `[wildlife:presentation:${instance.instanceId}] ${formattingWorldPlazaClientCapturedError(error)}`
      );
    }
  }
}
