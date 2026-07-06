/**
 * Snapshot and request types for timed plaza interactions.
 *
 * @module components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot
 */

export type DefiningWorldPlazaTimedInteractionMilestone =
  | 'start'
  | 'mid'
  | 'final';

export type DefiningWorldPlazaTimedInteractionProgressSnapshot = {
  readonly isActive: boolean;
  readonly isCancelling: boolean;
  readonly progressRatio: number;
  readonly milestonePulse: DefiningWorldPlazaTimedInteractionMilestone | null;
  readonly pulseGeneration: number;
  readonly activeTargetKey: string | null;
  readonly activeProgressIcon: string | null;
};

export const DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_INITIAL_SNAPSHOT: DefiningWorldPlazaTimedInteractionProgressSnapshot =
  {
    isActive: false,
    isCancelling: false,
    progressRatio: 0,
    milestonePulse: null,
    pulseGeneration: 0,
    activeTargetKey: null,
    activeProgressIcon: null,
  };

export type StartingWorldPlazaTimedInteractionRequest<TContext> = {
  readonly targetKey: string;
  readonly durationMs: number;
  readonly context: TContext;
  readonly progressIcon?: string;
  readonly checkingShouldContinue: () => boolean;
  readonly handlingMilestone?: (
    milestone: DefiningWorldPlazaTimedInteractionMilestone,
    context: TContext,
    nowMs: number
  ) => void;
};
