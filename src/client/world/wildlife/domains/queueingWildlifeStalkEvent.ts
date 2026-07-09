/**
 * Queues stalk phase events on instance aggro state.
 *
 * @module components/world/wildlife/domains/queueingWildlifeStalkEvent
 */

import type { DefiningWildlifeStalkEventKind } from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeStalkPackmatesTargetingPrey } from '@/components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

function appendingWildlifeStalkEvent(
  instance: DefiningWildlifeInstance,
  eventKind: DefiningWildlifeStalkEventKind
): DefiningWildlifeInstance {
  const pending = instance.aggroState.pendingStalkEvents ?? [];

  if (pending.includes(eventKind)) {
    return instance;
  }

  return {
    ...instance,
    aggroState: {
      ...instance.aggroState,
      pendingStalkEvents: [...pending, eventKind],
    },
  };
}

/** Appends one stalk event to a single instance. */
export function queueingWildlifeStalkEventOnInstance(
  instance: DefiningWildlifeInstance,
  eventKind: DefiningWildlifeStalkEventKind
): DefiningWildlifeInstance {
  return appendingWildlifeStalkEvent(instance, eventKind);
}

export type QueueingWildlifeStalkEventOnPackParams = {
  store: ManagingWildlifeInstanceStore;
  anchorInstance: DefiningWildlifeInstance;
  preyTargetId: string;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  eventKind: DefiningWildlifeStalkEventKind;
};

/** Appends one stalk event to every hunter targeting the same prey. */
export function queueingWildlifeStalkEventOnPack({
  store,
  anchorInstance,
  preyTargetId,
  nearbyInstances,
  eventKind,
}: QueueingWildlifeStalkEventOnPackParams): void {
  const packmates = listingWildlifeStalkPackmatesTargetingPrey({
    instance: anchorInstance,
    nearbyInstances,
    preyTargetId,
  });

  if (packmates.length === 0) {
    return;
  }

  for (const packmate of packmates) {
    const livePackmate = store.instances.get(packmate.instanceId) ?? packmate;

    replacingWildlifeInstance(
      store,
      appendingWildlifeStalkEvent(livePackmate, eventKind)
    );
  }

  for (const instance of listingWildlifeInstances(store)) {
    if (
      instance.isDead ||
      instance.speciesId !== anchorInstance.speciesId ||
      instance.aggroState.activeTargetId !== preyTargetId
    ) {
      continue;
    }

    if (
      packmates.some((packmate) => packmate.instanceId === instance.instanceId)
    ) {
      continue;
    }

    const liveInstance = store.instances.get(instance.instanceId) ?? instance;

    replacingWildlifeInstance(
      store,
      appendingWildlifeStalkEvent(liveInstance, eventKind)
    );
  }
}
