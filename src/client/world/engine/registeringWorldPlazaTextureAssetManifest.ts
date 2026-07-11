import type { DefiningWorldPlazaFirelandsPropKind } from '@/components/world/domains/definingWorldPlazaFirelandsRuinBlueprintConstants';
import { creatingWorldPlazaTextureAssetLoader } from '@/components/world/engine/creatingWorldPlazaTextureAssetLoader';
import { Assets, Texture } from 'pixi.js';

/**
 * Declarative texture asset manifest for terrain overlay layers.
 *
 * @module components/world/engine/registeringWorldPlazaTextureAssetManifest
 */

/** Stable texture asset ids referenced by terrain layer descriptors. */
export const REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID = {
  LAVA_STATIC_TILE: 'lava-static-tile',
  FIRELANDS_SPRITES: 'firelands-sprites',
} as const;

/** Public URL for the static lava surface texture. */
export const LOADING_WORLD_PLAZA_LAVA_STATIC_TILE_URL =
  '/fire/sprites/props/4227f58876b6da124ab41e5f50b9e8a7.webp';

/** Retries for transient Devvit webview asset 504s. */
const LOADING_WORLD_PLAZA_FIRELANDS_TEXTURE_LOAD_ATTEMPTS = 3;

/** Delay between texture load retries (ms). */
const LOADING_WORLD_PLAZA_FIRELANDS_TEXTURE_RETRY_DELAY_MS = 400;

/**
 * How many Firelands prop textures to fetch at once. Full parallel loads of
 * ~26 large PNGs trip Devvit webview gateway timeouts.
 */
const LOADING_WORLD_PLAZA_FIRELANDS_TEXTURE_CONCURRENCY = 4;

const LOADING_WORLD_PLAZA_FIRELANDS_TEXTURE_URLS: Record<
  DefiningWorldPlazaFirelandsPropKind,
  readonly string[]
> = {
  lava_tree: [
    '/fire/sprites/props/Trees/LavaTree1.webp',
    '/fire/sprites/props/Trees/LavaTree2.webp',
    '/fire/sprites/props/Trees/LavaTree3.webp',
    '/fire/sprites/props/Trees/LavaTree4.webp',
  ],
  volcanic_rock: [
    '/fire/sprites/props/Rocks/VolcanicRock1.webp',
    '/fire/sprites/props/Rocks/VolcanicRock2.webp',
    '/fire/sprites/props/Rocks/VolcanicRock3.webp',
    '/fire/sprites/props/Rocks/VolcanicRock4.webp',
  ],
  lava_plant: [
    '/fire/sprites/props/Plants/LavaPlant1.webp',
    '/fire/sprites/props/Plants/LavaPlant2.webp',
    '/fire/sprites/props/Plants/LavaPlant3.webp',
    '/fire/sprites/props/Plants/LavaPlant4.webp',
  ],
  mini_volcano: [
    '/fire/sprites/props/MiniVolcans/VolcanicMound1.webp',
    '/fire/sprites/props/MiniVolcans/VolcanicMound2.webp',
    '/fire/sprites/props/MiniVolcans/VolcanicMound3.webp',
    '/fire/sprites/props/MiniVolcans/VolcanicMound4.webp',
  ],
  volcano: [
    '/fire/sprites/props/Volcano/Volcano1.webp',
    '/fire/sprites/props/Volcano/Volcano2.webp',
    '/fire/sprites/props/Volcano/Volcano3.webp',
    '/fire/sprites/props/Volcano/Volcano4.webp',
  ],
  lava_forge: ['/fire/sprites/props/Constructions/LavaForge.webp'],
  lava_anvil: ['/fire/sprites/props/Constructions/LavaAnvile.webp'],
  lava_portal: ['/fire/sprites/props/Constructions/LavaPortal.webp'],
  lava_obelisk: ['/fire/sprites/props/Constructions/LavaObelsik.webp'],
  lava_totem: ['/fire/sprites/props/Constructions/LavaTotem.webp'],
  lava_fence: ['/fire/sprites/props/Constructions/LavaFence.webp'],
};

async function waitingWorldPlazaFirelandsTextureRetryDelayMs(
  delayMs: number
): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

/**
 * Loads one texture URL with retries for transient gateway failures.
 */
