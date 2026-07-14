import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityDisease } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import {
  LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_EFFECTS_TEASER,
  LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_NAME,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseHudDetailRevealConstants';
import {
  computingWorldPlazaEntityBuffHudRemainingSeconds,
  listingWorldPlazaEntityActiveBuffHudEntries,
} from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('listingWorldPlazaEntityActiveBuffHudEntries disease rows', () => {
  const nowMs = 1_000_000;

  afterEach(() => {
    vi.useRealTimers();
  });

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
      pathologyStudyCountByDiseaseId: { salmonellosis: 0 },
    });

    expect(rows.find((row) => row.isDisease)).toBeUndefined();
  });

  it('stage 1: unknown illness until Pathology field notes', () => {
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
      pathologyStudyCountByDiseaseId: { salmonellosis: 0 },
    });

    const diseaseRow = rows.find((row) => row.isDisease);

    expect(diseaseRow?.label).toBe(
      LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_NAME
    );
    expect(diseaseRow?.severityLabel).toBeUndefined();
    expect(diseaseRow?.detailLines).toEqual([]);
  });

  it('stage 2: name and flavor, mechanics still locked', () => {
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
      pathologyStudyCountByDiseaseId: { salmonellosis: 1 },
    });

    const diseaseRow = rows.find((row) => row.isDisease);

    expect(diseaseRow?.label).toBe('Salmonellosis');
    expect(diseaseRow?.severityLabel).toBe('Mild');
    expect(diseaseRow?.detailLines).toEqual([
      LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_EFFECTS_TEASER,
    ]);
  });

  it('stage 3: full mechanics and hides internal disease buffs', () => {
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
      pathologyStudyCountByDiseaseId: { salmonellosis: 5 },
    });

    const diseaseRow = rows.find((row) => row.isDisease);
    const hiddenNauseaRow = rows.find(
      (row) => row.id === 'disease-nausea-slow-debuff'
    );

    expect(diseaseRow?.label).toBe('Salmonellosis');
    expect(diseaseRow?.isDisease).toBe(true);
    expect(diseaseRow?.severityLabel).toBe('Mild');
    expect(diseaseRow?.detailLines?.length).toBeGreaterThan(0);
    expect(diseaseRow?.detailLines?.[0]).toMatch(/^Active: /);
    expect(hiddenNauseaRow).toBeUndefined();
  });

  it('counts disease remaining seconds against world epoch, not performance.now', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-09T04:00:00.000Z'));

    const wallNowMs = Date.now();
    const expiresAtMs = wallNowMs + 90_000;
    const performanceNowMs = 12_345;

    expect(
      computingWorldPlazaEntityBuffHudRemainingSeconds(
        expiresAtMs,
        performanceNowMs,
        { isDisease: true }
      )
    ).toBe(90);

    expect(
      computingWorldPlazaEntityBuffHudRemainingSeconds(
        expiresAtMs,
        performanceNowMs
      )
    ).toBeGreaterThan(1_000_000);
  });
});

describe('listingWorldPlazaEntityActiveBuffHudEntries well-fed rows', () => {
  it('puts mechanical food bonus under the flavor description', () => {
    const nowMs = 1_000_000;
    const state = applyingWorldPlazaEntityBuff(
      creatingWorldPlazaEntityHealthInitialState(),
      'well-fed-comfort-buff',
      nowMs
    );

    const rows = listingWorldPlazaEntityActiveBuffHudEntries({
      state,
      nowMs,
      defenderModifierIds: [],
      attackerModifierIds: [],
    });

    const comfortFoodRow = rows.find(
      (row) => row.id === 'well-fed-comfort-buff'
    );

    expect(comfortFoodRow?.description).toBe(
      'Chicken settles the stomach and nerves.'
    );
    expect(comfortFoodRow?.detailLines).toEqual(['Stamina regen ×1.2']);
  });
});
