/**
 * Internal transition executor shared by start/send/tick services.
 *
 * Runs exit actions leaf-to-ancestor, transition actions, then enter actions
 * ancestor-to-leaf, and returns the new snapshot plus collected commands.
 * A self-transition (target resolves to the current leaf) is internal: only
 * the transition actions run and the state timer resets.
 *
 * @module lib/stateMachine/applyingStateMachineTransition
 */

import type {
  DefiningStateMachineActionId,
  DefiningStateMachineDefinition,
  DefiningStateMachineEvent,
  DefiningStateMachineRegistry,
  DefiningStateMachineSnapshot,
  DefiningStateMachineStateId,
  DefiningStateMachineTransition,
} from '@/lib/stateMachine/definingStateMachineTypes';
import {
  listingStateMachineAncestorChain,
  resolvingStateMachineCommonAncestor,
  resolvingStateMachineLeafState,
} from '@/lib/stateMachine/resolvingStateMachineStatePath';

export type ApplyingStateMachineTransitionParams<TContext, TCommand> = {
  definition: DefiningStateMachineDefinition;
  registry: DefiningStateMachineRegistry<TContext, TCommand>;
  snapshot: DefiningStateMachineSnapshot;
  transition: DefiningStateMachineTransition;
  event: DefiningStateMachineEvent | null;
  context: TContext;
  onMissingAction?: (actionId: DefiningStateMachineActionId) => void;
};

/** Runs registered actions in order, collecting any commands they return. */
export function runningStateMachineActions<TContext, TCommand>(
  registry: DefiningStateMachineRegistry<TContext, TCommand>,
  actionIds: readonly DefiningStateMachineActionId[] | undefined,
  context: TContext,
  event: DefiningStateMachineEvent | null,
  commands: TCommand[],
  onMissingAction?: (actionId: DefiningStateMachineActionId) => void
): void {
  for (const actionId of actionIds ?? []) {
    const action = registry.actions[actionId];

    if (!action) {
      onMissingAction?.(actionId);
      continue;
    }

    const produced = action(context, event);

    if (produced) {
      commands.push(...produced);
    }
  }
}

/** True when `stateId` is `ancestor` itself or an ancestor of it. */
function checkingIsAncestorOrSelf(
  stateId: DefiningStateMachineStateId,
  ancestor: DefiningStateMachineStateId | null
): boolean {
  if (ancestor === null) {
    return false;
  }

  return stateId === ancestor || ancestor.startsWith(`${stateId}.`);
}

export function applyingStateMachineTransition<TContext, TCommand>({
  definition,
  registry,
  snapshot,
  transition,
  event,
  context,
  onMissingAction,
}: ApplyingStateMachineTransitionParams<TContext, TCommand>): {
  snapshot: DefiningStateMachineSnapshot;
  commands: TCommand[];
} {
  const commands: TCommand[] = [];
  const targetLeaf = resolvingStateMachineLeafState(definition, transition.to);
  const common =
    snapshot.currentState === targetLeaf
      ? snapshot.currentState
      : resolvingStateMachineCommonAncestor(snapshot.currentState, targetLeaf);

  const exitChain = listingStateMachineAncestorChain(snapshot.currentState)
    .filter((stateId) => !checkingIsAncestorOrSelf(stateId, common))
    .reverse();

  for (const stateId of exitChain) {
    runningStateMachineActions(
      registry,
      definition.states[stateId]?.onExit,
      context,
      event,
      commands,
      onMissingAction
    );
  }

  runningStateMachineActions(
    registry,
    transition.actions,
    context,
    event,
    commands,
    onMissingAction
  );

  const enterChain = listingStateMachineAncestorChain(targetLeaf).filter(
    (stateId) => !checkingIsAncestorOrSelf(stateId, common)
  );

  for (const stateId of enterChain) {
    runningStateMachineActions(
      registry,
      definition.states[stateId]?.onEnter,
      context,
      event,
      commands,
      onMissingAction
    );
  }

  return {
    snapshot: {
      ...snapshot,
      previousState: snapshot.currentState,
      currentState: targetLeaf,
      stateTimeMs: 0,
    },
    commands,
  };
}
