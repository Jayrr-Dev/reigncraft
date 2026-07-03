"use client";

import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import {
  DEFINING_WORLD_PLAZA_CHARACTER_FACING_ROTATION_NETWORK_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_CHARACTER_FACING_ROTATION_POINTER_BUTTON,
  DEFINING_WORLD_PLAZA_CHARACTER_FACING_ROTATION_POINTER_BUTTONS_MASK,
} from "@/components/world/domains/definingWorldPlazaCharacterFacingRotationConstants";
import { DEFINING_WORLD_PLAZA_UI_SELECTOR } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { projectingWorldPlazaViewportClientPointToGridPoint } from "@/components/world/domains/projectingWorldPlazaViewportClientPointToGridPoint";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint } from "@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint";
import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";
import { useCallback, useEffect, useRef } from "react";

/** Pointer position in viewport (client) pixels while turning. */
interface TrackingWorldPlazaCharacterFacingPointerClientPoint {
  clientX: number;
  clientY: number;
}

export interface TrackingWorldPlazaCharacterFacingRotationInputParams {
  /** When false, turn input is ignored and facing resets to default. */
  isEnabled: boolean;
  /** When true, turn input is blocked while chat is open. */
  isChatOpenRef: React.RefObject<boolean>;
  /** Plaza viewport frame used to project pointer positions. */
  viewportFrameRef: React.RefObject<HTMLElement | null>;
  /** Updated each frame by the camera rig for pointer projection. */
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  /** Live Pixi screen size; scales DOM pointer pixels into canvas space. */
  viewportSizeRef: React.RefObject<DefiningWorldPlazaPixiViewportSize>;
  /** Effective world-container zoom, including fullscreen compensation. */
  cameraWorldZoomRef: React.RefObject<number>;
  /** Live local avatar position. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** True while click-walk locomotion is active. */
  isWalkingRef: React.RefObject<boolean>;
  /** True while a jump animation is active. */
  isJumpingRef: React.RefObject<boolean>;
  /** Called after the avatar facing changes so motion can sync online. */
  onFacingChanged?: () => void;
}

export interface TrackingWorldPlazaCharacterFacingRotationInputResult {
  /** Live GirlSample facing strip for idle turn-in-place. */
  characterFacingDirectionRef: React.RefObject<DefiningWorldPlazaGirlSampleWalkDirection>;
  /** True while the right mouse button is held for turning. */
  isTurnPointerHeldRef: React.RefObject<boolean>;
  /** Starts face-the-pointer on right-button press. */
  handlingCharacterFacingPointerDown: (
    event: React.PointerEvent<HTMLElement>,
  ) => void;
  /** Updates facing toward the pointer while the right button is held. */
  handlingCharacterFacingPointerMove: (
    event: React.PointerEvent<HTMLElement>,
  ) => void;
  /** Ends face-the-pointer when the right button is released. */
  handlingCharacterFacingPointerRelease: (
    event?: React.PointerEvent<HTMLElement>,
  ) => void;
}

/**
 * Tracks right-click hold input so the local avatar faces the pointer.
 *
 * @param params - Enable flag, viewport refs, locomotion locks, and sync callback.
 */
