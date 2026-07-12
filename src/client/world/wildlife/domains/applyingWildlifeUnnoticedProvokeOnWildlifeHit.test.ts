import { applyingWildlifeUnnoticedProvokeOnWildlifeHit } from '@/components/world/wildlife/domains/applyingWildlifeUnnoticedProvokeOnWildlifeHit';
import { checkingWildlifeInstanceHasProvokedWildlifeAggro } from '@/components/world/wildlife/domains/checkingWildlifeInstanceHasProvokedWildlifeAggro';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_UNNOTICED_PROVOKE_DURATION_MS } from '@/components/world/wildlife/domains/definingWildlifeSpeciesPassiveTraitConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('applyingWildlifeUnnoticedProvokeOnWildlifeHit', () => {
  it('marks unnoticed attackers as provoked for the configured window', () => {
    const fairy = creatingWildlifeTestInstance({
      instanceId: 'wildlife:fairy:1',
      speciesId: 'fairy',
    });
    const fairySpecies = resolvingWildlifeSpeciesDefinition('fairy')!;
    const nowMs = 10_000;

    const provoked = applyingWildlifeUnnoticedProvokeOnWildlifeHit(
      fairy,
      fairySpecies,
      nowMs
    );

    expect(
      checkingWildlifeInstanceHasProvokedWildlifeAggro(provoked, nowMs + 1)
    ).toBe(true);
    expect(
      checkingWildlifeInstanceHasProvokedWildlifeAggro(
        provoked,
        nowMs + DEFINING_WILDLIFE_UNNOTICED_PROVOKE_DURATION_MS + 1
      )
    ).toBe(false);
  });

  it('leaves normal species unchanged', () => {
    const wolf = creatingWildlifeTestInstance();
    const wolfSpecies = resolvingWildlifeSpeciesDefinition('grey-wolf')!;

    const next = applyingWildlifeUnnoticedProvokeOnWildlifeHit(
      wolf,
      wolfSpecies,
      1_000
    );

    expect(next).toBe(wolf);
  });
});
