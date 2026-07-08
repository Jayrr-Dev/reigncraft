import { applyingWorldPlazaEntityDisease } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { listingWorldPlazaEntityActiveBuffHudEntries } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('listingWorldPlazaEntityActiveBuffHudEntries disease rows', () => {
  const nowMs = 1_000_000;

  it('shows one disease-styled row and hides internal disease buffs', () => {
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

    const diseaseRow = rows.find((row) => row.isDisease);
    const hiddenNauseaRow = rows.find(
      (row) => row.id === 'disease-nausea-slow-debuff'
    );

    expect(diseaseRow?.label).toBe('Salmonellosis');
    expect(diseaseRow?.isDisease).toBe(true);
    expect(hiddenNauseaRow).toBeUndefined();
  });
});
