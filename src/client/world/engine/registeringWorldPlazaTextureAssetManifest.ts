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
  '/firelands/4227f58876b6da124ab41e5f50b9e8a7.webp';

const LOADING_WORLD_PLAZA_FIRELANDS_TEXTURE_URLS: Record<
  DefiningWorldPlazaFirelandsPropKind,
  readonly string[]
> = {
  lava_tree: [
    '/firelands/Trees/LavaTree1.png',
    '/firelands/Trees/LavaTree2.png',
    '/firelands/Trees/LavaTree3.png',
    '/firelands/Trees/LavaTree4.png',
  ],
  volcanic_rock: [
    '/firelands/Rocks/VolcanicRock1.png',
    '/firelands/Rocks/VolcanicRock2.png',
    '/firelands/Rocks/VolcanicRock3.png',
    '/firelands/Rocks/VolcanicRock4.png',
  ],
  lava_plant: [
    '/firelands/Plants/LavaPlant1.png',
    '/firelands/Plants/LavaPlant2.png',
    '/firelands/Plants/LavaPlant3.png',
    '/firelands/Plants/LavaPlant4.png',
  ],
  mini_volcano: [
    '/firelands/MiniVolcans/VolcanicMound1.png',
    '/firelands/MiniVolcans/VolcanicMound2.png',
    '/firelands/MiniVolcans/VolcanicMound3.png',
    '/firelands/MiniVolcans/VolcanicMound4.png',
  ],
  volcano: [
    '/firelands/Volcano/Volcano1.png',
    '/firelands/Volcano/Volcano2.png',
    '/firelands/Volcano/Volcano3.png',
    '/firelands/Volcano/Volcano4.png',
  ],
  lava_forge: ['/firelands/Constructions/LavaForge.png'],
  lava_anvil: ['/firelands/Constructions/LavaAnvile.png'],
  lava_portal: ['/firelands/Constructions/LavaPortal.png'],
  lava_obelisk: ['/firelands/Constructions/LavaObelsik.png'],
  lava_totem: ['/firelands/Constructions/LavaTotem.png'],
  lava_fence: ['/firelands/Constructions/LavaFence.png'],
};

/** Loader for the static Firelands lava floor texture. */
export const registeringWorldPlazaLavaStaticTileTextureLoader =
  creatingWorldPlazaTextureAssetLoader({
    id: REGISTERING_WORLD_PLAZA_TEXTURE_ASSET_ID.LAVA_STATIC_TILE,
    load: async () => {
      const loadedStaticTexture = await Assets.load<Texture>(
        LOADING_WORLD_PLAZA_LAVA_STATIC_TILE_URL
      );

      if (!(loadedStaticTexture instanceof Texture)) {
        throw new Error('Lava static tile did not load as a Texture.');
      }

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

      await Promise.all(
        kindEntries.map(async ([kind, urls]) => {
          const loadedTextures = await Promise.all(
            urls.map(async (url) => {
              const loadedTexture = await Assets.load<Texture>(url);

              if (!(loadedTexture instanceof Texture)) {
                throw new Error(
                  `Firelands texture did not load as a Texture: ${url}`
                );
              }

              return loadedTexture;
            })
          );

          loadedTexturesByKind[kind] = loadedTextures;
        })
      );

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
