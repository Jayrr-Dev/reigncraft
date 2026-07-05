import type { DefiningWorldPlazaFirelandsPropKind } from '@/components/world/domains/definingWorldPlazaFirelandsRuinBlueprintConstants';
import { Assets, Texture } from 'pixi.js';

/**
 * Loads and caches Firelands biome sprite textures from public assets.
 *
 * @module components/world/domains/loadingWorldPlazaFirelandsSpriteTextures
 */

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

let firelandsTexturesByKind: Readonly<
  Record<DefiningWorldPlazaFirelandsPropKind, readonly Texture[]>
> | null = null;
let firelandsPreloadPromise: Promise<
  Readonly<Record<DefiningWorldPlazaFirelandsPropKind, readonly Texture[]>>
> | null = null;

/**
 * Returns cached Firelands textures when preload has already populated the cache.
 */
export function peekingWorldPlazaFirelandsSpriteTextures(): Readonly<
  Record<DefiningWorldPlazaFirelandsPropKind, readonly Texture[]>
> | null {
  return firelandsTexturesByKind;
}

/**
 * Resolves one cached texture for a prop kind and variant index.
 *
 * @param kind - Prop kind.
 * @param variantIndex - Zero-based variant index.
 */
export function peekingWorldPlazaFirelandsSpriteTextureForProp(
  kind: DefiningWorldPlazaFirelandsPropKind,
  variantIndex: number
): Texture | null {
  const texturesByKind = peekingWorldPlazaFirelandsSpriteTextures();

  if (!texturesByKind) {
    return null;
  }

  const textures = texturesByKind[kind];

  if (textures.length === 0) {
    return null;
  }

  return textures[variantIndex % textures.length] ?? textures[0] ?? null;
}

/**
 * Preloads and caches all Firelands sprite textures.
 */
export async function preloadingWorldPlazaFirelandsSpriteTextures(): Promise<
  Readonly<Record<DefiningWorldPlazaFirelandsPropKind, readonly Texture[]>>
> {
  if (firelandsPreloadPromise) {
    return firelandsPreloadPromise;
  }

  firelandsPreloadPromise = (async () => {
    const loadedTexturesByKind = {} as Record<
      DefiningWorldPlazaFirelandsPropKind,
      readonly Texture[]
    >;
    const kindEntries = Object.entries(
      LOADING_WORLD_PLAZA_FIRELANDS_TEXTURE_URLS
    ) as [DefiningWorldPlazaFirelandsPropKind, readonly string[]][];

    // All textures load in parallel; sequential awaits stalled the whole
    // preload behind each individual network round trip.
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

    firelandsTexturesByKind = loadedTexturesByKind;

    return loadedTexturesByKind;
  })();

  return firelandsPreloadPromise;
}
