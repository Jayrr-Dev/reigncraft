import { checkingWildlifeInstanceQualifiesAsAggroDeerKill } from '@/components/world/wildlife/domains/checkingWildlifeInstanceQualifiesAsAggroDeerKill';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeInstanceQualifiesAsAggroDeerKill', () => {
  const deerSpecies = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
  const nowMs = 1_000_000;
  const playerUserId = 'player-1';

  it('tags meat when the player kills an aggressive deer that was fighting back', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'deer',
      aggressionLevel: 'aggressive',
      aggroState: {
        activeTargetId: playerUserId,
        threats: [],
        lastDamagedAtMs: nowMs - 500,
        lastAggroedAtMs: nowMs - 500,
        stalkPackResponse: null,
        stalkAttackingPreySinceMs: null,
        playerRevengeAggroUntilMs: null,
      },
    });

    expect(
      checkingWildlifeInstanceQualifiesAsAggroDeerKill({
        instance,
        species: deerSpecies,
        killerTargetId: playerUserId,
        playerUserId,
        nowMs,
      })
    ).toBe(true);
  });

  it('does not tag meat from a calm deer kill', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'deer',
      aggressionLevel: 'normal',
      aggroState: {
        activeTargetId: null,
        threats: [],
        lastDamagedAtMs: null,
        lastAggroedAtMs: null,
        stalkPackResponse: null,
        stalkAttackingPreySinceMs: null,
        playerRevengeAggroUntilMs: null,
      },
    });

    expect(
      checkingWildlifeInstanceQualifiesAsAggroDeerKill({
        instance,
        species: deerSpecies,
        killerTargetId: playerUserId,
        playerUserId,
        nowMs,
      })
    ).toBe(false);
  });

  it('does not tag meat when wildlife kills the deer', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'deer',
      aggressionLevel: 'aggressive',
      aggroState: {
        activeTargetId: playerUserId,
        threats: [],
        lastDamagedAtMs: nowMs - 500,
        lastAggroedAtMs: nowMs - 500,
        stalkPackResponse: null,
        stalkAttackingPreySinceMs: null,
        playerRevengeAggroUntilMs: null,
      },
    });

    expect(
      checkingWildlifeInstanceQualifiesAsAggroDeerKill({
        instance,
        species: deerSpecies,
        killerTargetId: 'wolf-1',
        playerUserId,
        nowMs,
      })
    ).toBe(false);
  });
});
