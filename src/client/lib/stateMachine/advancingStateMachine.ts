/**
 * Application services: start a machine, send it an event, advance it a tick.
 *
 * Formula: definition + snapshot + event + context + registry
 * -> new snapshot + commands. The runtime never reads game state directly;
 * everything domain-specific arrives through the registry and context.
 *
 * @module lib/stateMachine/advancingStateMachine
 */

import {
  applyingStateMachineTransition,
  runningStateMachineActions,
} from '@/lib/stateMachine/applyingStateMachineTransition';
import type {
  DefiningStateMachineDefinition,
  DefiningStateMachineEvent,
  DefiningStateMachineRegistry,
  DefiningStateMachineSnapshot,
  DefiningStateMachineStepResult,
} from '@/lib/stateMachine/definingStateMachineTypes';
import {
  listingStateMachineAncestorChain,
  resolvingStateMachineLeafState,
} from '@/lib/stateMachine/resolvingStateMachineStatePath';
import { resolvingStateMachineTransition } from '@/lib/stateMachine/resolvingStateMachineTransition';

/** Safety cap on chained eventless transitions within one step. */
const DEFINING_STATE_MACHINE_MAX_MICROSTEPS = 32;

export type AdvancingStateMachineDiagnostics = {
  onMissingGuard?: (guardId: string) => void;
  onMissingAction?: (actionId: string) => void;
  /** Fired when the microstep cap is hit (likely an eventless cycle). */
  onMicrostepOverflow?: (machineId: string) => void;
};

type MachineStepParams<TContext, TCommand> = {
  definition: DefiningStateMachineDefinition;
  registry: DefiningStateMachineRegistry<TContext, TCommand>;
  context: TContext;
  diagnostics?: AdvancingStateMachineDiagnostics;
};

/**
 * Drains eventless transitions until none fire, appending their commands.
 * Returns the settled snapshot.
 */
function drainingEventlessTransitions<TContext, TCommand>(
  params: MachineStepParams<TContext, TCommand>,
  snapshot: DefiningStateMachineSnapshot,
  commands: TCommand[]
): { snapshot: DefiningStateMachineSnapshot; transitioned: boolean } {
  const { definition, registry, context, diagnostics } = params;
  let current = snapshot;
  let transitioned = false;

  for (let step = 0; step < DEFINING_STATE_MACHINE_MAX_MICROSTEPS; step += 1) {
    const transition = resolvingStateMachineTransition({
      definition,
      registry,
      currentState: current.currentState,
      event: null,
      context,
      onMissingGuard: diagnostics?.onMissingGuard,
    });

    if (!transition) {
      return { snapshot: current, transitioned };
    }

    const applied = applyingStateMachineTransition({
      definition,
      registry,
      snapshot: current,
      transition,
      event: null,
      context,
      onMissingAction: diagnostics?.onMissingAction,
    });

    // An internal self-transition cannot make progress without an event;
    // stop instead of spinning on it forever.
    if (applied.snapshot.currentState === current.currentState) {
      commands.push(...applied.commands);

      return { snapshot: applied.snapshot, transitioned: true };
    }

    commands.push(...applied.commands);
    current = applied.snapshot;
    transitioned = true;
  }

  diagnostics?.onMicrostepOverflow?.(definition.id);

  return { snapshot: current, transitioned };
}

/**
 * Enters the definition's initial state (drilling through compound initials),
 * runs its enter actions root-to-leaf, and settles eventless transitions.
 */
export function startingStateMachine<TContext, TCommand>(
  params: MachineStepParams<TContext, TCommand>
): DefiningStateMachineStepResult<TCommand> {
  const { definition, registry, context, diagnostics } = params;
  const commands: TCommand[] = [];
  const initialLeaf = resolvingStateMachineLeafState(
    definition,
    definition.initial
  );

  for (const stateId of listingStateMachineAncestorChain(initialLeaf)) {
    runningStateMachineActions(
      registry,
      definition.states[stateId]?.onEnter,
      context,
      null,
      commands,
      diagnostics?.onMissingAction
    );
  }

  const started: DefiningStateMachineSnapshot = {
    machineId: definition.id,
    definitionVersion: definition.version ?? 1,
    currentState: initialLeaf,
    previousState: null,
    stateTimeMs: 0,
  };

  const settled = drainingEventlessTransitions(params, started, commands);

  return { snapshot: settled.snapshot, commands, transitioned: true };
}

export type SendingStateMachineEventParams<TContext, TCommand> =
  MachineStepParams<TContext, TCommand> & {
    snapshot: DefiningStateMachineSnapshot;
    event: DefiningStateMachineEvent;
  };

/**
 * Delivers one event. If no transition matches (or its guard fails) the
 * event is ignored and the snapshot is returned unchanged.
 */
