import { DEFINING_PLAZA_LAPIDARY_STUDY_TIER_THRESHOLDS } from '@/components/home/domains/definingPlazaLapidaryStudyTier';
import {
  checkingPlazaLapidaryStudyTierUnlocked,
  resolvingPlazaLapidaryStudyTierId,
} from '@/components/home/domains/resolvingPlazaLapidaryStudyTier';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaLapidaryStudyTier', () => {
  it('maps study counts to the same thresholds as Herbarium', () => {
    expect(resolvingPlazaLapidaryStudyTierId(0)).toBe('sighted');
    expect(resolvingPlazaLapidaryStudyTierId(1)).toBe('fieldNotes');
    expect(resolvingPlazaLapidaryStudyTierId(5)).toBe('properties');
    expect(resolvingPlazaLapidaryStudyTierId(15)).toBe('habitats');
    expect(resolvingPlazaLapidaryStudyTierId(25)).toBe('full');
  });

  it('unlocks full dossier at the shared full threshold', () => {
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
