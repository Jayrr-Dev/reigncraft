import type { Texture } from 'pixi.js';

/**
 * True when a Pixi texture can be bound for rendering.
 *
 * Destroyed frame textures or evicted wildlife sheets may still be referenced
 * on sprites until the next animation tick clears them.
 */
export function checkingWorldPlazaPixiTextureIsRenderable(
  texture: Texture | null | undefined
): texture is Texture {
  if (!texture || texture.destroyed) {
    return false;
  }

  const source = texture.source;

  if (!source || source.destroyed) {
    return false;
  }

  return true;
}