export function sendingStateMachineEvent<TContext, TCommand>(
  params: SendingStateMachineEventParams<TContext, TCommand>
): DefiningStateMachineStepResult<TCommand> {
  const { definition, registry, snapshot, event, context, diagnostics } =
    params;
  const commands: TCommand[] = [];
  const transition = resolvingStateMachineTransition({
    definition,
    registry,
    currentState: snapshot.currentState,
    event,
    context,
    onMissingGuard: diagnostics?.onMissingGuard,
  });

  if (!transition) {
    return { snapshot, commands, transitioned: false };
  }

  const applied = applyingStateMachineTransition({
    definition,
    registry,
    snapshot,
    transition,
    event,
    context,
    onMissingAction: diagnostics?.onMissingAction,
  });
  commands.push(...applied.commands);

  const settled = drainingEventlessTransitions(
    params,
    applied.snapshot,
    commands
  );

  return { snapshot: settled.snapshot, commands, transitioned: true };
}

export type ProcessingStateMachineExplicitEventsParams<TContext, TCommand> =
  MachineStepParams<TContext, TCommand> & {
    snapshot: DefiningStateMachineSnapshot;
    events: readonly DefiningStateMachineEvent[];
    /** Runs transition actions without changing state when to === from. */
    allowInternalTransitions?: boolean;
    /** When false, skips the post-batch eventless drain. Default true. */
    settleEventless?: boolean;
    /** Called with the active state id before each explicit event is resolved. */
    onStep?: (currentStateId: string) => void;
    /** Called with the next state id just before a state-changing transition applies. */
    beforeTransition?: (nextStateId: string) => void;
  };

/**
 * Applies a batch of explicit events in order without eventless settling
 * between them, then drains guarded eventless transitions once at the end.
 * Matches game-AI tick semantics where timer checks run after queued events.
 */
export function processingStateMachineExplicitEvents<TContext, TCommand>({
  definition,
  registry,
  snapshot,
  events,
  context,
  diagnostics,
  allowInternalTransitions = false,
  settleEventless = true,
  beforeTransition,
  onStep,
}: ProcessingStateMachineExplicitEventsParams<TContext, TCommand>): DefiningStateMachineStepResult<TCommand> {
  const commands: TCommand[] = [];
  let current = snapshot;
  let transitioned = false;

  for (const event of events) {
    onStep?.(current.currentState);

    const transition = resolvingStateMachineTransition({
      definition,
      registry,
      currentState: current.currentState,
      event,
      context,
      onMissingGuard: diagnostics?.onMissingGuard,
    });

    if (!transition) {
      continue;
    }

    if (
      transition.to === current.currentState &&
      !allowInternalTransitions
    ) {
      continue;
    }

    if (transition.to === current.currentState) {
      runningStateMachineActions(
        registry,
        transition.actions,
        context,
        event,
        commands,
        diagnostics?.onMissingAction
      );
      transitioned = true;
      continue;
    }

    beforeTransition?.(transition.to);

    const applied = applyingStateMachineTransition({
      definition,
      registry,
      snapshot: current,
      transition,
      event,
      context,
      onMissingAction: diagnostics?.onMissingAction,
    });
    commands.push(...applied.commands);
    current = applied.snapshot;
    transitioned = true;
  }

  if (!settleEventless) {
    return { snapshot: current, commands, transitioned };
  }

  const settled = drainingEventlessTransitions(
    { definition, registry, context, diagnostics },
    current,
    commands
  );

  return {
    snapshot: settled.snapshot,
    commands,
    transitioned: transitioned || settled.transitioned,
  };
}

export type AdvancingStateMachineTickParams<TContext, TCommand> =
  MachineStepParams<TContext, TCommand> & {
    snapshot: DefiningStateMachineSnapshot;
    deltaMs: number;
  };

/**
 * Advances the state timer, runs onUpdate actions for the active state chain
 * (root to leaf), then settles eventless transitions so guards that depend
 * on time or context changes can fire without an explicit event.
 */
export function advancingStateMachineTick<TContext, TCommand>(
  params: AdvancingStateMachineTickParams<TContext, TCommand>
): DefiningStateMachineStepResult<TCommand> {
  const { definition, registry, snapshot, deltaMs, context, diagnostics } =
    params;
  const commands: TCommand[] = [];
  const ticked: DefiningStateMachineSnapshot = {
    ...snapshot,
    stateTimeMs: snapshot.stateTimeMs + Math.max(0, deltaMs),
  };

  for (const stateId of listingStateMachineAncestorChain(
    ticked.currentState
  )) {
    runningStateMachineActions(
      registry,
      definition.states[stateId]?.onUpdate,
      context,
      null,
      commands,
      diagnostics?.onMissingAction
    );
  }

  const settled = drainingEventlessTransitions(params, ticked, commands);

  return {
    snapshot: settled.snapshot,
    commands,
    transitioned: settled.transitioned,
  };
}
