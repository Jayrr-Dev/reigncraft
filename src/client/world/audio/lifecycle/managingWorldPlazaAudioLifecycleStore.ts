/**
 * Runtime store for the coarse plaza audio lifecycle statechart.
 *
 * @module components/world/audio/lifecycle/managingWorldPlazaAudioLifecycleStore
 */

import { releasingWorldPlazaAudioScopesByPrefix } from '@/components/world/audio/engine/managingWorldPlazaAudioScopeStore';
import { DEFINING_WORLD_PLAZA_AUDIO_LIFECYCLE_MACHINE } from '@/components/world/audio/lifecycle/definingWorldPlazaAudioLifecycleMachine';
import {
  sendingStateMachineEvent,
  startingStateMachine,
} from '@/lib/stateMachine/advancingStateMachine';
import type {
  DefiningStateMachineEvent,
  DefiningStateMachineRegistry,
  DefiningStateMachineSnapshot,
} from '@/lib/stateMachine/definingStateMachineTypes';

export type ManagingWorldPlazaAudioLifecycleCommand = {
  readonly type: 'release-world-scopes';
};

const DEFINING_WORLD_PLAZA_AUDIO_LIFECYCLE_REGISTRY: DefiningStateMachineRegistry<
  undefined,
  ManagingWorldPlazaAudioLifecycleCommand
> = {
  guards: {},
  actions: {
    'audio.releaseWorldScopes': () => [{ type: 'release-world-scopes' }],
  },
};

const managingWorldPlazaAudioLifecycleSubscribers = new Set<() => void>();

function applyingWorldPlazaAudioLifecycleCommands(
  commands: readonly ManagingWorldPlazaAudioLifecycleCommand[]
): void {
  for (const command of commands) {
    if (command.type === 'release-world-scopes') {
      releasingWorldPlazaAudioScopesByPrefix('world:');
    }
  }
}

const initialStep = startingStateMachine({
  definition: DEFINING_WORLD_PLAZA_AUDIO_LIFECYCLE_MACHINE,
  registry: DEFINING_WORLD_PLAZA_AUDIO_LIFECYCLE_REGISTRY,
  context: undefined,
});
let managingWorldPlazaAudioLifecycleSnapshot = initialStep.snapshot;
applyingWorldPlazaAudioLifecycleCommands(initialStep.commands);

export function peekingWorldPlazaAudioLifecycleSnapshot(): DefiningStateMachineSnapshot {
  return managingWorldPlazaAudioLifecycleSnapshot;
}

export function subscribingWorldPlazaAudioLifecycle(
  listener: () => void
): () => void {
  managingWorldPlazaAudioLifecycleSubscribers.add(listener);

  return () => {
    managingWorldPlazaAudioLifecycleSubscribers.delete(listener);
  };
}

export function sendingWorldPlazaAudioLifecycleEvent(
  eventType: DefiningStateMachineEvent['type']
): void {
  const step = sendingStateMachineEvent({
    definition: DEFINING_WORLD_PLAZA_AUDIO_LIFECYCLE_MACHINE,
    registry: DEFINING_WORLD_PLAZA_AUDIO_LIFECYCLE_REGISTRY,
    snapshot: managingWorldPlazaAudioLifecycleSnapshot,
    event: { type: eventType },
    context: undefined,
  });

  if (!step.transitioned) {
    return;
  }

  managingWorldPlazaAudioLifecycleSnapshot = step.snapshot;
  applyingWorldPlazaAudioLifecycleCommands(step.commands);
  managingWorldPlazaAudioLifecycleSubscribers.forEach((notify) => notify());
}
