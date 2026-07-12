import { resolvingWorldPlazaCharacterHeightDisplayText } from '@/components/world/character/domains/resolvingWorldPlazaCharacterHeightDisplayText';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaCharacterHeightDisplayText', () => {
  it('translates baseline world-layer height to imperial height', () => {
    expect(resolvingWorldPlazaCharacterHeightDisplayText(4)).toBe(`4L · 5'4"`);
  });

  it('translates grizzly world-layer height', () => {
    expect(resolvingWorldPlazaCharacterHeightDisplayText(5)).toBe(
      `5L · 6'8"`
    );
  });

  it('preserves fractional world-layer height', () => {
    expect(resolvingWorldPlazaCharacterHeightDisplayText(3.6)).toBe(
      `3.6L · 4'10"`
    );
  });
});
