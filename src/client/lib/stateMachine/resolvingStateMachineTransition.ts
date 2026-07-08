/**
 * Pure transition resolver: given the active state, an event (or none for
 * eventless transitions), context, and the registry, pick the single
 * transition that should fire.
 *
 * Selection order: matching pattern, matching event, passing guard, then
 * highest priority; ties break by pattern specificity, then definition order.
 *
 * @module lib/stateMachine/resolvingStateMachineTransition
 */

import type {
  DefiningStateMachineDefinition,
  DefiningStateMachineEvent,
  DefiningStateMachineRegistry,
  DefiningStateMachineStateId,
  DefiningStateMachineTransition,
} from '@/lib/stateMachine/definingStateMachineTypes';
import {
  checkingStateMachinePatternMatchesState,
  computingStateMachinePatternSpecificity,
} from '@/lib/stateMachine/resolvingStateMachineStatePath';

export type ResolvingStateMachineTransitionParams<TContext, TCommand> = {
  definition: DefiningStateMachineDefinition;
  registry: DefiningStateMachineRegistry<TContext, TCommand>;
  currentState: DefiningStateMachineStateId;
  /** Null resolves eventless (always-on) transitions only. */
  event: DefiningStateMachineEvent | null;
  context: TContext;
  /** Called when a transition names a guard missing from the registry. */
  onMissingGuard?: (guardId: string) => void;
};

export function resolvingStateMachineTransition<TContext, TCommand>({
  definition,
  registry,
  currentState,
  event,
  context,
  onMissingGuard,
}: ResolvingStateMachineTransitionParams<TContext, TCommand>):
  | DefiningStateMachineTransition
  | null {
  let best: DefiningStateMachineTransition | null = null;
  let bestPriority = Number.NEGATIVE_INFINITY;
  let bestSpecificity = Number.NEGATIVE_INFINITY;

  for (const transition of definition.transitions) {
    const wantsEvent = transition.event !== undefined;

    if (event === null ? wantsEvent : transition.event !== event.type) {
      continue;
    }

    if (
      !checkingStateMachinePatternMatchesState(transition.from, currentState)
    ) {
      continue;
    }

    if (transition.guard !== undefined) {
      const guard = registry.guards[transition.guard];

      if (!guard) {
        onMissingGuard?.(transition.guard);
        continue;
      }

      if (!guard(context, event)) {
        continue;
      }
    }

    const priority = transition.priority ?? 0;
    const specificity = computingStateMachinePatternSpecificity(
      transition.from
    );

    if (
      priority > bestPriority ||
      (priority === bestPriority && specificity > bestSpecificity)
    ) {
      best = transition;
      bestPriority = priority;
      bestSpecificity = specificity;
    }
  }

  return best;
}
