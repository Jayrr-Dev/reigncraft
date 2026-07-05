'use client';

import { applyingWorldPlazaDeclarativeAvatarMotionToSprite } from '@/components/world/animation/domains/applyingWorldPlazaDeclarativeAvatarMotionToSprite';
import type { DefiningWorldPlazaAvatarMotionClipSuffix } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { registeringWorldPlazaAvatarMotionAnimationClips } from '@/components/world/animation/domains/registeringWorldPlazaAvatarMotionAnimationClips';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { computingWorldPlazaPlayerJumpLayerReachMaxFromMultiplier } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import {
  checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex,
  resolvingWorldBuildingJumpForwardGridDistanceClampedToWall,
} from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import { syncingWorldPlazaPlayerStandingLayer } from '@/components/world/building/domains/syncingWorldPlazaPlayerStandingLayer';
import { attemptingWorldPlazaPlayerFallFromLayerDrop } from '@/components/world/domains/attemptingWorldPlazaPlayerFallFromLayerDrop';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import { checkingWorldPlazaPlayerShouldSlideOnIceAfterRun } from '@/components/world/domains/checkingWorldPlazaPlayerShouldSlideOnIceAfterRun';
import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { computingWorldPlazaGirlSampleFallDurationMs } from '@/components/world/domains/computingWorldPlazaGirlSampleFallDurationMs';
import { computingWorldPlazaGirlSampleFallVerticalOffsetPx } from '@/components/world/domains/computingWorldPlazaGirlSampleFallVerticalOffsetPx';
import { computingWorldPlazaGirlSampleJumpArcOffsetPx } from '@/components/world/domains/computingWorldPlazaGirlSampleJumpArcOffsetPx';
import {
  computingWorldPlazaIceSlideVelocity,
  resolvingWorldPlazaIceRunAnimationSpeedScale,
  type DefiningWorldPlazaIceSlideVelocity,
} from '@/components/world/domains/computingWorldPlazaIceSlideVelocity';
import { computingWorldPlazaIsometricGridDeltaFromScreenDirection } from '@/components/world/domains/computingWorldPlazaIsometricGridDeltaFromScreenDirection';
import { computingWorldPlazaIsometricGridStepTowardTarget } from '@/components/world/domains/computingWorldPlazaIsometricGridStepTowardTarget';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { resolvingWorldPlazaAvatarFootOffsetBelowGridAnchorPx } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import { DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET } from '@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants';
import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK,
  type DefiningWorldPlazaAvatarMotionKind,
  type DefiningWorldPlazaAvatarMotionState,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import type { DefiningWorldPlazaFallState } from '@/components/world/domains/definingWorldPlazaFallState';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_READY_IDLE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaGirlSampleIdleConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_ARC_PEAK_SCREEN_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_FORWARD_GRID_DISTANCE,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_ARC_PEAK_SCREEN_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_FORWARD_GRID_DISTANCE,
} from '@/components/world/domains/definingWorldPlazaGirlSampleJumpConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { DEFINING_WORLD_PLAZA_ICE_SLIDE_SCREEN_RUN_SPEED_PER_SECOND } from '@/components/world/domains/definingWorldPlazaIceSlideConstants';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_SCREEN_RUN_SPEED_PER_SECOND,
  DEFINING_WORLD_PLAZA_ISOMETRIC_SCREEN_WALK_SPEED_PER_SECOND,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaJumpState } from '@/components/world/domains/definingWorldPlazaJumpState';
