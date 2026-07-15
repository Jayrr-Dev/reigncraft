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
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
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
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import {
  beginningWorldPlazaPerformanceSample,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { resolvingWorldPlazaDayNightCycleSample } from '@/components/world/domains/resolvingWorldPlazaDayNightCycleSample';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { resolvingWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import {
  ensuringWorldPlazaHungerTierSpriteTexturesLoaded,
  peekingWorldPlazaHungerTierSpriteTexture,
} from '@/components/world/hunger/domains/loadingWorldPlazaHungerTierSpriteTextures';
import {
  clearingWorldPlazaLightSourcesForOwner,
  syncingWorldPlazaLightSourcesForOwner,
} from '@/components/world/lighting/domains/managingWorldPlazaLightSourceStore';
import {
  advancingWildlifeSimulationTick,
  applyingWildlifeInstanceDamage,
} from '@/components/world/wildlife/domains/advancingWildlifeSimulationTick';
import { advancingWildlifeSpeciesTextureEviction } from '@/components/world/wildlife/domains/advancingWildlifeSpeciesTextureEviction';
import { checkingWildlifeInstanceShowsHungerUi } from '@/components/world/wildlife/domains/checkingWildlifeInstanceIsOwnedPet';
import { checkingWildlifeIsGodSpawn } from '@/components/world/wildlife/domains/checkingWildlifeIsGodSpawn';
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
  computingWildlifeRenderStructuralFingerprint,
  quantizingWildlifeRenderHungerCircleRatio,
  quantizingWildlifeRenderVitalsRatio,
} from '@/components/world/wildlife/domains/computingWildlifeRenderStructuralFingerprint';
import { DEFINING_WILDLIFE_CYROBORN_SPECIES_ID } from '@/components/world/wildlife/domains/definingWildlifeCyrobornConstants';
import { DEFINING_WILDLIFE_FAIRY_LIGHT_OWNER_KEY } from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';
import { DEFINING_WILDLIFE_GOD_SPAWN_SPRITE_TINT } from '@/components/world/wildlife/domains/definingWildlifeGodSpawnConstants';
import { DEFINING_WILDLIFE_NAME_TAG_RECENT_COMBAT_REVEAL_MS } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeSimulationTickConfig } from '@/components/world/wildlife/domains/definingWildlifeSimulationTickConfig';
import {
  DEFINING_WILDLIFE_SIMULATION_MAX_STEPS_PER_FRAME,
  DEFINING_WILDLIFE_SIMULATION_TICK_MS,
} from '@/components/world/wildlife/domains/definingWildlifeSimulationTimestepConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeMotionClipKind } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import { DEFINING_WILDLIFE_TEXTURE_EVICTION_CHECK_INTERVAL_MS } from '@/components/world/wildlife/domains/definingWildlifeTextureEvictionConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  DEFINING_WILDLIFE_VITALS_BAR_LIFT_PX,
  DEFINING_WILDLIFE_VITALS_BAR_Z_INDEX_OFFSET,
} from '@/components/world/wildlife/domains/definingWildlifeVitalsBarConstants';
import { drawingWildlifeCyrobornGlowOrbOnGraphics } from '@/components/world/wildlife/domains/drawingWildlifeCyrobornGlowOrbOnGraphics';
import { drawingWildlifeFairyGlowOrbOnGraphics } from '@/components/world/wildlife/domains/drawingWildlifeFairyGlowOrbOnGraphics';
import { drawingWildlifeVitalsOnGraphics } from '@/components/world/wildlife/domains/drawingWildlifeVitalsOnGraphics';
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
import { resolvingWildlifeFairyLightSources } from '@/components/world/wildlife/domains/resolvingWildlifeFairyLightSources';
import { resolvingWildlifeGlowOrbHoverLiftPx } from '@/components/world/wildlife/domains/resolvingWildlifeGlowOrbHoverOffsetPx';
import {
  resolvingWildlifeInstanceCollisionRadiusGrid,
  resolvingWildlifeInstanceMaxStaminaRatio,
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
import { updatingWildlifeForageEatOverlaysRef } from '@/components/world/wildlife/domains/updatingWildlifeForageEatOverlaysRef';
import {
  updatingWildlifeNameTagsOverlayRef,
  type UpdatingWildlifeNameTagLabelCacheEntry,
} from '@/components/world/wildlife/domains/updatingWildlifeNameTagsOverlayRef';
import { updatingWildlifeStatusHudOverlaysRef } from '@/components/world/wildlife/domains/updatingWildlifeStatusHudOverlaysRef';
import type { Graphics, Sprite } from 'pixi.js';
import { memo, useEffect, useRef, useState } from 'react';

export type RenderingWildlifeLayerProps = {
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
  tickConfigRef: React.RefObject<DefiningWildlifeSimulationTickConfig>;
};

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
  hungerRatio: number;
  /** Familiar+ companion (`hungerUi`); wild / pre-Familiar never show hunger orbs. */
  isDomesticatedPet: boolean;
  isDead: boolean;
  spriteAlpha: number;
  spriteTint: number;
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
    hungerRatio,
    isDomesticatedPet,
    isDead,
    spriteAlpha,
    spriteTint,
    jumpLiftPx,
    jumpArcPeakPx,
  }: RenderingWildlifeInstanceSpriteProps): React.JSX.Element | null {
    const species = resolvingWildlifeSpeciesDefinition(speciesId);
    const wildlifeSpriteRef = useRef<Sprite | null>(null);
    const wildlifeOrbGraphicsRef = useRef<Graphics | null>(null);
    const wildlifeShadowGraphicsRef = useRef<Graphics | null>(null);
    const wildlifeVitalsGraphicsRef = useRef<Graphics | null>(null);
    const wildlifeHungerIconSpriteRef = useRef<Sprite | null>(null);
    const [hungerIconTextureRevision, setHungerIconTextureRevision] =
      useState(0);
    const usesGlowOrb =
      species !== null &&
      checkingWildlifeSpeciesUsesGlowOrbPresentation(species);

    useEffect(() => {
      const registry = imperativePresentationRegistryRef.current;

      if (!registry) {
        return;
      }

      registeringWildlifeInstanceImperativePresentation(registry, instanceId, {
        spriteRef: wildlifeSpriteRef,
        orbGraphicsRef: wildlifeOrbGraphicsRef,
        shadowGraphicsRef: wildlifeShadowGraphicsRef,
        vitalsGraphicsRef: wildlifeVitalsGraphicsRef,
        hungerIconSpriteRef: wildlifeHungerIconSpriteRef,
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

    const showHungerCircleFeature =
      isDomesticatedPet &&
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_HUNGER_CIRCLE
      );

    useEffect(() => {
      if (!showHungerCircleFeature) {
        return;
      }

      let isCancelled = false;

      void ensuringWorldPlazaHungerTierSpriteTexturesLoaded()
        .then(() => {
          if (!isCancelled) {
            setHungerIconTextureRevision((revision) => revision + 1);
          }
        })
        .catch(() => {
          // Hunger icon stays hidden if the HUD sheet fails to decode.
        });

      return () => {
        isCancelled = true;
      };
    }, [showHungerCircleFeature]);

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
    const vitalsVisibility = checkingWildlifeVitalsGraphicsShouldShow({
      isDead,
      isImmortal: checkingWildlifeSpeciesIsImmortal(species),
      healthRatio,
      staminaRatio,
      showHungerCircle: showHungerCircleFeature,
    });
    const hungerCircleLayout = computingWildlifeHungerCircleLocalLayout(
      vitalsVisibility.showBars
    );
    const hungerTier = resolvingWorldPlazaHungerTier(hungerRatio);
    // `hungerIconTextureRevision` forces a re-render after the tier sheet loads.
    const hungerIconTexture =
      vitalsVisibility.showHungerCircle && hungerIconTextureRevision >= 0
        ? peekingWorldPlazaHungerTierSpriteTexture(hungerTier)
        : null;
    const vitalsY =
      anchoredScreenY -
      jumpLiftPx -
      DEFINING_WILDLIFE_VITALS_BAR_LIFT_PX * sizeScale;
    const vitalsZIndex = sortKey + DEFINING_WILDLIFE_VITALS_BAR_Z_INDEX_OFFSET;
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
        {!isDead && !usesGlowOrb ? (
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
        {usesGlowOrb ? (
          <pixiGraphics
            ref={wildlifeOrbGraphicsRef}
            eventMode="none"
            x={screenPoint.x}
            y={
              anchoredScreenY -
              jumpLiftPx -
              (isDead ? 0 : resolvingWildlifeGlowOrbHoverLiftPx(speciesId))
            }
            zIndex={sortKey}
            alpha={spriteAlpha}
            draw={(graphics: Graphics) => {
              if (speciesId === DEFINING_WILDLIFE_CYROBORN_SPECIES_ID) {
                drawingWildlifeCyrobornGlowOrbOnGraphics(graphics, {
                  nowMs: performance.now(),
                  alphaScale: spriteAlpha,
                  isDead,
                });
                return;
              }

              drawingWildlifeFairyGlowOrbOnGraphics(graphics, {
                nowMs: performance.now(),
                alphaScale: spriteAlpha,
                isDead,
              });
            }}
          />
        ) : (
          <RenderingWorldPlazaDeclarativeAnimatedSprite
            externalSpriteRef={wildlifeSpriteRef}
            playback={{
              clipId,
              variantKey: facingDirection,
              playing: playsLocomotionClip ? isMoving : true,
              speedScale: playsLocomotionClip
                ? locomotionAnimationSpeedScale
                : 1,
            }}
            tickMode="shared"
            position={{ x: screenPoint.x, y: anchoredScreenY - jumpLiftPx }}
            anchor={{ x: 0.5, y: spritePresentation.anchorYNormalized }}
            scale={sizeScale}
            zIndex={sortKey}
            alpha={spriteAlpha}
            tint={spriteTint}
          />
        )}
        {vitalsVisibility.showGraphics ? (
          <pixiGraphics
            ref={wildlifeVitalsGraphicsRef}
            eventMode="none"
            zIndex={vitalsZIndex}
            x={screenPoint.x}
            y={vitalsY}
            draw={(graphics: Graphics) => {
              drawingWildlifeVitalsOnGraphics({
                graphics,
                healthRatio,
                staminaRatio,
                hungerRatio,
                showHungerCircle: vitalsVisibility.showHungerCircle,
                showBars: vitalsVisibility.showBars,
              });
            }}
          />
        ) : null}
        {vitalsVisibility.showGraphics &&
        vitalsVisibility.showHungerCircle &&
        hungerIconTexture ? (
          <pixiSprite
            ref={wildlifeHungerIconSpriteRef}
            eventMode="none"
            texture={hungerIconTexture}
            anchor={0.5}
            width={hungerCircleLayout.iconSizePx}
            height={hungerCircleLayout.iconSizePx}
            x={screenPoint.x + hungerCircleLayout.centerX}
            y={vitalsY + hungerCircleLayout.centerY}
            zIndex={vitalsZIndex + 1}
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
  const wildlifeImperativePresentationRegistryRef =
    useRef<SyncingWildlifeInstancesImperativePresentationRegistry>(new Map());

  useEffect(() => {
    return () => {
      clearingWorldPlazaLightSourcesForOwner(
        DEFINING_WILDLIFE_FAIRY_LIGHT_OWNER_KEY
      );
    };
  }, []);

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
              playerTransformWildlifeSpeciesId:
                config.playerTransformWildlifeSpeciesIdRef?.current ?? null,
              resolveSpecies: resolvingWildlifeSpeciesDefinition,
              deltaSeconds: DEFINING_WILDLIFE_SIMULATION_TICK_MS / 1000,
              nowMs,
              placedBlocks: placedBlocksScene?.blocks ?? [],
              placedBlocksByTile: placedBlocksScene?.blocksByTile,
              isDaytime: cycleSample.isDaytime,
              onPlayerHitByWildlife: config.onPlayerHitByWildlife,
              onWildlifeSpawnProjectile: config.onWildlifeSpawnProjectile,
              isLeader,
              remoteSnapshots: config.remoteWildlifeSnapshotsRef?.current ?? [],
              meatDropContext: config.meatDropContextRef?.current
                ? {
                    ...config.meatDropContextRef.current,
                    playerPosition,
                  }
                : null,
              npcPreyTargets: config.npcPreyTargetsRef?.current ?? [],
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
          for (const event of lastSimResult.playerContactEvents) {
            config.onPlayerContactWildlife(event, nowMs);
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

      if (
        checkingWorldPlazaGenerationFeatureEnabled(
          DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_DAMAGE_NUMBERS
        )
      ) {
        for (const instance of nextInstances) {
          if (instance.floatingTexts.length === 0) {
            continue;
          }

          const species = resolvingWildlifeSpeciesDefinition(
            instance.speciesId
          );

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
    }

    if (config.wildlifeSpeechBubblesOutRef?.current) {
      config.wildlifeSpeechBubblesOutRef.current.length = 0;

      if (
        checkingWorldPlazaGenerationFeatureEnabled(
          DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_SPEECH_BUBBLES
        )
      ) {
        for (const instance of nextInstances) {
          const activeBubble = instance.speechState?.activeBubble;

          if (!activeBubble || activeBubble.expiresAtMs <= nowMs) {
            continue;
          }

          const species = resolvingWildlifeSpeciesDefinition(
            instance.speciesId
          );

          if (!species) {
            continue;
          }

          const speechAnchorPoint =
            (checkingWildlifeSpeciesUsesGlowOrbPresentation(species) &&
              wildlifeImperativePresentationRegistryRef.current.get(
                instance.instanceId
              )?.smoothedOrbPointRef.current) ||
            instance.position;

          config.wildlifeSpeechBubblesOutRef.current.push({
            instanceId: instance.instanceId,
            message: activeBubble.message,
            presentation: activeBubble.presentation,
            gridX: speechAnchorPoint.x,
            gridY: speechAnchorPoint.y,
            layer: resolvingWorldPlazaPlayerWorldLayer(instance.position),
            sizeScale: resolvingWildlifeInstanceSizeScale(species, instance),
            frameHeightPx:
              resolvingWildlifeSpeciesSpritePresentation(species).frameHeightPx,
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

    if (config.wildlifeForageEatOverlaysOutRef?.current) {
      updatingWildlifeForageEatOverlaysRef({
        outRef: config.wildlifeForageEatOverlaysOutRef.current,
        instances: nextInstances,
        nowMs,
        resolveSpecies: resolvingWildlifeSpeciesDefinition,
      });
    }

    if (config.wildlifeNameTagsOutRef?.current) {
      if (
        !checkingWorldPlazaGenerationFeatureEnabled(
          DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_NAME_TAGS
        )
      ) {
        config.wildlifeNameTagsOutRef.current.length = 0;
        if (config.wildlifeNameTagsMountRevisionRef) {
          config.wildlifeNameTagsMountRevisionRef.current += 1;
        }
      } else {
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

        // Glow-orb bodies (fairy) ease toward the sim point on screen; anchor
        // their name tags to the same smoothed point so tags never trail the orb.
        const nameTagInstances = nextInstances.map((instance) => {
          const species = resolvingWildlifeSpeciesDefinition(
            instance.speciesId
          );

          if (
            !species ||
            !checkingWildlifeSpeciesUsesGlowOrbPresentation(species)
          ) {
            return instance;
          }

          const smoothedPoint =
            wildlifeImperativePresentationRegistryRef.current.get(
              instance.instanceId
            )?.smoothedOrbPointRef.current;

          if (!smoothedPoint) {
            return instance;
          }

          return {
            ...instance,
            position: {
              ...instance.position,
              x: smoothedPoint.x,
              y: smoothedPoint.y,
            },
          };
        });

        const nameTagUpdate = updatingWildlifeNameTagsOverlayRef({
          outRef: config.wildlifeNameTagsOutRef.current,
          instances: nameTagInstances,
          playerPosition,
          playerFacingDirection:
            config.localAvatarMotionStateRef?.current.facingDirection ?? 'Down',
          playerUserId: config.localUserId,
          nowMs,
          hoveredInstanceId:
            config.wildlifeHoveredInstanceIdRef?.current ?? null,
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

        if (config.wildlifeStatusHudOverlaysOutRef?.current) {
          const statusHudUpdate = updatingWildlifeStatusHudOverlaysRef({
            outRef: config.wildlifeStatusHudOverlaysOutRef.current,
            instances: nameTagInstances,
            playerPosition,
            nowMs,
            hoveredInstanceId:
              config.wildlifeHoveredInstanceIdRef?.current ?? null,
            combatLockedInstanceId:
              config.wildlifeCombatLockedInstanceIdRef?.current ?? null,
            resolveSpecies: resolvingWildlifeSpeciesDefinition,
          });

          if (
            statusHudUpdate.didMountSetChange &&
            config.wildlifeStatusHudOverlaysMountRevisionRef
          ) {
            config.wildlifeStatusHudOverlaysMountRevisionRef.current += 1;
          }
        }
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

      if (
        !species ||
        checkingWildlifeSpeciesUsesGlowOrbPresentation(species) ||
        loadedSpeciesRef.current.has(species.speciesId)
      ) {
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

    if (
      checkingWorldPlazaGenerationFeatureEnabled(
        DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_FAIRY_GLOW
      )
    ) {
      syncingWorldPlazaLightSourcesForOwner(
        DEFINING_WILDLIFE_FAIRY_LIGHT_OWNER_KEY,
        resolvingWildlifeFairyLightSources(nextInstances)
      );
    } else {
      clearingWorldPlazaLightSourcesForOwner(
        DEFINING_WILDLIFE_FAIRY_LIGHT_OWNER_KEY
      );
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
      const nextRenderStructuralFingerprint = `${computingWildlifeRenderStructuralFingerprint(nextInstances)}:${
        checkingWorldPlazaGenerationFeatureEnabled(
          DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_HUNGER_CIRCLE
        )
          ? 'h1'
          : 'h0'
      }`;

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
              instance.staminaState.staminaRatio,
              resolvingWildlifeInstanceMaxStaminaRatio(instance, species)
            )}
            hungerRatio={quantizingWildlifeRenderHungerCircleRatio(
              instance.hungerState.hungerRatio
            )}
            isDomesticatedPet={checkingWildlifeInstanceShowsHungerUi(instance)}
            isDead={instance.isDead}
            spriteAlpha={spriteAlpha}
            spriteTint={
              checkingWildlifeIsGodSpawn(instance)
                ? DEFINING_WILDLIFE_GOD_SPAWN_SPRITE_TINT
                : 0xffffff
            }
            jumpLiftPx={jumpLiftPx}
            jumpArcPeakPx={species.jump.jumpArcPeakPx}
          />
        );
      })}
    </>
  );
}
