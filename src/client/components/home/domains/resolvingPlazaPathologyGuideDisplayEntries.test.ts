import { computingPlazaPathologyTotalStudyPoints } from '@/components/home/domains/computingPlazaPathologyStudyPoints';
import { DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaPathologyGuideConstants';
import {
  formattingPlazaPathologyCodexMenuDescription,
  resolvingPlazaPathologyGuideDisplayEntries,
} from '@/components/home/domains/resolvingPlazaPathologyGuideDisplayEntries';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaPathologyGuideDisplayEntries', () => {
  it('keeps unobtained diseases locked with zero study progress', () => {
    const entries = resolvingPlazaPathologyGuideDisplayEntries(
      new Set(),
      { salmonellosis: 30 },
      { salmonellosis: 10 }
    );
    const salmonellosis = entries.find(
      (entry) => entry.diseaseId === 'salmonellosis'
    );

    expect(salmonellosis?.discoveryState).toBe('locked');
    expect(salmonellosis?.isObtained).toBe(false);
    expect(salmonellosis?.studyCount).toBe(0);
    expect(salmonellosis?.displayName).toBe('???');
  });

  it('applies floor(linked / 3) plus infection hours once obtained', () => {
    const entries = resolvingPlazaPathologyGuideDisplayEntries(
      new Set(['salmonellosis']),
      { salmonellosis: 8 },
      { salmonellosis: 3 }
    );
    const salmonellosis = entries.find(
      (entry) => entry.diseaseId === 'salmonellosis'
    );

    expect(computingPlazaPathologyTotalStudyPoints(8, 3)).toBe(5);
    expect(salmonellosis?.isObtained).toBe(true);
    expect(salmonellosis?.studyCount).toBe(5);
    expect(salmonellosis?.infectionStudyPoints).toBe(3);
    expect(salmonellosis?.discoveryState).toBe('studied');
    expect(salmonellosis?.displayName).toBe('Salmonellosis');
  });

  it('unlocks carrier chips only after proficiency', () => {
    const lockedCarriers = resolvingPlazaPathologyGuideDisplayEntries(
      new Set(['trichinellosis']),
      { trichinellosis: 12 }
    ).find((entry) => entry.diseaseId === 'trichinellosis');

    expect(lockedCarriers?.studyCount).toBe(4);
    expect(lockedCarriers?.isStudied).toBe(true);
    expect(lockedCarriers?.carrierChips).toBeNull();

    const unlockedCarriers = resolvingPlazaPathologyGuideDisplayEntries(
      new Set(['trichinellosis']),
      {},
      { trichinellosis: 50 }
    ).find((entry) => entry.diseaseId === 'trichinellosis');

    expect(unlockedCarriers?.studyCount).toBe(50);
    expect(unlockedCarriers?.studyTierId).toBe('proficiency');
    expect(unlockedCarriers?.carrierChips?.length).toBeGreaterThan(0);
  });
});

describe('formattingPlazaPathologyCodexMenuDescription', () => {
  it('formats progress copy', () => {
    const total = DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES.length;

    expect(formattingPlazaPathologyCodexMenuDescription(0, total)).toBe(
      'No diseases logged yet'
    );
    expect(formattingPlazaPathologyCodexMenuDescription(2, total)).toBe(
      `2 of ${total} diseases logged`
    );
    expect(formattingPlazaPathologyCodexMenuDescription(total, total)).toBe(
      `All ${total} diseases logged`
    );
  });
});
