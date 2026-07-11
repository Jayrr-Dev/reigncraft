import { resolvingWildlifeVocalSfxConcurrencyAction } from '@/components/world/wildlife/domains/resolvingWildlifeVocalSfxConcurrencyAction';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeVocalSfxConcurrencyAction', () => {
  it('plays when the animal has no active vocal', () => {
    expect(resolvingWildlifeVocalSfxConcurrencyAction(null, 3)).toBe('play');
  });

  it('skips a repeated attack while the previous attack vocal plays', () => {
    expect(resolvingWildlifeVocalSfxConcurrencyAction(3, 3)).toBe('skip');
  });

  it('skips a lower-priority idle call during combat audio', () => {
    expect(resolvingWildlifeVocalSfxConcurrencyAction(3, 0)).toBe('skip');
  });

  it('interrupts an idle call for an attack vocal', () => {
    expect(resolvingWildlifeVocalSfxConcurrencyAction(0, 3)).toBe('interrupt');
  });
});
