/**
 * Loads and caches Spirited beta horizontal-strip textures for Pixi.
 *
 * @module components/world/beta/spirited/domains/loadingSpiritedSpritesBetaTextures
 */

import {
  buildingSpiritedSpritesBetaAnimalSheetUrl,
  DEFINING_SPIRITED_SPRITES_BETA_FRAME_COUNT,
  DEFINING_SPIRITED_SPRITES_BETA_FRAME_HEIGHT_PX,
  DEFINING_SPIRITED_SPRITES_BETA_FRAME_WIDTH_PX,
  DEFINING_SPIRITED_SPRITES_BETA_PREVIEW_FRAME_COUNT,
  resolvingSpiritedSpritesBetaAnimalDefinition,
  type DefiningSpiritedSpritesBetaAnimalId,
} from '@/components/world/beta/spirited/domains/definingSpiritedSpritesBetaCatalog';
import { Assets, Rectangle, Texture } from 'pixi.js';

export type LoadingSpiritedSpritesBetaMotionSheet = {
  readonly frames: readonly Texture[];
};

const loadingSpiritedSpritesBetaTextureCache = new Map<
  DefiningSpiritedSpritesBetaAnimalId,
  Promise<LoadingSpiritedSpritesBetaMotionSheet | null>
>();

/**
 * Loads one Spirited beta strip and slices preview frames.
 */
export function loadingSpiritedSpritesBetaTextures(
  animalId: DefiningSpiritedSpritesBetaAnimalId
): Promise<LoadingSpiritedSpritesBetaMotionSheet | null> {
  const cached = loadingSpiritedSpritesBetaTextureCache.get(animalId);
  if (cached) {
    return cached;
  }

  const pending = (async () => {
    const definition = resolvingSpiritedSpritesBetaAnimalDefinition(animalId);
    if (!definition) {
      return null;
    }

    const sheetUrl = buildingSpiritedSpritesBetaAnimalSheetUrl(
      definition.fileStem
    );
    const sheetTexture = (await Assets.load(sheetUrl)) as Texture;
    const frameCount = Math.min(
      DEFINING_SPIRITED_SPRITES_BETA_PREVIEW_FRAME_COUNT,
      DEFINING_SPIRITED_SPRITES_BETA_FRAME_COUNT,
      Math.floor(
        sheetTexture.source.width /
          DEFINING_SPIRITED_SPRITES_BETA_FRAME_WIDTH_PX
      )
    );

    const frames: Texture[] = [];
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      frames.push(
        new Texture({
          source: sheetTexture.source,
          frame: new Rectangle(
            frameIndex * DEFINING_SPIRITED_SPRITES_BETA_FRAME_WIDTH_PX,
            0,
            DEFINING_SPIRITED_SPRITES_BETA_FRAME_WIDTH_PX,
            DEFINING_SPIRITED_SPRITES_BETA_FRAME_HEIGHT_PX
          ),
        })
      );
    }

    return { frames };
  })();

  loadingSpiritedSpritesBetaTextureCache.set(animalId, pending);
  return pending;
}
