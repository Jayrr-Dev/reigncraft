import { advancingWildlifeStalkerBehaviour } from '@/components/world/wildlife/domains/advancingWildlifeStalkerBehaviour';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE } from '@/components/world/wildlife/domains/definingWildlifeStalkerBehaviourMachine';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STALK_AGGRO_TIMEOUT_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type {
  DefiningWildlifeStalkEventKind,
  DefiningWildlifeStalkPhase,
} from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type { DefiningWildlifeAggroState } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingStateMachineTransition } from '@/lib/stateMachine/resolvingStateMachineTransition';
import { describe, expect, it } from 'vitest';

const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
const resolveSpecies = (speciesId: string) =>
  DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null;

function resolvingWildlifeStalkPhaseTransition(
  currentPhase: DefiningWildlifeStalkPhase,
  eventKind: DefiningWildlifeStalkEventKind
): DefiningWildlifeStalkPhase | null {
  const transition = resolvingStateMachineTransition({
    definition: DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE,
    registry: { guards: {}, actions: {} },
    currentState: currentPhase,
    event: { type: eventKind },
    context: {},
  });

  if (!transition) {
    return null;
  }

  const phase = transition.to;

  if (
    phase === 'idle' ||
    phase === 'shadowing' ||
    phase === 'retreating' ||
    phase === 'regrouping' ||
    phase === 'formingUp' ||
    phase === 'surrounding' ||
    phase === 'attacking' ||
    phase === 'fleeing'
  ) {
    return phase;
  }

  return null;
}

function advancingStalkPhase({
  instance,
  aggroState,
  tickEvents = [],
  nowMs = 5_000,
  playerPosition = { x: 12, y: 10, layer: 1 },
}: {
  instance: ReturnType<typeof creatingWildlifeTestInstance>;
  aggroState: DefiningWildlifeAggroState;
  tickEvents?: readonly DefiningWildlifeStalkEventKind[];
  nowMs?: number;
  playerPosition?: { x: number; y: number; layer: number };
}) {
  return advancingWildlifeStalkerBehaviour({
    instance,
    species,
    nearbyInstances: [],
    playerPosition,
    playerUserId: 'player-1',
    playerHealthRatio: 1,
    playerStaminaRatio: 1,
    playerStaminaIsDepleted: false,
    playerStillDurationMs: 0,
    nowMs,
    aggroState,
    tickEvents,
    resolveSpecies,
  });
}

