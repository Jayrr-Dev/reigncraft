'use client';

/**
 * Renders live wildlife instances and advances simulation inside Pixi Application.
 *
 * @module components/world/wildlife/components/renderingWildlifeLayer
 */

import { RenderingWorldPlazaDeclarativeAnimatedSprite } from '@/components/world/animation/components/renderingWorldPlazaDeclarativeAnimatedSprite';
import { advancingAllWorldPlazaDeclarativeAnimationPlayback } from '@/components/world/animation/domains/managingWorldPlazaDeclarativeAnimationPlaybackRegistry';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET } from '@/components/world/depth';
import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import {
  computingWorldPlazaPlayerStillDurationMs,
  type ComputingWorldPlazaPlayerStillnessSample,
} from '@/components/world/domains/computingWorldPlazaPlayerStillDurationMs';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  resolvingWorldPlazaPlayerWorldLayer,
  type DefiningWorldPlazaWorldPoint,
} from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { updatingWorldPlazaAvatarGroundShadowGraphics } from '@/components/world/domains/drawingWorldPlazaAvatarGroundShadowOnGraphics';
import { invokingWorldPlazaLoopBodySafely } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import {
  beginningWorldPlazaPerformanceSample,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { resolvingWorldPlazaDayNightCycleSample } from '@/components/world/domains/resolvingWorldPlazaDayNightCycleSample';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import {
  advancingWildlifeSimulationTick,
  applyingWildlifeInstanceDamage,
} from '@/components/world/wildlife/domains/advancingWildlifeSimulationTick';
import { advancingWildlifeSpeciesTextureEviction } from '@/components/world/wildlife/domains/advancingWildlifeSpeciesTextureEviction';
import { computingWildlifeCorpseFadeAlpha } from '@/components/world/wildlife/domains/computingWildlifeCorpseFadeAlpha';
import {
  computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx,
  computingWildlifeGroundShadowSizeScale,
} from '@/components/world/wildlife/domains/computingWildlifeGroundShadowLayout';
import {
  computingWildlifeRenderStructuralFingerprint,
  quantizingWildlifeRenderVitalsRatio,
} from '@/components/world/wildlife/domains/computingWildlifeRenderStructuralFingerprint';
import { DEFINING_WILDLIFE_NAME_TAG_RECENT_COMBAT_REVEAL_MS } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeSimulationTickConfig } from '@/components/world/wildlife/domains/definingWildlifeSimulationTickConfig';
import {
  DEFINING_WILDLIFE_SIMULATION_MAX_STEPS_PER_FRAME,
  DEFINING_WILDLIFE_SIMULATION_TICK_MS,
} from '@/components/world/wildlife/domains/definingWildlifeSimulationTimestepConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeSpriteSheetFrameHeightPx } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetFrameHeightByFolder';
import type { DefiningWildlifeMotionClipKind } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import { DEFINING_WILDLIFE_TEXTURE_EVICTION_CHECK_INTERVAL_MS } from '@/components/world/wildlife/domains/definingWildlifeTextureEvictionConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  DEFINING_WILDLIFE_VITALS_BAR_LIFT_PX,
  DEFINING_WILDLIFE_VITALS_BAR_Z_INDEX_OFFSET,
} from '@/components/world/wildlife/domains/definingWildlifeVitalsBarConstants';
import { electingWildlifeSimulationLeaderUserId } from '@/components/world/wildlife/domains/electingWildlifeSimulationLeaderUserId';
import { loadingWildlifeSpeciesTextures } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { listingWildlifeInstances } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { recordingWildlifeSpeciesTextureResidence } from '@/components/world/wildlife/domains/managingWildlifeSpeciesTextureResidence';
import { recordingWildlifePerformanceDiagnostics } from '@/components/world/wildlife/domains/recordingWildlifePerformanceDiagnostics';
import {
  ensuringWildlifeAnimationClipsRegistered,
  formattingWildlifeAnimationClipId,
} from '@/components/world/wildlife/domains/registeringWildlifeAnimationClips';
import {
  resolvingWildlifeInstanceCollisionRadiusGrid,
  resolvingWildlifeInstanceSizeScale,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { computingWildlifeJumpArcLiftPx } from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import { resolvingWildlifeLocomotionAnimationSpeedScale } from '@/components/world/wildlife/domains/resolvingWildlifeLocomotionAnimationSpeedScale';
import { resolvingWildlifeProximateSpeciesIdsAtWorldPoint } from '@/components/world/wildlife/domains/resolvingWildlifeProximateSpeciesIdsAtWorldPoint';
import { resolvingWildlifeSpeciesSpritePresentation } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSpritePresentation';
import { resolvingWildlifeTextureEvictionProfile } from '@/components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile';
import {
  registeringWildlifeInstanceImperativePresentation,
  syncingWildlifeInstancesImperativePresentation,
  unregisteringWildlifeInstanceImperativePresentation,
  type SyncingWildlifeInstancesImperativePresentationRegistry,
} from '@/components/world/wildlife/domains/syncingWildlifeInstancesImperativePresentation';
import {
  updatingWildlifeNameTagsOverlayRef,
  type UpdatingWildlifeNameTagLabelCacheEntry,
} from '@/components/world/wildlife/domains/updatingWildlifeNameTagsOverlayRef';
import type { Graphics, Sprite } from 'pixi.js';
import { memo, useEffect, useRef, useState } from 'react';

export type RenderingWildlifeLayerProps = {
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
  tickConfigRef: React.RefObject<DefiningWildlifeSimulationTickConfig>;
};

const RENDERING_WILDLIFE_BAR_WIDTH_PX = 24;
const RENDERING_WILDLIFE_BAR_HEIGHT_PX = 3;
const RENDERING_WILDLIFE_STAMINA_BAR_HEIGHT_PX = 2;
/** Minimum ms between contact disease rolls for the same animal. */
const RENDERING_WILDLIFE_CONTACT_DISEASE_COOLDOWN_MS = 1000;
const RENDERING_WILDLIFE_BAR_GAP_PX = 0.5;

/** Player HP bar thresholds reused for animals (green / orange / red). */
function resolvingWildlifeBarFillColor(healthRatio: number): number {
  if (healthRatio <= 0.25) {
    return 0x8f1010;
  }

  if (healthRatio <= 0.5) {
    return 0xc45c12;
  }

  return 0x1f9b3f;
}

function drawingWildlifeVitalsBars(
  graphics: Graphics,
  healthRatio: number,
  staminaRatio: number
): void {
  graphics.clear();

  const barLeft = -RENDERING_WILDLIFE_BAR_WIDTH_PX / 2;

  graphics
    .rect(
      barLeft,
      0,
      RENDERING_WILDLIFE_BAR_WIDTH_PX,
      RENDERING_WILDLIFE_BAR_HEIGHT_PX
    )
    .fill({ color: 0x1a140f, alpha: 0.9 });

  if (healthRatio > 0) {
    graphics
      .rect(
        barLeft,
        0,
        RENDERING_WILDLIFE_BAR_WIDTH_PX * healthRatio,
        RENDERING_WILDLIFE_BAR_HEIGHT_PX
      )
      .fill({ color: resolvingWildlifeBarFillColor(healthRatio) });
  }

  const staminaTop =
    RENDERING_WILDLIFE_BAR_HEIGHT_PX + RENDERING_WILDLIFE_BAR_GAP_PX;

  graphics
    .rect(
      barLeft,
      staminaTop,
      RENDERING_WILDLIFE_BAR_WIDTH_PX,
      RENDERING_WILDLIFE_STAMINA_BAR_HEIGHT_PX
    )
    .fill({ color: 0x1a140f, alpha: 0.9 });

  if (staminaRatio > 0) {
    graphics
      .rect(
        barLeft,
        staminaTop,
        RENDERING_WILDLIFE_BAR_WIDTH_PX * staminaRatio,
        RENDERING_WILDLIFE_STAMINA_BAR_HEIGHT_PX
      )
      .fill({ color: 0xd9a521 });
  }
}

type RenderingWildlifeInstanceSpriteProps = {
  instanceId: string;
  speciesId: string;
  imperativePresentationRegistryRef: React.RefObject<SyncingWildlifeInstancesImperativePresentationRegistry>;
  positionX: number;
  positionY: number;
  standingLayer: number;
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  motionClip: DefiningWildlifeMotionClipKind;
  isMoving: boolean;
  sizeScale: number;
  locomotionAnimationSpeedScale: number;
  healthRatio: number;
  staminaRatio: number;
  isDead: boolean;
  spriteAlpha: number;
  jumpLiftPx: number;
  jumpArcPeakPx: number;
};

const RenderingWildlifeInstanceSprite = memo(
  function RenderingWildlifeInstanceSprite({
    instanceId,
    speciesId,
    imperativePresentationRegistryRef,
    positionX,
    positionY,
    standingLayer,
    placedBlocks,
    placedBlocksByTile,
    facingDirection,
    motionClip,
    isMoving,
    sizeScale,
    locomotionAnimationSpeedScale,
    healthRatio,
    staminaRatio,
    isDead,
    spriteAlpha,
    jumpLiftPx,
    jumpArcPeakPx,
  }: RenderingWildlifeInstanceSpriteProps): React.JSX.Element | null {
    const species = resolvingWildlifeSpeciesDefinition(speciesId);
    const wildlifeSpriteRef = useRef<Sprite | null>(null);
    const wildlifeShadowGraphicsRef = useRef<Graphics | null>(null);
    const wildlifeVitalsGraphicsRef = useRef<Graphics | null>(null);

    useEffect(() => {
      const registry = imperativePresentationRegistryRef.current;

      if (!registry) {
        return;
      }

      registeringWildlifeInstanceImperativePresentation(registry, instanceId, {
        spriteRef: wildlifeSpriteRef,
        shadowGraphicsRef: wildlifeShadowGraphicsRef,
        vitalsGraphicsRef: wildlifeVitalsGraphicsRef,
        speciesId,
        sizeScale,
        facingDirection,
        jumpArcPeakPx,
      });

      return () => {
        unregisteringWildlifeInstanceImperativePresentation(
          registry,
          instanceId
        );
      };
    }, [
      facingDirection,
      imperativePresentationRegistryRef,
      instanceId,
      jumpArcPeakPx,
      sizeScale,
      speciesId,
    ]);

    if (!species) {
      return null;
    }

    const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: positionX,
      y: positionY,
    });
    const standingLayerOffsetPx =
      computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
    const anchoredScreenY = screenPoint.y + standingLayerOffsetPx;
    const clipId = formattingWildlifeAnimationClipId(speciesId, motionClip);
    const playsLocomotionClip = motionClip === 'walk' || motionClip === 'run';
    const sortKey = resolvingWorldDepthAvatarBodySortKey(
      {
        x: positionX,
        y: positionY,
        layer: standingLayer,
      },
      {
        placedBlocks,
        placedBlocksByTile,
      }
    );
    const showsVitalsBars =
      !isDead && (healthRatio < 0.999 || staminaRatio < 0.999);
    const spritePresentation =
      resolvingWildlifeSpeciesSpritePresentation(species);
    const shadowSizeScale = computingWildlifeGroundShadowSizeScale(
      sizeScale,
      speciesId
    );
    const shadowFootOffsetPx =
      computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx(
        sizeScale,
        spritePresentation.frameHeightPx,
        spritePresentation.footYNormalized,
        spritePresentation.anchorYNormalized,
        speciesId
      );
    const shadowZIndex =
      sortKey +
      DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET;

    return (
      <>
        {!isDead ? (
          <pixiGraphics
            ref={wildlifeShadowGraphicsRef}
            eventMode="none"
            x={screenPoint.x}
            y={anchoredScreenY}
            zIndex={shadowZIndex}
            draw={(graphics: Graphics) => {
              updatingWorldPlazaAvatarGroundShadowGraphics(
                graphics,
                -jumpLiftPx,
                jumpArcPeakPx,
                facingDirection,
                shadowFootOffsetPx,
                shadowSizeScale
              );
            }}
          />
        ) : null}
        <RenderingWorldPlazaDeclarativeAnimatedSprite
          externalSpriteRef={wildlifeSpriteRef}
          playback={{
            clipId,
            variantKey: facingDirection,
            playing: playsLocomotionClip ? isMoving : true,
            speedScale: playsLocomotionClip ? locomotionAnimationSpeedScale : 1,
          }}
          tickMode="shared"
          position={{ x: screenPoint.x, y: anchoredScreenY - jumpLiftPx }}
          anchor={{ x: 0.5, y: spritePresentation.anchorYNormalized }}
          scale={sizeScale}
          zIndex={sortKey}
          alpha={spriteAlpha}
        />
        {showsVitalsBars ? (
          <pixiGraphics
            ref={wildlifeVitalsGraphicsRef}
            eventMode="none"
            zIndex={sortKey + DEFINING_WILDLIFE_VITALS_BAR_Z_INDEX_OFFSET}
            x={screenPoint.x}
            y={
              anchoredScreenY -
              jumpLiftPx -
              DEFINING_WILDLIFE_VITALS_BAR_LIFT_PX * sizeScale
            }
            draw={(graphics: Graphics) => {
              drawingWildlifeVitalsBars(graphics, healthRatio, staminaRatio);
            }}
          />
        ) : null}
      </>
    );
  }
);

