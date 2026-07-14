/**
 * Lazy per-species texture loader for NPC sprite sheets.
 *
 * @module components/world/npc/domains/loadingNpcSpeciesTextures
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaGirlSampleWalkDirectionTextures } from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';
import type { DefiningNpcSpeciesDefinition } from '@/components/world/npc/domains/definingNpcSpeciesRegistry';
import type { DefiningNpcLoadedMotionClipKind } from '@/components/world/npc/domains/definingNpcSpriteSheetLayout';
import {
  buildingNpcMotionSheetUrls,
  DEFINING_NPC_DIRECTION_ROW_INDEX,
  DEFINING_NPC_SHEET_COLUMN_COUNT,
  DEFINING_NPC_SHEET_ROW_COUNT,
} from '@/components/world/npc/domains/definingNpcSpriteSheetLayout';
import { Assets, Rectangle, Texture } from 'pixi.js';

export type DefiningNpcMotionDirectionTextures =
  DefiningWorldPlazaGirlSampleWalkDirectionTextures;

export type DefiningNpcMotionSheet = {
  directionTextures: DefiningNpcMotionDirectionTextures;
  frameWidthPx: number;
  frameHeightPx: number;
};

export type DefiningNpcSpeciesTextures = Record<
  DefiningNpcLoadedMotionClipKind,
  DefiningNpcMotionSheet
>;

const DEFINING_NPC_MOTION_CLIP_KINDS_LIST: readonly DefiningNpcLoadedMotionClipKind[] =
  ['idle', 'walk', 'run', 'attack', 'takeDamage', 'die'];

const loadingNpcSpeciesTexturesCache = new Map<
  string,
  Promise<DefiningNpcSpeciesTextures>
>();

const loadingNpcSpeciesTexturesResolved = new Map<
  string,
  DefiningNpcSpeciesTextures
>();

function slicingNpcSheetIntoDirectionRows(
  sheetTexture: Texture
): DefiningNpcMotionSheet {
  const frameWidthPx = Math.floor(
    sheetTexture.source.width / DEFINING_NPC_SHEET_COLUMN_COUNT
  );
  const frameHeightPx = Math.floor(
    sheetTexture.source.height / DEFINING_NPC_SHEET_ROW_COUNT
  );

  const directionEntries = Object.entries(DEFINING_NPC_DIRECTION_ROW_INDEX) as Array<
    [DefiningWorldPlazaGirlSampleWalkDirection, number]
  >;

  const directionTextureEntries = directionEntries.map(
    ([direction, rowIndex]) => {
      const rowTexture = new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          0,
          rowIndex * frameHeightPx,
          frameWidthPx * DEFINING_NPC_SHEET_COLUMN_COUNT,
          frameHeightPx
        ),
      });

      return [direction, rowTexture] as const;
    }
  );

  return {
    directionTextures: Object.fromEntries(
      directionTextureEntries
    ) as DefiningNpcMotionDirectionTextures,
    frameWidthPx,
    frameHeightPx,
  };
}

type DefiningNpcLoadedSheet = {
  readonly texture: Texture;
  readonly sheetUrl: string;
};

async function loadingNpcSheetWithFallback(
  sheetUrls: readonly string[]
): Promise<DefiningNpcLoadedSheet> {
  let lastError: unknown = null;

  for (const sheetUrl of sheetUrls) {
    try {
      const loadedTexture = await Assets.load<Texture>(sheetUrl);

      if (loadedTexture instanceof Texture) {
        return { texture: loadedTexture, sheetUrl };
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `NPC sheets failed to load: ${sheetUrls.join(', ')} (${String(lastError)})`
  );
}

async function loadingNpcMotionSheet(
  species: DefiningNpcSpeciesDefinition,
  motionKind: DefiningNpcLoadedMotionClipKind
): Promise<DefiningNpcLoadedSheet & { sheet: DefiningNpcMotionSheet }> {
  const sheetUrls = buildingNpcMotionSheetUrls(
    species.spriteFolder,
    motionKind
  );
  const loaded = await loadingNpcSheetWithFallback(sheetUrls);

  return {
    ...loaded,
    sheet: slicingNpcSheetIntoDirectionRows(loaded.texture),
  };
}

/** Loads all motion direction textures for one NPC species (cached). */
export function loadingNpcSpeciesTextures(
  species: DefiningNpcSpeciesDefinition
): Promise<DefiningNpcSpeciesTextures> {
  const cacheKey = species.speciesId;
  const cached = loadingNpcSpeciesTexturesCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const loadingPromise = (async (): Promise<DefiningNpcSpeciesTextures> => {
    const idleLoaded = await loadingNpcMotionSheet(species, 'idle');
    const requiredMotionKinds = DEFINING_NPC_MOTION_CLIP_KINDS_LIST.filter(
      (motionKind) => motionKind !== 'idle'
    );
    const motionEntries = await Promise.all(
      requiredMotionKinds.map(async (motionKind) => {
        try {
          const loaded = await loadingNpcMotionSheet(species, motionKind);
          return [motionKind, loaded.sheet] as const;
        } catch {
          return [motionKind, idleLoaded.sheet] as const;
        }
      })
    );

    const textures = {
      idle: idleLoaded.sheet,
      ...Object.fromEntries(motionEntries),
    } as DefiningNpcSpeciesTextures;

    loadingNpcSpeciesTexturesResolved.set(cacheKey, textures);

    return textures;
  })();

  loadingNpcSpeciesTexturesCache.set(cacheKey, loadingPromise);

  return loadingPromise;
}

/** Returns already-resolved textures without waiting, or null. */
export function peekingNpcSpeciesTextures(
  speciesId: string
): DefiningNpcSpeciesTextures | null {
  return loadingNpcSpeciesTexturesResolved.get(speciesId) ?? null;
}
