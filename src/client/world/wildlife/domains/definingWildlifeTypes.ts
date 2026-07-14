/**
 * Core wildlife instance and simulation types.
 *
 * @module components/world/wildlife/domains/definingWildlifeTypes
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaEntityHealthFloatText } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWildlifeLargeSizeFrame } from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import type { DefiningWildlifeStaminaFatigueTier } from '@/components/world/wildlife/domains/definingWildlifeStaminaFatigueConstants';
import type {
  DefiningWildlifeStalkEventKind,
  DefiningWildlifeStalkPhase,
} from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type { DefiningWildlifePetBondState } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';

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
  | 'docile'
  | 'passive'
  | 'skittish'
  | 'retaliator'
  | 'predator'
  | 'ambusher'
  | 'pack_hunter'
  | 'stalker';

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
  /** Fatigue after repeated full depletions; resets on a full bar. */
  fatigueTier: DefiningWildlifeStaminaFatigueTier;
  /** Continuous seconds spent running; resets when the animal stops sprinting. */
  runningForSeconds: number;
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
      /** Young animal running back to a larger same-species guardian. */
      mode: 'followGuardian';
      targetInstanceId: string;
      targetPoint: DefiningWorldPlazaWorldPoint;
    }
  | {
      /** Social hunter running toward a packmate before opening a hunt. */
      mode: 'seekPackmate';
      targetInstanceId: string;
      targetPoint: DefiningWorldPlazaWorldPoint;
    }
  | {
      /** Docile dog/cat trailing the player after a friendly approach roll. */
      mode: 'followPlayer';
      targetInstanceId: string;
      targetPoint: DefiningWorldPlazaWorldPoint;
    }
  | {
      mode: 'stalk';
      targetInstanceId: string;
      targetPoint: DefiningWorldPlazaWorldPoint;
      /** Face this point while stepping backward (player during a close retreat). */
      facingPoint?: DefiningWorldPlazaWorldPoint;
      /** Run during catch-up / approach retreat; default walk. */
      pace?: 'walk' | 'run';
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

/** In-progress chew on one ground-food stack; consumes one unit when ready. */
export type DefiningWildlifePendingGroundFoodBite = {
  groundItemId: string;
  startedAtMs: number;
  readyAtMs: number;
};

/** Pull toward a heard packmate howl; cleared on arrival or expiry. */
export type DefiningWildlifeHowlSummonState = {
  targetPoint: DefiningWorldPlazaWorldPoint;
  howlerInstanceId: string;
  untilMs: number;
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
    | 'runBackwards'
    | 'attack'
    | 'attack2'
    | 'attack3'
    | 'howl'
    | 'taunt'
    | 'takeDamage'
    | 'die'
    | 'sleep';
  isMoving: boolean;
  lastThinkAtMs: number;
  wanderTarget: DefiningWorldPlazaWorldPoint | null;
  steeringCache: DefiningWildlifeSteeringCache | null;
  /** Timestamp of the last melee swing; gates the attack cooldown. */
  lastAttackAtMs: number | null;
  /** Grey wolf combo step for attack / attack2 / attack3 rotation. */
  attackComboIndex: number;
  /** While set and in the future, the wolf plays the howl clip and stands still. */
  howlingUntilMs: number | null;
  /** Timestamp of the last howl for cooldown gating. */
  lastHowlAtMs: number | null;
  /**
   * Set when this wolf answered a packmate howl; pulls it to the howl point.
   * Optional so existing fixtures stay valid; absent means no summon.
   */
  howlSummon?: DefiningWildlifeHowlSummonState | null;
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
  /**
   * True after this animal has already spent its one bluff charge (or never
   * qualifies). Cleared only on respawn via fresh AI state.
   */
  hasUsedBluffCharge: boolean;
  /**
   * True while a bluff-eligible charge is in progress and the player has left
   * the home territory patch (past the territory line).
   */
  bluffChargePlayerExitedTerritory: boolean;
  /**
   * Spawn-relative point to walk back to after a bluff abort. Usually the
   * position where the animal stood when the charge wind-up began.
   */
  bluffReturnPoint: DefiningWorldPlazaWorldPoint | null;
  /** While set and in the future, the hunter stays locked on a kill meal. */
  feedingOnKillUntilMs: number | null;
  /** Ground item id for the active post-kill feeding session. */
  feedingOnKillGroundItemId: string | null;
  /** Chew timer gating the next ground-food unit; null when not chewing. */
  pendingGroundFoodBite: DefiningWildlifePendingGroundFoodBite | null;
  /** True while the animal is asleep on its activity schedule. */
  isSleeping: boolean;
  /** Once disturbed by damage, the animal stays awake until despawn or death. */
  hasSleepBeenDisturbed: boolean;
  /**
   * True while the player is overlapping this sleeper after the bump-wake roll
   * for the current contact. Cleared when overlap ends.
   */
  hasPlayerSleepBumpContact: boolean;
  /** While set and in the future, docile wildlife trails the player. */
  docileFollowUntilMs: number | null;
  /** Last time this docile animal rolled follow vs flee on approach. */
  docileLastReactAtMs: number | null;
  /**
   * Pouncer pattern phase (`sunhead`). `idle` when not mid-cycle.
   * Optional for older fixtures / network snapshots.
   */
  pouncerPhase?: 'retreat' | 'cast' | 'pounce' | 'idle';
  /** World X where the current pouncer retreat started. */
  pouncerRetreatFromX?: number | null;
  /** World Y where the current pouncer retreat started. */
  pouncerRetreatFromY?: number | null;
  /** While set and in the future, plays the jump-scare taunt cast. */
  jumpScareUntilMs?: number | null;
  /** Timestamp of the last jump-scare cast for cooldown gating. */
  lastJumpScareAtMs?: number | null;
  /** True after jump-scare cast until the armed pounce lands. */
  jumpScareArmed?: boolean;
  /** While set and in the future, the next melee forces fatal EV tier. */
  jumpScareFatalUntilMs?: number | null;
};

/** Threat entry keyed by target id (player userId or wildlife instanceId). */
export type DefiningWildlifeThreatEntry = {
  targetId: string;
  threat: number;
  lastUpdatedAtMs: number;
};

/** Aggro state on one wildlife instance. */
export type DefiningWildlifeStalkPackResponseKind =
  | 'flee'
  | 'enrage'
  | 'regroup';

/** Gradual retreat leg while the player closes on a shadowing PackHunter. */
export type DefiningWildlifeStalkPlayerApproachState = {
  noticedAtMs: number;
  noticeDelayMs: number;
  playerPace: 'walk' | 'run';
  retreatDistanceGrid: number;
  retreatStartedAtMs: number | null;
  retreatFromX: number;
  retreatFromY: number;
};

export type DefiningWildlifeAggroState = {
  threats: readonly DefiningWildlifeThreatEntry[];
  activeTargetId: string | null;
  lastDamagedAtMs: number | null;
  /** Last time this animal landed melee damage on a combat target. */
  lastDealtDamageAtMs?: number | null;
  /** Timestamp when the current active-target pursuit began. */
  chaseEngagedAtMs?: number | null;
  /**
   * After a no-damage chase give-up, skip player proximity threat until the
   * player leaves the aggro radius (or damages this animal).
   */
  chaseGiveUpUntilPlayerExitsAggro?: boolean;
  /** Timestamp when this PackHunter first locked onto the active prey target. */
  stalkingPreySinceMs?: number | null;
  /** Timestamp when the pack hit confident size (5+); starts the formation timer. */
  stalkConfidentSinceMs?: number | null;
  /** Timestamp of the first hit during a committed stalk rush on the prey. */
  stalkAttackingPreySinceMs?: number | null;
  /** Last time this hunt rolled a player-approach reaction (pack-wide cooldown). */
  stalkPlayerApproachReactedAtMs?: number | null;
  /** Delayed walk/run retreat while the player closes during shadowing. */
  stalkPlayerApproachState?: DefiningWildlifeStalkPlayerApproachState | null;
  /** Prey id the alpha committed to; other targets are ignored until release. */
  stalkLockedPreyTargetId?: string | null;
  /** Player hits keep the hunt lock until this timestamp. */
  playerRevengeAggroUntilMs?: number | null;
  /** Last tick while this animal had an active combat target. */
  lastAggroedAtMs?: number | null;
  /**
   * Set when this adult joined a defend-young counterattack.
   * Cleared when the active threat target drops; used so passive adults fight.
   */
  defendingYoungUntilMs?: number | null;
  /**
   * Unnoticed animals that land a hit on wildlife stay "provoked" until this
   * timestamp so predators may hunt them despite the trait.
   */
  provokedWildlifeAggroUntilMs?: number | null;
  /** Explicit stalk hunt phase for PackHunter temperament. */
  stalkPhase?: DefiningWildlifeStalkPhase;
  /** Timestamp when the current stalkPhase began. */
  stalkPhaseEnteredAtMs?: number | null;
  /** Events queued for the stalk phase machine on the next tick. */
  pendingStalkEvents?: readonly DefiningWildlifeStalkEventKind[];
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
  /**
   * Rolled once at spawn; stable for the life of this instance.
   * For docile species this is also friendliness: tame follows most, aggressive flees most.
   * Player hits on docile stock demote one step (tame → normal → aggressive).
   */
  aggressionLevel: DefiningWildlifeAggressionLevel;
  /** Standard-normal sleep schedule roll; stable from spawn anchor. */
  sleepScheduleSample: number;
  /** Standard-normal size roll; stable from spawn anchor. */
  sizeScaleSample: number;
  /** Obese or apex frame for +1σ/+2σ spawns; null for smaller animals. */
  largeSizeFrame?: DefiningWildlifeLargeSizeFrame | null;
  /**
   * Sticky spawn-pack alpha id. Locked once when the pack first forms around the
   * largest living member; survives later bigger spawns until the locked alpha dies.
   */
  packAlphaInstanceId?: string | null;
  /**
   * Until this timestamp, survivors of an alpha death keep fleeing to regroup and
   * will not elect a replacement alpha.
   */
  packAlphaDeathScatterUntilMs?: number | null;
  /** Player-assigned name override; null uses the generated size-tier label. */
  customDisplayName?: string | null;
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
  /** True after the local player finishes a Study channel on this corpse. */
  hasBeenStudied: boolean;
  /**
   * Wall-clock ms until this living companion accepts another Pet.
   * Null/undefined when never petted or cooldown already expired.
   */
  petCooldownUntilMs?: number | null;
  /**
   * Soft-despawn clock for fairy daybreak / betrayal departure. Null while
   * still a normal companion.
   */
  softDepartureStartedAtMs?: number | null;
  /**
   * Why soft departure started. Daybreak stamps clear if night returns;
   * betrayal keeps fleeing until despawn.
   */
  softDepartureReason?: 'daybreak' | 'betrayal' | null;
  /** Bonded companion state when this instance is an owned pet. */
  petBond?: DefiningWildlifePetBondState | null;
};

/** Dead anchor waiting to respawn once the player leaves the kill site. */
export type DefiningWildlifePendingRespawn = {
  anchorId: string;
  speciesId: DefiningWildlifeSpeciesId;
  aggressionLevel: DefiningWildlifeAggressionLevel;
  sleepScheduleSample: number;
  sizeScaleSample: number;
  largeSizeFrame: DefiningWildlifeLargeSizeFrame | null;
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
  instanceId: string;
  speciesId: DefiningWildlifeSpeciesId;
  damageAmount: number;
  aggressionLevel: DefiningWildlifeAggressionLevel;
  /** When set, forces this EV outcome tier on the player damage roll. */
  forcedDeviationScore?: number;
};

/** Payload when the player is overlapping a live animal body. */
export type DefiningWildlifePlayerContactEvent = {
  instanceId: string;
  speciesId: DefiningWildlifeSpeciesId;
  aggressionLevel: DefiningWildlifeAggressionLevel;
};
