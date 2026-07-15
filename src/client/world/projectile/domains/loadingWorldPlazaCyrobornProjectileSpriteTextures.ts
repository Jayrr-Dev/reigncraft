/**
 * Loads and slices the Cyroborn ice projectile sprite sheet.
 *
 * @module components/world/projectile/domains/loadingWorldPlazaCyrobornProjectileSpriteTextures
 */

import {
  checkingWorldPlazaCyrobornProjectileClipId,
  DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_CELL_SIZE_PX,
  DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_CLIP_COLUMN_INDEX,
  DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_SHEET_COLUMNS,
  DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_SHEET_URL,
  type DefiningWorldPlazaCyrobornProjectileClipId,
} from '@/components/world/projectile/domains/definingWorldPlazaCyrobornProjectileSpriteConstants';
import { Assets, Rectangle, Texture } from 'pixi.js';

const textureByClipId = new Map<
  DefiningWorldPlazaCyrobornProjectileClipId,
  Texture
>();
let preloadPromise: Promise<void> | null = null;

function slicingCyrobornProjectileSheet(sheetTexture: Texture): void {
  const cellSize = DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_CELL_SIZE_PX;

  for (const [clipId, columnIndex] of Object.entries(
    DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_CLIP_COLUMN_INDEX
  ) as ReadonlyArray<
    readonly [DefiningWorldPlazaCyrobornProjectileClipId, number]
  >) {
    if (
      columnIndex < 0 ||
      columnIndex >= DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_SHEET_COLUMNS
    ) {
      continue;
    }

    textureByClipId.set(
      clipId,
      new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(columnIndex * cellSize, 0, cellSize, cellSize),
      })
    );
  }
}

/**
 * Preloads the Cyroborn projectile sheet once. Safe to call repeatedly.
 */
export async function preloadingWorldPlazaCyrobornProjectileSpriteTextures(): Promise<void> {
  if (textureByClipId.size > 0) {
    return;
  }

  if (preloadPromise) {
    await preloadPromise;
    return;
  }

  preloadPromise = (async () => {
    const loaded = await Assets.load<Texture>(
      DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_SHEET_URL
    );

    if (!(loaded instanceof Texture)) {
      throw new Error(
        `Cyroborn projectile sheet ${DEFINING_WORLD_PLAZA_CYROBORN_PROJECTILE_SHEET_URL} did not load as a Texture.`
      );
    }

    slicingCyrobornProjectileSheet(loaded);
  })();

  try {
    await preloadPromise;
  } finally {
    preloadPromise = null;
  }
}

/**
 * Returns a cached Cyroborn projectile texture when preload finished.
 */
export function peekingWorldPlazaCyrobornProjectileSpriteTexture(
  clipId: string
): Texture | null {
  if (!checkingWorldPlazaCyrobornProjectileClipId(clipId)) {
    return null;
  }

  return textureByClipId.get(clipId) ?? null;
}
