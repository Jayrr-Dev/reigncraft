'use client';

import { applyingWorldPlazaDeclarativeAvatarMotionToSprite } from '@/components/world/animation/domains/applyingWorldPlazaDeclarativeAvatarMotionToSprite';
import type { DefiningWorldPlazaAvatarMotionClipSuffix } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { computingWorldPlazaGirlSampleJumpArcOffsetPx } from '@/components/world/domains/computingWorldPlazaGirlSampleJumpArcOffsetPx';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaAvatarCharacterDefinition } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import { resolvingWorldPlazaAvatarFootOffsetBelowGridAnchorPx } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import { DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET } from '@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants';
import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK,
  type DefiningWorldPlazaAvatarMotionKind,
  resolvingWorldPlazaAvatarMotionKindFromString,
  resolvingWorldPlazaGirlSampleWalkDirectionFromString,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_READY_IDLE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaGirlSampleIdleConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_ARC_PEAK_SCREEN_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_ARC_PEAK_SCREEN_PX,
} from '@/components/world/domains/definingWorldPlazaGirlSampleJumpConstants';
import { type DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import { DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  computingWorldPlazaAvatarGroundShadowJumpHeightRatio,
  drawingWorldPlazaAvatarGroundShadowOnGraphics,
  updatingWorldPlazaAvatarGroundShadowGraphics,
} from '@/components/world/domains/drawingWorldPlazaAvatarGroundShadowOnGraphics';
import { checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { resolvingWorldPlazaAvatarBodyEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaAvatarGroundShadowEntityZIndex';
import { resolvingWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirection';
import {
  computingWorldPlazaLavaSinkBobOffsetPx,
  computingWorldPlazaLavaSinkOffsetPxAtGridPoint,
  drawingWorldPlazaLavaSinkCoverBackOnGraphics,
  drawingWorldPlazaLavaSinkCoverFrontOnGraphics,
  updatingWorldPlazaLavaSinkCoverAnimation,
} from '@/components/world/domains/resolvingWorldPlazaLavaSinkStateAtGridPoint';
import { useTick } from '@pixi/react';
import type { Container, Graphics, Sprite, Ticker } from 'pixi.js';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Exponential smoothing rate (per second) for remote avatar movement.
 *
 * Frame-rate independent: the per-frame blend is derived from elapsed time, so
 * remotes glide evenly between discrete network position updates instead of
 * snapping to each target and stalling (which reads as choppy stutter).
 */
const RENDERING_WORLD_PLAZA_GIRL_SAMPLE_REMOTE_AVATAR_SMOOTHING_RATE_PER_SECOND = 14;

/** Grid distance beyond which the remote avatar snaps instead of smoothing (teleport/respawn). */
const RENDERING_WORLD_PLAZA_GIRL_SAMPLE_REMOTE_AVATAR_SNAP_GRID_DISTANCE = 6;

/**
 * Grid distance to target above which the remote avatar is treated as "moving".
 *
 * Remote positions glide via exponential smoothing between sparse network
 * updates, so the avatar keeps visibly traveling after the networked motion has
 * already flipped back to idle. Driving the walk/run cycle off actual on-screen
 * travel (not just the lagging network motion kind) keeps the legs animating for
 * the whole glide, including short hops.
 */
const RENDERING_WORLD_PLAZA_GIRL_SAMPLE_REMOTE_AVATAR_LOCOMOTION_GRID_EPSILON = 0.05;

export interface RenderingWorldPlazaGirlSampleRemoteAvatarProps {
  /** Stable remote user id. */
  userId: string;
  /** Seed display name and starting grid position. */
  initialPlayer: DefiningWorldPlazaRemotePlayer;
  /** Live positions from Colyseus; read every Pixi frame. */
  remotePlayerRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >;
  /** Smoothed screen positions written each Pixi frame for overlays. */
  playerRenderPositionRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  /** Presentation bundle for the remote player's synced avatar skin. */
  characterDefinition: DefiningWorldPlazaAvatarCharacterDefinition;
}

/**
 * One remote plaza player rendered with synced walk, run, and jump strips.
 */
export function RenderingWorldPlazaGirlSampleRemoteAvatar({
  userId,
  initialPlayer,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  characterDefinition,
}: RenderingWorldPlazaGirlSampleRemoteAvatarProps): React.JSX.Element {
  const avatarShadowContainerRef = useRef<Container | null>(null);
  const avatarGroundShadowGraphicsRef = useRef<Graphics | null>(null);
  const avatarContainerRef = useRef<Container | null>(null);
  const avatarSpriteRef = useRef<Sprite | null>(null);
  const avatarLavaSinkCoverBackGraphicsRef = useRef<Graphics | null>(null);
  const avatarLavaSinkCoverFrontGraphicsRef = useRef<Graphics | null>(null);
  const animationTimeRef = useRef(0);
  const facingDirectionRef = useRef<DefiningWorldPlazaGirlSampleWalkDirection>(
    characterDefinition.defaultDirection
  );
  const previousMotionKindRef = useRef<DefiningWorldPlazaAvatarMotionKind>(
    DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE
  );
  const inactiveSinceMsRef = useRef<number | null>(null);
  const previousReadyIdleActiveRef = useRef(false);
  const lastLocomotionWasRunRef = useRef(false);
  const renderGridXRef = useRef(initialPlayer.x);
  const renderGridYRef = useRef(initialPlayer.y);
  const targetGridXRef = useRef(initialPlayer.x);
  const targetGridYRef = useRef(initialPlayer.y);
  const lastSpriteFrameTextureKeyRef = useRef('');
  const playerRenderPositionRef =
    useRef<DefiningWorldPlazaPlayerRenderPosition>({
      x: initialPlayer.x,
      y: initialPlayer.y,
      layer:
        initialPlayer.layer ?? DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER,
    });

  const drawingAvatarGroundShadow = useCallback(
    (graphics: Graphics): void => {
      avatarGroundShadowGraphicsRef.current = graphics;
      drawingWorldPlazaAvatarGroundShadowOnGraphics(
        graphics,
        0,
        facingDirectionRef.current,
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
      applyingWorldPlazaDeclarativeAvatarMotionToSprite({
        sprite,
        skinId: characterDefinition.skinId,
        motionSuffix: 'walk',
        direction: facingDirectionRef.current,
        frameIndex: 0,
      });
    },
    [characterDefinition]
  );

  useEffect(() => {
    return () => {
      playerRenderPositionRegistryRef.current?.delete(userId);
    };
  }, [playerRenderPositionRegistryRef, userId]);

  useTick((ticker: Ticker) => {
    const shadowContainer = avatarShadowContainerRef.current;
    const container = avatarContainerRef.current;
    const sprite = avatarSpriteRef.current;

    if (!shadowContainer || !container || !sprite) {
      return;
    }

    container.visible =
      checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.AVATARS
      );

    const livePlayer = remotePlayerRegistryRef.current?.get(userId);
    const motionKind = resolvingWorldPlazaAvatarMotionKindFromString(
      livePlayer?.motionKind ?? initialPlayer.motionKind
    );
    const syncedFacingDirection =
      resolvingWorldPlazaGirlSampleWalkDirectionFromString(
        livePlayer?.facingDirection ?? initialPlayer.facingDirection
      );
    const jumpStartedAtMs =
      livePlayer?.jumpStartedAtMs ?? initialPlayer.jumpStartedAtMs;
    const jumpArcPeakScreenPx =
      livePlayer?.jumpArcPeakScreenPx ||
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_ARC_PEAK_SCREEN_PX;
    const standingLayer =
      livePlayer?.layer ??
      initialPlayer.layer ??
      DEFINING_WORLD_PLAZA_WORLD_POINT_GROUND_LAYER;

    if (livePlayer) {
      targetGridXRef.current = livePlayer.x;
      targetGridYRef.current = livePlayer.y;
    }

    const distanceToTarget = Math.hypot(
      targetGridXRef.current - renderGridXRef.current,
      targetGridYRef.current - renderGridYRef.current
    );

    if (
      distanceToTarget >
      RENDERING_WORLD_PLAZA_GIRL_SAMPLE_REMOTE_AVATAR_SNAP_GRID_DISTANCE
    ) {
      renderGridXRef.current = targetGridXRef.current;
      renderGridYRef.current = targetGridYRef.current;
    } else {
      const smoothingAlpha =
        1 -
        Math.exp(
          -RENDERING_WORLD_PLAZA_GIRL_SAMPLE_REMOTE_AVATAR_SMOOTHING_RATE_PER_SECOND *
            (ticker.deltaMS / 1000)
        );

      renderGridXRef.current +=
        (targetGridXRef.current - renderGridXRef.current) * smoothingAlpha;
      renderGridYRef.current +=
        (targetGridYRef.current - renderGridYRef.current) * smoothingAlpha;
    }

    const isRunningMotion =
      motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN;
    const isLocomoting =
      distanceToTarget >
        RENDERING_WORLD_PLAZA_GIRL_SAMPLE_REMOTE_AVATAR_LOCOMOTION_GRID_EPSILON ||
      motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK ||
      motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN;

    const facingDirection = isLocomoting
      ? resolvingWorldPlazaGirlSampleWalkDirection(
          targetGridXRef.current - renderGridXRef.current,
          targetGridYRef.current - renderGridYRef.current,
          syncedFacingDirection
        )
      : syncedFacingDirection;

    facingDirectionRef.current = facingDirection;

    const elapsedJumpMs =
      jumpStartedAtMs > 0 ? Math.max(0, Date.now() - jumpStartedAtMs) : 0;
    const isJumpActive =
      jumpStartedAtMs > 0 &&
      elapsedJumpMs < DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS;

    const resolvedMotionKind: DefiningWorldPlazaAvatarMotionKind = isJumpActive
      ? DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP
      : isLocomoting
        ? isRunningMotion
          ? DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN
          : DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK
        : DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE;

    let jumpArcOffsetPx = 0;
    let animationFrameIndex = 0;
    let activeMotionSuffix: DefiningWorldPlazaAvatarMotionClipSuffix = 'idle';

    const isAvatarActive = isJumpActive || isLocomoting;

    if (isAvatarActive) {
      inactiveSinceMsRef.current = null;
      previousReadyIdleActiveRef.current = false;
    }

    if (isJumpActive) {
      const jumpProgress = Math.min(
        1,
        elapsedJumpMs / DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS
      );

      jumpArcOffsetPx = computingWorldPlazaGirlSampleJumpArcOffsetPx(
        jumpProgress,
        jumpArcPeakScreenPx
      );
      animationFrameIndex = Math.min(
        characterDefinition.jumpSheetLayout.frameCount - 1,
        Math.floor(
          (elapsedJumpMs / 1000) * characterDefinition.jumpAnimationFps
        )
      );
      activeMotionSuffix = 'jump';
      lastLocomotionWasRunRef.current =
        jumpArcPeakScreenPx >=
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_ARC_PEAK_SCREEN_PX;
    } else if (isLocomoting) {
      activeMotionSuffix = isRunningMotion ? 'run' : 'walk';
      animationTimeRef.current +=
        (ticker.deltaMS / 1000) *
        (isRunningMotion
          ? characterDefinition.runAnimationFps
          : characterDefinition.walkAnimationFps);
      animationFrameIndex = Math.floor(animationTimeRef.current);
      lastLocomotionWasRunRef.current = isRunningMotion;
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
        activeMotionSuffix = 'idle';
      }
    }

    if (resolvedMotionKind !== previousMotionKindRef.current) {
      if (
        resolvedMotionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE ||
        previousMotionKindRef.current ===
          DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE ||
        previousMotionKindRef.current ===
          DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP
      ) {
        animationTimeRef.current = 0;
      }

      previousMotionKindRef.current = resolvedMotionKind;
    }

    const nextSpriteFrameTextureKey = `${activeMotionSuffix}|${facingDirectionRef.current}|${animationFrameIndex}`;
    if (lastSpriteFrameTextureKeyRef.current !== nextSpriteFrameTextureKey) {
      applyingWorldPlazaDeclarativeAvatarMotionToSprite({
        sprite,
        skinId: characterDefinition.skinId,
        motionSuffix: activeMotionSuffix,
        direction: facingDirectionRef.current,
        frameIndex: animationFrameIndex,
      });
      lastSpriteFrameTextureKeyRef.current = nextSpriteFrameTextureKey;
    }

    const standingLayerOffsetPx =
      computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
    const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: renderGridXRef.current,
      y: renderGridYRef.current,
    });
    const anchoredScreenY = screenPoint.y + standingLayerOffsetPx;
    const groundShadowJumpHeightRatio =
      computingWorldPlazaAvatarGroundShadowJumpHeightRatio(
        jumpArcOffsetPx,
        jumpArcPeakScreenPx
      );

    const avatarBodyEntityZIndex = resolvingWorldPlazaAvatarBodyEntityZIndex({
      x: renderGridXRef.current,
      y: renderGridYRef.current,
      layer: standingLayer,
    });

    // Remote avatars sink into molten lava too; skip while mid jump arc.
    const lavaSinkBaseOffsetPx =
      jumpArcOffsetPx !== 0
        ? 0
        : computingWorldPlazaLavaSinkOffsetPxAtGridPoint(
            renderGridXRef.current,
            renderGridYRef.current,
            standingLayer
          );
    const lavaSinkOffsetPx =
      lavaSinkBaseOffsetPx > 0
        ? lavaSinkBaseOffsetPx +
          computingWorldPlazaLavaSinkBobOffsetPx(performance.now())
        : 0;

    updatingWorldPlazaLavaSinkCoverAnimation(
      {
        backGraphics: avatarLavaSinkCoverBackGraphicsRef.current,
        frontGraphics: avatarLavaSinkCoverFrontGraphicsRef.current,
      },
      lavaSinkBaseOffsetPx > 0,
      performance.now()
    );

    shadowContainer.position.set(screenPoint.x, anchoredScreenY);
    // Sync the shadow with the sprite: share the body sort key and visibility so
    // whatever occludes (or hides) the avatar occludes the shadow in lockstep.
    shadowContainer.zIndex =
      avatarBodyEntityZIndex +
      DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET;
    shadowContainer.visible = container.visible && lavaSinkBaseOffsetPx === 0;
    container.position.set(screenPoint.x, anchoredScreenY);
    container.zIndex = avatarBodyEntityZIndex;
    sprite.position.set(0, jumpArcOffsetPx + lavaSinkOffsetPx);
    updatingWorldPlazaAvatarGroundShadowGraphics(
      avatarGroundShadowGraphicsRef.current,
      jumpArcOffsetPx,
      jumpArcPeakScreenPx,
      facingDirectionRef.current,
      resolvingWorldPlazaAvatarFootOffsetBelowGridAnchorPx(characterDefinition)
    );

    const renderPosition = playerRenderPositionRef.current;
    renderPosition.x = renderGridXRef.current;
    renderPosition.y = renderGridYRef.current;
    renderPosition.layer = standingLayer;
    renderPosition.avatarScreenOffsetYPx =
      standingLayerOffsetPx + jumpArcOffsetPx;
    renderPosition.avatarStandingLayerScreenOffsetYPx = standingLayerOffsetPx;
    renderPosition.avatarFacingDirection = facingDirectionRef.current;
    renderPosition.avatarGroundShadowJumpHeightRatio =
      groundShadowJumpHeightRatio;
    playerRenderPositionRegistryRef.current?.set(userId, renderPosition);
  });

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
        <pixiGraphics
          ref={(graphics) => {
            avatarLavaSinkCoverBackGraphicsRef.current = graphics;
          }}
          draw={drawingWorldPlazaLavaSinkCoverBackOnGraphics}
          visible={false}
          eventMode="none"
        />
        <pixiSprite ref={attachingAvatarSprite} />
        <pixiGraphics
          ref={(graphics) => {
            avatarLavaSinkCoverFrontGraphicsRef.current = graphics;
          }}
          draw={drawingWorldPlazaLavaSinkCoverFrontOnGraphics}
          visible={false}
          eventMode="none"
        />
      </pixiContainer>
    </>
  );
}
