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
    expect(resolvingPlazaBestiaryStudyTierId(19)).toBe('combat');
    expect(resolvingPlazaBestiaryStudyTierId(20)).toBe('procs');
    expect(resolvingPlazaBestiaryStudyTierId(49)).toBe('procs');
    expect(resolvingPlazaBestiaryStudyTierId(50)).toBe('ecology');
    expect(resolvingPlazaBestiaryStudyTierId(74)).toBe('ecology');
    expect(resolvingPlazaBestiaryStudyTierId(75)).toBe('full');
    expect(resolvingPlazaBestiaryStudyTierId(99)).toBe('full');
    expect(resolvingPlazaBestiaryStudyTierId(100)).toBe('playable');
  });

  it('reports the next unlock threshold until fully studied', () => {
    expect(resolvingPlazaBestiaryNextStudyTierUnlockKillCount(0)).toBe(1);
    expect(resolvingPlazaBestiaryNextStudyTierUnlockKillCount(1)).toBe(10);
    expect(resolvingPlazaBestiaryNextStudyTierUnlockKillCount(20)).toBe(50);
    expect(resolvingPlazaBestiaryNextStudyTierUnlockKillCount(75)).toBe(100);
    expect(resolvingPlazaBestiaryNextStudyTierUnlockKillCount(100)).toBeNull();
  });

  it('gates tier unlock checks at the configured thresholds', () => {
    expect(checkingPlazaBestiaryStudyTierUnlocked('procs', 19)).toBe(false);
    expect(checkingPlazaBestiaryStudyTierUnlocked('procs', 20)).toBe(true);
    expect(checkingPlazaBestiaryStudyTierUnlocked('full', 74)).toBe(false);
    expect(checkingPlazaBestiaryStudyTierUnlocked('full', 75)).toBe(true);
    expect(checkingPlazaBestiaryStudyTierUnlocked('playable', 99)).toBe(false);
    expect(checkingPlazaBestiaryStudyTierUnlocked('playable', 100)).toBe(true);
  });

  it('formats study progress labels', () => {
    expect(formattingPlazaBestiaryKillProgressLabel(12)).toBe(
      'Studied 12 · Next unlock at 20'
    );
    expect(formattingPlazaBestiaryKillProgressLabel(100)).toBe(
      'Studied 100 · Fully studied'
    );
  });
});