async function loadingWorldPlazaFirelandsTextureWithRetry(
  url: string
): Promise<Texture> {
  let lastError: unknown = null;

  for (
    let attempt = 1;
    attempt <= LOADING_WORLD_PLAZA_FIRELANDS_TEXTURE_LOAD_ATTEMPTS;
    attempt += 1
  ) {
    try {
      const loadedTexture = await Assets.load<Texture>(url);

      if (!(loadedTexture instanceof Texture)) {
        throw new Error(`Firelands texture did not load as a Texture: ${url}`);
      }

      return loadedTexture;
    } catch (error) {
      lastError = error;

      if (attempt < LOADING_WORLD_PLAZA_FIRELANDS_TEXTURE_LOAD_ATTEMPTS) {
        await waitingWorldPlazaFirelandsTextureRetryDelayMs(
          LOADING_WORLD_PLAZA_FIRELANDS_TEXTURE_RETRY_DELAY_MS * attempt
        );
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Failed to load Firelands texture: ${url}`);
}

/**
 * Loads texture URLs with bounded concurrency.
 */
async function loadingWorldPlazaFirelandsTexturesWithConcurrency(
  urls: readonly string[],
  concurrency: number
): Promise<Texture[]> {
  const loadedTextures: Texture[] = new Array(urls.length);
  let nextIndex = 0;

  async function loadingNextTextureWorker(): Promise<void> {
    while (nextIndex < urls.length) {
      const urlIndex = nextIndex;
      nextIndex += 1;
      loadedTextures[urlIndex] =
        await loadingWorldPlazaFirelandsTextureWithRetry(urls[urlIndex]!);
    }
  }

  const workerCount = Math.min(concurrency, Math.max(urls.length, 1));
  await Promise.all(
    Array.from({ length: workerCount }, () => loadingNextTextureWorker())
  );

  return loadedTextures;
}

/** Loader for the static Firelands lava floor texture. */
export const registeringWorldPlazaLavaStaticTileTextureLoader =
  creatingWorldPlazaTextureAssetLoader({
    id: REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID.LAVA_STATIC_TILE,
    load: async () => {
      const loadedStaticTexture =
        await loadingWorldPlazaFirelandsTextureWithRetry(
          LOADING_WORLD_PLAZA_LAVA_STATIC_TILE_URL
        );

      loadedStaticTexture.source.style.scaleMode = 'linear';
      loadedStaticTexture.source.style.addressMode = 'repeat';

      return loadedStaticTexture;
    },
  });

/** Loader for all Firelands prop sprite textures keyed by prop kind. */
export const registeringWorldPlazaFirelandsSpriteTextureLoader =
  creatingWorldPlazaTextureAssetLoader({
    id: REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID.FIRELANDS_SPRITES,
    load: async () => {
      const loadedTexturesByKind = {} as Record<
        DefiningWorldPlazaFirelandsPropKind,
        readonly Texture[]
      >;
      const kindEntries = Object.entries(
        LOADING_WORLD_PLAZA_FIRELANDS_TEXTURE_URLS
      ) as [DefiningWorldPlazaFirelandsPropKind, readonly string[]][];
      const flatUrls = kindEntries.flatMap(([, urls]) => [...urls]);
      const loadedTextures =
        await loadingWorldPlazaFirelandsTexturesWithConcurrency(
          flatUrls,
          LOADING_WORLD_PLAZA_FIRELANDS_TEXTURE_CONCURRENCY
        );

      let flatIndex = 0;

      for (const [kind, urls] of kindEntries) {
        loadedTexturesByKind[kind] = loadedTextures.slice(
          flatIndex,
          flatIndex + urls.length
        );
        flatIndex += urls.length;
      }

      return loadedTexturesByKind;
    },
  });

/** All terrain texture assets preloaded before the declarative terrain engine runs. */
export const REGISTERING_WORLD_PLAZA_TERRAIN_TEXTURE_ASSET_MANIFEST = [
  registeringWorldPlazaLavaStaticTileTextureLoader,
  registeringWorldPlazaFirelandsSpriteTextureLoader,
] as const;

/**
 * Preloads every terrain texture asset in the manifest.
 */
export async function preloadingWorldPlazaTerrainTextureAssetManifest(): Promise<void> {
  await Promise.all(
    REGISTERING_WORLD_PLAZA_TERRAIN_TEXTURE_ASSET_MANIFEST.map((loader) =>
      loader.preload()
    )
  );
}

/**
 * Returns true when every manifest texture asset has finished preloading.
 */
export function checkingWorldPlazaTerrainTextureAssetManifestIsReady(): boolean {
  return REGISTERING_WORLD_PLAZA_TERRAIN_TEXTURE_ASSET_MANIFEST.every(
    (loader) => loader.isReady()
  );
}

/**
 * Resolves one cached Firelands texture for a prop kind and variant index.
 */
export function peekingWorldPlazaFirelandsSpriteTextureForPropFromManifest(
  kind: DefiningWorldPlazaFirelandsPropKind,
  variantIndex: number
): Texture | null {
  const texturesByKind =
    registeringWorldPlazaFirelandsSpriteTextureLoader.peek();

  if (!texturesByKind) {
    return null;
  }

  const textures = texturesByKind[kind];

  if (textures.length === 0) {
    return null;
  }

  return textures[variantIndex % textures.length] ?? textures[0] ?? null;
}
