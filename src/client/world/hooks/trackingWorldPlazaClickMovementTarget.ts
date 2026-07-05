'use client';

import {
  checkingWorldBuildingClaimModeTilePopoverDoubleTap,
  type CheckingWorldBuildingClaimModeTilePopoverDoubleTapPreviousTap,
} from '@/components/world/building/domains/checkingWorldBuildingClaimModeTilePopoverDoubleTap';
import { snappingWorldBuildingTilePositionFromGridPoint } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { clampingWorldCollisionWalkTargetToWalkableGridPoint } from '@/components/world/collision';
import { convertingWorldPlazaIsometricScreenPointToGridPoint } from '@/components/world/domains/convertingWorldPlazaIsometricScreenPointToGridPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaClickArrowEffectState } from '@/components/world/domains/definingWorldPlazaClickArrowEffectState';
import {
  DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_PRIMARY_POINTER_BUTTON,
  DEFINING_WORLD_PLAZA_UI_SELECTOR,
} from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_RUN_STAMINA_HOLD_TO_RUN_MS } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { projectingWorldPlazaViewportScreenPointToIsometricWorldLocal } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import type { DefiningWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import { useCallback, useEffect, useRef } from 'react';

/** Pointer position in viewport (client) pixels, captured while held. */
interface TrackingWorldPlazaPointerClientPoint {
  clientX: number;
  clientY: number;
}

export interface TrackingWorldPlazaClickMovementTargetParams {
  /** When false, clicks are ignored and any active walk is cleared. */
  isEnabled: boolean;
  /** Plaza viewport frame (Pixi canvas container) for pointer projection. */
  viewportFrameRef: React.RefObject<HTMLElement | null>;
  /** Updated each frame by the camera rig for pointer projection. */
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  /** Live Pixi screen size; scales DOM pointer pixels into canvas space. */
  viewportSizeRef: React.RefObject<DefiningWorldPlazaPixiViewportSize>;
  /** Effective world-container zoom, including fullscreen compensation. */
  cameraWorldZoomRef: React.RefObject<number>;
  /** Live local avatar position; required so clicks are ignored before spawn. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** True while a jump animation is active; pauses hold-to-walk refresh. */
  isJumpingRef: React.RefObject<boolean>;
  /** Set to true on mobile tap while running; consumed by the avatar. */
  jumpRequestedRef?: React.RefObject<boolean>;
  /** Clears a pending inventory ground drop when the player steers elsewhere. */
  cancellingPlayerNavigateIntentRef?: React.RefObject<(() => void) | null>;
  /** When true, click movement is ignored. */
  isPlayerDeadRef?: React.RefObject<boolean>;
}

export interface TrackingWorldPlazaClickMovementTargetResult {
  /** Grid destination from the latest click; null when idle. */
  walkTargetRef: React.RefObject<DefiningWorldPlazaWorldPoint | null>;
  /** True while the avatar is walking toward {@link walkTargetRef}. */
  isWalkingRef: React.RefObject<boolean>;
  /** True while the pointer is held down (steer walk target). */
  isPointerHeldRef: React.RefObject<boolean>;
  /** {@link performance.now} timestamp of the latest pointer press. */
  pointerHeldSinceMsRef: React.RefObject<number>;
  /** True while a double-click run is active for the current walk target. */
  isClickRunIntentRef: React.RefObject<boolean>;
  /** One-shot arrow flash at the latest click destination. */
  clickArrowEffectRef: React.RefObject<DefiningWorldPlazaClickArrowEffectState | null>;
  /** Pointer-down handler: starts a walk and arms double-click run intent. */
  handlingPlazaPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  /** Pointer-move handler: steers the destination while the pointer is held. */
  handlingPlazaPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  /** Pointer-release handler: drops pointer steer (walk continues to target). */
  handlingPlazaPointerRelease: (
    event?: React.PointerEvent<HTMLElement>
  ) => void;
  /** Clears any in-progress click walk. */
  clearingWalkTarget: () => void;
  /** True while movement is paused against a collision until the pointer resets. */
  isWalkPausedByCollisionRef: React.RefObject<boolean>;
  /** Authoritative running flag (written by the stamina loop). */
  isRunningRef: React.RefObject<boolean>;
}

/**
 * Tracks click-to-move targets on the plaza viewport without React re-renders.
 *
 * A single click walks to the target. A double-click on the same tile runs
 * there instead. Holding the pointer steers the destination while pressed and,
 * after a short hold, upgrades the walk to a run. On touch, tapping again while
 * running queues a run jump.
 *
 * @param params - Enable flag, viewport frame ref, and live camera offset ref.
 */
export function trackingWorldPlazaClickMovementTarget({
  isEnabled,
  viewportFrameRef,
  cameraOffsetRef,
  viewportSizeRef,
  cameraWorldZoomRef,
  playerPositionRef,
  isJumpingRef,
  jumpRequestedRef,
  cancellingPlayerNavigateIntentRef,
  isPlayerDeadRef,
}: TrackingWorldPlazaClickMovementTargetParams): TrackingWorldPlazaClickMovementTargetResult {
  const walkTargetRef = useRef<DefiningWorldPlazaWorldPoint | null>(null);
  const isWalkingRef = useRef(false);
  const isPointerHeldRef = useRef(false);
  const pointerHeldSinceMsRef = useRef(0);
  const isClickRunIntentRef = useRef(false);
  const isRunningRef = useRef(false);
  const previousPrimaryClickRef =
    useRef<CheckingWorldBuildingClaimModeTilePopoverDoubleTapPreviousTap | null>(
      null
    );
  const lastPointerClientRef =
    useRef<TrackingWorldPlazaPointerClientPoint | null>(null);
  const clickArrowEffectRef =
    useRef<DefiningWorldPlazaClickArrowEffectState | null>(null);
  const isWalkPausedByCollisionRef = useRef(false);

  const clearingWalkTarget = useCallback((): void => {
    walkTargetRef.current = null;
    isWalkingRef.current = false;
    isPointerHeldRef.current = false;
    isClickRunIntentRef.current = false;
    isWalkPausedByCollisionRef.current = false;
    lastPointerClientRef.current = null;
    clickArrowEffectRef.current = null;
    previousPrimaryClickRef.current = null;
  }, []);

  const projectingClientPointToGridTarget = useCallback(
    (clientX: number, clientY: number): DefiningWorldPlazaWorldPoint | null => {
      const viewportFrame = viewportFrameRef.current;

      if (!viewportFrame) {
        return null;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return null;
      }

      const viewportFrameBounds = viewportFrame.getBoundingClientRect();

      if (viewportFrameBounds.width === 0 || viewportFrameBounds.height === 0) {
        return null;
      }

      // The pointer is measured in DOM (CSS) pixels, while the camera offset is
      // in Pixi screen pixels. When the canvas is CSS-scaled (host narrower than
      // its internal resolution), these spaces differ, so scale the pointer into
      // canvas space before projecting; otherwise clicks drift from the target.
      const viewportSize = viewportSizeRef.current;
      const domToCanvasScaleX = viewportSize.width / viewportFrameBounds.width;
      const domToCanvasScaleY =
        viewportSize.height / viewportFrameBounds.height;
      const viewportX =
        (clientX - viewportFrameBounds.left) * domToCanvasScaleX;
      const viewportY = (clientY - viewportFrameBounds.top) * domToCanvasScaleY;
      const worldLocalPoint =
        projectingWorldPlazaViewportScreenPointToIsometricWorldLocal(
          { x: viewportX, y: viewportY },
          cameraOffsetRef.current,
          cameraWorldZoomRef.current
        );

      return convertingWorldPlazaIsometricScreenPointToGridPoint(
        worldLocalPoint
      );
    },
    [
      cameraOffsetRef,
      cameraWorldZoomRef,
      viewportFrameRef,
      playerPositionRef,
      viewportSizeRef,
    ]
  );

  const resolvingWalkablePlazaClickTarget = useCallback(
    (
      targetGrid: DefiningWorldPlazaWorldPoint
    ): DefiningWorldPlazaWorldPoint | null => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return null;
      }

      return clampingWorldCollisionWalkTargetToWalkableGridPoint(
        playerPosition,
        targetGrid
      );
    },
    [playerPositionRef]
  );

  const resolvingPlazaClickTargetFromEvent = useCallback(
    (
      event: React.PointerEvent<HTMLElement>
    ): DefiningWorldPlazaWorldPoint | null => {
      if (!isEnabled) {
        return null;
      }

      if (isPlayerDeadRef?.current) {
        return null;
      }

      const clickedElement = event.target;

      if (
        clickedElement instanceof Element &&
        clickedElement.closest(DEFINING_WORLD_PLAZA_UI_SELECTOR)
      ) {
        return null;
      }

      return projectingClientPointToGridTarget(event.clientX, event.clientY);
    },
    [isEnabled, isPlayerDeadRef, projectingClientPointToGridTarget]
  );

  const notifyingPlayerNavigateIntent = useCallback((): void => {
    cancellingPlayerNavigateIntentRef?.current?.();
  }, [cancellingPlayerNavigateIntentRef]);

  const handlingPlazaPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>): void => {
      if (
        event.button !==
        DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_PRIMARY_POINTER_BUTTON
      ) {
        return;
      }

      const targetGrid = resolvingPlazaClickTargetFromEvent(event);

      if (!targetGrid) {
        return;
      }

      const walkableTargetGrid = resolvingWalkablePlazaClickTarget(targetGrid);

      if (!walkableTargetGrid) {
        return;
      }

      const shouldTapJumpWhileRunning =
        event.pointerType === 'touch' &&
        isRunningRef.current &&
        isWalkingRef.current &&
        !isJumpingRef.current;

      if (shouldTapJumpWhileRunning && jumpRequestedRef) {
        jumpRequestedRef.current = true;
        return;
      }

      const nowMs = performance.now();
      const clientPoint = {
        clientX: event.clientX,
        clientY: event.clientY,
      };
      const targetTile =
        snappingWorldBuildingTilePositionFromGridPoint(walkableTargetGrid);
      const isDoubleClick = checkingWorldBuildingClaimModeTilePopoverDoubleTap({
        eventDetail: event.detail,
        nowMs,
        clientPoint,
        tilePosition: targetTile,
        previousTap: previousPrimaryClickRef.current,
      });

      previousPrimaryClickRef.current = {
        atMs: nowMs,
        clientPoint,
        tilePosition: targetTile,
      };

      isClickRunIntentRef.current = isDoubleClick;

      notifyingPlayerNavigateIntent();

      walkTargetRef.current = walkableTargetGrid;
      isWalkingRef.current = true;
      isWalkPausedByCollisionRef.current = false;
      isPointerHeldRef.current = true;
      pointerHeldSinceMsRef.current = performance.now();
      lastPointerClientRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
      };
      clickArrowEffectRef.current = {
        targetGrid: walkableTargetGrid,
        startedAtMs: Date.now(),
      };
    },
    [
      jumpRequestedRef,
      isJumpingRef,
      notifyingPlayerNavigateIntent,
      resolvingPlazaClickTargetFromEvent,
      resolvingWalkablePlazaClickTarget,
    ]
  );

  const handlingPlazaPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>): void => {
      if (!isPointerHeldRef.current) {
        return;
      }

      lastPointerClientRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
      };

      const targetGrid = resolvingPlazaClickTargetFromEvent(event);

      if (!targetGrid) {
        return;
      }

      const walkableTargetGrid = resolvingWalkablePlazaClickTarget(targetGrid);

      if (!walkableTargetGrid) {
        return;
      }

      notifyingPlayerNavigateIntent();

      walkTargetRef.current = walkableTargetGrid;
      isWalkingRef.current = true;
    },
    [
      notifyingPlayerNavigateIntent,
      resolvingPlazaClickTargetFromEvent,
      resolvingWalkablePlazaClickTarget,
    ]
  );

  const handlingPlazaPointerRelease = useCallback(
    (event?: React.PointerEvent<HTMLElement>): void => {
      if (event && event.buttons !== 0) {
        return;
      }

      isPointerHeldRef.current = false;
      isWalkPausedByCollisionRef.current = false;
      lastPointerClientRef.current = null;
    },
    []
  );

  // While the pointer is held, keep re-aiming the walk target at the cursor each
  // frame. A stationary mouse fires no pointermove, so without this the avatar
  // would walk to the initial target and stop until the pointer moved again. The
  // camera follows the player, so a fixed cursor yields a fresh world target and
  // the avatar keeps moving (joystick-style hold-to-walk/run).
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let animationFrameId = 0;

    const refreshingHeldWalkTarget = (): void => {
      const pointerClient = lastPointerClientRef.current;
      const nowMs = performance.now();

      if (
        isPointerHeldRef.current &&
        pointerHeldSinceMsRef.current > 0 &&
        nowMs - pointerHeldSinceMsRef.current >=
          DEFINING_WORLD_PLAZA_RUN_STAMINA_HOLD_TO_RUN_MS
      ) {
        isClickRunIntentRef.current = true;
      }

      if (
        isPointerHeldRef.current &&
        pointerClient &&
        !isWalkPausedByCollisionRef.current &&
        !isJumpingRef.current
      ) {
        const targetGrid = projectingClientPointToGridTarget(
          pointerClient.clientX,
          pointerClient.clientY
        );

        if (targetGrid) {
          const walkableTargetGrid =
            resolvingWalkablePlazaClickTarget(targetGrid);

          if (walkableTargetGrid) {
            notifyingPlayerNavigateIntent();
            walkTargetRef.current = walkableTargetGrid;
            isWalkingRef.current = true;
          }
        }
      }

      animationFrameId = window.requestAnimationFrame(refreshingHeldWalkTarget);
    };

    animationFrameId = window.requestAnimationFrame(refreshingHeldWalkTarget);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [
    isEnabled,
    isJumpingRef,
    notifyingPlayerNavigateIntent,
    projectingClientPointToGridTarget,
    resolvingWalkablePlazaClickTarget,
  ]);

  return {
    walkTargetRef,
    isWalkingRef,
    isPointerHeldRef,
    pointerHeldSinceMsRef,
    isClickRunIntentRef,
    clickArrowEffectRef,
    handlingPlazaPointerDown,
    handlingPlazaPointerMove,
    handlingPlazaPointerRelease,
    clearingWalkTarget,
    isWalkPausedByCollisionRef,
    isRunningRef,
  };
}
