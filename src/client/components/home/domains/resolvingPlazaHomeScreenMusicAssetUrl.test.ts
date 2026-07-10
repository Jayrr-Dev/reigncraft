import { resolvingPlazaHomeScreenMusicAssetUrl } from '@/components/home/domains/resolvingPlazaHomeScreenMusicAssetUrl';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaHomeScreenMusicAssetUrl', () => {
  it('matches the game.html preload href', () => {
    expect(resolvingPlazaHomeScreenMusicAssetUrl()).toBe(
      '/Cozy%20Tunes%20v1.5.3/Cozy%20Tunes/Audio/ogg/Chickens%20In%20The%20Meadow.ogg'
    );
  });
});
