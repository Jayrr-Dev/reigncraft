import { resolvingPlazaHomeScreenMusicAssetUrl } from '@/components/home/domains/resolvingPlazaHomeScreenMusicAssetUrl';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaHomeScreenMusicAssetUrl', () => {
  it('matches the game.html preload href', () => {
    expect(resolvingPlazaHomeScreenMusicAssetUrl()).toBe(
      '/environment/music/cozy-tunes/chickens-in-the-meadow.ogg'
    );
  });
});
