import { checkingWildlifeStalkerShadowingAtDamage } from '@/components/world/wildlife/domains/checkingWildlifeStalkerShadowingAtDamage';
import {
  creatingWildlifeTestAiState,
  creatingWildlifeTestInstance,
} from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingStalkingWolf(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return creatingWildlifeTestInstance({
    speciesId: 'grey-wolf',
    aggroState: {
      threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1_000 }],
      activeTargetId: 'player-1',
      lastDamagedAtMs: null,
      stalkingPreySinceMs: 1_000,
      stalkAttackingPreySinceMs: null,
      stalkPhase: 'shadowing',
    },
    aiState: creatingWildlifeTestAiState({
      intent: { mode: 'wander' },
    }),
    ...overrides,
  });
}

describe('checkingWildlifeStalkerShadowingAtDamage', () => {
  it('treats wander intent as shadowing while the hunt timer is active', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingStalkingWolf();

    expect(
      checkingWildlifeStalkerShadowingAtDamage({
        instance,
        species,
        preyTargetId: 'player-1',
        nowMs: 1_000 + DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS - 1,
        preyHealthRatio: 1,
        preyStaminaRatio: 1,
        preyStaminaIsDepleted: false,
        preyStillDurationMs: 0,
      })
    ).toBe(true);
  });

  it('does not treat a committed rush as shadowing', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingStalkingWolf({
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1_000 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 1_000,
        stalkAttackingPreySinceMs: 1_500,
        stalkPhase: 'attacking',
      },
      aiState: creatingWildlifeTestAiState({
        intent: {
          mode: 'chase',
          targetInstanceId: 'player-1',
          targetPoint: { x: 3, y: 1.5, layer: 1 },
        },
      }),
    });

    expect(
      checkingWildlifeStalkerShadowingAtDamage({
        instance,
        species,
        preyTargetId: 'player-1',
        nowMs: 2_000,
        preyHealthRatio: 1,
        preyStaminaRatio: 1,
        preyStaminaIsDepleted: false,
        preyStillDurationMs: 0,
      })
    ).toBe(false);
  });

  it('stops shadowing once kill-window weakness triggers fire', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingStalkingWolf({
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1_000 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 1_000,
        stalkAttackingPreySinceMs: null,
        stalkPhase: 'attacking',
      },
      aiState: creatingWildlifeTestAiState({
        intent: {
          mode: 'stalk',
          targetInstanceId: 'player-1',
          targetPoint: { x: 3, y: 1.5, layer: 1 },
        },
      }),
    });

    expect(
      checkingWildlifeStalkerShadowingAtDamage({
        instance,
        species,
        preyTargetId: 'player-1',
        nowMs: 1_000 + DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS + 1,
        preyHealthRatio: 0.2,
        preyStaminaRatio: 1,
        preyStaminaIsDepleted: false,
        preyStillDurationMs: 0,
      })
    ).toBe(false);
  });
});
