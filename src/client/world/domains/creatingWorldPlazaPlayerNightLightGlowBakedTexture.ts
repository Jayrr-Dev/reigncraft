import { applyingWorldPlazaPlayerNightLightGlowFiltersOnGraphics } from '@/components/world/domains/applyingWorldPlazaPlayerNightLightGlowFiltersOnGraphics';
import { drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics } from '@/components/world/domains/drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics';
import { Graphics, RenderTexture, type Renderer, type Texture } from 'pixi.js';

/**
 * Bakes the torch ground glow (gradient + blur) into a reusable texture.
 *
 * @module components/world/domains/creatingWorldPlazaPlayerNightLightGlowBakedTexture
 */

const CREATING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BAKED_TEXTURE_PADDING_PX = 20;

let creatingWorldPlazaPlayerNightLightGlowBakedTextureCache: Texture | null =
  null;

/**
 * Returns a cached render texture for the warm torch pool at full brightness.
 *
 * Alpha is applied on the sprite so brightness can change without rebaking.
 *
 * @param renderer - Active Pixi renderer used for the one-time bake.
 */
export function resolvingWorldPlazaPlayerNightLightGlowBakedTexture(
  renderer: Renderer
): Texture {
  if (creatingWorldPlazaPlayerNightLightGlowBakedTextureCache) {
    return creatingWorldPlazaPlayerNightLightGlowBakedTextureCache;
  }

  const glowGraphics = new Graphics();
  glowGraphics.blendMode = 'screen';
  drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics(glowGraphics, 1);
  applyingWorldPlazaPlayerNightLightGlowFiltersOnGraphics(glowGraphics);

  const localBounds = glowGraphics.getLocalBounds();
  const textureWidth = Math.max(
    1,
    Math.ceil(
      localBounds.width +
        CREATING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BAKED_TEXTURE_PADDING_PX *
          2
    )
  );
  const textureHeight = Math.max(
    1,
    Math.ceil(
      localBounds.height +
        CREATING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BAKED_TEXTURE_PADDING_PX *
          2
    )
  );

  glowGraphics.position.set(
    -localBounds.x +
      CREATING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BAKED_TEXTURE_PADDING_PX,
    -localBounds.y +
      CREATING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_GLOW_BAKED_TEXTURE_PADDING_PX
  );

  const renderTexture = RenderTexture.create({
    width: textureWidth,
    height: textureHeight,
  });

  renderer.render({
    container: glowGraphics,
    target: renderTexture,
  });
  glowGraphics.destroy();

  creatingWorldPlazaPlayerNightLightGlowBakedTextureCache = renderTexture;
  return renderTexture;
}
