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
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
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
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { peekingWorldPlazaHungerTierSpriteTexture } from '@/components/world/hunger/domains/loadingWorldPlazaHungerTierSpriteTextures';
import { checkingWildlifeInstanceShowsHungerUi } from '@/components/world/wildlife/domains/checkingWildlifeInstanceIsOwnedPet';
import { checkingWildlifeSpeciesIsImmortal } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsImmortal';
import { checkingWildlifeSpeciesUsesGlowOrbPresentation } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesUsesGlowOrbPresentation';
import { checkingWildlifeVitalsGraphicsShouldShow } from '@/components/world/wildlife/domains/checkingWildlifeVitalsGraphicsShouldShow';
import { computingWildlifeCorpseFadeAlpha } from '@/components/world/wildlife/domains/computingWildlifeCorpseFadeAlpha';
import {
  computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx,
  computingWildlifeGroundShadowSizeScale,
} from '@/components/world/wildlife/domains/computingWildlifeGroundShadowLayout';
import { computingWildlifeHungerCircleLocalLayout } from '@/components/world/wildlife/domains/computingWildlifeHungerCircleLocalLayout';
import {
  quantizingWildlifeRenderHungerCircleRatio,
  quantizingWildlifeRenderVitalsRatio,
} from '@/components/world/wildlife/domains/computingWildlifeRenderStructuralFingerprint';
import { DEFINING_WILDLIFE_CYROBORN_SPECIES_ID } from '@/components/world/wildlife/domains/definingWildlifeCyrobornConstants';
import {
  DEFINING_WILDLIFE_FAIRY_POSITION_SMOOTHING_MAX_STEP_MS,
  DEFINING_WILDLIFE_FAIRY_POSITION_SMOOTHING_MAX_TRAIL_DISTANCE_GRID,
  DEFINING_WILDLIFE_FAIRY_POSITION_SMOOTHING_TAU_MS,
} from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  DEFINING_WILDLIFE_VITALS_BAR_LIFT_PX,
  DEFINING_WILDLIFE_VITALS_BAR_Z_INDEX_OFFSET,
} from '@/components/world/wildlife/domains/definingWildlifeVitalsBarConstants';
import { drawingWildlifeCyrobornGlowOrbOnGraphics } from '@/components/world/wildlife/domains/drawingWildlifeCyrobornGlowOrbOnGraphics';
import { drawingWildlifeFairyGlowOrbOnGraphics } from '@/components/world/wildlife/domains/drawingWildlifeFairyGlowOrbOnGraphics';
import { drawingWildlifeVitalsOnGraphics } from '@/components/world/wildlife/domains/drawingWildlifeVitalsOnGraphics';
import {
  resolvingWildlifeGlowOrbHoverLiftPx,
  resolvingWildlifeGlowOrbHoverOffsetPx,
} from '@/components/world/wildlife/domains/resolvingWildlifeGlowOrbHoverOffsetPx';
import { resolvingWildlifeInstanceMaxStaminaRatio } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { computingWildlifeJumpArcLiftPx } from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import { resolvingWildlifeSpeciesSpritePresentation } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSpritePresentation';
import type { Graphics, Sprite } from 'pixi.js';

export type SyncingWildlifeInstanceImperativePresentationEntry = {
  spriteRef: { current: Sprite | null };
  orbGraphicsRef: { current: Graphics | null };
  shadowGraphicsRef: { current: Graphics | null };
  vitalsGraphicsRef: { current: Graphics | null };
  /** Pet hunger-tier drumstick sprite centered in the hunger orb. */
  hungerIconSpriteRef: { current: Sprite | null };
  speciesId: string;
  sizeScale: number;
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  jumpArcPeakPx: number;
  depthSortCache: ManagingWorldPlazaEntityDepthSortCache;
  bodyZIndexRef: { current: number };
  shadowZIndexRef: { current: number };
  vitalsZIndexRef: { current: number };
  hungerIconZIndexRef: { current: number };
  /** Eased grid point for glow-orb bodies (null until first frame). */
  smoothedOrbPointRef: { current: { x: number; y: number } | null };
  /** Timestamp of the last smoothing step, for frame-rate independent easing. */
  smoothedOrbAtMsRef: { current: number };
  /**
   * Last drawn vitals fingerprint. Skips Graphics.clear/redraw when HP /
   * stamina / hunger / visibility have not changed a visible bucket.
   */
  lastDrawnVitalsKeyRef: { current: string };
};

