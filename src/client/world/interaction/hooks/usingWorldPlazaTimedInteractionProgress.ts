'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_CANCEL_FADE_MS,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_COMPLETION_RESET_MS,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_MAX_QUEUED,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_MID_RATIO,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressConstants';
import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT,
  type DefiningWorldPlazaTimedInteractionMilestone,
  type DefiningWorldPlazaTimedInteractionProgressSnapshot,
  type StartingWorldPlazaTimedInteractionRequest,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { resolvingWorldPlazaTimedInteractionQueueEnqueue } from '@/components/world/interaction/domains/resolvingWorldPlazaTimedInteractionQueueEnqueue';
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
  /**
   * When true (default), extra clicks on the same targetKey enqueue repeats
   * instead of returning false while the channel is already running.
   */
  readonly enableQueue?: boolean;
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
 * Same-target click spam can queue repeats (wet clay, harvest, fishing, etc.).
 * Progress ratio updates run through a ref so the ring can animate without React re-renders.
 */
export function usingWorldPlazaTimedInteractionProgress<TContext>({
  onComplete,
  avatarToolActionRef,
  enableQueue = true,
}: UsingWorldPlazaTimedInteractionProgressParams<TContext>): UsingWorldPlazaTimedInteractionProgressResult<TContext> {
  const [snapshot, setSnapshot] =
    useState<DefiningWorldPlazaTimedInteractionProgressSnapshot>(
      DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT
    );
  const progressRatioRef = useRef(0);
  const activeInteractionRef =
    useRef<ActiveTimedInteractionState<TContext> | null>(null);
  const pendingQueueRef = useRef<
    StartingWorldPlazaTimedInteractionRequest<TContext>[]
  >([]);
  const cancelFadeTimerRef = useRef<number | null>(null);
  const pulseGenerationRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const enableQueueRef = useRef(enableQueue);

  onCompleteRef.current = onComplete;
  enableQueueRef.current = enableQueue;

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

  const clearingPendingQueue = useCallback((): void => {
    pendingQueueRef.current = [];
  }, []);

  const beginningCancelFade = useCallback((): void => {
    if (!activeInteractionRef.current) {
      return;
    }

    activeInteractionRef.current = null;
    clearingPendingQueue();
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
  }, [
    clearingAvatarToolAction,
    clearingCancelFadeTimer,
    clearingPendingQueue,
  ]);

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

  const beginningTimedInteractionFromRequest = useCallback(
    (
      request: StartingWorldPlazaTimedInteractionRequest<TContext>,
      startedAtMs: number
    ): void => {
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
    },
    [avatarToolActionRef, firingMilestone]
  );

  const startingNextQueuedTimedInteraction = useCallback((): boolean => {
    while (pendingQueueRef.current.length > 0) {
      const nextRequest = pendingQueueRef.current.shift();

      if (!nextRequest) {
        break;
      }

      if (!nextRequest.checkingShouldContinue()) {
        continue;
      }

      beginningTimedInteractionFromRequest(nextRequest, performance.now());
      return true;
    }

    return false;
  }, [beginningTimedInteractionFromRequest]);

  const cancellingTimedInteraction = useCallback((): void => {
    if (!activeInteractionRef.current) {
      return;
    }

    beginningCancelFade();
  }, [beginningCancelFade]);

  const startingTimedInteraction = useCallback(
    (request: StartingWorldPlazaTimedInteractionRequest<TContext>): boolean => {
      const activeInteraction = activeInteractionRef.current;

      if (activeInteraction) {
        if (
          !enableQueueRef.current ||
          activeInteraction.targetKey !== request.targetKey
        ) {
          return false;
        }

        const enqueueResult = resolvingWorldPlazaTimedInteractionQueueEnqueue(
          pendingQueueRef.current,
          request,
          DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_MAX_QUEUED
        );
        pendingQueueRef.current = [...enqueueResult.nextQueue];
        return enqueueResult.accepted;
      }

      if (!request.checkingShouldContinue()) {
        return false;
      }

      clearingCancelFadeTimer();
      beginningTimedInteractionFromRequest(request, performance.now());
      return true;
    },
    [beginningTimedInteractionFromRequest, clearingCancelFadeTimer]
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
          onCompleteRef.current(completedContext);

          if (startingNextQueuedTimedInteraction()) {
            return;
          }

          setSnapshot({
            isActive: false,
            isCancelling: false,
            progressRatio: 1,
            milestonePulse: 'final',
            pulseGeneration: pulseGenerationRef.current,
            activeTargetKey: completedTargetKey,
            activeProgressIcon: completedProgressIcon,
          });

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
    startingNextQueuedTimedInteraction,
  ]);

  useEffect(
    () => () => {
      clearingCancelFadeTimer();
      clearingPendingQueue();
    },
    [clearingCancelFadeTimer, clearingPendingQueue]
  );

  return {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  };
}
