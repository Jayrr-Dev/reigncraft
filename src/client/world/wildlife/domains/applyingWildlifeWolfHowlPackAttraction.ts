/**
 * Howl pack attraction: wolves in earshot may answer a howl and travel to it.
 *
 * @module components/world/wildlife/domains/applyingWildlifeWolfHowlPackAttraction
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeWolfComboSpecies } from '@/components/world/wildlife/domains/checkingWildlifeWolfComboSpecies';
import {
  DEFINING_WILDLIFE_WOLF_HOWL_ATTRACT_CHANCE,
  DEFINING_WILDLIFE_WOLF_HOWL_ATTRACT_RADIUS_GRID,
  DEFINING_WILDLIFE_WOLF_HOWL_SUMMON_DURATION_MS,
} from '@/components/world/wildlife/domains/definingWildlifeWolfVocalizationConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

/** One howl emitted this tick: source wolf and where it stood. */
export type ApplyingWildlifeWolfHowlEvent = {
  howlerInstanceId: string;
  point: DefiningWorldPlazaWorldPoint;
};

export type RollingWildlifeWolfHowlSummonParams = {
  instance: DefiningWildlifeInstance;
  event: ApplyingWildlifeWolfHowlEvent;
  nowMs: number;
  /** Injectable for deterministic tests; defaults to Math.random. */
  random?: () => number;
};

/**
 * Rolls whether one wolf answers a howl. Returns the updated instance with a
 * summon lock, or the unchanged instance when the roll fails or is ineligible.
 * Wolves already fighting, sleeping, dead, or mid-summon never answer.
 */
export function rollingWildlifeWolfHowlSummon({
  instance,
  event,
  nowMs,
  random = Math.random,
}: RollingWildlifeWolfHowlSummonParams): DefiningWildlifeInstance {
  if (instance.instanceId === event.howlerInstanceId) {
    return instance;
  }

  if (!checkingWildlifeWolfComboSpecies(instance.speciesId)) {
    return instance;
  }

  if (instance.isDead || instance.aiState.isSleeping) {
    return instance;
  }

  if (instance.aggroState.activeTargetId !== null) {
    return instance;
  }

  const existingSummon = instance.aiState.howlSummon ?? null;

  if (existingSummon !== null && existingSummon.untilMs > nowMs) {
    return instance;
  }

  const distanceGrid = Math.hypot(
    event.point.x - instance.position.x,
    event.point.y - instance.position.y
  );

  if (distanceGrid > DEFINING_WILDLIFE_WOLF_HOWL_ATTRACT_RADIUS_GRID) {
    return instance;
  }

  if (random() >= DEFINING_WILDLIFE_WOLF_HOWL_ATTRACT_CHANCE) {
    return instance;
  }

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      howlSummon: {
        targetPoint: event.point,
        howlerInstanceId: event.howlerInstanceId,
        untilMs: nowMs + DEFINING_WILDLIFE_WOLF_HOWL_SUMMON_DURATION_MS,
      },
    },
  };
}

export type ApplyingWildlifeWolfHowlPackAttractionParams = {
  store: ManagingWildlifeInstanceStore;
  events: readonly ApplyingWildlifeWolfHowlEvent[];
  nowMs: number;
  random?: () => number;
};

/**
 * Applies every howl emitted this tick to all live wolves in the store.
 * Runs after the per-instance tick flush so it sees final positions.
 */
export function applyingWildlifeWolfHowlPackAttraction({
  store,
  events,
  nowMs,
  random = Math.random,
}: ApplyingWildlifeWolfHowlPackAttractionParams): void {
  if (events.length === 0) {
    return;
  }

  for (const instance of listingWildlifeInstances(store)) {
    let nextInstance = instance;

    for (const event of events) {
      nextInstance = rollingWildlifeWolfHowlSummon({
        instance: nextInstance,
        event,
        nowMs,
        random,
      });
    }

    if (nextInstance !== instance) {
      replacingWildlifeInstance(store, nextInstance);
    }
  }
}
