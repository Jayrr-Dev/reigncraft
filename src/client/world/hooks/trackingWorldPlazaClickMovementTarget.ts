'use client';

import {
  checkingWorldBuildingClaimModeTilePopoverDoubleTap,
  type CheckingWorldBuildingClaimModeTilePopoverDoubleTapPreviousTap,
} from '@/components/world/building/domains/checkingWorldBuildingClaimModeTilePopoverDoubleTap';
import { snappingWorldBuildingTilePositionFromGridPoint } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { clampingWorldCollisionWalkTargetToWalkableGridPoint } from '@/components/world/collision';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaClickArrowEffectState } from '@/components/world/domains/definingWorldPlazaClickArrowEffectState';
import {
  DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_PRIMARY_POINTER_BUTTON,
  DEFINING_WORLD_PLAZA_UI_SELECTOR,
} from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_RUN_STAMINA_HOLD_TO_RUN_MS } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { projectingWorldPlazaViewportClientPointToGridPoint } from '@/components/world/domains/projectingWorldPlazaViewportClientPointToGridPoint';
import type { DefiningWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import {
  applyingWorldPlazaNavigationWalkTargets,
  clearingWorldPlazaNavigationWalkWaypoints,
  resolvingWorldPlazaNavigationWalkPlan,
} from '@/components/world/navigation';
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
  /** When true, click movement is ignored. */
  isPlayerAsleepRef?: React.RefObject<boolean>;
  /** When true, click movement is ignored. */
  isPlayerStunnedRef?: React.RefObject<boolean>;
  /** Player-placed blocks used for navigation path planning. */
  placedBlocksRef?: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
}

