import { drawingWorldPlazaPlayerNightLightOuterDarknessOnGraphics } from '@/components/world/domains/drawingWorldPlazaPlayerNightLightOuterDarknessOnGraphics';
import { Graphics, RenderTexture, type Renderer, type Texture } from 'pixi.js';

/**
 * Bakes the floor-only torch darkness ring into a reusable texture.
 *
 * @module components/world/domains/creatingWorldPlazaPlayerNightLightOuterDarknessBakedTexture
 */

const CREATING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_BAKED_TEXTURE_PADDING_PX = 24;

let creatingWorldPlazaPlayerNightLightOuterDarknessBakedTextureCache: Texture | null =
  null;

/**
 * Returns a cached render texture for the floor darkness ring at full strength.
 *
 * @param renderer - Active Pixi renderer used for the one-time bake.
 */
export function resolvingWorldPlazaPlayerNightLightOuterDarknessBakedTexture(
  renderer: Renderer
): Texture {
  if (creatingWorldPlazaPlayerNightLightOuterDarknessBakedTextureCache) {
    return creatingWorldPlazaPlayerNightLightOuterDarknessBakedTextureCache;
  }

  const darknessGraphics = new Graphics();
  drawingWorldPlazaPlayerNightLightOuterDarknessOnGraphics(darknessGraphics);

  const localBounds = darknessGraphics.getLocalBounds();
  const textureWidth = Math.max(
    1,
    Math.ceil(
      localBounds.width +
        CREATING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_BAKED_TEXTURE_PADDING_PX *
          2
    )
  );
  const textureHeight = Math.max(
    1,
    Math.ceil(
      localBounds.height +
        CREATING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_BAKED_TEXTURE_PADDING_PX *
          2
    )
  );

  darknessGraphics.position.set(
    -localBounds.x +
      CREATING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_BAKED_TEXTURE_PADDING_PX,
    -localBounds.y +
      CREATING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_OUTER_DARKNESS_BAKED_TEXTURE_PADDING_PX
  );

  const renderTexture = RenderTexture.create({
    width: textureWidth,
    height: textureHeight,
  });

  renderer.render({
    container: darknessGraphics,
    target: renderTexture,
  });
  darknessGraphics.destroy();

  creatingWorldPlazaPlayerNightLightOuterDarknessBakedTextureCache =
    renderTexture;
  return renderTexture;
}