import type { DefiningWorldPlazaMovementDirection } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import { checkingWorldPlazaMovementDirectionIsActive } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  computingWorldPlazaAvatarGroundShadowJumpHeightRatio,
  drawingWorldPlazaAvatarGroundShadowOnGraphics,
  updatingWorldPlazaAvatarGroundShadowGraphics,
} from '@/components/world/domains/drawingWorldPlazaAvatarGroundShadowOnGraphics';
import {
  beginningWorldPlazaPerformanceSample,
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { resolvingWorldPlazaAvatarBodyEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaAvatarGroundShadowEntityZIndex';
import { resolvingWorldPlazaEjectingPlayerFromBlockedWorldPoint } from '@/components/world/domains/resolvingWorldPlazaBlockedWorldPoint';
import { resolvingWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirection';
import { resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection';
import { resolvingWorldPlazaIceSlideFrozenRunFrameIndex } from '@/components/world/domains/resolvingWorldPlazaIceSlideFrozenRunFrameIndex';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { resolvingWorldPlazaJumpLandingGridPointAlongPath } from '@/components/world/domains/resolvingWorldPlazaJumpLandingGridPointAlongPath';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { checkingWorldPlazaTerrainBlocksJumpLandingAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature';
import { computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha } from '@/components/world/health/domains/computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { resolvingWorldPlazaEntityHealthMovementMultipliers } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthMovementMultipliers';
import type { ResolvingWorldPlazaHungerMovementEffects } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerMovementEffects';
import { usingWorldPlazaSelectedAvatarCharacterDefinition } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarCharacterDefinition';
import { useTick } from '@pixi/react';
import { useQuery } from '@tanstack/react-query';
import type { Container, Graphics, Sprite, Ticker } from 'pixi.js';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Below this grid distance moved in a frame, a click-walk pressing into a tree
 * trunk is treated as blocked and the walk target is dropped (avoids the avatar
 * grinding its walk animation forever against a trunk).
 */
const DEFINING_WORLD_PLAZA_AVATAR_WALK_BLOCKED_GRID_EPSILON = 0.002;

/** Below this length, reuse the last non-zero frame movement for cliff lip relief. */
const DEFINING_WORLD_PLAZA_AVATAR_CLIFF_LIP_MOVEMENT_REUSE_EPSILON = 1e-5;

export interface RenderingWorldPlazaGirlSampleWalkAvatarProps {
  /** Shared player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Auth user id for live render-position registry writes. */
  localUserId: string | null;
  /** Live avatar render positions shared with chat bubbles. */
  playerRenderPositionRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  /** Click destination; null when not walking. */
  walkTargetRef: React.RefObject<DefiningWorldPlazaWorldPoint | null>;
  /** Updated each frame while walking toward a click target. */
  isWalkingRef: React.RefObject<boolean>;
  /** True while hold-to-run movement is active (owned by the stamina loop). */
  isRunningRef: React.RefObject<boolean>;
  /** Set by the jump input hook; consumed when a jump starts. */
  jumpRequestedRef: React.RefObject<boolean>;
  /** Spends stamina for a jump; returns false when the jump is blocked. */
  tryConsumingJumpStaminaRef: React.RefObject<(isRunJump: boolean) => boolean>;
  /** True while a jump animation is in progress. */
  isJumpingRef: React.RefObject<boolean>;
  /** Live motion state synced to Colyseus each frame. */
  localAvatarMotionStateRef: React.RefObject<DefiningWorldPlazaAvatarMotionState>;
  /** Sends position and motion immediately (e.g. on jump start). */
  syncingMovePositionRef?: React.RefObject<(() => void) | null>;
  /** Optional hook invoked when the avatar reaches the click target or lands. */
  onWalkArrivedRef?: React.RefObject<(() => void) | null>;
  /** Optional hook invoked after each click-walk step while moving. */
  onWalkStepRef?: React.RefObject<(() => void) | null>;
  /** Optional hook invoked when a layer-drop fall finishes landing. */
  onFallLandedRef?: React.RefObject<((layerDelta: number) => void) | null>;
  /** Set when a collision box stops movement; cleared on the next pointer input. */
  isWalkPausedByCollisionRef: React.RefObject<boolean>;
  /** Held arrow keys and WASD direction from keyboard input. */
  keyboardDirectionRef: React.RefObject<DefiningWorldPlazaMovementDirection>;
  /** Player-placed blocks near the avatar for collision resolution. */
  placedBlocksRef?: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
  /** Idle turn-in-place facing updated by Q/E and movement. */
  characterFacingDirectionRef: React.RefObject<DefiningWorldPlazaGirlSampleWalkDirection>;
  /** True while actively running on frozen water; drives faster ice run stamina drain. */
  isRunningOnIceRef?: React.RefObject<boolean>;
  /** When true, the avatar stops moving while dead. */
  isPlayerDeadRef?: React.RefObject<boolean>;
  /** Post-respawn invincibility expiry for sprite blink feedback. */
  postRespawnInvincibilityUntilMsRef?: React.RefObject<number>;
  /** Live player health state for movement buff multipliers. */
  healthStateRef?: React.RefObject<DefiningWorldPlazaEntityHealthState>;
  /** Live hunger tier movement effects (speed gates, jump lockout). */
  hungerMovementMultipliersRef?: React.RefObject<ResolvingWorldPlazaHungerMovementEffects>;
}

/**
 * Local plaza test avatar using GirlSample isometric walk, run, and jump strips.
 */
export function RenderingWorldPlazaGirlSampleWalkAvatar({
  playerPositionRef,
  localUserId,
  playerRenderPositionRegistryRef,
  walkTargetRef,
  isWalkingRef,
  isRunningRef,
  jumpRequestedRef,
  tryConsumingJumpStaminaRef,
  isJumpingRef,
  localAvatarMotionStateRef,
  syncingMovePositionRef,
  onWalkArrivedRef,
  onWalkStepRef,
  onFallLandedRef,
  isWalkPausedByCollisionRef,
  keyboardDirectionRef,
  placedBlocksRef,
  characterFacingDirectionRef,
  isRunningOnIceRef,
  isPlayerDeadRef,
  postRespawnInvincibilityUntilMsRef,
  healthStateRef,
  hungerMovementMultipliersRef,
}: RenderingWorldPlazaGirlSampleWalkAvatarProps): React.JSX.Element | null {
  const characterDefinition =
    usingWorldPlazaSelectedAvatarCharacterDefinition();
  const avatarShadowContainerRef = useRef<Container | null>(null);
  const avatarGroundShadowGraphicsRef = useRef<Graphics | null>(null);
  const avatarContainerRef = useRef<Container | null>(null);
  const avatarSpriteRef = useRef<Sprite | null>(null);
  const animationTimeRef = useRef(0);
  const jumpStateRef = useRef<DefiningWorldPlazaJumpState | null>(null);
  const fallStateRef = useRef<DefiningWorldPlazaFallState | null>(null);
  const walkDirectionRef = useRef<DefiningWorldPlazaGirlSampleWalkDirection>(
    characterDefinition.defaultDirection
  );
  const previousMotionKindRef = useRef<DefiningWorldPlazaAvatarMotionKind>(
    DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE
  );
  const inactiveSinceMsRef = useRef<number | null>(null);
  const previousReadyIdleActiveRef = useRef(false);
  const lastLocomotionWasRunRef = useRef(false);
  const lastFrameMovementDeltaRef = useRef({ x: 0, y: 0 });
  /** Live grid velocity for ice run momentum and post-stop slide. */
  const iceSlideVelocityRef = useRef<DefiningWorldPlazaIceSlideVelocity>({
    x: 0,
    y: 0,
  });
  /** Run strip frame held still while the avatar slides after releasing input on ice. */
  const iceSlideFrozenRunFrameIndexRef = useRef<number | null>(null);
  /** True after an ice run until the post-run slide fully settles. */
  const wasRunningOnIceRef = useRef(false);

  const { data: characterTextures } = useQuery({
    queryKey: characterDefinition.texturesQueryKey,
    queryFn: characterDefinition.loadTextures,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const registeredAvatarClipSkinIdRef = useRef<string | null>(null);

  if (
    characterTextures &&
    registeredAvatarClipSkinIdRef.current !== characterDefinition.skinId
  ) {
    registeringWorldPlazaAvatarMotionAnimationClips({
      characterDefinition,
      textures: characterTextures,
    });
    registeredAvatarClipSkinIdRef.current = characterDefinition.skinId;
  }

  const drawingAvatarGroundShadow = useCallback(
    (graphics: Graphics): void => {
      avatarGroundShadowGraphicsRef.current = graphics;
      drawingWorldPlazaAvatarGroundShadowOnGraphics(
        graphics,
        0,
        walkDirectionRef.current,
        resolvingWorldPlazaAvatarFootOffsetBelowGridAnchorPx(
          characterDefinition
        )
      );
    },
    [characterDefinition]
  );

  const attachingAvatarSprite = useCallback(
    (sprite: Sprite | null): void => {
      avatarSpriteRef.current = sprite;

      if (!sprite) {
        return;
      }

      sprite.anchor.set(
        characterDefinition.anchorXNormalized,
        characterDefinition.anchorYNormalized
      );
      sprite.scale.set(characterDefinition.spriteScale);
      sprite.eventMode = 'none';
    },
    [characterDefinition]
  );

  useEffect(() => {
    const sprite = avatarSpriteRef.current;

    if (!sprite || !characterTextures) {
      return;
    }

    sprite.anchor.set(
      characterDefinition.anchorXNormalized,
      characterDefinition.anchorYNormalized
    );
    sprite.scale.set(characterDefinition.spriteScale);
    applyingWorldPlazaDeclarativeAvatarMotionToSprite({
      sprite,
      skinId: characterDefinition.skinId,
      motionSuffix: 'walk',
      direction: walkDirectionRef.current,
      frameIndex: 0,
    });
  }, [characterTextures, characterDefinition]);

  useTick((ticker: Ticker) => {
    const finishAvatarTickSample = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AVATAR_TICK
    );
    const shadowContainer = avatarShadowContainerRef.current;
    const container = avatarContainerRef.current;
    const sprite = avatarSpriteRef.current;
    const playerPosition = playerPositionRef.current;
    const placedBlocksScene = placedBlocksRef?.current;
    const scenePlacedBlocks = placedBlocksScene?.blocks ?? [];
    const scenePlacedBlocksByTile = placedBlocksScene?.blocksByTile;
    const walkTarget = walkTargetRef.current;
    const keyboardDirection = keyboardDirectionRef.current;
    const isKeyboardMoving =
      checkingWorldPlazaMovementDirectionIsActive(keyboardDirection);

    if (isKeyboardMoving) {
      if (walkTargetRef.current !== null) {
        walkTargetRef.current = null;
      }

      isWalkingRef.current = true;
      isWalkPausedByCollisionRef.current = false;
    } else if (walkTarget === null) {
      isWalkingRef.current = false;
    }

    const jumpState = jumpStateRef.current;
    const fallState = fallStateRef.current;
    const isJumping = jumpState !== null;
    const isFalling = fallState !== null;

    isJumpingRef.current = isJumping || isFalling;

    if (
      !shadowContainer ||
      !container ||
      !sprite ||
      !playerPosition ||
      !characterTextures
    ) {
      finishAvatarTickSample();
      return;
    }

    container.visible =
      checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.AVATARS
      );

    if (isRunningOnIceRef) {
      isRunningOnIceRef.current = false;
    }

    const isPlayerDead = isPlayerDeadRef?.current ?? false;

    if (isPlayerDead) {
      walkTargetRef.current = null;
      isWalkingRef.current = false;
      isRunningRef.current = false;
      isWalkPausedByCollisionRef.current = true;
      jumpStateRef.current = null;
      fallStateRef.current = null;
      isJumpingRef.current = false;
      finishAvatarTickSample();
      return;
    }

    const preStepPositionX = playerPosition.x;
    const preStepPositionY = playerPosition.y;
    const movementMultipliers = healthStateRef?.current
      ? resolvingWorldPlazaEntityHealthMovementMultipliers(
          healthStateRef.current,
          performance.now()
        )
      : {
          speedMultiplier: 1,
          jumpDistanceMultiplier: 1,
          jumpArcMultiplier: 1,
          jumpLayerReachMultiplier: 1,
          staminaDrainMultiplier: 1,
          staminaRegenMultiplier: 1,
          staminaJumpCostMultiplier: 1,
        };
    const hungerMovementEffects = hungerMovementMultipliersRef?.current ?? {
      speedMultiplier: 1,
      staminaDrainMultiplier: 1,
      staminaRegenMultiplier: 1,
      jumpCostMultiplier: 1,
      isSprintDisabled: false,
      isJumpDisabled: false,
      isHealthDraining: false,
    };
    movementMultipliers.speedMultiplier *= hungerMovementEffects.speedMultiplier;
    const jumpLayerReachMax =
      computingWorldPlazaPlayerJumpLayerReachMaxFromMultiplier(
        movementMultipliers.jumpLayerReachMultiplier
      );

    let jumpArcOffsetPx = 0;
    let fallVerticalOffsetPx = 0;
    let animationFrameIndex = 0;
    let activeMotionSuffix: DefiningWorldPlazaAvatarMotionClipSuffix = 'idle';
    let activeDirection = walkDirectionRef.current;
    let isIceCoasting = false;

    if (
      !isJumping &&
      !isFalling &&
      jumpRequestedRef.current &&
      hungerMovementEffects.isJumpDisabled
    ) {
      jumpRequestedRef.current = false;
    }

    if (!isJumping && !isFalling && jumpRequestedRef.current) {
      jumpRequestedRef.current = false;

      const isRunJump =
        isRunningRef.current &&
        isWalkingRef.current &&
        (walkTargetRef.current !== null || isKeyboardMoving);
      const requestedForwardGridDistance =
        (isRunJump
          ? DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_FORWARD_GRID_DISTANCE
          : DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_FORWARD_GRID_DISTANCE) *
        movementMultipliers.jumpDistanceMultiplier;
      const jumpDirection = walkDirectionRef.current;
      const gridDirection =
        resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection(
          jumpDirection
        );
      const jumpStartLayer =
        resolvingWorldPlazaPlayerWorldLayer(playerPosition);
      const placedBlocks = scenePlacedBlocks;
      const startTile =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);
      const isJumpStartOnWater =
        checkingWorldPlazaTerrainBlocksJumpLandingAtTileIndex(
          startTile.tileX,
          startTile.tileY
        ) ||
        checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex(
          startTile.tileX,
          startTile.tileY,
          placedBlocks
        );
      const fullDistanceLandingGridPoint = {
        x: playerPosition.x + gridDirection.x * requestedForwardGridDistance,
        y: playerPosition.y + gridDirection.y * requestedForwardGridDistance,
      };
      const fullDistanceLandingTile =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(
          fullDistanceLandingGridPoint
        );
      const fullDistanceLandingSurfaceLayer =
        resolvingWorldPlazaSurfaceLayerAtTileIndex(
          fullDistanceLandingTile.tileX,
          fullDistanceLandingTile.tileY,
          placedBlocks
        );
      const forwardGridDistance =
        resolvingWorldBuildingJumpForwardGridDistanceClampedToWall(
          playerPosition,
          gridDirection,
          requestedForwardGridDistance,
          placedBlocks,
          jumpStartLayer,
          fullDistanceLandingSurfaceLayer,
          jumpLayerReachMax
        );
      const resolvedJumpLanding =
        resolvingWorldPlazaJumpLandingGridPointAlongPath(
          playerPosition,
          gridDirection,
          forwardGridDistance,
          placedBlocks,
          jumpStartLayer,
          jumpLayerReachMax
        );

      if (!isJumpStartOnWater && resolvedJumpLanding) {
        const landingGridPoint = resolvedJumpLanding.landingGridPoint;
        const jumpLandingLayer = resolvedJumpLanding.landingSurfaceLayer;

        const didConsumeJumpStamina =
          tryConsumingJumpStaminaRef.current?.(isRunJump) ?? false;

        if (didConsumeJumpStamina) {
          const arcPeakScreenPx =
            (isRunJump
              ? DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_ARC_PEAK_SCREEN_PX
              : DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_ARC_PEAK_SCREEN_PX) *
            movementMultipliers.jumpArcMultiplier;

          walkTargetRef.current = null;
          isWalkingRef.current = false;
          isRunningRef.current = false;
          isWalkPausedByCollisionRef.current = true;

          jumpStateRef.current = {
            direction: jumpDirection,
            startPosition: {
              x: playerPosition.x,
              y: playerPosition.y,
            },
            targetPosition: {
              x: landingGridPoint.x,
              y: landingGridPoint.y,
            },
            startedAtMs: performance.now(),
            networkStartedAtMs: Date.now(),
            isRunJump,
            arcPeakScreenPx,
            startLayer: jumpStartLayer,
            landingLayer: jumpLandingLayer,
          };

          isJumpingRef.current = true;
          syncingMovePositionRef?.current?.();
        }
      }
    }

    const activeJumpState = jumpStateRef.current;
    let activeFallState = fallStateRef.current;
    const jumpProgress = activeJumpState
      ? Math.min(
          1,
          (performance.now() - activeJumpState.startedAtMs) /
            DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS
        )
      : 0;
    const isLocomoting = Boolean(
      activeJumpState ||
      activeFallState ||
      isKeyboardMoving ||
      (walkTarget && isWalkingRef.current)
    );

    if (isLocomoting) {
      inactiveSinceMsRef.current = null;
      previousReadyIdleActiveRef.current = false;
    }

    const deltaSeconds = ticker.deltaMS / 1000;

    if (activeJumpState) {
      const elapsedMs = performance.now() - activeJumpState.startedAtMs;

      playerPosition.layer = activeJumpState.startLayer;
      playerPosition.x =
        activeJumpState.startPosition.x +
        (activeJumpState.targetPosition.x - activeJumpState.startPosition.x) *
          jumpProgress;
      playerPosition.y =
        activeJumpState.startPosition.y +
        (activeJumpState.targetPosition.y - activeJumpState.startPosition.y) *
          jumpProgress;

      jumpArcOffsetPx = computingWorldPlazaGirlSampleJumpArcOffsetPx(
        jumpProgress,
        activeJumpState.arcPeakScreenPx
      );
      animationFrameIndex = Math.min(
        characterDefinition.jumpSheetLayout.frameCount - 1,
        Math.floor((elapsedMs / 1000) * characterDefinition.jumpAnimationFps)
      );
      activeMotionSuffix = 'jump';
      activeDirection = activeJumpState.direction;
      lastLocomotionWasRunRef.current = activeJumpState.isRunJump;

      if (jumpProgress >= 1) {
        const landingTile =
          resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);
        playerPosition.layer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
          landingTile.tileX,
          landingTile.tileY,
          scenePlacedBlocks,
          scenePlacedBlocksByTile
        );
        walkTargetRef.current = null;
        isWalkingRef.current = false;
        isRunningRef.current = false;
        isWalkPausedByCollisionRef.current = false;
        jumpStateRef.current = null;
        isJumpingRef.current = false;
        animationTimeRef.current = 0;
        syncingMovePositionRef?.current?.();
      }
    } else if (activeFallState) {
      const elapsedMs = performance.now() - activeFallState.startedAtMs;
      const fallDurationMs = computingWorldPlazaGirlSampleFallDurationMs(
        activeFallState.layerDelta
      );
      const fallProgress = Math.min(1, elapsedMs / fallDurationMs);

      fallVerticalOffsetPx = computingWorldPlazaGirlSampleFallVerticalOffsetPx(
        fallProgress,
        activeFallState.totalDropScreenPx
      );
      animationFrameIndex =
        Math.floor((elapsedMs / 1000) * characterDefinition.fallAnimationFps) %
        characterDefinition.fallSheetLayout.frameCount;
      activeMotionSuffix = 'fall';
      activeDirection = characterDefinition.fallSpriteDirection;

      if (fallProgress >= 1) {
        const completedFallLayerDelta = activeFallState.layerDelta;
        playerPosition.layer = activeFallState.targetLayer;
        fallStateRef.current = null;
        activeFallState = null;
        animationTimeRef.current = 0;
        onFallLandedRef?.current?.(completedFallLayerDelta);
        syncingMovePositionRef?.current?.();
      }
    } else if (
      checkingWorldPlazaPlayerShouldSlideOnIceAfterRun(
        playerPosition,
        iceSlideVelocityRef.current,
        wasRunningOnIceRef.current,
        isRunningRef.current
      )
    ) {
      const nextVelocity = computingWorldPlazaIceSlideVelocity(
        iceSlideVelocityRef.current,
        null,
        deltaSeconds
      );

      iceSlideVelocityRef.current = nextVelocity;

      const gridDeltaX = nextVelocity.x * deltaSeconds;
      const gridDeltaY = nextVelocity.y * deltaSeconds;

      playerPosition.x += gridDeltaX;
      playerPosition.y += gridDeltaY;

      activeMotionSuffix = 'run';

      if (iceSlideFrozenRunFrameIndexRef.current === null) {
        iceSlideFrozenRunFrameIndexRef.current =
          resolvingWorldPlazaIceSlideFrozenRunFrameIndex(
            animationTimeRef.current,
            characterDefinition.runSheetLayout.frameCount
          );
      }

      if (
        Math.hypot(gridDeltaX, gridDeltaY) >
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON
      ) {
        walkDirectionRef.current = resolvingWorldPlazaGirlSampleWalkDirection(
          gridDeltaX,
          gridDeltaY,
          walkDirectionRef.current
        );
        characterFacingDirectionRef.current = walkDirectionRef.current;
      }

      animationFrameIndex = iceSlideFrozenRunFrameIndexRef.current;
      activeDirection = walkDirectionRef.current;
      isIceCoasting = true;
      lastLocomotionWasRunRef.current = true;
    } else if (isKeyboardMoving) {
      const isRunning = isRunningRef.current;
      activeMotionSuffix = isRunning ? 'run' : 'walk';

      const standingTile =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);
      const isOnIce = checkingWorldPlazaWaterIsFrozenAtTileIndex(
        standingTile.tileX,
        standingTile.tileY,
        { placedBlocksByTile: scenePlacedBlocksByTile }
      );
      const movementSpeedPerSecond =
        (isRunning
          ? isOnIce
            ? DEFINING_WORLD_PLAZA_ICE_SLIDE_SCREEN_RUN_SPEED_PER_SECOND
            : DEFINING_WORLD_PLAZA_ISOMETRIC_SCREEN_RUN_SPEED_PER_SECOND
          : DEFINING_WORLD_PLAZA_ISOMETRIC_SCREEN_WALK_SPEED_PER_SECOND) *
        movementMultipliers.speedMultiplier;
      const targetGridVelocity =
        computingWorldPlazaIsometricGridDeltaFromScreenDirection(
          keyboardDirection,
          movementSpeedPerSecond,
          1
        );

      let gridDelta;

      if (isRunning && isOnIce) {
        const nextVelocity = computingWorldPlazaIceSlideVelocity(
          iceSlideVelocityRef.current,
          targetGridVelocity,
          deltaSeconds
        );

        iceSlideVelocityRef.current = nextVelocity;
        gridDelta = {
          x: nextVelocity.x * deltaSeconds,
          y: nextVelocity.y * deltaSeconds,
        };
        wasRunningOnIceRef.current = true;
        if (isRunningOnIceRef) {
          isRunningOnIceRef.current = true;
        }
      } else {
        if (!isOnIce || !wasRunningOnIceRef.current) {
          iceSlideVelocityRef.current = { x: 0, y: 0 };
        }

        gridDelta = {
          x: targetGridVelocity.x * deltaSeconds,
          y: targetGridVelocity.y * deltaSeconds,
        };
      }

      playerPosition.x += gridDelta.x;
      playerPosition.y += gridDelta.y;

      if (
        Math.hypot(gridDelta.x, gridDelta.y) >
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON
      ) {
        walkDirectionRef.current = resolvingWorldPlazaGirlSampleWalkDirection(
          gridDelta.x,
          gridDelta.y,
          walkDirectionRef.current
        );
        characterFacingDirectionRef.current = walkDirectionRef.current;
      }

      const animationFps =
        isRunning && isOnIce
          ? characterDefinition.runAnimationFps *
            resolvingWorldPlazaIceRunAnimationSpeedScale(
              iceSlideVelocityRef.current,
              targetGridVelocity
            )
          : isRunning
            ? characterDefinition.runAnimationFps
            : characterDefinition.walkAnimationFps;

      animationTimeRef.current += (ticker.deltaMS / 1000) * animationFps;
      animationFrameIndex = Math.floor(animationTimeRef.current);
      activeDirection = walkDirectionRef.current;

      if (isRunning) {
        lastLocomotionWasRunRef.current = true;

        if (isOnIce) {
          iceSlideFrozenRunFrameIndexRef.current =
            resolvingWorldPlazaIceSlideFrozenRunFrameIndex(
              animationTimeRef.current,
              characterDefinition.runSheetLayout.frameCount
            );
        }
      }
    } else if (walkTarget && isWalkingRef.current) {
      const isRunning = isRunningRef.current;
      activeMotionSuffix = isRunning ? 'run' : 'walk';

      const standingTile =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);
      const isOnIce = checkingWorldPlazaWaterIsFrozenAtTileIndex(
        standingTile.tileX,
        standingTile.tileY,
        { placedBlocksByTile: scenePlacedBlocksByTile }
      );
      const movementSpeedPerSecond =
        (isRunning
          ? isOnIce
            ? DEFINING_WORLD_PLAZA_ICE_SLIDE_SCREEN_RUN_SPEED_PER_SECOND
            : DEFINING_WORLD_PLAZA_ISOMETRIC_SCREEN_RUN_SPEED_PER_SECOND
          : DEFINING_WORLD_PLAZA_ISOMETRIC_SCREEN_WALK_SPEED_PER_SECOND) *
        movementMultipliers.speedMultiplier;
      const stepResult = computingWorldPlazaIsometricGridStepTowardTarget(
        playerPosition,
        walkTarget,
        movementSpeedPerSecond,
        ticker.deltaMS / 1000
      );

      const gridDeltaX = stepResult.nextPosition.x - playerPosition.x;
      const gridDeltaY = stepResult.nextPosition.y - playerPosition.y;

      playerPosition.x = stepResult.nextPosition.x;
      playerPosition.y = stepResult.nextPosition.y;
      onWalkStepRef?.current?.();

      if (isRunning && isOnIce && deltaSeconds > 0) {
        wasRunningOnIceRef.current = true;
        if (isRunningOnIceRef) {
          isRunningOnIceRef.current = true;
        }
        iceSlideVelocityRef.current = {
          x: gridDeltaX / deltaSeconds,
          y: gridDeltaY / deltaSeconds,
        };
      }

      if (
        Math.hypot(gridDeltaX, gridDeltaY) >
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON
      ) {
        walkDirectionRef.current = resolvingWorldPlazaGirlSampleWalkDirection(
          gridDeltaX,
          gridDeltaY,
          walkDirectionRef.current
        );
        characterFacingDirectionRef.current = walkDirectionRef.current;
      }

      const animationFps = isRunning
        ? characterDefinition.runAnimationFps
        : characterDefinition.walkAnimationFps;

      animationTimeRef.current += (ticker.deltaMS / 1000) * animationFps;
      animationFrameIndex = Math.floor(animationTimeRef.current);
      activeDirection = walkDirectionRef.current;

      if (isRunning) {
        lastLocomotionWasRunRef.current = true;

        if (isOnIce) {
          iceSlideFrozenRunFrameIndexRef.current =
            resolvingWorldPlazaIceSlideFrozenRunFrameIndex(
              animationTimeRef.current,
              characterDefinition.runSheetLayout.frameCount
            );
        }
      }

      if (stepResult.arrived) {
        walkTargetRef.current = null;
        isWalkingRef.current = false;
        animationTimeRef.current = 0;
        onWalkArrivedRef?.current?.();
      }
    } else {
      const shouldPlayReadyIdleAfterRun = lastLocomotionWasRunRef.current;

      if (shouldPlayReadyIdleAfterRun) {
        if (inactiveSinceMsRef.current === null) {
          inactiveSinceMsRef.current = performance.now();
        }

        const inactiveDurationMs =
          performance.now() - inactiveSinceMsRef.current;
        const isReadyIdleActive =
          inactiveDurationMs <
          DEFINING_WORLD_PLAZA_GIRL_SAMPLE_READY_IDLE_DURATION_MS;

        if (isReadyIdleActive) {
          activeMotionSuffix = 'idle';
          animationTimeRef.current +=
            (ticker.deltaMS / 1000) * characterDefinition.idleAnimationFps;
          animationFrameIndex = Math.floor(animationTimeRef.current);
        } else {
          animationFrameIndex = 0;
          activeMotionSuffix = 'idle';
        }

        if (isReadyIdleActive !== previousReadyIdleActiveRef.current) {
          if (isReadyIdleActive) {
            animationTimeRef.current = 0;
          }

          previousReadyIdleActiveRef.current = isReadyIdleActive;
        }
      } else {
        inactiveSinceMsRef.current = null;
        previousReadyIdleActiveRef.current = false;
        animationFrameIndex = 0;
      }

      activeDirection = characterFacingDirectionRef.current;
      walkDirectionRef.current = characterFacingDirectionRef.current;
      iceSlideVelocityRef.current = { x: 0, y: 0 };
      iceSlideFrozenRunFrameIndexRef.current = null;
      wasRunningOnIceRef.current = false;
    }

    const frameMovementDeltaX = playerPosition.x - preStepPositionX;
    const frameMovementDeltaY = playerPosition.y - preStepPositionY;

    if (
      Math.hypot(frameMovementDeltaX, frameMovementDeltaY) >
      DEFINING_WORLD_PLAZA_AVATAR_CLIFF_LIP_MOVEMENT_REUSE_EPSILON
    ) {
      lastFrameMovementDeltaRef.current = {
        x: frameMovementDeltaX,
        y: frameMovementDeltaY,
      };
    }

    const collisionMovementDelta = {
      x:
        Math.abs(frameMovementDeltaX) >
        DEFINING_WORLD_PLAZA_AVATAR_CLIFF_LIP_MOVEMENT_REUSE_EPSILON
          ? frameMovementDeltaX
          : lastFrameMovementDeltaRef.current.x,
      y:
        Math.abs(frameMovementDeltaY) >
        DEFINING_WORLD_PLAZA_AVATAR_CLIFF_LIP_MOVEMENT_REUSE_EPSILON
          ? frameMovementDeltaY
          : lastFrameMovementDeltaRef.current.y,
    };

    const finishAvatarCollisionSample = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AVATAR_COLLISION
    );
    const collisionPlayerLayer = activeJumpState
      ? jumpProgress >= 1
        ? activeJumpState.landingLayer
        : activeJumpState.startLayer
      : playerPosition.layer;
    const blockedPosition =
      resolvingWorldPlazaEjectingPlayerFromBlockedWorldPoint(
        {
          x: playerPosition.x,
          y: playerPosition.y,
        },
        {
          isJumping: Boolean(activeJumpState),
          jumpProgress,
          fallbackPosition: {
            x: preStepPositionX,
            y: preStepPositionY,
          },
          placedBlocks: scenePlacedBlocks,
          placedBlocksByTile: scenePlacedBlocksByTile,
          playerLayer: collisionPlayerLayer,
          playerCenter: {
            x: playerPosition.x,
            y: playerPosition.y,
          },
          movementDelta: collisionMovementDelta,
        }
      );

    if (!activeJumpState) {
      playerPosition.x = blockedPosition.x;
      playerPosition.y = blockedPosition.y;
    }
    finishAvatarCollisionSample();

    const layerBeforeSync = resolvingWorldPlazaPlayerWorldLayer(playerPosition);
    syncingWorldPlazaPlayerStandingLayer(
      playerPosition,
      scenePlacedBlocks,
      Boolean(activeJumpState) || Boolean(activeFallState),
      scenePlacedBlocksByTile
    );

    if (!activeJumpState && !activeFallState) {
      const layerAfterSync =
        resolvingWorldPlazaPlayerWorldLayer(playerPosition);
      const nextFallState = attemptingWorldPlazaPlayerFallFromLayerDrop(
        layerBeforeSync,
        layerAfterSync,
        performance.now(),
        activeDirection
      );

      if (nextFallState) {
        fallStateRef.current = nextFallState;
        activeFallState = nextFallState;
        isWalkPausedByCollisionRef.current = true;
        isJumpingRef.current = true;

        // Render the fall's first frame at takeoff height on this same tick.
        // The fall is detected after the motion branch already ran, so without
        // this the avatar would render snapped to the ground surface for one
        // frame before the next tick lifts it back up to start the drop.
        fallVerticalOffsetPx =
          computingWorldPlazaGirlSampleFallVerticalOffsetPx(
            0,
            nextFallState.totalDropScreenPx
          );
        animationFrameIndex = 0;
        animationTimeRef.current = 0;
        activeMotionSuffix = 'fall';
        activeDirection = characterDefinition.fallSpriteDirection;
      }
    }

    if (!activeJumpState && walkTarget && isWalkingRef.current) {
      const movedGridDistance = Math.hypot(
        playerPosition.x - preStepPositionX,
        playerPosition.y - preStepPositionY
      );

      if (
        movedGridDistance <
        DEFINING_WORLD_PLAZA_AVATAR_WALK_BLOCKED_GRID_EPSILON
      ) {
        walkTargetRef.current = null;
        isWalkingRef.current = false;
        isRunningRef.current = false;
        isWalkPausedByCollisionRef.current = true;
        animationTimeRef.current = 0;
        onWalkArrivedRef?.current?.();
      }
    }

    const motionKind: DefiningWorldPlazaAvatarMotionKind = activeJumpState
      ? DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP
      : activeFallState
        ? DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP
        : isKeyboardMoving ||
            (walkTarget && isWalkingRef.current) ||
            isIceCoasting
          ? isIceCoasting || isRunningRef.current
            ? DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN
            : DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK
          : DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE;

    if (motionKind !== previousMotionKindRef.current) {
      if (
        motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE ||
        previousMotionKindRef.current ===
          DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE
      ) {
        animationTimeRef.current = 0;
      }

      previousMotionKindRef.current = motionKind;
    }

    localAvatarMotionStateRef.current = {
      motionKind,
      facingDirection: activeDirection,
      jumpStartedAtMs: activeJumpState?.networkStartedAtMs ?? 0,
      jumpArcPeakScreenPx: activeJumpState?.arcPeakScreenPx ?? 0,
      layer: activeJumpState
        ? activeJumpState.startLayer
        : resolvingWorldPlazaPlayerWorldLayer(playerPosition),
    };

    applyingWorldPlazaDeclarativeAvatarMotionToSprite({
      sprite,
      skinId: characterDefinition.skinId,
      motionSuffix: activeMotionSuffix,
      direction: activeDirection,
      frameIndex: animationFrameIndex,
    });

    const standingLayerOffsetPx = activeJumpState
      ? computingWorldBuildingWorldLayerScreenOffsetPx(
          activeJumpState.startLayer
        ) +
        (computingWorldBuildingWorldLayerScreenOffsetPx(
          activeJumpState.landingLayer
        ) -
          computingWorldBuildingWorldLayerScreenOffsetPx(
            activeJumpState.startLayer
          )) *
          jumpProgress
      : computingWorldBuildingWorldLayerScreenOffsetPx(
          resolvingWorldPlazaPlayerWorldLayer(playerPosition)
        );
    const screenPoint =
      convertingWorldPlazaGridPointToIsometricScreenPoint(playerPosition);
    const anchoredScreenY = screenPoint.y + standingLayerOffsetPx;
    const groundShadowLiftPeakScreenPx = activeJumpState
      ? activeJumpState.arcPeakScreenPx
      : activeFallState
        ? activeFallState.totalDropScreenPx
        : 0;
    const groundShadowJumpHeightRatio =
      computingWorldPlazaAvatarGroundShadowJumpHeightRatio(
        jumpArcOffsetPx + fallVerticalOffsetPx,
        groundShadowLiftPeakScreenPx
      );

    const avatarBodyEntityZIndex = resolvingWorldPlazaAvatarBodyEntityZIndex(
      playerPosition,
      scenePlacedBlocks,
      scenePlacedBlocksByTile
    );

    shadowContainer.position.set(screenPoint.x, anchoredScreenY);
    // Sync the shadow with the sprite: share the body sort key so whatever
    // occludes (or hides) the avatar occludes the shadow too. The shadow draws
    // just under the body via the tiny negative offset and its earlier child
    // order in the container.
    shadowContainer.zIndex =
      avatarBodyEntityZIndex +
      DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET;
    shadowContainer.visible = container.visible;
    container.position.set(screenPoint.x, anchoredScreenY);
    container.zIndex = avatarBodyEntityZIndex;
    sprite.position.set(0, jumpArcOffsetPx + fallVerticalOffsetPx);
    const respawnInvincibilityBlinkAlpha =
      computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha(
        postRespawnInvincibilityUntilMsRef?.current ?? 0,
        performance.now()
      );
    sprite.alpha = respawnInvincibilityBlinkAlpha;
    shadowContainer.alpha = respawnInvincibilityBlinkAlpha;
    updatingWorldPlazaAvatarGroundShadowGraphics(
      avatarGroundShadowGraphicsRef.current,
      jumpArcOffsetPx + fallVerticalOffsetPx,
      groundShadowLiftPeakScreenPx,
      activeDirection,
      resolvingWorldPlazaAvatarFootOffsetBelowGridAnchorPx(characterDefinition)
    );

    if (localUserId) {
      playerRenderPositionRegistryRef.current?.set(localUserId, {
        x: playerPosition.x,
        y: playerPosition.y,
        layer: playerPosition.layer,
        avatarScreenOffsetYPx:
          standingLayerOffsetPx + jumpArcOffsetPx + fallVerticalOffsetPx,
        avatarStandingLayerScreenOffsetYPx: standingLayerOffsetPx,
        avatarFacingDirection: activeDirection,
        avatarGroundShadowJumpHeightRatio: groundShadowJumpHeightRatio,
      });
    }

    finishAvatarTickSample();
  });

  if (!characterTextures) {
    return null;
  }

  return (
    <>
      <pixiContainer
        ref={(container) => {
          avatarShadowContainerRef.current = container;
        }}
        eventMode="none"
      >
        <pixiGraphics draw={drawingAvatarGroundShadow} eventMode="none" />
      </pixiContainer>
      <pixiContainer
        ref={(container) => {
          avatarContainerRef.current = container;
        }}
      >
        <pixiSprite ref={attachingAvatarSprite} />
      </pixiContainer>
    </>
  );
}
