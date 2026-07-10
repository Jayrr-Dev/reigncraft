import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearingWorldPlazaAnimationClipRegistryForTests,
  listingWorldPlazaAnimationClipIds,
  registeringWorldPlazaAnimationClip,
  removingWorldPlazaAnimationClipsByPrefix,
} from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { Texture } from 'pixi.js';

describe('removingWorldPlazaAnimationClipsByPrefix', () => {
  beforeEach(() => {
    clearingWorldPlazaAnimationClipRegistryForTests();
  });

  it('removes wildlife clip ids for one species prefix', () => {
    registeringWorldPlazaAnimationClip({
      clipId: 'wildlife-giraffe-idle-Down',
      frameDurationMs: 100,
      resolveFrames: () => [Texture.EMPTY],
    });
    registeringWorldPlazaAnimationClip({
      clipId: 'wildlife-cow-idle-Down',
      frameDurationMs: 100,
      resolveFrames: () => [Texture.EMPTY],
    });

    expect(removingWorldPlazaAnimationClipsByPrefix('wildlife-giraffe-')).toBe(
      1
    );
    expect(listingWorldPlazaAnimationClipIds()).toEqual([
      'wildlife-cow-idle-Down',
    ]);
  });
});