export function trackingWorldPlazaCharacterFacingRotationInput({
  isEnabled,
  isChatOpenRef,
  viewportFrameRef,
  cameraOffsetRef,
  viewportSizeRef,
  cameraWorldZoomRef,
  playerPositionRef,
  isWalkingRef,
  isJumpingRef,
  onFacingChanged,
}: TrackingWorldPlazaCharacterFacingRotationInputParams): TrackingWorldPlazaCharacterFacingRotationInputResult {
  const characterFacingDirectionRef =
    useRef<DefiningWorldPlazaGirlSampleWalkDirection>(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION,
    );
  const isTurnPointerHeldRef = useRef(false);
  const activeTurnPointerIdRef = useRef<number | null>(null);
  const lastTurnPointerClientRef =
    useRef<TrackingWorldPlazaCharacterFacingPointerClientPoint | null>(null);
  const lastFacingSyncSentAtMsRef = useRef(0);

  const checkingTurnInputIsAllowed = useCallback((): boolean => {
    return (
      isEnabled &&
      !isChatOpenRef.current &&
      !isWalkingRef.current &&
      !isJumpingRef.current
    );
  }, [isChatOpenRef, isEnabled, isJumpingRef, isWalkingRef]);

  const updatingCharacterFacingTowardClientPoint = useCallback(
    (clientX: number, clientY: number): void => {
      if (!checkingTurnInputIsAllowed() || !isTurnPointerHeldRef.current) {
        return;
      }

      const viewportFrame = viewportFrameRef.current;
      const playerPosition = playerPositionRef.current;

      if (!viewportFrame || !playerPosition) {
        return;
      }

      const pointerGridPoint = projectingWorldPlazaViewportClientPointToGridPoint(
        clientX,
        clientY,
        viewportFrame,
        cameraOffsetRef.current,
        viewportSizeRef.current,
        cameraWorldZoomRef.current,
      );

      if (!pointerGridPoint) {
        return;
      }

      const nextFacingDirection =
        resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint(
          playerPosition,
          pointerGridPoint,
          characterFacingDirectionRef.current,
        );

      if (nextFacingDirection === characterFacingDirectionRef.current) {
        return;
      }

      characterFacingDirectionRef.current = nextFacingDirection;

      const nowMs = performance.now();

      if (
        nowMs - lastFacingSyncSentAtMsRef.current <
        DEFINING_WORLD_PLAZA_CHARACTER_FACING_ROTATION_NETWORK_INTERVAL_MS
      ) {
        return;
      }

      lastFacingSyncSentAtMsRef.current = nowMs;
      onFacingChanged?.();
    },
    [
      cameraOffsetRef,
      cameraWorldZoomRef,
      checkingTurnInputIsAllowed,
      onFacingChanged,
      playerPositionRef,
      viewportFrameRef,
      viewportSizeRef,
    ],
  );

  const handlingCharacterFacingPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>): void => {
      if (event.button !== DEFINING_WORLD_PLAZA_CHARACTER_FACING_ROTATION_POINTER_BUTTON) {
        return;
      }

      if (!checkingTurnInputIsAllowed()) {
        return;
      }

      const clickedElement = event.target;

      if (
        clickedElement instanceof Element &&
        clickedElement.closest(DEFINING_WORLD_PLAZA_UI_SELECTOR)
      ) {
        return;
      }

      event.preventDefault();
      isTurnPointerHeldRef.current = true;
      activeTurnPointerIdRef.current = event.pointerId;
      lastTurnPointerClientRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
      };
      lastFacingSyncSentAtMsRef.current = 0;
      event.currentTarget.setPointerCapture(event.pointerId);
      updatingCharacterFacingTowardClientPoint(event.clientX, event.clientY);
    },
    [checkingTurnInputIsAllowed, updatingCharacterFacingTowardClientPoint],
  );

  const handlingCharacterFacingPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>): void => {
      if (
        !isTurnPointerHeldRef.current ||
        activeTurnPointerIdRef.current !== event.pointerId
      ) {
        return;
      }

      if (
        (event.buttons &
          DEFINING_WORLD_PLAZA_CHARACTER_FACING_ROTATION_POINTER_BUTTONS_MASK) ===
        0
      ) {
        isTurnPointerHeldRef.current = false;
        activeTurnPointerIdRef.current = null;
        lastTurnPointerClientRef.current = null;
        return;
      }

      lastTurnPointerClientRef.current = {
        clientX: event.clientX,
        clientY: event.clientY,
      };
      updatingCharacterFacingTowardClientPoint(event.clientX, event.clientY);
    },
    [updatingCharacterFacingTowardClientPoint],
  );

  const handlingCharacterFacingPointerRelease = useCallback(
    (event?: React.PointerEvent<HTMLElement>): void => {
      if (
        event &&
        (event.buttons &
          DEFINING_WORLD_PLAZA_CHARACTER_FACING_ROTATION_POINTER_BUTTONS_MASK) !==
          0
      ) {
        return;
      }

      if (
        event &&
        activeTurnPointerIdRef.current !== null &&
        event.pointerId !== activeTurnPointerIdRef.current
      ) {
        return;
      }

      if (
        event?.currentTarget &&
        activeTurnPointerIdRef.current !== null &&
        event.currentTarget.hasPointerCapture(activeTurnPointerIdRef.current)
      ) {
        event.currentTarget.releasePointerCapture(activeTurnPointerIdRef.current);
      }

      isTurnPointerHeldRef.current = false;
      activeTurnPointerIdRef.current = null;
      lastTurnPointerClientRef.current = null;
    },
    [],
  );

  useEffect(() => {
    if (!isEnabled) {
      characterFacingDirectionRef.current =
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION;
      isTurnPointerHeldRef.current = false;
      activeTurnPointerIdRef.current = null;
      lastTurnPointerClientRef.current = null;
      lastFacingSyncSentAtMsRef.current = 0;
      return;
    }

    let animationFrameId = 0;

    const refreshingHeldCharacterFacing = (): void => {
      const pointerClient = lastTurnPointerClientRef.current;

      if (isTurnPointerHeldRef.current && pointerClient) {
        updatingCharacterFacingTowardClientPoint(
          pointerClient.clientX,
          pointerClient.clientY,
        );
      }

      animationFrameId = window.requestAnimationFrame(refreshingHeldCharacterFacing);
    };

    animationFrameId = window.requestAnimationFrame(refreshingHeldCharacterFacing);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isEnabled, updatingCharacterFacingTowardClientPoint]);

  return {
    characterFacingDirectionRef,
    isTurnPointerHeldRef,
    handlingCharacterFacingPointerDown,
    handlingCharacterFacingPointerMove,
    handlingCharacterFacingPointerRelease,
  };
}
