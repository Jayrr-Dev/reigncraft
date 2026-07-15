import { DEFINING_WILDLIFE_GOD_SPAWN_SPEECH_LINES } from '@/components/world/wildlife/domains/definingWildlifeGodSpawnConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeInstanceEffectiveSpecies } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceEffectiveSpecies';
import { resolvingWildlifeSpeechLinesForInstance } from '@/components/world/wildlife/domains/resolvingWildlifeSpeechLinesForInstance';
import { describe, expect, it } from 'vitest';

describe('wildlife god spawn presentation helpers', () => {
  it('swaps animal vocalizations for human taunt lines', () => {
    const lines = resolvingWildlifeSpeechLinesForInstance(
      { speciesId: 'chicken', isGodSpawn: true },
      'attack'
    );

    expect(lines).toEqual(DEFINING_WILDLIFE_GOD_SPAWN_SPEECH_LINES);
    expect(
      lines.some((line) =>
        (typeof line === 'string' ? line : line.text).includes('FOOLISH')
      )
    ).toBe(true);
  });

  it('overrides species temperament and forces always-aggro for god spawns', () => {
    const chicken = DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken;
    const effective = resolvingWildlifeInstanceEffectiveSpecies(chicken, {
      isGodSpawn: true,
      temperamentOverrideId: 'stalker',
    });

    expect(effective.temperamentId).toBe('stalker');
    expect(effective.aggressionSpawn.alwaysAttacksPlayerOnSight).toBe(true);
    expect(chicken.temperamentId).not.toBe('stalker');
  });
});
