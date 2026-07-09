/**
 * Loads and caches 8-direction tool sprite sheets for held-item overlays.
 *
 * @module components/world/equipment/domains/loadingWorldPlazaHeldItemTextures
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { computingWorldPlazaHeldItemFrameRect } from '@/components/world/equipment/domains/computingWorldPlazaHeldItemFrameRect';
import {
  DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_REGISTRY,
  type DefiningWorldPlazaHeldItemPresentation,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry';
import type {
  DefiningWorldPlazaHeldItemTier,
  DefiningWorldPlazaHeldItemVisualId,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import { Assets, Texture } from 'pixi.js';

const heldItemSheetTextureCache = new Map<
  DefiningWorldPlazaHeldItemVisualId,
  Texture
>();

const heldItemFrameTextureCache = new Map<string, Texture>();

function buildingHeldItemFrameCacheKey(
  visualId: DefiningWorldPlazaHeldItemVisualId,
  direction: DefiningWorldPlazaGirlSampleWalkDirection,
  tier: DefiningWorldPlazaHeldItemTier
): string {
  return `${visualId}:${direction}:${tier}`;
}

/**
 * Loads one tool sheet texture (cached per visual id).
 */
export async function loadingWorldPlazaHeldItemSheetTexture(
  visualId: DefiningWorldPlazaHeldItemVisualId
): Promise<Texture> {
  const cached = heldItemSheetTextureCache.get(visualId);

  if (cached) {
    return cached;
  }

  const sheetUrl =
    DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_REGISTRY[visualId].sheetUrl;
  const loadedTexture = await Assets.load<Texture>(sheetUrl);

  if (!(loadedTexture instanceof Texture)) {
    throw new Error(`Held item sheet ${sheetUrl} did not load as a Texture.`);
  }

  heldItemSheetTextureCache.set(visualId, loadedTexture);

  return loadedTexture;
}

/**
 * Resolves a framed held-item texture for direction and tier (cached).
 */
export async function resolvingWorldPlazaHeldItemFrameTexture(
  presentation: DefiningWorldPlazaHeldItemPresentation,
  direction: DefiningWorldPlazaGirlSampleWalkDirection
): Promise<Texture> {
  const cacheKey = buildingHeldItemFrameCacheKey(
    presentation.visualId,
    direction,
    presentation.tier
  );
  const cached = heldItemFrameTextureCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const sheetTexture = await loadingWorldPlazaHeldItemSheetTexture(
    presentation.visualId
  );
  const frameRect = computingWorldPlazaHeldItemFrameRect(
    direction,
    presentation.tier
  );
  const frameTexture = new Texture({
    source: sheetTexture.source,
    frame: frameRect,
  });

  heldItemFrameTextureCache.set(cacheKey, frameTexture);

  return frameTexture;
}

/**
 * Preloads every shipped tool sheet.
 */
export async function preloadingWorldPlazaHeldItemSheetTextures(): Promise<void> {
  await Promise.all(
    Object.keys(DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_REGISTRY).map(
      (visualId) =>
        loadingWorldPlazaHeldItemSheetTexture(
          visualId as DefiningWorldPlazaHeldItemVisualId
        )
    )
  );
}
