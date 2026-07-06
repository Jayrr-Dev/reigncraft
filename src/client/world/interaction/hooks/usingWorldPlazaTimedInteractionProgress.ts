'use client';

import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_CANCEL_FADE_MS,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_COMPLETION_RESET_MS,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_MID_RATIO,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressConstants';
import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT,
  type DefiningWorldPlazaTimedInteractionMilestone,
  type DefiningWorldPlazaTimedInteractionProgressSnapshot,
  type StartingWorldPlazaTimedInteractionRequest,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UsingWorldPlazaTimedInteractionProgressParams<TContext> = {
  readonly onComplete: (context: TContext) => void;
};

export type UsingWorldPlazaTimedInteractionProgressResult<TContext> = {
  readonly snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly startingTimedInteraction: (
    request: StartingWorldPlazaTimedInteractionRequest<TContext>
  ) => boolean;
  readonly cancellingTimedInteraction: () => void;
};

type ActiveTimedInteractionState<TContext> = {
  readonly targetKey: string;
  readonly context: TContext;
  readonly startedAtMs: number;
  readonly durationMs: number;
  readonly firedMidMilestone: boolean;
  readonly handlingMilestone?: (
    milestone: DefiningWorldPlazaTimedInteractionMilestone,
    context: TContext,
    nowMs: number
  ) => void;
};

/**
 * Drives a single timed world interaction with milestone pulses and cancel-on-invalid.
 */
export function usingWorldPlazaTimedInteractionProgress<TContext>({
  onComplete,
}: UsingWorldPlazaTimedInteractionProgressParams<TContext>): UsingWorldPlazaTimedInteractionProgressResult<TContext> {
  const [snapshot, setSnapshot] =
    useState<DefiningWorldPlazaTimedInteractionProgressSnapshot>(
      DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT
    );
  const activeInteractionRef = useRef<ActiveTimedInteractionState<TContext> | null>(
    null
  );
  const cancelFadeTimerRef = useRef<number | null>(null);
  const pulseGenerationRef = useRef(0);
  const onCompleteRef = useRef(onComplete);

  onCompleteRef.current = onComplete;

  const clearingCancelFadeTimer = useCallback((): void => {
    if (cancelFadeTimerRef.current !== null) {
      window.clearTimeout(cancelFadeTimerRef.current);
      cancelFadeTimerRef.current = null;
    }
  }, []);

  const beginningCancelFade = useCallback((): void => {
    if (!activeInteractionRef.current) {
      return;
    }

    activeInteractionRef.current = null;
    setSnapshot((current) => ({
      ...current,
      isCancelling: true,
      milestonePulse: null,
    }));

    clearingCancelFadeTimer();
    cancelFadeTimerRef.current = window.setTimeout(() => {
      setSnapshot(DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT);
      cancelFadeTimerRef.current = null;
    }, DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_CANCEL_FADE_MS);
  }, [clearingCancelFadeTimer]);

  const firingMilestone = useCallback(
    (
      milestone: DefiningWorldPlazaTimedInteractionMilestone,
      activeInteraction: ActiveTimedInteractionState<TContext>,
      nowMs: number
    ): void => {
      activeInteraction.handlingMilestone?.(
        milestone,
        activeInteraction.context,
        nowMs
      );
      pulseGenerationRef.current += 1;
      setSnapshot((current) => ({
        ...current,
        milestonePulse: milestone,
        pulseGeneration: pulseGenerationRef.current,
      }));
    },
    []
  );

  const cancellingTimedInteraction = useCallback((): void => {
    if (!activeInteractionRef.current) {
      return;
    }

    beginningCancelFade();
  }, [beginningCancelFade]);

  const startingTimedInteraction = useCallback(
    (request: StartingWorldPlazaTimedInteractionRequest<TContext>): boolean => {
      if (activeInteractionRef.current) {
        return false;
      }

      if (!request.checkingShouldContinue()) {
        return false;
      }

      const startedAtMs = performance.now();

      activeInteractionRef.current = {
        targetKey: request.targetKey,
        context: request.context,
        startedAtMs,
        durationMs: request.durationMs,
        firedMidMilestone: false,
        handlingMilestone: request.handlingMilestone,
      };

      firingMilestone('start', activeInteractionRef.current, startedAtMs);
      setSnapshot({
        isActive: true,
        isCancelling: false,
        progressRatio: 0,
        milestonePulse: 'start',
        pulseGeneration: pulseGenerationRef.current,
        activeTargetKey: request.targetKey,
      });

      return true;
    },
    [firingMilestone]
  );

  useEffect(() => {
    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        const activeInteraction = activeInteractionRef.current;

        if (!activeInteraction) {
          return;
        }

        if (!activeInteraction.checkingShouldContinue?.()) {
          beginningCancelFade();
          return;
        }

        const nowMs = performance.now();
        const elapsedMs = nowMs - activeInteraction.startedAtMs;
        const progressRatio = Math.min(1, elapsedMs / activeInteraction.durationMs);

        if (
          !activeInteraction.firedMidMilestone &&
          progressRatio >= DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_MID_RATIO
        ) {
          activeInteractionRef.current = {
            ...activeInteraction,
            firedMidMilestone: true,
          };
          firingMilestone('mid', activeInteraction, nowMs);
        }

        if (progressRatio >= 1) {
          const completedContext = activeInteraction.context;
          const completedTargetKey = activeInteraction.targetKey;
          activeInteractionRef.current = null;
          firingMilestone('final', activeInteraction, nowMs);
          setSnapshot({
            isActive: false,
            isCancelling: false,
            progressRatio: 1,
            milestonePulse: 'final',
            pulseGeneration: pulseGenerationRef.current,
            activeTargetKey: completedTargetKey,
          });
          onCompleteRef.current(completedContext);

          window.setTimeout(() => {
            if (!activeInteractionRef.current) {
              setSnapshot(
                DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT
              );
            }
          }, DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_COMPLETION_RESET_MS);

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
  }, [beginningCancelFade, clearingCancelFadeTimer, firingMilestone]);

  return {
    snapshot,
    startingTimedInteraction,
    cancellingTimedInteraction,
  };
}
