/**
 * Resolves danger-sense intensity + tint for one wildlife instance.
 *
 * @module components/world/wildlife/domains/computingWildlifeDangerSenseThreatIntensity
 */

import {
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_CAUTION_INTENSITY,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_DISTANCE_FALLOFF_POWER,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_FULL_INTENSITY_RANGE_GRID,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_HUNTING_INTENSITY,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_LOCKED_TARGET_INTENSITY,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_MAX_RANGE_GRID,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SOFT_THREAT_INTENSITY_CAP,
  type DefiningWorldPlazaDangerSenseHudTint,
} from '@/components/world/domains/definingWorldPlazaDangerSenseHudConstants';
import { DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import {
  checkingWildlifeStalkPhaseIsAttacking,
  checkingWildlifeStalkPhaseIsShadowing,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkPhase';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeTemperamentId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifeIsHuntingPlayer } from '@/components/world/wildlife/domains/resolvingWildlifePlayerCollisionStartle';

/** Temperaments that can threaten the player without already being in chase/attack. */
const DEFINING_WILDLIFE_DANGER_SENSE_HOSTILE_TEMPERAMENTS: ReadonlySet<DefiningWildlifeTemperamentId> =
  new Set(['predator', 'ambusher', 'retaliator', 'pack_hunter', 'stalker']);

export type ComputingWildlifeDangerSenseThreatSignal = {
  readonly intensity: number;
  readonly tint: DefiningWorldPlazaDangerSenseHudTint;
};

/**
 * Distance fade: full strength up close, then eases toward zero at max range.
 * Farther threats look weaker on the rim.
 */
export function computingWorldPlazaDangerSenseHudDistanceFalloff(
  distanceGrid: number
): number {
  if (distanceGrid <= DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_FULL_INTENSITY_RANGE_GRID) {
    return 1;
  }

  if (distanceGrid >= DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_MAX_RANGE_GRID) {
    return 0;
  }

  const span =
    DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_MAX_RANGE_GRID -
    DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_FULL_INTENSITY_RANGE_GRID;
  const normalizedDistance =
    (distanceGrid -
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_FULL_INTENSITY_RANGE_GRID) /
    span;

  return Math.pow(
    1 - normalizedDistance,
    DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_DISTANCE_FALLOFF_POWER
  );
}

/**
 * Intensity only (legacy helper). Prefer {@link computingWildlifeDangerSenseThreatSignal}.
 */
export function computingWildlifeDangerSenseThreatIntensity(
  instance: DefiningWildlifeInstance,
  playerUserId: string | null,
  distanceGrid: number
): number {
  return (
    computingWildlifeDangerSenseThreatSignal(
      instance,
      playerUserId,
      distanceGrid
    )?.intensity ?? 0
  );
}

/**
 * Returns a tinted threat signal, or null when this instance should not light the HUD.
 *
 * Yellow caution: stalking you, or standing ground / territory warn.
 * Red danger: chase/attack, or hostile aggro building toward a fight.
 */
export function computingWildlifeDangerSenseThreatSignal(
  instance: DefiningWildlifeInstance,
  playerUserId: string | null,
  distanceGrid: number
): ComputingWildlifeDangerSenseThreatSignal | null {
  if (!playerUserId || instance.isDead) {
    return null;
  }

  const distanceFalloff =
    computingWorldPlazaDangerSenseHudDistanceFalloff(distanceGrid);
  if (distanceFalloff <= 0) {
    return null;
  }

  const intent = instance.aiState.intent;

  // Fleeing prey is not a danger signal, even with leftover damage threat.
  if (intent.mode === 'flee') {
    return null;
  }

  // Territory stand-ground (boar / lion / aggressive herbivore warn band).
  if (
    intent.mode === 'territoryWarn' &&
    intent.targetInstanceId === playerUserId
  ) {
    return {
      intensity:
        DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_CAUTION_INTENSITY * distanceFalloff,
      tint: 'caution',
    };
  }

  // Active stalk step toward / around the player.
  if (intent.mode === 'stalk' && intent.targetInstanceId === playerUserId) {
    return {
      intensity:
        DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_CAUTION_INTENSITY * distanceFalloff,
      tint: 'caution',
    };
  }

  const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);
  const isLockedOnPlayer = instance.aggroState.activeTargetId === playerUserId;

  // Quiet stalk shadow phase (before rush).
  if (
    (species?.temperamentId === 'pack_hunter' ||
      species?.temperamentId === 'stalker') &&
    isLockedOnPlayer &&
    checkingWildlifeStalkPhaseIsShadowing(instance.aggroState) &&
    !checkingWildlifeStalkPhaseIsAttacking(instance.aggroState)
  ) {
    return {
      intensity:
        DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_CAUTION_INTENSITY * distanceFalloff,
      tint: 'caution',
    };
  }

  if (checkingWildlifeIsHuntingPlayer(instance, playerUserId)) {
    return {
      intensity:
        DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_HUNTING_INTENSITY * distanceFalloff,
      tint: 'danger',
    };
  }

  if (!species) {
    return null;
  }

  // Skittish / passive stock (deer, etc.) only light the rim while hunting you.
  if (
    !DEFINING_WILDLIFE_DANGER_SENSE_HOSTILE_TEMPERAMENTS.has(
      species.temperamentId
    )
  ) {
    return null;
  }

  if (isLockedOnPlayer) {
    return {
      intensity:
        DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_LOCKED_TARGET_INTENSITY *
        distanceFalloff,
      tint: 'danger',
    };
  }

  const playerThreat = instance.aggroState.threats.find(
    (entry) => entry.targetId === playerUserId
  )?.threat;

  if (playerThreat == null || playerThreat <= 0) {
    return null;
  }

  const softNormalized = Math.min(
    1,
    playerThreat / DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD
  );

  return {
    intensity:
      softNormalized *
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SOFT_THREAT_INTENSITY_CAP *
      distanceFalloff,
    tint: 'danger',
  };
}