export function RenderingWildlifeLayer({
  wildlifeStoreRef,
  tickConfigRef,
}: RenderingWildlifeLayerProps): React.JSX.Element | null {
  const performanceProfile = usingWorldPlazaPerformanceProfile();
  const [instances, setInstances] = useState<
    readonly DefiningWildlifeInstance[]
  >([]);
  const renderStructuralFingerprintRef = useRef('0');
  const lastRenderReconcileAtMsRef = useRef(0);
  const loadedSpeciesRef = useRef<Set<string>>(new Set());
  const liveSpeciesIdsRef = useRef<ReadonlySet<string>>(new Set());
  const lastTickMsRef = useRef<number | null>(null);
  const lastTextureEvictionCheckMsRef = useRef(0);
  const simAccumulatorMsRef = useRef(0);
  const renderNowMsRef = useRef(Date.now());
  const playerStillnessSampleRef =
    useRef<ComputingWorldPlazaPlayerStillnessSample | null>(null);
  const playerPreviousPositionRef = useRef<DefiningWorldPlazaWorldPoint | null>(
    null
  );
  const wildlifeNameTagLabelCacheRef = useRef(
    new Map<string, UpdatingWildlifeNameTagLabelCacheEntry>()
  );
  const playerContactDiseaseLastRollAtMsByInstanceIdRef = useRef(
    new Map<string, number>()
  );
  const wildlifeImperativePresentationRegistryRef =
    useRef<SyncingWildlifeInstancesImperativePresentationRegistry>(new Map());

  usingWorldPlazaSafeTick((ticker) => {
    const config = tickConfigRef.current;
    const store = wildlifeStoreRef.current;
    const playerPosition = config.playerPositionRef.current;
    const nowMs = Date.now();
    renderNowMsRef.current = nowMs;
    const placedBlocksScene = config.placedBlocksRef?.current;
    const frameDeltaMs = Math.max(0, ticker.deltaMS);
    let simStepsThisFrame = 0;
    let isSimulationLeader = false;
    let snapshotCount = 0;
    let playerContactCount = 0;

    advancingAllWorldPlazaDeclarativeAnimationPlayback(
      frameDeltaMs,
      performance.now()
    );

    if (config.enabled && playerPosition) {
      const lastTickMs = lastTickMsRef.current ?? nowMs;
      lastTickMsRef.current = nowMs;
      simAccumulatorMsRef.current = Math.min(
        simAccumulatorMsRef.current + (nowMs - lastTickMs),
        DEFINING_WILDLIFE_SIMULATION_TICK_MS *
          DEFINING_WILDLIFE_SIMULATION_MAX_STEPS_PER_FRAME
      );

      const leaderUserId = electingWildlifeSimulationLeaderUserId(
        config.localUserId,
        config.remoteUserIds
      );
      const isLeader =
        !config.localUserId || leaderUserId === config.localUserId;
      isSimulationLeader = isLeader;

      const playerHealthState = config.playerHealthStateRef?.current;
      const playerRunStaminaState = config.playerRunStaminaStateRef?.current;
      const playerHealthRatio =
        playerHealthState && playerHealthState.baseMaxHealth > 0
          ? playerHealthState.currentHealth / playerHealthState.baseMaxHealth
          : null;
      const stillnessResult = computingWorldPlazaPlayerStillDurationMs({
        sample: playerStillnessSampleRef.current,
        position: playerPosition,
        isWalking: config.isPlayerWalkingRef?.current ?? false,
        isRunning: config.isPlayerRunningRef?.current ?? false,
        isJumping: config.isPlayerJumpingRef?.current ?? false,
        nowMs,
      });
      playerStillnessSampleRef.current = stillnessResult.sample;

      if (config.playerStillDurationMsRef) {
        config.playerStillDurationMsRef.current =
          stillnessResult.stillDurationMs;
      }

      const stalkShadowingContext = {
        playerUserId: config.localUserId,
        playerHealthRatio,
        playerStaminaRatio: playerRunStaminaState?.staminaRatio ?? null,
        playerStaminaIsDepleted: playerRunStaminaState?.isDepleted ?? false,
        playerStillDurationMs: stillnessResult.stillDurationMs,
      };

      if (
        isLeader &&
        config.pendingWildlifeDamageEventsRef?.current &&
        config.pendingWildlifeDamageEventsRef.current.length > 0
      ) {
        for (const event of config.pendingWildlifeDamageEventsRef.current) {
          invokingWorldPlazaLoopBodySafely(
            `combat:wildlife-damage:${event.instanceId}`,
            () => {
              const playerPosition = config.playerPositionRef.current;
              const meatDropContext =
                playerPosition && config.meatDropContextRef?.current
                  ? {
                      ...config.meatDropContextRef.current,
                      playerPosition,
                    }
                  : null;

              applyingWildlifeInstanceDamage(
                store,
                event.instanceId,
                event.damageAmount,
                event.attackerUserId,
                resolvingWildlifeSpeciesDefinition,
                event.atMs,
                meatDropContext,
                event.projectileArchetypeId ?? null,
                stalkShadowingContext
              );
            }
          );
        }

        config.pendingWildlifeDamageEventsRef.current.length = 0;
      }

      const cycleSample = resolvingWorldPlazaDayNightCycleSample(nowMs);
      const playerPreviousPosition = playerPreviousPositionRef.current;
      let lastSimResult: ReturnType<
        typeof advancingWildlifeSimulationTick
      > | null = null;
      const maxSimStepsPerFrame = Math.min(
        DEFINING_WILDLIFE_SIMULATION_MAX_STEPS_PER_FRAME,
        performanceProfile.wildlifeSimulationMaxStepsPerFrame
      );
      const finishWildlifeTickSample = beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WILDLIFE_TICK
      );

      while (
        simAccumulatorMsRef.current >= DEFINING_WILDLIFE_SIMULATION_TICK_MS &&
        simStepsThisFrame < maxSimStepsPerFrame
      ) {
        simAccumulatorMsRef.current -= DEFINING_WILDLIFE_SIMULATION_TICK_MS;
        simStepsThisFrame += 1;
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.WILDLIFE_SIM_STEP
        );

        const stepResult = invokingWorldPlazaLoopBodySafely(
          `wildlife:sim-step:${simStepsThisFrame}`,
          () =>
            advancingWildlifeSimulationTick({
              store,
              center: playerPosition,
              playerPosition,
              playerPreviousPosition,
              playerUserId: config.localUserId,
              playerHealthRatio,
              playerStaminaRatio: playerRunStaminaState?.staminaRatio ?? null,
              playerStaminaIsDepleted:
                playerRunStaminaState?.isDepleted ?? false,
              playerStillDurationMs: stillnessResult.stillDurationMs,
              isPlayerWalking: config.isPlayerWalkingRef?.current ?? false,
              isPlayerRunning: config.isPlayerRunningRef?.current ?? false,
              isPlayerJumping: config.isPlayerJumpingRef?.current ?? false,
              resolveSpecies: resolvingWildlifeSpeciesDefinition,
              deltaSeconds: DEFINING_WILDLIFE_SIMULATION_TICK_MS / 1000,
              nowMs,
              placedBlocks: placedBlocksScene?.blocks ?? [],
              placedBlocksByTile: placedBlocksScene?.blocksByTile,
              isDaytime: cycleSample.isDaytime,
              onPlayerHitByWildlife: config.onPlayerHitByWildlife,
              isLeader,
              remoteSnapshots: config.remoteWildlifeSnapshotsRef?.current ?? [],
              meatDropContext: config.meatDropContextRef?.current
                ? {
                    ...config.meatDropContextRef.current,
                    playerPosition,
                  }
                : null,
            })
        );

        if (stepResult) {
          lastSimResult = stepResult;
        }
      }

      finishWildlifeTickSample();

      playerPreviousPositionRef.current = playerPosition;

      if (lastSimResult) {
        snapshotCount = lastSimResult.snapshots.length;
        playerContactCount = lastSimResult.playerContactEvents.length;

        if (isLeader && config.wildlifeSnapshotsOutRef?.current) {
          config.wildlifeSnapshotsOutRef.current.length = 0;
          config.wildlifeSnapshotsOutRef.current.push(
            ...lastSimResult.snapshots
          );
        }

        // Solid-body collision: nudge the player out of animal circles. The
        // avatar's own collision step runs on the same live point next frame.
        if (lastSimResult.playerPushOut) {
          playerPosition.x += lastSimResult.playerPushOut.x;
          playerPosition.y += lastSimResult.playerPushOut.y;
        }

        if (config.onPlayerContactWildlife) {
          const cooldowns =
            playerContactDiseaseLastRollAtMsByInstanceIdRef.current;

          for (const event of lastSimResult.playerContactEvents) {
            const lastRollAtMs = cooldowns.get(event.instanceId) ?? 0;

            if (
              nowMs - lastRollAtMs >=
              RENDERING_WILDLIFE_CONTACT_DISEASE_COOLDOWN_MS
            ) {
              cooldowns.set(event.instanceId, nowMs);
              config.onPlayerContactWildlife(event, nowMs);
            }
          }
        }
      }
    }

    const nextInstances = listingWildlifeInstances(store);
    recordingWildlifePerformanceDiagnostics({
      instances: nextInstances,
      presentationInstanceIds:
        wildlifeImperativePresentationRegistryRef.current,
      playerPosition,
      presentationCullGridRadius:
        performanceProfile.wildlifePresentationCullGridRadius,
      simulationStepsThisFrame: simStepsThisFrame,
      simulationBacklogMs: simAccumulatorMsRef.current,
      isSimulationLeader,
      snapshotCount,
      playerContactCount,
    });

    if (config.projectileTargetsOutRef?.current) {
      config.projectileTargetsOutRef.current.length = 0;

      for (const instance of nextInstances) {
        if (instance.isDead) {
          continue;
        }

        const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

        if (!species) {
          continue;
        }

        config.projectileTargetsOutRef.current.push({
          targetId: instance.instanceId,
          point: instance.position,
          collisionRadiusGrid:
            resolvingWildlifeInstanceCollisionRadiusGrid(species, instance) +
            0.15,
          jumpArcOffsetPx: instance.aiState.jumpState
            ? computingWildlifeJumpArcLiftPx(
                species.jump.jumpArcPeakPx,
                instance.aiState.jumpState.progress
              )
            : 0,
        });
      }
    }

    if (config.wildlifeFloatingCombatTextsOutRef?.current) {
      config.wildlifeFloatingCombatTextsOutRef.current.length = 0;

      for (const instance of nextInstances) {
        if (instance.floatingTexts.length === 0) {
          continue;
        }

        const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

        if (!species) {
          continue;
        }

        for (const floatText of instance.floatingTexts) {
          config.wildlifeFloatingCombatTextsOutRef.current.push({
            instanceId: instance.instanceId,
            floatText,
            gridX: instance.position.x,
            gridY: instance.position.y,
            layer: resolvingWorldPlazaPlayerWorldLayer(instance.position),
            sizeScale: resolvingWildlifeInstanceSizeScale(species, instance),
            jumpArcOffsetPx: instance.aiState.jumpState
              ? computingWildlifeJumpArcLiftPx(
                  species.jump.jumpArcPeakPx,
                  instance.aiState.jumpState.progress
                )
              : 0,
          });
        }
      }
    }

    if (config.wildlifeSpeechBubblesOutRef?.current) {
      config.wildlifeSpeechBubblesOutRef.current.length = 0;

      for (const instance of nextInstances) {
        const activeBubble = instance.speechState?.activeBubble;

        if (!activeBubble || activeBubble.expiresAtMs <= nowMs) {
          continue;
        }

        const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

        if (!species) {
          continue;
        }

        config.wildlifeSpeechBubblesOutRef.current.push({
          instanceId: instance.instanceId,
          message: activeBubble.message,
          presentation: activeBubble.presentation,
          gridX: instance.position.x,
          gridY: instance.position.y,
          layer: resolvingWorldPlazaPlayerWorldLayer(instance.position),
          sizeScale: resolvingWildlifeInstanceSizeScale(species, instance),
          frameHeightPx: resolvingWildlifeSpriteSheetFrameHeightPx(
            species.spriteFolder
          ),
          jumpArcOffsetPx: instance.aiState.jumpState
            ? computingWildlifeJumpArcLiftPx(
                species.jump.jumpArcPeakPx,
                instance.aiState.jumpState.progress
              )
            : 0,
        });
      }
    }

    if (config.wildlifeNameTagsOutRef?.current) {
      const wildlifeDamagedPlayerAtMsByInstanceId =
        config.wildlifeDamagedPlayerAtMsByInstanceIdRef?.current;

      if (wildlifeDamagedPlayerAtMsByInstanceId) {
        for (const [
          instanceId,
          damagedAtMs,
        ] of wildlifeDamagedPlayerAtMsByInstanceId) {
          if (
            nowMs - damagedAtMs >
            DEFINING_WILDLIFE_NAME_TAG_RECENT_COMBAT_REVEAL_MS
          ) {
            wildlifeDamagedPlayerAtMsByInstanceId.delete(instanceId);
          }
        }
      }

      const nameTagUpdate = updatingWildlifeNameTagsOverlayRef({
        outRef: config.wildlifeNameTagsOutRef.current,
        instances: nextInstances,
        playerPosition,
        playerFacingDirection:
          config.localAvatarMotionStateRef?.current.facingDirection ?? 'Down',
        playerUserId: config.localUserId,
        nowMs,
        hoveredInstanceId: config.wildlifeHoveredInstanceIdRef?.current ?? null,
        wildlifeDamagedPlayerAtMsByInstanceId:
          wildlifeDamagedPlayerAtMsByInstanceId ?? new Map(),
        labelCache: wildlifeNameTagLabelCacheRef.current,
        resolveSpecies: resolvingWildlifeSpeciesDefinition,
      });

      if (
        nameTagUpdate.didMountSetChange &&
        config.wildlifeNameTagsMountRevisionRef
      ) {
        config.wildlifeNameTagsMountRevisionRef.current += 1;
      }
    }

    const liveSpeciesIds = new Set<string>();

    for (const instance of nextInstances) {
      liveSpeciesIds.add(instance.speciesId);
    }

    liveSpeciesIdsRef.current = liveSpeciesIds;

    if (liveSpeciesIds.size > 0) {
      recordingWildlifeSpeciesTextureResidence([...liveSpeciesIds], nowMs);
    }

    if (
      nowMs - lastTextureEvictionCheckMsRef.current >=
        DEFINING_WILDLIFE_TEXTURE_EVICTION_CHECK_INTERVAL_MS &&
      playerPosition
    ) {
      lastTextureEvictionCheckMsRef.current = nowMs;
      const proximateSpeciesIds =
        resolvingWildlifeProximateSpeciesIdsAtWorldPoint(
          playerPosition,
          resolvingWildlifeTextureEvictionProfile()
        );
      void advancingWildlifeSpeciesTextureEviction({
        nowMs,
        gettingLiveSpeciesIds: () => liveSpeciesIdsRef.current,
        proximateSpeciesIds,
        onEvictedSpeciesId: (speciesId) => {
          loadedSpeciesRef.current.delete(speciesId);
        },
      }).then((evictedSpeciesIds) => {
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.WILDLIFE_TEXTURE_EVICTION,
          evictedSpeciesIds.length
        );
      });
    }

    if (nextInstances.length === 0 && instances.length === 0) {
      return;
    }

    for (const instance of nextInstances) {
      const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

      if (!species || loadedSpeciesRef.current.has(species.speciesId)) {
        continue;
      }

      loadedSpeciesRef.current.add(species.speciesId);
      incrementingWorldPlazaPerformanceDiagnosticsCounter(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.WILDLIFE_TEXTURE_LOAD_REQUEST
      );
      void ensuringWildlifeAnimationClipsRegistered(
        species,
        loadingWildlifeSpeciesTextures
      ).catch(() => {
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.WILDLIFE_TEXTURE_LOAD_FAILURE
        );
        // Allow a later tick to retry after a transient CDN / sheet failure.
        loadedSpeciesRef.current.delete(species.speciesId);
      });
    }

    const finishWildlifeRenderSyncSample = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.WILDLIFE_RENDER_SYNC
    );
    syncingWildlifeInstancesImperativePresentation({
      registry: wildlifeImperativePresentationRegistryRef.current,
      instances: nextInstances,
      placedBlocks: placedBlocksScene?.blocks ?? [],
      placedBlocksByTile: placedBlocksScene?.blocksByTile,
      nowMs,
      playerPosition: config.playerPositionRef.current,
      presentationCullGridRadius:
        performanceProfile.wildlifePresentationCullGridRadius,
    });
    finishWildlifeRenderSyncSample();

    if (
      nowMs - lastRenderReconcileAtMsRef.current >=
      performanceProfile.wildlifePresentationReconcileIntervalMs
    ) {
      lastRenderReconcileAtMsRef.current = nowMs;
      const nextRenderStructuralFingerprint =
        computingWildlifeRenderStructuralFingerprint(nextInstances);

      if (
        renderStructuralFingerprintRef.current !==
        nextRenderStructuralFingerprint
      ) {
        renderStructuralFingerprintRef.current =
          nextRenderStructuralFingerprint;
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.WILDLIFE_REACT_RECONCILE
        );
        setInstances(nextInstances);
      }
    }
  }, 'tick:wildlife');

  if (instances.length === 0) {
    return null;
  }

  const placedBlocksScene = tickConfigRef.current.placedBlocksRef?.current;

  return (
    <>
      {instances.map((instance) => {
        const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

        if (!species) {
          return null;
        }

        const healthRatio = Math.min(
          1,
          Math.max(
            0,
            instance.healthState.baseMaxHealth > 0
              ? instance.healthState.currentHealth /
                  instance.healthState.baseMaxHealth
              : 0
          )
        );

        const jumpState = instance.aiState.jumpState;
        const jumpLiftPx = jumpState
          ? computingWildlifeJumpArcLiftPx(
              species.jump.jumpArcPeakPx,
              jumpState.progress
            )
          : 0;
        const spriteAlpha = instance.isDead
          ? computingWildlifeCorpseFadeAlpha(
              instance.diedAtMs,
              renderNowMsRef.current
            )
          : 1;

        if (instance.isDead && spriteAlpha <= 0) {
          return null;
        }

        return (
          <RenderingWildlifeInstanceSprite
            key={instance.instanceId}
            instanceId={instance.instanceId}
            speciesId={instance.speciesId}
            imperativePresentationRegistryRef={
              wildlifeImperativePresentationRegistryRef
            }
            positionX={instance.position.x}
            positionY={instance.position.y}
            standingLayer={resolvingWorldPlazaPlayerWorldLayer(
              instance.position
            )}
            placedBlocks={placedBlocksScene?.blocks ?? []}
            placedBlocksByTile={placedBlocksScene?.blocksByTile}
            facingDirection={
              instance.facingDirection as DefiningWorldPlazaGirlSampleWalkDirection
            }
            motionClip={instance.aiState.motionClip}
            isMoving={instance.aiState.isMoving}
            sizeScale={resolvingWildlifeInstanceSizeScale(species, instance)}
            locomotionAnimationSpeedScale={resolvingWildlifeLocomotionAnimationSpeedScale(
              species,
              instance,
              instance.aiState.motionClip
            )}
            healthRatio={healthRatio}
            staminaRatio={quantizingWildlifeRenderVitalsRatio(
              instance.staminaState.staminaRatio
            )}
            isDead={instance.isDead}
            spriteAlpha={spriteAlpha}
            jumpLiftPx={jumpLiftPx}
            jumpArcPeakPx={species.jump.jumpArcPeakPx}
          />
        );
      })}
    </>
  );
}
