import { DEFINING_WORLD_PLAZA_CYROBORN_DEATH_IMPLODE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaCyrobornScalePulseConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeCyrobornScalePulseFromInstance } from '@/components/world/wildlife/domains/resolvingWildlifeCyrobornScalePulseFromInstance';
import { describe, expect, it } from 'vitest';

function buildingStubInstance(
  overrides: Partial<DefiningWildlifeInstance> & {
    aiState?: Partial<DefiningWildlifeInstance['aiState']>;
  }
): DefiningWildlifeInstance {
  return {
    instanceId: 'cyroborn-1',
    speciesId: 'cyroborn',
    position: { x: 0, y: 0, layer: 1 },
    facingDirection: 'Down',
    isDead: false,
    diedAtMs: null,
    healthState: {
      currentHealth: 72,
      baseMaxHealth: 72,
    },
    hungerState: {
      hungerRatio: 1,
      driveLevel: 'satisfied',
    },
    staminaState: {
      staminaRatio: 1,
      isDepleted: false,
    },
    aggroState: {
      activeTargetId: null,
      threatTable: [],
    },
    aiState: {
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
      fleeTargetPoint: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      hasUsedBluffCharge: false,
      isSleeping: false,
      sleepStartedAtMs: null,
      ...overrides.aiState,
    },
    ...overrides,
  } as DefiningWildlifeInstance;
}

describe('resolvingWildlifeCyrobornScalePulseFromInstance', () => {
  it('ignores non-cyroborn species', () => {
    const pulse = resolvingWildlifeCyrobornScalePulseFromInstance({
      instance: buildingStubInstance({ speciesId: 'fairy' }),
      nowMs: 1_000,
    });
    expect(pulse).toEqual({ scaleMultiplier: 1, hideBody: false });
  });

  it('shrinks while jumping', () => {
    const pulse = resolvingWildlifeCyrobornScalePulseFromInstance({
      instance: buildingStubInstance({
        aiState: {
          jumpState: {
            fromPoint: { x: 0, y: 0, layer: 1 },
            toPoint: { x: 1, y: 0, layer: 1 },
            startedAtMs: 0,
            durationMs: 500,
            progress: 0.5,
          },
        },
      }),
      nowMs: 500,
    });
    expect(pulse.scaleMultiplier).toBeLessThan(1);
  });

  it('grows during attack clip hold', () => {
    const pulse = resolvingWildlifeCyrobornScalePulseFromInstance({
      instance: buildingStubInstance({
        aiState: {
          motionClip: 'attack',
          lastAttackAtMs: 1_000,
        },
      }),
      nowMs: 1_225,
    });
    expect(pulse.scaleMultiplier).toBeGreaterThan(1);
  });

  it('implodes on death', () => {
    const start = resolvingWildlifeCyrobornScalePulseFromInstance({
      instance: buildingStubInstance({
        isDead: true,
        diedAtMs: 1_000,
      }),
      nowMs: 1_000,
    });
    const end = resolvingWildlifeCyrobornScalePulseFromInstance({
      instance: buildingStubInstance({
        isDead: true,
        diedAtMs: 1_000,
      }),
      nowMs: 1_000 + DEFINING_WORLD_PLAZA_CYROBORN_DEATH_IMPLODE_DURATION_MS,
    });

    expect(start.scaleMultiplier).toBeCloseTo(1, 5);
    expect(end.scaleMultiplier).toBe(0);
    expect(end.hideBody).toBe(true);
  });
});