export interface TrackingWorldPlazaClickMovementTargetResult {
  /** Grid destination from the latest click; null when idle. */
  walkTargetRef: React.RefObject<DefiningWorldPlazaWorldPoint | null>;
  /** Remaining navigation waypoints after the active walk target. */
  walkWaypointsRef: React.RefObject<DefiningWorldPlazaWorldPoint[]>;
  /** Final click destination used for arrow effects and replans. */
  walkDestinationRef: React.RefObject<DefiningWorldPlazaWorldPoint | null>;
  /** Placed-block ids captured when the current path was planned. */
  navigationPlacedBlockSnapshotRef: React.RefObject<ReadonlySet<string>>;
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
  /**
   * Plans a walk/run path to a destination (combat chase, scripted moves).
   * Does not arm pointer-hold steer or click-arrow flash.
   */
  applyingWalkPlanToDestination: (
    destination: DefiningWorldPlazaWorldPoint,
    options?: { readonly run?: boolean }
  ) => void;
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
  isPlayerAsleepRef,
  isPlayerStunnedRef,
  placedBlocksRef,
}: TrackingWorldPlazaClickMovementTargetParams): TrackingWorldPlazaClickMovementTargetResult {
  const performanceProfile = usingWorldPlazaPerformanceProfile();
  const walkTargetRef = useRef<DefiningWorldPlazaWorldPoint | null>(null);
  const walkWaypointsRef = useRef<DefiningWorldPlazaWorldPoint[]>([]);
  const walkDestinationRef = useRef<DefiningWorldPlazaWorldPoint | null>(null);
  const navigationPlacedBlockSnapshotRef = useRef<ReadonlySet<string>>(
    new Set()
  );
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
    walkDestinationRef.current = null;
    clearingWorldPlazaNavigationWalkWaypoints(walkWaypointsRef);
    navigationPlacedBlockSnapshotRef.current = new Set();
    isWalkingRef.current = false;
    isPointerHeldRef.current = false;
    isClickRunIntentRef.current = false;
    isWalkPausedByCollisionRef.current = false;
    lastPointerClientRef.current = null;
    clickArrowEffectRef.current = null;
    previousPrimaryClickRef.current = null;
  }, []);

  const applyingPlazaNavigationWalkPlan = useCallback(
    (destination: DefiningWorldPlazaWorldPoint): void => {
      const playerPosition = playerPositionRef.current;
      const placedBlocksScene = placedBlocksRef?.current;

      if (!playerPosition) {
        return;
      }

      const placedBlocks = placedBlocksScene?.blocks ?? [];
      const walkPlan = resolvingWorldPlazaNavigationWalkPlan({
        start: playerPosition,
        destination,
        placedBlocks,
        placedBlocksByTile: placedBlocksScene?.blocksByTile,
        isJumping: isJumpingRef.current,
        maxNodeExpansions: performanceProfile.navigationMaxNodeExpansions,
      });

      walkDestinationRef.current = destination;
      navigationPlacedBlockSnapshotRef.current = new Set(
        placedBlocks.map((placedBlock) => placedBlock.blockId)
      );
      applyingWorldPlazaNavigationWalkTargets({
        walkTargetRef,
        walkWaypointsRef,
        destination,
        path: walkPlan.path,
      });
    },
    [
      isJumpingRef,
      performanceProfile.navigationMaxNodeExpansions,
      placedBlocksRef,
      playerPositionRef,
    ]
  );

  /**
   * Keeps joystick-style pointer steering cheap after hold-to-run activates.
   *
   * The initial press still plans around obstacles. Continuous steering writes
   * the moving camera-relative target directly, while collision handles walls.
   */
  const applyingHeldPointerSteerTarget = useCallback(
    (destination: DefiningWorldPlazaWorldPoint): void => {
      walkDestinationRef.current = destination;
      walkTargetRef.current = destination;

      if (walkWaypointsRef.current.length > 0) {
        clearingWorldPlazaNavigationWalkWaypoints(walkWaypointsRef);
      }

      isWalkingRef.current = true;
    },
    []
  );

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

      return projectingWorldPlazaViewportClientPointToGridPoint(
        clientX,
        clientY,
        viewportFrame,
        cameraOffsetRef.current,
        viewportSizeRef.current,
        cameraWorldZoomRef.current
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

      if (isPlayerAsleepRef?.current) {
        return null;
      }

      if (isPlayerStunnedRef?.current) {
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
    [
      isEnabled,
      isPlayerDeadRef,
      isPlayerAsleepRef,
      isPlayerStunnedRef,
      projectingClientPointToGridTarget,
    ]
  );

  const notifyingPlayerNavigateIntent = useCallback((): void => {
    cancellingPlayerNavigateIntentRef?.current?.();
  }, [cancellingPlayerNavigateIntentRef]);

  const applyingWalkPlanToDestination = useCallback(
    (
      destination: DefiningWorldPlazaWorldPoint,
      options?: { readonly run?: boolean }
    ): void => {
      const walkableTargetGrid = resolvingWalkablePlazaClickTarget(destination);

      if (!walkableTargetGrid) {
        return;
      }

      notifyingPlayerNavigateIntent();
      applyingPlazaNavigationWalkPlan(walkableTargetGrid);
      isWalkingRef.current = true;
      isWalkPausedByCollisionRef.current = false;
      isClickRunIntentRef.current = options?.run === true;
    },
    [
      applyingPlazaNavigationWalkPlan,
      notifyingPlayerNavigateIntent,
      resolvingWalkablePlazaClickTarget,
    ]
  );

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

      applyingPlazaNavigationWalkPlan(walkableTargetGrid);
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
      applyingPlazaNavigationWalkPlan,
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
    },
    []
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

  // After hold-to-run activates, keep re-aiming the walk target at the cursor.
  // A stationary pointer emits no move event, while the following camera makes
  // its world target change. Direct ref writes avoid synchronous A* every frame.
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let animationFrameId = 0;

    const refreshingHeldWalkTarget = (): void => {
      const pointerClient = lastPointerClientRef.current;
      const nowMs = performance.now();
      const isHoldToRunActive =
        isPointerHeldRef.current &&
        pointerHeldSinceMsRef.current > 0 &&
        nowMs - pointerHeldSinceMsRef.current >=
          DEFINING_WORLD_PLAZA_RUN_STAMINA_HOLD_TO_RUN_MS;

      if (isHoldToRunActive) {
        isClickRunIntentRef.current = true;
      }

      if (
        isHoldToRunActive &&
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
            applyingHeldPointerSteerTarget(walkableTargetGrid);
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
    applyingHeldPointerSteerTarget,
    isEnabled,
    isJumpingRef,
    projectingClientPointToGridTarget,
    resolvingWalkablePlazaClickTarget,
  ]);

  return {
    walkTargetRef,
    walkWaypointsRef,
    walkDestinationRef,
    navigationPlacedBlockSnapshotRef,
    isWalkingRef,
    isPointerHeldRef,
    pointerHeldSinceMsRef,
    isClickRunIntentRef,
    clickArrowEffectRef,
    handlingPlazaPointerDown,
    handlingPlazaPointerMove,
    handlingPlazaPointerRelease,
    clearingWalkTarget,
    applyingWalkPlanToDestination,
    isWalkPausedByCollisionRef,
    isRunningRef,
  };
}
