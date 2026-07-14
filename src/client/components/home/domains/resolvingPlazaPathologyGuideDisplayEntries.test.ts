import { computingPlazaPathologyStudyPoints } from '@/components/home/domains/computingPlazaPathologyStudyPoints';
import { DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaPathologyGuideConstants';
import {
  formattingPlazaPathologyCodexMenuDescription,
  resolvingPlazaPathologyGuideDisplayEntries,
} from '@/components/home/domains/resolvingPlazaPathologyGuideDisplayEntries';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaPathologyGuideDisplayEntries', () => {
  it('keeps unobtained diseases locked with zero study progress', () => {
    const entries = resolvingPlazaPathologyGuideDisplayEntries(new Set(), {
      salmonellosis: 30,
    });
    const salmonellosis = entries.find(
      (entry) => entry.diseaseId === 'salmonellosis'
    );

    expect(salmonellosis?.discoveryState).toBe('locked');
    expect(salmonellosis?.isObtained).toBe(false);
    expect(salmonellosis?.studyCount).toBe(0);
    expect(salmonellosis?.displayName).toBe('???');
  });

  it('applies floor(linked / 3) Pathology points once obtained', () => {
    const entries = resolvingPlazaPathologyGuideDisplayEntries(
      new Set(['salmonellosis']),
      { salmonellosis: 8 }
    );
    const salmonellosis = entries.find(
      (entry) => entry.diseaseId === 'salmonellosis'
    );

    expect(computingPlazaPathologyStudyPoints(8)).toBe(2);
    expect(salmonellosis?.isObtained).toBe(true);
    expect(salmonellosis?.studyCount).toBe(2);
    expect(salmonellosis?.discoveryState).toBe('studied');
    expect(salmonellosis?.displayName).toBe('Salmonellosis');
  });

  it('unlocks carrier chips only after the habitats tier', () => {
    const lockedCarriers = resolvingPlazaPathologyGuideDisplayEntries(
      new Set(['trichinellosis']),
      { trichinellosis: 12 }
    ).find((entry) => entry.diseaseId === 'trichinellosis');

    expect(lockedCarriers?.studyCount).toBe(4);
    expect(lockedCarriers?.carrierChips).toBeNull();

    const unlockedCarriers = resolvingPlazaPathologyGuideDisplayEntries(
      new Set(['trichinellosis']),
      { trichinellosis: 45 }
    ).find((entry) => entry.diseaseId === 'trichinellosis');

    expect(unlockedCarriers?.studyCount).toBe(15);
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
