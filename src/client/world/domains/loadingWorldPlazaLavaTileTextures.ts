import { Assets, Rectangle, Texture } from 'pixi.js';

/**
 * Loads and slices the Firelands lava tile sheet into animation frames.
 *
 * The sheet is one horizontal strip of square frames (8 frames at 32×32 in
 * `LavaTiles (8 frames).png`). Frame count is derived from width ÷ height.
 *
 * @module components/world/domains/loadingWorldPlazaLavaTileTextures
 */

/** Expected frame count in the Firelands lava strip (documentation / validation). */
export const LOADING_WORLD_PLAZA_LAVA_TILE_FRAME_COUNT = 8;

/** Public URL for the Firelands 8-frame lava tile animation strip. */
export const LOADING_WORLD_PLAZA_LAVA_TILE_SHEET_URL = `/firelands/${encodeURIComponent('LavaTiles (8 frames).png')}`;

/** Public URL for the static cracked-lava floor tile from the 32×32 pack. */
export const LOADING_WORLD_PLAZA_LAVA_STATIC_TILE_URL =
  '/firelands/tiles_32x32/tile_018.png';

let lavaFrameTextures: readonly Texture[] | null = null;
let lavaStaticTileTexture: Texture | null = null;
let lavaPreloadPromise: Promise<readonly Texture[]> | null = null;

function slicingWorldPlazaLavaSheetIntoFrameTextures(
  sheetTexture: Texture
): readonly Texture[] {
  sheetTexture.source.style.scaleMode = 'nearest';
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
 * Returns cached static lava tile texture when preload has populated the cache.
 */
export function peekingWorldPlazaLavaStaticTileTexture(): Texture | null {
  return lavaStaticTileTexture;
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
    const [loadedSheetTexture, loadedStaticTexture] = await Promise.all([
      Assets.load<Texture>(LOADING_WORLD_PLAZA_LAVA_TILE_SHEET_URL),
      Assets.load<Texture>(LOADING_WORLD_PLAZA_LAVA_STATIC_TILE_URL),
    ]);

    if (!(loadedSheetTexture instanceof Texture)) {
      throw new Error('Lava tile sheet did not load as a Texture.');
    }

    if (!(loadedStaticTexture instanceof Texture)) {
      throw new Error('Lava static tile did not load as a Texture.');
    }

    loadedStaticTexture.source.style.scaleMode = 'nearest';
    lavaStaticTileTexture = loadedStaticTexture;
    lavaFrameTextures =
      slicingWorldPlazaLavaSheetIntoFrameTextures(loadedSheetTexture);

    return lavaFrameTextures;
  })();

  return lavaPreloadPromise;
}
