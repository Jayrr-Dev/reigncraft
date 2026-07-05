import { Assets, Rectangle, Texture } from 'pixi.js';

/**
 * Loads and slices the lava tile sheet into square frames.
 *
 * The sheet is one horizontal strip of square frames, so the frame count is
 * derived from the sheet's width-to-height ratio. A square sheet yields a
 * single frame, which renders as a static (non-animated) lava surface.
 *
 * @module components/world/domains/loadingWorldPlazaLavaTileTextures
 */

/** Public URL for the lava tile sheet (square Firelands texture, one frame). */
export const LOADING_WORLD_PLAZA_LAVA_TILE_SHEET_URL =
  '/firelands/Tiles/Lava_SIDES_Texture.png';

let lavaFrameTextures: readonly Texture[] | null = null;
let lavaPreloadPromise: Promise<readonly Texture[]> | null = null;

function slicingWorldPlazaLavaSheetIntoFrameTextures(
  sheetTexture: Texture
): readonly Texture[] {
  const frameSize = sheetTexture.height;
  const frameCount = Math.max(1, Math.floor(sheetTexture.width / frameSize));
  const frames: Texture[] = [];

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    frames.push(
      new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(frameIndex * frameSize, 0, frameSize, frameSize),
      })
    );
  }

  return frames;
}

/**
 * Returns cached lava frames when preload has already populated the cache.
 */
export function peekingWorldPlazaLavaTileFrameTextures():
  | readonly Texture[]
  | null {
  return lavaFrameTextures;
}

/**
 * Preloads and caches the lava tile animation frames.
 */
export async function preloadingWorldPlazaLavaTileTextures(): Promise<
  readonly Texture[]
> {
  if (lavaPreloadPromise) {
    return lavaPreloadPromise;
  }

  lavaPreloadPromise = (async () => {
    const loadedTexture = await Assets.load<Texture>(
      LOADING_WORLD_PLAZA_LAVA_TILE_SHEET_URL
    );

    if (!(loadedTexture instanceof Texture)) {
      throw new Error('Lava tile sheet did not load as a Texture.');
    }

    lavaFrameTextures =
      slicingWorldPlazaLavaSheetIntoFrameTextures(loadedTexture);

    return lavaFrameTextures;
  })();

  return lavaPreloadPromise;
}
