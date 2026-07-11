import { resolvingPlazaHomeScreenMusicAssetUrl } from '@/components/home/domains/resolvingPlazaHomeScreenMusicAssetUrl';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaHomeScreenMusicAssetUrl', () => {
  it('matches the game.html preload href', () => {
    expect(resolvingPlazaHomeScreenMusicAssetUrl()).toBe(
      '/environment/music/cozy-tunes/Chickens%20In%20The%20Meadow.ogg'
    );
  });
});
