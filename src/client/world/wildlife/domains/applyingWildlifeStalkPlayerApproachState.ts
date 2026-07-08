/**
 * Applies or clears pack-wide player-approach retreat state on stalking hunters.
 *
 * @module components/world/wildlife/domains/applyingWildlifeStalkPlayerApproachState
 */

import type {
  DefiningWildlifeInstance,
  DefiningWildlifeStalkPlayerApproachState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeStalkPackmatesTargetingPrey } from '@/components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type ApplyingWildlifeStalkPlayerApproachStateParams = {
  store: ManagingWildlifeInstanceStore;
  anchorInstance: DefiningWildlifeInstance;
  preyTargetId: string;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  approachState: DefiningWildlifeStalkPlayerApproachState | null;
};

function applyingWildlifeStalkPlayerApproachStateToInstance(
  instance: DefiningWildlifeInstance,
  approachState: DefiningWildlifeStalkPlayerApproachState | null
): DefiningWildlifeInstance {
  if (approachState === null) {
    return {
      ...instance,
      aggroState: {
        ...instance.aggroState,
        stalkPlayerApproachState: null,
      },
    };
  }

  const retreatStartedAtMs = approachState.retreatStartedAtMs;

  return {
    ...instance,
    aggroState: {
      ...instance.aggroState,
      stalkPlayerApproachState: {
        ...approachState,
        retreatFromX:
          retreatStartedAtMs === null
            ? approachState.retreatFromX
            : instance.position.x,
        retreatFromY:
          retreatStartedAtMs === null
            ? approachState.retreatFromY
            : instance.position.y,
      },
    },
  };
}

/** Writes the same approach-retreat state to every hunter on one prey target. */
export function applyingWildlifeStalkPlayerApproachState({
  store,
  anchorInstance,
  preyTargetId,
  nearbyInstances,
  approachState,
}: ApplyingWildlifeStalkPlayerApproachStateParams): void {
  const packmates = listingWildlifeStalkPackmatesTargetingPrey({
    instance: anchorInstance,
    nearbyInstances,
    preyTargetId,
  });

  for (const packmate of packmates) {
    const livePackmate = store.instances.get(packmate.instanceId) ?? packmate;

    replacingWildlifeInstance(
      store,
      applyingWildlifeStalkPlayerApproachStateToInstance(
        livePackmate,
        approachState
      )
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

    replacingWildlifeInstance(
      store,
      applyingWildlifeStalkPlayerApproachStateToInstance(
        instance,
        approachState
      )
    );
  }
}
