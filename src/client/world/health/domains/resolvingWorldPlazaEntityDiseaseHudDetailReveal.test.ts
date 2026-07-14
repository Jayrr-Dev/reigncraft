import {
  resolvingWorldPlazaEntityDiseaseHudDetailReveal,
  resolvingWorldPlazaEntityDiseaseHudTooltipContent,
} from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseHudDetailReveal';
import {
  LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_EFFECTS_TEASER,
  LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_DESCRIPTION,
  LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_NAME,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseHudDetailRevealConstants';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEntityDiseaseHudDetailReveal', () => {
  it('locks identity and mechanics at sighted (0)', () => {
    expect(resolvingWorldPlazaEntityDiseaseHudDetailReveal(0)).toEqual({
      showName: false,
      showSeverity: false,
      showDescription: false,
      showEffectLines: false,
    });
  });

  it('unlocks name and flavor at field notes (1)', () => {
    expect(resolvingWorldPlazaEntityDiseaseHudDetailReveal(1)).toEqual({
      showName: true,
      showSeverity: true,
      showDescription: true,
      showEffectLines: false,
    });
  });

  it('unlocks mechanical stages at properties (5)', () => {
    expect(resolvingWorldPlazaEntityDiseaseHudDetailReveal(5)).toEqual({
      showName: true,
      showSeverity: true,
      showDescription: true,
      showEffectLines: true,
    });
  });
});

describe('resolvingWorldPlazaEntityDiseaseHudTooltipContent', () => {
  const detail = {
    severityLabel: 'Severe',
    effectLines: [
      'Active: Muscle Lock',
      '3 in-game hours: venomous poison · 45% max HP over 8 in-game hours',
    ],
  };

  it('stage 1: unknown illness only', () => {
    expect(
      resolvingWorldPlazaEntityDiseaseHudTooltipContent({
        trueLabel: 'Trichinellosis',
        trueDescription: 'Muscle worms from raw pork.',
        detail,
        studyCount: 0,
      })
    ).toEqual({
      label: LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_NAME,
      description: LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_DESCRIPTION,
      severityLabel: undefined,
      detailLines: [],
    });
  });

  it('stage 2: name and flavor, mechanics teaser', () => {
    expect(
      resolvingWorldPlazaEntityDiseaseHudTooltipContent({
        trueLabel: 'Trichinellosis',
        trueDescription: 'Muscle worms from raw pork.',
        detail,
        studyCount: 1,
      })
    ).toEqual({
      label: 'Trichinellosis',
      description: 'Muscle worms from raw pork.',
      severityLabel: 'Severe',
      detailLines: [LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_EFFECTS_TEASER],
    });
  });

  it('stage 3: full mechanical lines', () => {
    expect(
      resolvingWorldPlazaEntityDiseaseHudTooltipContent({
        trueLabel: 'Trichinellosis',
        trueDescription: 'Muscle worms from raw pork.',
        detail,
        studyCount: 5,
      })
    ).toEqual({
      label: 'Trichinellosis',
      description: 'Muscle worms from raw pork.',
      severityLabel: 'Severe',
      detailLines: detail.effectLines,
    });
  });
});
