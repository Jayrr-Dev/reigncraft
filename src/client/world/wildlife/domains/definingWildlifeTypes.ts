/**
 * Core wildlife instance and simulation types.
 *
 * @module components/world/wildlife/domains/definingWildlifeTypes
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaEntityHealthFloatText } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Stable species identifier (kebab-case). */
export type DefiningWildlifeSpeciesId = string;

/** Diet category driving hunger and prey selection. */
export type DefiningWildlifeDietKind =
  | 'herbivore'
  | 'carnivore'
  | 'omnivore'
  | 'scavenger';

/** Behavior tree temperament key. */
export type DefiningWildlifeTemperamentId =
  | 'passive'
  | 'skittish'
  | 'retaliator'
  | 'predator'
  | 'ambusher';

/** Hunger drive level emitted by the hunger tick. */
export type DefiningWildlifeHungerDriveLevel =
  | 'sated'
  | 'peckish'
  | 'hungry'
  | 'starving';

/** Hunger state carried on each wildlife instance. */
export type DefiningWildlifeHungerState = {
  hungerRatio: number;
  driveLevel: DefiningWildlifeHungerDriveLevel;
  lastFedAtMs: number | null;
};

/** Run stamina state carried on each wildlife instance (mirrors player stamina). */
export type DefiningWildlifeStaminaState = {
  staminaRatio: number;
  isExhausted: boolean;
};

/** AI intent returned by the behavior tree evaluator. */
export type DefiningWildlifeBehaviorIntent =
  | {
      mode: 'idle' | 'wander' | 'graze' | 'flee' | 'return';
      targetPoint?: DefiningWorldPlazaWorldPoint;
    }
  | {
      mode: 'chase' | 'attack';
      targetInstanceId: string;
      targetPoint: DefiningWorldPlazaWorldPoint;
    };

/** Cached steering direction reused between re-scores. */
export type DefiningWildlifeSteeringCache = {
  directionX: number;
  directionY: number;
  cachedAtMs: number;
  intentKey: string;
};

/** Runtime AI state on one wildlife instance. */
export type DefiningWildlifeAiState = {
  intent: DefiningWildlifeBehaviorIntent;
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  motionClip: 'idle' | 'walk' | 'run' | 'attack' | 'takeDamage' | 'die';
  isMoving: boolean;
  lastThinkAtMs: number;
  wanderTarget: DefiningWorldPlazaWorldPoint | null;
  steeringCache: DefiningWildlifeSteeringCache | null;
};

/** Threat entry keyed by target id (player userId or wildlife instanceId). */
export type DefiningWildlifeThreatEntry = {
  targetId: string;
  threat: number;
  lastUpdatedAtMs: number;
};

/** Aggro state on one wildlife instance. */
export type DefiningWildlifeAggroState = {
  threats: readonly DefiningWildlifeThreatEntry[];
  activeTargetId: string | null;
  lastDamagedAtMs: number | null;
};

/** Deterministic spawn anchor resolved from tile coordinates. */
export type DefiningWildlifeSpawnAnchor = {
  anchorId: string;
  tileX: number;
  tileY: number;
  speciesId: DefiningWildlifeSpeciesId;
  packIndex: number;
  packSize: number;
  seed: number;
};

/** Live wildlife instance in the simulation store. */
export type DefiningWildlifeInstance = {
  instanceId: string;
  speciesId: DefiningWildlifeSpeciesId;
  anchorId: string;
  spawnAnchor: DefiningWorldPlazaWorldPoint;
  position: DefiningWorldPlazaWorldPoint;
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  healthState: DefiningWorldPlazaEntityHealthState;
  hungerState: DefiningWildlifeHungerState;
  staminaState: DefiningWildlifeStaminaState;
  aiState: DefiningWildlifeAiState;
  aggroState: DefiningWildlifeAggroState;
  /** Ephemeral combat numbers rendered above the sprite. */
  floatingTexts: readonly DefiningWorldPlazaEntityHealthFloatText[];
  /** Last environmental hazard damage tick timestamp (ms). */
  environmentalDamageLastTickAtMs: number | null;
  isDead: boolean;
  diedAtMs: number | null;
  /** Prevents duplicate loot when death persists across ticks. */
  hasDroppedLoot: boolean;
};

/** Compact network snapshot for multiplayer sync. */
export type DefiningWildlifeNetworkSnapshot = {
  instanceId: string;
  speciesId: DefiningWildlifeSpeciesId;
  x: number;
  y: number;
  facingDirection: string;
  motionClip: string;
  healthCurrent: number;
};

/** Client event when a non-leader damages an animal. */
export type DefiningWildlifeDamageEvent = {
  instanceId: string;
  damageAmount: number;
  attackerUserId: string;
  atMs: number;
};
