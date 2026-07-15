/**
 * Boot-only entry for terrain texture preload.
 *
 * Kept separate from `registeringWorldPlazaTextureAssetManifest` so the world
 * loading step can dynamically import this module without fighting the many
 * static peek/preload imports that already pull the manifest into the Pixi
 * scene chunk (Vite INEFFECTIVE_DYNAMIC_IMPORT).
 *
 * @module components/world/engine/preloadingWorldPlazaBootTerrainTextures
 */

import { preloadingWorldPlazaTerrainTextureAssetManifest } from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';

/** Preloads every terrain texture asset registered in the manifest. */
export async function preloadingWorldPlazaBootTerrainTextures(): Promise<void> {
  await preloadingWorldPlazaTerrainTextureAssetManifest();
}
