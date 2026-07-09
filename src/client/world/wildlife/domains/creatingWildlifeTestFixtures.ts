import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import type {
  DefiningWildlifeAiState,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Default AI state for wildlife unit tests. */
export function creatingWildlifeTestAiState(
  overrides: Partial<DefiningWildlifeAiState> = {}
): DefiningWildlifeAiState {
  return {
    intent: { mode: 'idle' },
    facingDirection: 'Down',
    motionClip: 'idle',
    isMoving: false,
    lastThinkAtMs: 0,
    wanderTarget: null,
    steeringCache: null,
    lastAttackAtMs: null,
    attackComboIndex: 0,
    howlingUntilMs: null,
    lastHowlAtMs: null,
    jumpState: null,
    lastJumpEndedAtMs: null,
    startledUntilMs: null,
    chargeWindupStartedAtMs: null,
    fleeTargetPoint: null,
    feedingOnKillUntilMs: null,
    feedingOnKillGroundItemId: null,
    isSleeping: false,
    hasSleepBeenDisturbed: false,
    hasPlayerSleepBumpContact: false,
    ...overrides,
  };
}

/** Default wildlife instance for unit tests. */
export function creatingWildlifeTestInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:0:0:0',
    speciesId: 'grey-wolf',
    anchorId: 'wildlife:0:0:0',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    largeSizeFrame: null,
    packAlphaInstanceId: null,
    packAlphaDeathScatterUntilMs: null,
    customDisplayName: null,
    spawnAnchor: { x: 0.5, y: 0.5, layer: 1 },
    position: { x: 0.5, y: 0.5, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.85,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: creatingWildlifeTestAiState(),
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
      stalkingPreySinceMs: null,
      stalkAttackingPreySinceMs: null,
      stalkPhase: 'idle',
      stalkPhaseEnteredAtMs: null,
      pendingStalkEvents: [],
    },
    floatingTexts: [],
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    hasBeenStudied: false,
    ...overrides,
  };
}