/**
 * Advances the grid-space ease toward the sim position for glow-orb bodies.
 * The orb, its vitals bar, and its name tag all read this shared point so
 * nothing lags behind the body.
 */
function advancingWildlifeGlowOrbSmoothedGridPoint(
  entry: SyncingWildlifeInstanceImperativePresentationEntry,
  targetPoint: DefiningWorldPlazaWorldPoint,
  isDead: boolean,
  nowMs: number
): { x: number; y: number } {
  // Cap the step so frame hitches ease back instead of collapsing into a jump.
  const smoothingDeltaMs = Math.min(
    DEFINING_WILDLIFE_FAIRY_POSITION_SMOOTHING_MAX_STEP_MS,
    Math.max(0, nowMs - entry.smoothedOrbAtMsRef.current)
  );
  entry.smoothedOrbAtMsRef.current = nowMs;

  const smoothedPoint = entry.smoothedOrbPointRef.current;

  // First frame (or corpse) seeds the ease point. Never hard-teleport after that —
  // the soft trail cap below keeps the orb from drifting unboundedly.
  if (!smoothedPoint || isDead) {
    const seeded = { x: targetPoint.x, y: targetPoint.y };
    entry.smoothedOrbPointRef.current = seeded;
    return seeded;
  }

  const easeFactor =
    1 -
    Math.exp(
      -smoothingDeltaMs / DEFINING_WILDLIFE_FAIRY_POSITION_SMOOTHING_TAU_MS
    );
  smoothedPoint.x += (targetPoint.x - smoothedPoint.x) * easeFactor;
  smoothedPoint.y += (targetPoint.y - smoothedPoint.y) * easeFactor;

  // Soft trail cap: fast chases drag the orb along at a fixed max distance
  // instead of letting the gap grow forever.
  const trailX = targetPoint.x - smoothedPoint.x;
  const trailY = targetPoint.y - smoothedPoint.y;
  const trailDistance = Math.hypot(trailX, trailY);

  if (
    trailDistance >
    DEFINING_WILDLIFE_FAIRY_POSITION_SMOOTHING_MAX_TRAIL_DISTANCE_GRID
  ) {
    const pullRatio =
      (trailDistance -
        DEFINING_WILDLIFE_FAIRY_POSITION_SMOOTHING_MAX_TRAIL_DISTANCE_GRID) /
      trailDistance;
    smoothedPoint.x += trailX * pullRatio;
    smoothedPoint.y += trailY * pullRatio;
  }

  return smoothedPoint;
}

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
    | 'depthSortCache'
    | 'bodyZIndexRef'
    | 'shadowZIndexRef'
    | 'vitalsZIndexRef'
    | 'hungerIconZIndexRef'
    | 'smoothedOrbPointRef'
    | 'smoothedOrbAtMsRef'
    | 'lastDrawnVitalsKeyRef'
  >
): void {
  registry.set(instanceId, {
    ...entry,
    depthSortCache: creatingWorldPlazaEntityDepthSortCache(),
    bodyZIndexRef: { current: Number.NaN },
    shadowZIndexRef: { current: Number.NaN },
    vitalsZIndexRef: { current: Number.NaN },
    hungerIconZIndexRef: { current: Number.NaN },
    smoothedOrbPointRef: { current: null },
    smoothedOrbAtMsRef: { current: 0 },
    lastDrawnVitalsKeyRef: { current: '' },
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
      const orbGraphics = entry.orbGraphicsRef.current;
      const shadowGraphics = entry.shadowGraphicsRef.current;
      const vitalsGraphics = entry.vitalsGraphicsRef.current;
      const hungerIconSprite = entry.hungerIconSpriteRef.current;

      if (!isWithinPresentationRing) {
        if (sprite) {
          sprite.visible = false;
        }

        if (orbGraphics) {
          orbGraphics.visible = false;
        }

        if (shadowGraphics) {
          shadowGraphics.visible = false;
        }

        if (vitalsGraphics) {
          vitalsGraphics.visible = false;
        }

        if (hungerIconSprite) {
          hungerIconSprite.visible = false;
        }

        entry.lastDrawnVitalsKeyRef.current = '';

        continue;
      }

      // Simulation already resolves and stores terrain/block standing layers.
      // Re-scanning here multiplied that work by every visible animal and frame.
      const standingLayer = resolvingWorldPlazaPlayerWorldLayer(
        instance.position
      );
      const usesGlowOrb =
        checkingWildlifeSpeciesUsesGlowOrbPresentation(species);
      // Glow-orb bodies ease toward the sim point in grid space; every anchored
      // element (orb, vitals bar, name tag) shares the same smoothed point.
      const presentationGridPoint = usesGlowOrb
        ? advancingWildlifeGlowOrbSmoothedGridPoint(
            entry,
            instance.position,
            instance.isDead,
            input.nowMs
          )
        : instance.position;
      const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
        x: presentationGridPoint.x,
        y: presentationGridPoint.y,
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

      if (orbGraphics) {
        const areFairyGlowEnabled = checkingWorldPlazaGenerationFeatureEnabled(
          DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_FAIRY_GLOW
        );

        if (!areFairyGlowEnabled || !usesGlowOrb) {
          orbGraphics.visible = false;
        } else {
          const hoverOffset = resolvingWildlifeGlowOrbHoverOffsetPx(
            entry.speciesId,
            instance.instanceId,
            input.nowMs,
            instance.isDead
          );

          orbGraphics.position.set(
            screenPoint.x + hoverOffset.x,
            anchoredScreenY - jumpLiftPx + hoverOffset.y
          );
          applyingWorldPlazaCachedDisplayObjectZIndex(
            orbGraphics,
            sortKey,
            entry.bodyZIndexRef
          );
          orbGraphics.visible = !(instance.isDead && spriteAlpha <= 0);
          if (entry.speciesId === DEFINING_WILDLIFE_CYROBORN_SPECIES_ID) {
            drawingWildlifeCyrobornGlowOrbOnGraphics(orbGraphics, {
              nowMs: input.nowMs,
              alphaScale: spriteAlpha,
              isDead: instance.isDead,
            });
          } else {
            drawingWildlifeFairyGlowOrbOnGraphics(orbGraphics, {
              nowMs: input.nowMs,
              alphaScale: spriteAlpha,
              isDead: instance.isDead,
            });
          }
        }
      }

      if (shadowGraphics && !instance.isDead) {
        if (usesGlowOrb) {
          shadowGraphics.visible = false;
        } else {
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
        }
      } else if (shadowGraphics) {
        shadowGraphics.visible = false;
      }

      if (vitalsGraphics) {
        const healthRatio =
          instance.healthState.baseMaxHealth > 0
            ? instance.healthState.currentHealth /
              instance.healthState.baseMaxHealth
            : 0;
        const maxStaminaRatio = resolvingWildlifeInstanceMaxStaminaRatio(
          instance,
          species
        );
        const vitalsVisibility = checkingWildlifeVitalsGraphicsShouldShow({
          isDead: instance.isDead,
          isImmortal: checkingWildlifeSpeciesIsImmortal(species),
          healthRatio,
          staminaRatio: instance.staminaState.staminaRatio,
          maxStaminaRatio,
          showHungerCircle:
            checkingWildlifeInstanceShowsHungerUi(instance) &&
            checkingWorldPlazaGenerationFeatureEnabled(
              DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_HUNGER_CIRCLE
            ),
        });
        const vitalsLiftPx =
          (usesGlowOrb && !instance.isDead
            ? resolvingWildlifeGlowOrbHoverLiftPx(entry.speciesId)
            : 0) +
          DEFINING_WILDLIFE_VITALS_BAR_LIFT_PX * entry.sizeScale;
        const vitalsY = anchoredScreenY - jumpLiftPx - vitalsLiftPx;
        const vitalsZIndex =
          sortKey + DEFINING_WILDLIFE_VITALS_BAR_Z_INDEX_OFFSET;

        if (vitalsVisibility.showGraphics) {
          const quantizedHealth =
            quantizingWildlifeRenderVitalsRatio(healthRatio);
          const quantizedStamina = quantizingWildlifeRenderVitalsRatio(
            instance.staminaState.staminaRatio,
            maxStaminaRatio
          );
          const quantizedHunger = quantizingWildlifeRenderHungerCircleRatio(
            instance.hungerState.hungerRatio
          );
          const hungerTier = resolvingWorldPlazaHungerTier(
            instance.hungerState.hungerRatio
          );
          const nextVitalsKey = `${vitalsVisibility.showBars ? 1 : 0}:${vitalsVisibility.showHungerCircle ? 1 : 0}:${quantizedHealth}:${quantizedStamina}:${quantizedHunger}:${hungerTier}`;

          if (entry.lastDrawnVitalsKeyRef.current !== nextVitalsKey) {
            drawingWildlifeVitalsOnGraphics({
              graphics: vitalsGraphics,
              healthRatio: quantizedHealth,
              staminaRatio: quantizedStamina,
              hungerRatio: quantizedHunger,
              showHungerCircle: vitalsVisibility.showHungerCircle,
              showBars: vitalsVisibility.showBars,
            });
            entry.lastDrawnVitalsKeyRef.current = nextVitalsKey;

            if (hungerIconSprite && vitalsVisibility.showHungerCircle) {
              const hungerIconTexture =
                peekingWorldPlazaHungerTierSpriteTexture(hungerTier);

              if (hungerIconTexture) {
                hungerIconSprite.texture = hungerIconTexture;
              }
            }
          }

          vitalsGraphics.position.set(screenPoint.x, vitalsY);
          applyingWorldPlazaCachedDisplayObjectZIndex(
            vitalsGraphics,
            vitalsZIndex,
            entry.vitalsZIndexRef
          );
          vitalsGraphics.visible = true;
        } else {
          vitalsGraphics.visible = false;
          entry.lastDrawnVitalsKeyRef.current = '';
        }

        if (hungerIconSprite) {
          if (
            vitalsVisibility.showGraphics &&
            vitalsVisibility.showHungerCircle
          ) {
            const hungerLayout = computingWildlifeHungerCircleLocalLayout(
              vitalsVisibility.showBars
            );
            hungerIconSprite.position.set(
              screenPoint.x + hungerLayout.centerX,
              vitalsY + hungerLayout.centerY
            );
            applyingWorldPlazaCachedDisplayObjectZIndex(
              hungerIconSprite,
              vitalsZIndex + 1,
              entry.hungerIconZIndexRef
            );
            hungerIconSprite.visible = true;
          } else {
            hungerIconSprite.visible = false;
          }
        }
      } else if (hungerIconSprite) {
        hungerIconSprite.visible = false;
      }
    } catch (error) {
      loggingWorldPlazaClientError(
        `[wildlife:presentation:${instance.instanceId}] ${formattingWorldPlazaClientCapturedError(error)}`
      );
    }
  }
}
