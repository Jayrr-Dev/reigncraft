import { applyingWorldPlazaEntityDisease } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { listingWorldPlazaEntityActiveBuffHudEntries } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('listingWorldPlazaEntityActiveBuffHudEntries disease rows', () => {
  const nowMs = 1_000_000;

  it('hides disease badge during incubation', () => {
    const state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'salmonellosis',
      nowMs
    );

    const rows = listingWorldPlazaEntityActiveBuffHudEntries({
      state,
      nowMs,
      defenderModifierIds: [],
      attackerModifierIds: [],
    });

    expect(rows.find((row) => row.isDisease)).toBeUndefined();
  });

  it('shows one disease-styled row and hides internal disease buffs', () => {
    const uniformValues = [Math.exp(-0.5), 0.25, Math.exp(-0.5), 0.25];
    let uniformIndex = 0;
    const state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'salmonellosis',
      nowMs,
      () => uniformValues[uniformIndex++ % uniformValues.length]!
    );
    const symptomaticAtMs = state.diseaseEffects[0]!.symptomsStartAtMs;

    const rows = listingWorldPlazaEntityActiveBuffHudEntries({
      state,
      nowMs: symptomaticAtMs,
      worldEpochMs: symptomaticAtMs,
      defenderModifierIds: [],
      attackerModifierIds: [],
    });

    const diseaseRow = rows.find((row) => row.isDisease);
    const hiddenNauseaRow = rows.find(
      (row) => row.id === 'disease-nausea-slow-debuff'
    );

    expect(diseaseRow?.label).toBe('Salmonellosis');
    expect(diseaseRow?.isDisease).toBe(true);
    expect(hiddenNauseaRow).toBeUndefined();
  });
});
