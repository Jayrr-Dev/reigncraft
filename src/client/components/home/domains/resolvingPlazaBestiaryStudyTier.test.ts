import { describe, expect, it } from 'vitest';

import {
  checkingPlazaBestiaryStudyTierUnlocked,
  formattingPlazaBestiaryKillProgressLabel,
  resolvingPlazaBestiaryNextStudyTierUnlockKillCount,
  resolvingPlazaBestiaryStudyTierId,
} from '@/components/home/domains/resolvingPlazaBestiaryStudyTier';

describe('resolvingPlazaBestiaryStudyTier', () => {
  it('maps study counts to the highest unlocked tier', () => {
    expect(resolvingPlazaBestiaryStudyTierId(0)).toBe('sighted');
    expect(resolvingPlazaBestiaryStudyTierId(1)).toBe('studied');
    expect(resolvingPlazaBestiaryStudyTierId(9)).toBe('studied');
    expect(resolvingPlazaBestiaryStudyTierId(10)).toBe('combat');
    expect(resolvingPlazaBestiaryStudyTierId(49)).toBe('combat');
    expect(resolvingPlazaBestiaryStudyTierId(50)).toBe('procs');
    expect(resolvingPlazaBestiaryStudyTierId(99)).toBe('procs');
    expect(resolvingPlazaBestiaryStudyTierId(100)).toBe('ecology');
    expect(resolvingPlazaBestiaryStudyTierId(199)).toBe('ecology');
    expect(resolvingPlazaBestiaryStudyTierId(200)).toBe('full');
  });

  it('reports the next unlock threshold until fully studied', () => {
    expect(resolvingPlazaBestiaryNextStudyTierUnlockKillCount(0)).toBe(1);
    expect(resolvingPlazaBestiaryNextStudyTierUnlockKillCount(1)).toBe(10);
    expect(resolvingPlazaBestiaryNextStudyTierUnlockKillCount(50)).toBe(100);
    expect(resolvingPlazaBestiaryNextStudyTierUnlockKillCount(200)).toBeNull();
  });

  it('gates tier unlock checks at the configured thresholds', () => {
    expect(checkingPlazaBestiaryStudyTierUnlocked('procs', 49)).toBe(false);
    expect(checkingPlazaBestiaryStudyTierUnlocked('procs', 50)).toBe(true);
    expect(checkingPlazaBestiaryStudyTierUnlocked('full', 199)).toBe(false);
    expect(checkingPlazaBestiaryStudyTierUnlocked('full', 200)).toBe(true);
  });

  it('formats study progress labels', () => {
    expect(formattingPlazaBestiaryKillProgressLabel(12)).toBe(
      'Studied 12 · Next unlock at 50'
    );
    expect(formattingPlazaBestiaryKillProgressLabel(200)).toBe(
      'Studied 200 · Fully studied'
    );
  });
});
