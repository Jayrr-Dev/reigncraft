import { checkingWildlifeStalkerIsShadowingPrey } from '@/components/world/wildlife/domains/checkingWildlifeStalkerIsShadowingPrey';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { describe, expect, it } from 'vitest';

const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];

const healthyPrey = {
  preyHealthRatio: 1,
  preyStaminaRatio: 1,
  preyStaminaIsDepleted: false,
  preyStillDurationMs: 0,
};

describe('checkingWildlifeStalkerIsShadowingPrey', () => {
  it('returns true while quietly trailing healthy prey', () => {
    expect(
      checkingWildlifeStalkerIsShadowingPrey({
        species,
        aggroState: {
          threats: [],
          activeTargetId: 'deer-1',
          lastDamagedAtMs: null,
          stalkingPreySinceMs: 1_000,
          stalkAttackingPreySinceMs: null,
          stalkPackResponse: null,
        },
        preyTargetId: 'deer-1',
        ...healthyPrey,
        stalkingElapsedMs: DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS,
      })
    ).toBe(true);
  });

  it('returns false once the kill window is open', () => {
    expect(
      checkingWildlifeStalkerIsShadowingPrey({
        species,
        aggroState: {
          threats: [],
          activeTargetId: 'player-1',
          lastDamagedAtMs: null,
          stalkingPreySinceMs: 1_000,
          stalkAttackingPreySinceMs: null,
          stalkPackResponse: null,
        },
        preyTargetId: 'player-1',
        preyHealthRatio: 0.4,
        preyStaminaRatio: 1,
        preyStaminaIsDepleted: false,
        preyStillDurationMs: 0,
        stalkingElapsedMs: DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS,
      })
    ).toBe(false);
  });
});
