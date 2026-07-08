/**
 * Thin resolver over the stalker behaviour machine definition.
 *
 * @module components/world/wildlife/domains/definingWildlifeStalkPhaseRegistry
 */

import { DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE } from '@/components/world/wildlife/domains/definingWildlifeStalkerBehaviourMachine';
import type {
  DefiningWildlifeStalkEventKind,
  DefiningWildlifeStalkPhase,
} from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import { resolvingStateMachineTransition } from '@/lib/stateMachine/resolvingStateMachineTransition';

/** Resolves the next phase for one event, or null when the edge is illegal. */
export function resolvingWildlifeStalkPhaseTransition(
  currentPhase: DefiningWildlifeStalkPhase,
  eventKind: DefiningWildlifeStalkEventKind
): DefiningWildlifeStalkPhase | null {
  const transition = resolvingStateMachineTransition({
    definition: DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE,
    registry: { guards: {}, actions: {} },
    currentState: currentPhase,
    event: { type: eventKind },
    context: {},
  });

  if (!transition) {
    return null;
  }

  const phase = transition.to;

  if (
    phase === 'idle' ||
    phase === 'shadowing' ||
    phase === 'retreating' ||
    phase === 'regrouping' ||
    phase === 'formingUp' ||
    phase === 'surrounding' ||
    phase === 'attacking' ||
    phase === 'fleeing'
  ) {
    return phase;
  }

  return null;
}
