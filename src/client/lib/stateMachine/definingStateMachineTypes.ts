/**
 * Domain layer for the declarative statechart engine.
 *
 * A machine is described entirely as data: states, transitions, and the IDs
 * of guards/actions. Behavior is plugged in through a domain registry that
 * maps those IDs to functions, so definitions stay serializable and the
 * engine stays domain-agnostic.
 *
 * @module lib/stateMachine/definingStateMachineTypes
 */

/** Dot-path state identifier, e.g. `alive.idle` or `grounded.walk`. */
export type DefiningStateMachineStateId = string;

/** Domain event name, e.g. `predator.seen` or `input.move.started`. */
export type DefiningStateMachineEventType = string;

/** Registry key for a guard predicate, e.g. `animal.isHungry`. */
export type DefiningStateMachineGuardId = string;

/** Registry key for an action, e.g. `movement.moveToTarget`. */
export type DefiningStateMachineActionId = string;

/**
 * Transition source pattern: an exact state path, a subtree wildcard like
 * `alive.*` (matches any state under `alive`), or `*` (matches everything).
 */
export type DefiningStateMachineFromPattern = string;

export type DefiningStateMachineStateNodeKind = 'atomic' | 'compound' | 'final';

export type DefiningStateMachineStateNode = {
  kind?: DefiningStateMachineStateNodeKind;
  /**
   * For compound states: the child entered when this state is targeted
   * directly. May be a child segment (`idle`) or a full path (`alive.idle`).
   */
  initial?: string;
  onEnter?: readonly DefiningStateMachineActionId[];
  onExit?: readonly DefiningStateMachineActionId[];
  onUpdate?: readonly DefiningStateMachineActionId[];
};

export type DefiningStateMachineTransition = {
  from: DefiningStateMachineFromPattern;
  to: DefiningStateMachineStateId;
  /** Omitted event = eventless transition, evaluated on every tick. */
  event?: DefiningStateMachineEventType;
  guard?: DefiningStateMachineGuardId;
  actions?: readonly DefiningStateMachineActionId[];
  /** Higher wins. Ties break by definition order. Default 0. */
  priority?: number;
};

export type DefiningStateMachineDefinition = {
  id: string;
  /** Bumped when the shape changes; checked when hydrating snapshots. */
  version?: number;
  initial: DefiningStateMachineStateId;
  states: Record<DefiningStateMachineStateId, DefiningStateMachineStateNode>;
  transitions: readonly DefiningStateMachineTransition[];
};

export type DefiningStateMachineEvent = {
  type: DefiningStateMachineEventType;
  payload?: unknown;
};

/**
 * Serializable execution state. Context lives outside the snapshot so the
 * snapshot stays small enough for save/load, network sync, and replays.
 */
export type DefiningStateMachineSnapshot = {
  machineId: string;
  definitionVersion: number;
  currentState: DefiningStateMachineStateId;
  previousState: DefiningStateMachineStateId | null;
  /** Milliseconds spent in the current leaf state, advanced by ticks. */
  stateTimeMs: number;
};

export type DefiningStateMachineGuard<TContext> = (
  context: TContext,
  event: DefiningStateMachineEvent | null
) => boolean;

/**
 * Actions return commands instead of causing effects directly. The engine
 * collects them in execution order; game systems execute them afterwards.
 * Returning nothing is allowed for pure context bookkeeping.
 */
export type DefiningStateMachineAction<TContext, TCommand> = (
  context: TContext,
  event: DefiningStateMachineEvent | null
) => readonly TCommand[] | void;

/** Bounded-context vocabulary: what guard/action names actually mean. */
export type DefiningStateMachineRegistry<TContext, TCommand> = {
  guards: Record<
    DefiningStateMachineGuardId,
    DefiningStateMachineGuard<TContext>
  >;
  actions: Record<
    DefiningStateMachineActionId,
    DefiningStateMachineAction<TContext, TCommand>
  >;
};

/** Result shape shared by start, send, and tick. */
export type DefiningStateMachineStepResult<TCommand> = {
  snapshot: DefiningStateMachineSnapshot;
  commands: readonly TCommand[];
  /** True when at least one transition fired during this step. */
  transitioned: boolean;
};
