import { applyingWorldPlazaDeclarativeAnimationFrameToSprite } from '@/components/world/animation/domains/resolvingWorldPlazaDeclarativeAnimationFrame';
import { Texture } from 'pixi.js';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaDeclarativeAnimationFrameToSprite', () => {
  it('falls back to Texture.EMPTY when the frame texture was destroyed', () => {
    const destroyedTexture = new Texture();
    destroyedTexture.destroy(false);

    const sprite = { texture: destroyedTexture } as {
      texture: Texture;
    };

    applyingWorldPlazaDeclarativeAnimationFrameToSprite(sprite, {
      texture: destroyedTexture,
      frameIndex: 0,
      frameCount: 1,
      isComplete: false,
    });

    expect(sprite.texture).toBe(Texture.EMPTY);
    expect(sprite.texture.destroyed).toBe(false);
  });
});
