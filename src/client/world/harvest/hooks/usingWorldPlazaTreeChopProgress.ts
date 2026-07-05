'use client';

import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { computingWorldPlazaTreeChopDurationMs } from '@/components/world/harvest/domains/computingWorldPlazaTreeChopDurationMs';
import { DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES } from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';
import {
  DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_CANCEL_FADE_MS,
  DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_MID_RATIO,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopProgressConstants';
import type { ListingWorldPlazaTreesInInteractionRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaTreesInInteractionRange';
import { registeringWorldPlazaTreeShake } from '@/components/world/harvest/domains/managingWorldPlazaTreeShakeRegistry';
import { formattingWorldPlazaInteractableTreeSelectionKey } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableTreeSelectionKey';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

export type DefiningWorldPlazaTreeChopMilestone = 'start' | 'mid' | 'final';

export type UsingWorldPlazaTreeChopProgressSnapshot = {
  readonly isActive: boolean;
  readonly isCancelling: boolean;
  readonly progressRatio: number;
  readonly milestonePulse: DefiningWorldPlazaTreeChopMilestone | null;
  readonly pulseGeneration: number;
};

export type UsingWorldPlazaTreeChopProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly onChopComplete: (
    entry: ListingWorldPlazaTreesInInteractionRangeEntry
  ) => void;
};

export type UsingWorldPlazaTreeChopProgressResult = {
  readonly snapshot: UsingWorldPlazaTreeChopProgressSnapshot;
  readonly startingTreeChop: (
    entry: ListingWorldPlazaTreesInInteractionRangeEntry
  ) => boolean;
  readonly cancellingTreeChop: () => void;
};

const INITIAL_SNAPSHOT: UsingWorldPlazaTreeChopProgressSnapshot = {
  isActive: false,
  isCancelling: false,
  progressRatio: 0,
  milestonePulse: null,
  pulseGeneration: 0,
};

type ActiveChopState = {
  readonly entry: ListingWorldPlazaTreesInInteractionRangeEntry;
  readonly startedAtMs: number;
  readonly durationMs: number;
  readonly firedMidMilestone: boolean;
};

function checkingWorldPlazaTreeChopStillInRange(
  playerPosition: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number
): boolean {
  const distance = computingWorldPlazaGridChebyshevDistance(
    playerPosition.x,
    playerPosition.y,
    tileX + 0.5,
    tileY + 0.5
  );

  return distance <= DEFINING_WORLD_PLAZA_TREE_CHOP_PLAYER_RANGE_TILES;
}

function checkingWorldPlazaTreeChopStillSelected(
  selectedKeys: ReadonlySet<string>,
  tileX: number,
  tileY: number
): boolean {
  return selectedKeys.has(
    formattingWorldPlazaInteractableTreeSelectionKey(tileX, tileY)
  );
}

/**
 * Drives timed chop progress with milestone feedback and cancel-on-move.
 */
export function usingWorldPlazaTreeChopProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  onChopComplete,
}: UsingWorldPlazaTreeChopProgressParams): UsingWorldPlazaTreeChopProgressResult {
  const [snapshot, setSnapshot] =
    useState<UsingWorldPlazaTreeChopProgressSnapshot>(INITIAL_SNAPSHOT);
  const activeChopRef = useRef<ActiveChopState | null>(null);
  const cancelFadeTimerRef = useRef<number | null>(null);
  const pulseGenerationRef = useRef(0);
  const onChopCompleteRef = useRef(onChopComplete);

  onChopCompleteRef.current = onChopComplete;

  const clearingCancelFadeTimer = useCallback((): void => {
    if (cancelFadeTimerRef.current !== null) {
      window.clearTimeout(cancelFadeTimerRef.current);
      cancelFadeTimerRef.current = null;
    }
  }, []);

  const beginningCancelFade = useCallback((): void => {
    if (!activeChopRef.current) {
      return;
    }

    activeChopRef.current = null;
    setSnapshot((current) => ({
      ...current,
      isCancelling: true,
      milestonePulse: null,
    }));

    clearingCancelFadeTimer();
    cancelFadeTimerRef.current = window.setTimeout(() => {
      setSnapshot(INITIAL_SNAPSHOT);
      cancelFadeTimerRef.current = null;
    }, DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_CANCEL_FADE_MS);
  }, [clearingCancelFadeTimer]);

  const firingMilestone = useCallback(
    (
      milestone: DefiningWorldPlazaTreeChopMilestone,
      tileX: number,
      tileY: number,
      nowMs: number
    ): void => {
      registeringWorldPlazaTreeShake(tileX, tileY, nowMs);
      pulseGenerationRef.current += 1;
      setSnapshot((current) => ({
        ...current,
        milestonePulse: milestone,
        pulseGeneration: pulseGenerationRef.current,
      }));
    },
    []
  );

  const cancellingTreeChop = useCallback((): void => {
    if (!activeChopRef.current) {
      return;
    }

    beginningCancelFade();
  }, [beginningCancelFade]);

  const startingTreeChop = useCallback(
    (entry: ListingWorldPlazaTreesInInteractionRangeEntry): boolean => {
      if (activeChopRef.current) {
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      if (
        !checkingWorldPlazaTreeChopStillInRange(
          playerPosition,
          entry.tileX,
          entry.tileY
        )
      ) {
        return false;
      }

      const durationMs = computingWorldPlazaTreeChopDurationMs(
        entry.remainingChoppableLayers
      );
      const startedAtMs = performance.now();

      activeChopRef.current = {
        entry,
        startedAtMs,
        durationMs,
        firedMidMilestone: false,
      };

      firingMilestone('start', entry.tileX, entry.tileY, startedAtMs);
      setSnapshot({
        isActive: true,
        isCancelling: false,
        progressRatio: 0,
        milestonePulse: 'start',
        pulseGeneration: pulseGenerationRef.current,
      });

      return true;
    },
    [firingMilestone, playerPositionRef]
  );

  useEffect(() => {
    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        const activeChop = activeChopRef.current;

        if (!activeChop) {
          return;
        }

        const playerPosition = playerPositionRef.current;
        const selectedKeys = selectedInteractableBlockKeysRef.current;

        if (
          !playerPosition ||
          !checkingWorldPlazaTreeChopStillInRange(
            playerPosition,
            activeChop.entry.tileX,
            activeChop.entry.tileY
          ) ||
          !checkingWorldPlazaTreeChopStillSelected(
            selectedKeys,
            activeChop.entry.tileX,
            activeChop.entry.tileY
          )
        ) {
          beginningCancelFade();
          return;
        }

        const nowMs = performance.now();
        const elapsedMs = nowMs - activeChop.startedAtMs;
        const progressRatio = Math.min(1, elapsedMs / activeChop.durationMs);

        if (
          !activeChop.firedMidMilestone &&
          progressRatio >= DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_MID_RATIO
        ) {
          activeChopRef.current = {
            ...activeChop,
            firedMidMilestone: true,
          };
          firingMilestone(
            'mid',
            activeChop.entry.tileX,
            activeChop.entry.tileY,
            nowMs
          );
        }

        if (progressRatio >= 1) {
          const completedEntry = activeChop.entry;
          activeChopRef.current = null;
          firingMilestone(
            'final',
            completedEntry.tileX,
            completedEntry.tileY,
            nowMs
          );
          setSnapshot({
            isActive: false,
            isCancelling: false,
            progressRatio: 1,
            milestonePulse: 'final',
            pulseGeneration: pulseGenerationRef.current,
          });
          onChopCompleteRef.current(completedEntry);

          window.setTimeout(() => {
            if (!activeChopRef.current) {
              setSnapshot(INITIAL_SNAPSHOT);
            }
          }, 120);

          return;
        }

        setSnapshot((current) => ({
          ...current,
          progressRatio,
        }));
      }
    );

    return () => {
      unsubscribeDomOverlayFrame();
      clearingCancelFadeTimer();
    };
  }, [
    beginningCancelFade,
    clearingCancelFadeTimer,
    firingMilestone,
    playerPositionRef,
    selectedInteractableBlockKeysRef,
  ]);

  return {
    snapshot,
    startingTreeChop,
    cancellingTreeChop,
  };
}
