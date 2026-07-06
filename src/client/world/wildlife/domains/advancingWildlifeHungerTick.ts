/**
 * Pure hunger advancement for wildlife instances.
 *
 * @module components/world/wildlife/domains/advancingWildlifeHungerTick
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeHungerDriveLevel,
  DefiningWildlifeHungerState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type AdvancingWildlifeHungerTickParams = {
  state: DefiningWildlifeHungerState;
  species: DefiningWildlifeSpeciesDefinition;
  deltaSeconds: number;
  isGrazing: boolean;
  nowMs: number;
};

export type AdvancingWildlifeHungerTickResult = {
  state: DefiningWildlifeHungerState;
};

function clampingHungerRatio(ratio: number): number {
  if (ratio < 0) {
    return 0;
  }

  if (ratio > 1) {
    return 1;
  }

  return ratio;
}

function resolvingWildlifeHungerDriveLevel(
  hungerRatio: number,
  species: DefiningWildlifeSpeciesDefinition
): DefiningWildlifeHungerDriveLevel {
  if (hungerRatio <= species.hunger.starvingThreshold) {
    return 'starving';
  }

  if (hungerRatio <= species.hunger.hungryThreshold) {
    return 'hungry';
  }

  if (hungerRatio <= species.hunger.peckishThreshold) {
    return 'peckish';
  }

  return 'sated';
}

/**
 * Advances hunger for one wildlife instance.
 */
export function advancingWildlifeHungerTick({
  state,
  species,
  deltaSeconds,
  isGrazing,
  nowMs,
}: AdvancingWildlifeHungerTickParams): AdvancingWildlifeHungerTickResult {
  let nextRatio =
    state.hungerRatio - species.hunger.drainPerSecond * deltaSeconds;

  if (isGrazing && species.diet !== 'carnivore') {
    nextRatio += species.hunger.grazeRefillPerSecond * deltaSeconds;
  }

  nextRatio = clampingHungerRatio(nextRatio);

  return {
    state: {
      hungerRatio: nextRatio,
      driveLevel: resolvingWildlifeHungerDriveLevel(nextRatio, species),
      lastFedAtMs: isGrazing ? nowMs : state.lastFedAtMs,
    },
  };
}

/**
 * Refills hunger after a successful kill.
 */
export function refillingWildlifeHungerAfterKill(
  state: DefiningWildlifeHungerState,
  species: DefiningWildlifeSpeciesDefinition,
  nowMs: number
): DefiningWildlifeHungerState {
  const nextRatio = clampingHungerRatio(
    state.hungerRatio + species.hunger.killRefillRatio
  );

  return {
    hungerRatio: nextRatio,
    driveLevel: resolvingWildlifeHungerDriveLevel(nextRatio, species),
    lastFedAtMs: nowMs,
  };
}
