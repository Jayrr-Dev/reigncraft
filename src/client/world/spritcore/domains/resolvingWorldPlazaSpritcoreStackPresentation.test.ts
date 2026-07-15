import { resolvingWorldPlazaSpritcoreStackPresentation } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreStackPresentation';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaSpritcoreStackPresentation', () => {
  it('bands sprite column and name by stack quantity', () => {
    expect(resolvingWorldPlazaSpritcoreStackPresentation(7)).toMatchObject({
      displayName: 'Faint Spritcore',
      overlayColor: null,
    });
    expect(
      resolvingWorldPlazaSpritcoreStackPresentation(7).iconSpriteSheet
        .columnIndex
    ).toBe(0);

    expect(resolvingWorldPlazaSpritcoreStackPresentation(95)).toMatchObject({
      displayName: 'Strong Spritcore',
      overlayColor: null,
    });
    expect(
      resolvingWorldPlazaSpritcoreStackPresentation(95).iconSpriteSheet
        .columnIndex
    ).toBe(2);
  });

  it('uses crimson overlay after the violet cycle', () => {
    expect(resolvingWorldPlazaSpritcoreStackPresentation(241)).toMatchObject({
      displayName: 'Crimson Faint Spritcore',
      overlayColor: '#e11d48',
    });
  });
});
