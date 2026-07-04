'use client';

import { savingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import type { DefiningWorldPlazaAvatarMotionState } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import { DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import {
  creatingWorldPlazaLastPosition,
  type DefiningWorldPlazaLastPosition,
} from '@/components/world/domains/definingWorldPlazaLastPosition';
import {
  DEFINING_WORLD_PLAZA_LAST_POSITION_MIN_GRID_DELTA,
  DEFINING_WORLD_PLAZA_LAST_POSITION_POLL_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_LAST_POSITION_SETTLE_DELAY_MS,
  DEFINING_WORLD_PLAZA_LAST_POSITION_SUPABASE_MIN_INTERVAL_MS,
} from '@/components/world/domains/definingWorldPlazaLastPositionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { readingWorldPlazaLastPositionFromStorage } from '@/components/world/domains/readingWorldPlazaLastPositionFromStorage';
import { writingWorldPlazaLastPositionToStorage } from '@/components/world/domains/writingWorldPlazaLastPositionToStorage';
import { usingWorldPlazaLastPositionQuery } from '@/components/world/hooks/usingWorldPlazaLastPositionQuery';
import { useEffect, useRef } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

/**
 * Persists the local avatar last plaza position while the session is active.
 *
 * @module components/world/hooks/usingWorldPlazaPersistingPlayerLastPosition
 */

/** Params for {@link usingWorldPlazaPersistingPlayerLastPosition}. */
export interface UsingWorldPlazaPersistingPlayerLastPositionParams {
  /** When false, persist loops stay idle. */
  isEnabled: boolean;
  /** Auth user id, or null for offline sessions. */
  onlineUserId: string | null;
  /** Offline session owner id for localStorage when {@link onlineUserId} is null. */
  localPersistenceOwnerId?: string | null;
  /** Reddit user id for signed-in single-player cloud saves. */
  redditUserId?: string | null;
  /** Active single-player save slot (1–3). */
  singlePlayerSaveSlotIndex?: PlazaSaveSlotIndex | null;
  /** Live local avatar position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Live local avatar motion written each Pixi frame. */
  localAvatarMotionStateRef: React.RefObject<DefiningWorldPlazaAvatarMotionState>;
  /** Updated each frame while walking toward a click target. */
  isWalkingRef: React.RefObject<boolean>;
  /** True while a jump animation is in progress. */
  isJumpingRef: React.RefObject<boolean>;
}

/**
 * Returns true when two grid positions differ enough to persist.
 *
 * @param previousPosition - Last persisted position.
 * @param nextPosition - Candidate position.
 */
function checkingWorldPlazaLastPositionChangedEnough(
  previousPosition: DefiningWorldPlazaLastPosition,
  nextPosition: DefiningWorldPlazaLastPosition
): boolean {
  const deltaX = Math.abs(nextPosition.x - previousPosition.x);
  const deltaY = Math.abs(nextPosition.y - previousPosition.y);
  const layerChanged = nextPosition.layer !== previousPosition.layer;

  return (
    layerChanged ||
    deltaX >= DEFINING_WORLD_PLAZA_LAST_POSITION_MIN_GRID_DELTA ||
    deltaY >= DEFINING_WORLD_PLAZA_LAST_POSITION_MIN_GRID_DELTA
  );
}

/**
 * Returns true when the avatar is actively moving (walk, run, jump, or click-walk).
 *
 * Movement gates server writes: the position is only sent once the player rests.
 *
 * @param localAvatarMotionStateRef - Live motion state written each frame.
 * @param isWalkingRef - True while walking toward a click target.
 * @param isJumpingRef - True while a jump animation is in progress.
 */
function checkingWorldPlazaPlayerIsMoving(
  localAvatarMotionStateRef: React.RefObject<DefiningWorldPlazaAvatarMotionState>,
  isWalkingRef: React.RefObject<boolean>,
  isJumpingRef: React.RefObject<boolean>
): boolean {
  if (isWalkingRef.current || isJumpingRef.current) {
    return true;
  }

  const motionKind = localAvatarMotionStateRef.current?.motionKind;

  return (
    motionKind !== undefined &&
    motionKind !== DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE
  );
}

/**
 * Builds a last-position snapshot from the live avatar ref.
 *
 * @param playerPositionRef - Live local avatar position in grid space.
 */
function creatingWorldPlazaLastPositionFromPlayerRef(
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>
): DefiningWorldPlazaLastPosition | null {
  const playerPosition = playerPositionRef.current;

  if (
    !playerPosition ||
    !Number.isFinite(playerPosition.x) ||
    !Number.isFinite(playerPosition.y)
  ) {
    return null;
  }

  return creatingWorldPlazaLastPosition(
    playerPosition.x,
    playerPosition.y,
    resolvingWorldPlazaPlayerWorldLayer(playerPosition),
    Date.now()
  );
}

/**
 * Persists movement to localStorage and Supabase while the plaza is active.
 *
 * @param params - Live movement refs for the active session.
 */
export function usingWorldPlazaPersistingPlayerLastPosition({
  isEnabled,
  onlineUserId,
  localPersistenceOwnerId = null,
  redditUserId = null,
  singlePlayerSaveSlotIndex = null,
  playerPositionRef,
  localAvatarMotionStateRef,
  isWalkingRef,
  isJumpingRef,
}: UsingWorldPlazaPersistingPlayerLastPositionParams): void {
  const storageOwnerId = onlineUserId ?? localPersistenceOwnerId;
  const isSignedInSinglePlayer =
    onlineUserId === null &&
    redditUserId !== null &&
    singlePlayerSaveSlotIndex !== null;
  const { upsertingRemoteLastPosition } =
    usingWorldPlazaLastPositionQuery(onlineUserId);
  const lastPersistedLocalPositionRef =
    useRef<DefiningWorldPlazaLastPosition | null>(
      readingWorldPlazaLastPositionFromStorage(storageOwnerId)
    );
  const lastServerUpsertAtMsRef = useRef(0);
  /** Set when the local position diverges from what the server already holds. */
  const isDirtyForServerRef = useRef(false);
  /** Wall-clock ms the avatar last became idle; 0 while moving. */
  const idleSinceMsRef = useRef(0);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    /**
     * Writes the current position to localStorage when it moved enough.
     *
     * @returns The snapshot when local storage was updated, else null.
     */
    const persistingLocalLastPosition =
      (): DefiningWorldPlazaLastPosition | null => {
        const nextLastPosition =
          creatingWorldPlazaLastPositionFromPlayerRef(playerPositionRef);

        if (!nextLastPosition) {
          return null;
        }

        const previousLastPosition = lastPersistedLocalPositionRef.current;

        if (
          previousLastPosition &&
          !checkingWorldPlazaLastPositionChangedEnough(
            previousLastPosition,
            nextLastPosition
          )
        ) {
          return null;
        }

        writingWorldPlazaLastPositionToStorage(
          nextLastPosition,
          storageOwnerId
        );
        lastPersistedLocalPositionRef.current = nextLastPosition;
        isDirtyForServerRef.current = true;

        return nextLastPosition;
      };

    /**
     * Sends the resting position to the server, ignoring the settle wait.
     *
     * @param ignoresCooldown - When true, bypasses the upsert throttle (exit flush).
     */
    const flushingServerLastPosition = (ignoresCooldown: boolean): void => {
      if (!isDirtyForServerRef.current) {
        return;
      }

      const lastPosition = lastPersistedLocalPositionRef.current;

      if (!lastPosition) {
        return;
      }

      const nowMs = Date.now();

      if (isSignedInSinglePlayer && singlePlayerSaveSlotIndex) {
        if (
          !ignoresCooldown &&
          nowMs - lastServerUpsertAtMsRef.current <
            DEFINING_WORLD_PLAZA_LAST_POSITION_SUPABASE_MIN_INTERVAL_MS
        ) {
          return;
        }

        lastServerUpsertAtMsRef.current = nowMs;
        isDirtyForServerRef.current = false;
        void savingPlazaSinglePlayerSaveSlotData(singlePlayerSaveSlotIndex, {
          lastPosition: {
            x: lastPosition.x,
            y: lastPosition.y,
            layer: lastPosition.layer,
            updatedAtMs: lastPosition.updatedAtMs,
          },
        }).catch(() => {
          isDirtyForServerRef.current = true;
        });
        return;
      }

      if (onlineUserId === null) {
        return;
      }

      if (
        !ignoresCooldown &&
        nowMs - lastServerUpsertAtMsRef.current <
          DEFINING_WORLD_PLAZA_LAST_POSITION_SUPABASE_MIN_INTERVAL_MS
      ) {
        return;
      }

      lastServerUpsertAtMsRef.current = nowMs;
      isDirtyForServerRef.current = false;
      upsertingRemoteLastPosition(lastPosition);
    };

    const pollingPlayerLastPosition = (): void => {
      persistingLocalLastPosition();

      if (onlineUserId === null && !isSignedInSinglePlayer) {
        return;
      }

      const isMoving = checkingWorldPlazaPlayerIsMoving(
        localAvatarMotionStateRef,
        isWalkingRef,
        isJumpingRef
      );

      if (isMoving) {
        idleSinceMsRef.current = 0;
        return;
      }

      const nowMs = Date.now();

      if (idleSinceMsRef.current === 0) {
        idleSinceMsRef.current = nowMs;
        return;
      }

      const hasSettled =
        nowMs - idleSinceMsRef.current >=
        DEFINING_WORLD_PLAZA_LAST_POSITION_SETTLE_DELAY_MS;

      if (hasSettled) {
        flushingServerLastPosition(false);
      }
    };

    const flushingLastPositionOnExit = (): void => {
      persistingLocalLastPosition();
      flushingServerLastPosition(true);
    };

    const handlingVisibilityChange = (): void => {
      if (document.visibilityState === 'hidden') {
        flushingLastPositionOnExit();
      }
    };

    const pollIntervalId = window.setInterval(
      pollingPlayerLastPosition,
      DEFINING_WORLD_PLAZA_LAST_POSITION_POLL_INTERVAL_MS
    );

    window.addEventListener('pagehide', flushingLastPositionOnExit);
    document.addEventListener('visibilitychange', handlingVisibilityChange);

    return () => {
      window.clearInterval(pollIntervalId);
      window.removeEventListener('pagehide', flushingLastPositionOnExit);
      document.removeEventListener(
        'visibilitychange',
        handlingVisibilityChange
      );
      flushingLastPositionOnExit();
    };
  }, [
    isEnabled,
    isJumpingRef,
    isWalkingRef,
    isSignedInSinglePlayer,
    localAvatarMotionStateRef,
    onlineUserId,
    playerPositionRef,
    singlePlayerSaveSlotIndex,
    upsertingRemoteLastPosition,
  ]);
}
