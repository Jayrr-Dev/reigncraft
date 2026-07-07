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

/**
 * Daily activity rhythm: when the species rests versus forages or hunts.
 * - nocturnal: active at night, sleeps by day
 * - diurnal: active in daylight, sleeps at night
 * - crepuscular: active around dawn and dusk
 * - cathemeral: rests intermittently through day and night
 */
export type DefiningWildlifeActivityPattern =
  | 'nocturnal'
  | 'diurnal'
  | 'crepuscular'
  | 'cathemeral';

/**
 * Per-spawn aggression roll (bell-curve distributed).
 * Drives on-sight player threat, flee distance, and collision startle.
 */
export type DefiningWildlifeAggressionLevel = 'aggressive' | 'normal' | 'tame';

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
    }
  | {
      mode: 'territoryWarn';
      targetInstanceId: string;
      targetPoint: DefiningWorldPlazaWorldPoint;
    }
  | {
      mode: 'forageChase' | 'forageEat';
      targetGroundItemId: string;
      targetPoint: DefiningWorldPlazaWorldPoint;
    };

/** Cached steering direction reused between re-scores. */
export type DefiningWildlifeSteeringCache = {
  directionX: number;
  directionY: number;
  cachedAtMs: number;
  intentKey: string;
};

/** Active jump arc from one ground point to another. */
export type DefiningWildlifeJumpState = {
  fromPoint: DefiningWorldPlazaWorldPoint;
  toPoint: DefiningWorldPlazaWorldPoint;
  startedAtMs: number;
  durationMs: number;
  /** Normalized arc progress (0 = takeoff, 1 = landing), updated per tick. */
  progress: number;
};

/** Runtime AI state on one wildlife instance. */
export type DefiningWildlifeAiState = {
  intent: DefiningWildlifeBehaviorIntent;
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  motionClip:
    | 'idle'
    | 'walk'
    | 'run'
    | 'attack'
    | 'takeDamage'
    | 'die'
    | 'sleep';
  isMoving: boolean;
  lastThinkAtMs: number;
  wanderTarget: DefiningWorldPlazaWorldPoint | null;
  steeringCache: DefiningWildlifeSteeringCache | null;
  /** Timestamp of the last melee swing; gates the attack cooldown. */
  lastAttackAtMs: number | null;
  /** Active jump arc, or null when grounded. */
  jumpState: DefiningWildlifeJumpState | null;
  /** Timestamp of the last landing; gates the jump cooldown. */
  lastJumpEndedAtMs: number | null;
  /** Locked flee destination for player-proximity panic; avoids rubber-banding. */
  fleeTargetPoint: DefiningWorldPlazaWorldPoint | null;
  /** While set and in the future, the animal flees from player contact. */
  startledUntilMs: number | null;
  /** Timestamp when a full-stamina charge wind-up began, or null when idle. */
  chargeWindupStartedAtMs: number | null;
  /** While set and in the future, the hunter stays locked on a kill meal. */
  feedingOnKillUntilMs: number | null;
  /** Ground item id for the active post-kill feeding session. */
  feedingOnKillGroundItemId: string | null;
  /** True while the animal is asleep on its activity schedule. */
  isSleeping: boolean;
  /** Once disturbed by damage, the animal stays awake until despawn or death. */
  hasSleepBeenDisturbed: boolean;
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

import type { DefiningWildlifeSpeechPresentation } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';

/** Active speech bubble shown above a wildlife sprite. */
export type DefiningWildlifeSpeechBubble = {
  message: string;
  expiresAtMs: number;
  presentation: DefiningWildlifeSpeechPresentation;
};

/** Ephemeral vocalization state on one wildlife instance. */
export type DefiningWildlifeSpeechState = {
  activeBubble: DefiningWildlifeSpeechBubble | null;
  lastEmittedAtMs: number | null;
  lastContextKey: string | null;
};

/** Live wildlife instance in the simulation store. */
export type DefiningWildlifeInstance = {
  instanceId: string;
  speciesId: DefiningWildlifeSpeciesId;
  anchorId: string;
  /** Rolled once at spawn; stable for the life of this instance. */
  aggressionLevel: DefiningWildlifeAggressionLevel;
  /** Standard-normal sleep schedule roll; stable from spawn anchor. */
  sleepScheduleSample: number;
  /** Standard-normal size roll; stable from spawn anchor. */
  sizeScaleSample: number;
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
  /** Ephemeral vocalization bubble above the sprite. */
  speechState: DefiningWildlifeSpeechState;
  /** Last environmental hazard damage tick timestamp (ms). */
  environmentalDamageLastTickAtMs: number | null;
  isDead: boolean;
  diedAtMs: number | null;
  /** Prevents duplicate loot when death persists across ticks. */
  hasDroppedLoot: boolean;
};

/** Dead anchor waiting to respawn once the player leaves the kill site. */
export type DefiningWildlifePendingRespawn = {
  anchorId: string;
  speciesId: DefiningWildlifeSpeciesId;
  aggressionLevel: DefiningWildlifeAggressionLevel;
  sleepScheduleSample: number;
  sizeScaleSample: number;
  spawnAnchor: DefiningWorldPlazaWorldPoint;
  thinkScheduleAnchor: DefiningWildlifeSpawnAnchor;
  deathPosition: DefiningWorldPlazaWorldPoint;
  diedAtMs: number;
  placementSeed: number;
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
  projectileArchetypeId?: string;
};

/** Payload when a wildlife melee swing damages the local player. */
export type DefiningWildlifePlayerMeleeHit = {
  speciesId: DefiningWildlifeSpeciesId;
  damageAmount: number;
};
