'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
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
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

export type UsingWorldPlazaTimedInteractionProgressParams<TContext> = {
  readonly onComplete: (context: TContext) => void;
  /**
   * Shared slot for the local avatar's active tool action. Set on start and
   * cleared on cancel/completion so the avatar tick can play the action
   * animation and hold the character in place while the interaction runs.
   */
  readonly avatarToolActionRef?: RefObject<DefiningWorldPlazaAvatarToolAction | null>;
};

export type UsingWorldPlazaTimedInteractionProgressResult<TContext> = {
  readonly snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
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
  readonly progressIcon: string | null;
  readonly checkingShouldContinue: () => boolean;
  readonly handlingMilestone?: (
    milestone: DefiningWorldPlazaTimedInteractionMilestone,
    context: TContext,
    nowMs: number
  ) => void;
};

/**
 * Drives a single timed world interaction with milestone pulses and cancel-on-invalid.
 *
 * Progress ratio updates run through a ref so the ring can animate without React re-renders.
 */
export function usingWorldPlazaTimedInteractionProgress<TContext>({
  onComplete,
  avatarToolActionRef,
}: UsingWorldPlazaTimedInteractionProgressParams<TContext>): UsingWorldPlazaTimedInteractionProgressResult<TContext> {
  const [snapshot, setSnapshot] =
    useState<DefiningWorldPlazaTimedInteractionProgressSnapshot>(
      DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT
    );
  const progressRatioRef = useRef(0);
  const activeInteractionRef =
    useRef<ActiveTimedInteractionState<TContext> | null>(null);
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

  const clearingAvatarToolAction = useCallback((): void => {
    if (avatarToolActionRef) {
      avatarToolActionRef.current = null;
    }
  }, [avatarToolActionRef]);

  const beginningCancelFade = useCallback((): void => {
    if (!activeInteractionRef.current) {
      return;
    }

    activeInteractionRef.current = null;
    clearingAvatarToolAction();
    setSnapshot((current) => ({
      ...current,
      isActive: false,
      isCancelling: true,
      milestonePulse: null,
    }));

    clearingCancelFadeTimer();
    cancelFadeTimerRef.current = window.setTimeout(() => {
      progressRatioRef.current = 0;
      setSnapshot(
        DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT
      );
      cancelFadeTimerRef.current = null;
    }, DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_CANCEL_FADE_MS);
  }, [clearingAvatarToolAction, clearingCancelFadeTimer]);

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
      progressRatioRef.current = 0;

      activeInteractionRef.current = {
        targetKey: request.targetKey,
        context: request.context,
        startedAtMs,
        durationMs: request.durationMs,
        firedMidMilestone: false,
        progressIcon: request.progressIcon ?? null,
        checkingShouldContinue: request.checkingShouldContinue,
        handlingMilestone: request.handlingMilestone,
      };

      if (avatarToolActionRef && request.avatarToolAction) {
        avatarToolActionRef.current = request.avatarToolAction;
      }

      firingMilestone('start', activeInteractionRef.current, startedAtMs);
      setSnapshot({
        isActive: true,
        isCancelling: false,
        progressRatio: 0,
        milestonePulse: 'start',
        pulseGeneration: pulseGenerationRef.current,
        activeTargetKey: request.targetKey,
        activeProgressIcon: request.progressIcon ?? null,
      });

      return true;
    },
    [avatarToolActionRef, firingMilestone]
  );

  useEffect(() => {
    if (!snapshot.isActive) {
      return;
    }

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        const activeInteraction = activeInteractionRef.current;

        if (!activeInteraction) {
          return;
        }

        if (!activeInteraction.checkingShouldContinue()) {
          beginningCancelFade();
          return;
        }

        const nowMs = performance.now();
        const elapsedMs = nowMs - activeInteraction.startedAtMs;
        const progressRatio = Math.min(
          1,
          elapsedMs / activeInteraction.durationMs
        );

        progressRatioRef.current = progressRatio;

        if (
          !activeInteraction.firedMidMilestone &&
          progressRatio >=
            DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_MID_RATIO
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
          const completedProgressIcon = activeInteraction.progressIcon;
          activeInteractionRef.current = null;
          clearingAvatarToolAction();
          progressRatioRef.current = 1;
          firingMilestone('final', activeInteraction, nowMs);
          setSnapshot({
            isActive: false,
            isCancelling: false,
            progressRatio: 1,
            milestonePulse: 'final',
            pulseGeneration: pulseGenerationRef.current,
            activeTargetKey: completedTargetKey,
            activeProgressIcon: completedProgressIcon,
          });
          onCompleteRef.current(completedContext);

          window.setTimeout(() => {
            if (!activeInteractionRef.current) {
              progressRatioRef.current = 0;
              setSnapshot(
                DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT
              );
            }
          }, DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_COMPLETION_RESET_MS);

          return;
        }
      }
    );

    return () => {
      unsubscribeDomOverlayFrame();
    };
  }, [
    beginningCancelFade,
    clearingAvatarToolAction,
    firingMilestone,
    snapshot.isActive,
  ]);

  useEffect(
    () => () => {
      clearingCancelFadeTimer();
    },
    [clearingCancelFadeTimer]
  );

  return {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  };
}
