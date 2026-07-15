import { DEFINING_PLAZA_LAPIDARY_STUDY_TIER_THRESHOLDS } from '@/components/home/domains/definingPlazaLapidaryStudyTier';
import {
  checkingPlazaLapidaryStudyTierUnlocked,
  resolvingPlazaLapidaryStudyTierId,
} from '@/components/home/domains/resolvingPlazaLapidaryStudyTier';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaLapidaryStudyTier', () => {
  it('maps study counts onto legacy ids via the unified ladder', () => {
    expect(resolvingPlazaLapidaryStudyTierId(0)).toBe('sighted');
    expect(resolvingPlazaLapidaryStudyTierId(1)).toBe('sighted');
    expect(resolvingPlazaLapidaryStudyTierId(5)).toBe('fieldNotes');
    expect(resolvingPlazaLapidaryStudyTierId(20)).toBe('properties');
    expect(resolvingPlazaLapidaryStudyTierId(50)).toBe('habitats');
    expect(resolvingPlazaLapidaryStudyTierId(100)).toBe('full');
  });

  it('unlocks full dossier at mastery (100)', () => {
    expect(DEFINING_PLAZA_LAPIDARY_STUDY_TIER_THRESHOLDS.full).toBe(100);
    expect(
      checkingPlazaLapidaryStudyTierUnlocked(
        'full',
        DEFINING_PLAZA_LAPIDARY_STUDY_TIER_THRESHOLDS.full
      )
    ).toBe(true);
    expect(
      checkingPlazaLapidaryStudyTierUnlocked(
        'full',
        DEFINING_PLAZA_LAPIDARY_STUDY_TIER_THRESHOLDS.full - 1
      )
    ).toBe(false);
  });
});