describe('resolvingWildlifeStalkPhaseTransition', () => {
  it('maps every registry edge to the expected phase', () => {
    expect(
      resolvingWildlifeStalkPhaseTransition('idle', 'TARGET_ACQUIRED')
    ).toBe('shadowing');
    expect(
      resolvingWildlifeStalkPhaseTransition('shadowing', 'PLAYER_APPROACH_NOTICED')
    ).toBe('retreating');
    expect(
      resolvingWildlifeStalkPhaseTransition('retreating', 'RETREAT_DONE_ROLL_FLEE')
    ).toBe('fleeing');
    expect(
      resolvingWildlifeStalkPhaseTransition('retreating', 'RETREAT_DONE_ROLL_ENRAGE')
    ).toBe('attacking');
    expect(
      resolvingWildlifeStalkPhaseTransition('retreating', 'RETREAT_DONE_ROLL_REGROUP')
    ).toBe('regrouping');
    expect(
      resolvingWildlifeStalkPhaseTransition('regrouping', 'REGROUP_DISTANCE_REACHED')
    ).toBe('shadowing');
    expect(
      resolvingWildlifeStalkPhaseTransition('shadowing', 'PACK_CONFIDENT')
    ).toBe('formingUp');
    expect(
      resolvingWildlifeStalkPhaseTransition('formingUp', 'PACK_THINNED')
    ).toBe('shadowing');
    expect(
      resolvingWildlifeStalkPhaseTransition('formingUp', 'FORMATION_TIMER_DONE')
    ).toBe('surrounding');
    expect(
      resolvingWildlifeStalkPhaseTransition('shadowing', 'KILL_WINDOW_PLUS_PACK')
    ).toBe('surrounding');
    expect(
      resolvingWildlifeStalkPhaseTransition('shadowing', 'KILL_WINDOW_OPEN')
    ).toBe('attacking');
    expect(
      resolvingWildlifeStalkPhaseTransition(
        'surrounding',
        'SLOT_REACHED_OR_ALPHA_COMMIT'
      )
    ).toBe('attacking');
    expect(
      resolvingWildlifeStalkPhaseTransition('attacking', 'ATTACK_TIMEOUT_10S')
    ).toBe('shadowing');
    expect(
      resolvingWildlifeStalkPhaseTransition('shadowing', 'DAMAGED_ROLL_FLEE')
    ).toBe('fleeing');
    expect(
      resolvingWildlifeStalkPhaseTransition('shadowing', 'DAMAGED_ROLL_ENRAGE')
    ).toBe('attacking');
    expect(
      resolvingWildlifeStalkPhaseTransition('shadowing', 'STALK_TIMEOUT_2MIN')
    ).toBe('idle');
    expect(
      resolvingWildlifeStalkPhaseTransition('fleeing', 'FLEE_DISTANCE_REACHED')
    ).toBe('idle');
    expect(
      resolvingWildlifeStalkPhaseTransition('formingUp', 'TARGET_DEAD_OR_LOST')
    ).toBe('idle');
    expect(
      resolvingWildlifeStalkPhaseTransition('shadowing', 'ALPHA_DIED')
    ).toBe('fleeing');
  });

  it('returns null for illegal edges', () => {
    expect(
      resolvingWildlifeStalkPhaseTransition('shadowing', 'FORMATION_TIMER_DONE')
    ).toBeNull();
    expect(
      resolvingWildlifeStalkPhaseTransition('idle', 'KILL_WINDOW_OPEN')
    ).toBeNull();
  });
});

describe('advancingWildlifeStalkerBehaviour', () => {
  it('enters shadowing when a target is acquired', () => {
    const instance = creatingWildlifeTestInstance({
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 1_000,
        stalkPhase: 'idle',
      },
    });

    const nextAggro = advancingStalkPhase({
      instance,
      aggroState: instance.aggroState,
      tickEvents: ['TARGET_ACQUIRED'],
    });

    expect(nextAggro.stalkPhase).toBe('shadowing');
  });

  it('releases aggro after a stalk timeout event', () => {
    const instance = creatingWildlifeTestInstance({
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 0,
        stalkPhase: 'shadowing',
      },
    });

    const nextAggro = advancingStalkPhase({
      instance,
      aggroState: instance.aggroState,
      tickEvents: ['STALK_TIMEOUT_2MIN'],
      nowMs: DEFINING_WILDLIFE_STALK_AGGRO_TIMEOUT_MS + 1,
    });

    expect(nextAggro.stalkPhase).toBe('idle');
    expect(nextAggro.activeTargetId).toBeNull();
    expect(nextAggro.stalkingPreySinceMs).toBeNull();
  });

  it('ignores illegal events without changing phase', () => {
    const instance = creatingWildlifeTestInstance({
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 1_000,
        stalkPhase: 'shadowing',
      },
    });

    const nextAggro = advancingStalkPhase({
      instance,
      aggroState: instance.aggroState,
      tickEvents: ['FORMATION_TIMER_DONE'],
    });

    expect(nextAggro.stalkPhase).toBe('shadowing');
  });

  it('sets attack commit timestamp while already attacking', () => {
    const instance = creatingWildlifeTestInstance({
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 1_000,
        stalkPhase: 'attacking',
        stalkAttackingPreySinceMs: null,
      },
    });

    const nextAggro = advancingStalkPhase({
      instance,
      aggroState: instance.aggroState,
      tickEvents: ['ATTACK_COMMITTED'],
      nowMs: 9_000,
    });

    expect(nextAggro.stalkPhase).toBe('attacking');
    expect(nextAggro.stalkAttackingPreySinceMs).toBe(9_000);
  });
});
