/**
 * Loads animal playable avatar locomotion sheets via wildlife URL rules.
 *
 * @module components/world/domains/loadingWorldPlazaAnimalAvatarCharacterTextures
 */

import { resolvingWorldPlazaAnimalPlayableAvatarSkinRow } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type {
  DefiningWorldPlazaGirlSampleCharacterTextures,
  DefiningWorldPlazaGirlSampleWalkDirectionTextures,
} from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';
import { resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId } from '@/components/world/domains/resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId';
import {
  buildingWildlifeMotionSheetUrls,
  DEFINING_WILDLIFE_DIRECTION_ROW_INDEX,
  DEFINING_WILDLIFE_SHEET_COLUMN_COUNT,
  DEFINING_WILDLIFE_SHEET_ROW_COUNT,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import { Assets, Rectangle, Texture } from 'pixi.js';

const loadingWorldPlazaAnimalAvatarCharacterTexturesPromises = new Map<
  string,
  Promise<DefiningWorldPlazaGirlSampleCharacterTextures>
>();

const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_JUMP_SHEET_FILE_NAMES = [
  'Jump_Shadowless.webp',
  'Run_Shadowless.webp',
  'Walk_Shadowless.webp',
] as const;

async function loadingWorldPlazaAnimalAvatarSheetWithFallback(
  sheetUrls: readonly string[]
): Promise<Texture> {
  let lastError: unknown = null;

  for (const sheetUrl of sheetUrls) {
    try {
      const loadedTexture = await Assets.load<Texture>(sheetUrl);

      if (loadedTexture instanceof Texture) {
        return loadedTexture;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `Animal avatar sheets failed to load: ${sheetUrls.join(', ')} (${String(lastError)})`
  );
}

function slicingWorldPlazaAnimalAvatarSheetIntoDirectionTextures(
  sheetTexture: Texture
): DefiningWorldPlazaGirlSampleWalkDirectionTextures {
  const frameWidthPx = Math.floor(
    sheetTexture.source.width / DEFINING_WILDLIFE_SHEET_COLUMN_COUNT
  );
  const frameHeightPx = Math.floor(
    sheetTexture.source.height / DEFINING_WILDLIFE_SHEET_ROW_COUNT
  );
  const sheetRowWidthPx = frameWidthPx * DEFINING_WILDLIFE_SHEET_COLUMN_COUNT;

  const directionEntries = Object.entries(
    DEFINING_WILDLIFE_DIRECTION_ROW_INDEX
  ) as Array<[DefiningWorldPlazaGirlSampleWalkDirection, number]>;

  const directionTextureEntries = directionEntries.map(
    ([direction, rowIndex]) => {
      const rowTexture = new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          0,
          rowIndex * frameHeightPx,
          sheetRowWidthPx,
          frameHeightPx
        ),
      });

      return [direction, rowTexture] as const;
    }
  );

  return Object.fromEntries(
    directionTextureEntries
  ) as DefiningWorldPlazaGirlSampleWalkDirectionTextures;
}

function buildingWorldPlazaAnimalAvatarJumpSheetUrls(
  spriteFolder: string
): readonly string[] {
  const encodedFolder = spriteFolder
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_JUMP_SHEET_FILE_NAMES.map(
    (fileName) => `/creatures/sprites/species/${encodedFolder}/${fileName}`
  );
}

/**
 * Loads walk, run, idle, and jump direction textures for one animal playable skin.
 */
export function loadingWorldPlazaAnimalAvatarCharacterTextures(
  skinId: string
): Promise<DefiningWorldPlazaGirlSampleCharacterTextures> {
  const cachedPromise =
    loadingWorldPlazaAnimalAvatarCharacterTexturesPromises.get(skinId);

  if (cachedPromise) {
    return cachedPromise;
  }

  const skinRow = resolvingWorldPlazaAnimalPlayableAvatarSkinRow(skinId);

  if (!skinRow) {
    return Promise.reject(
      new Error(`No animal playable skin registry row for ${skinId}.`)
    );
  }

  const wildlifeSpeciesId =
    resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId(
      skinRow.spriteFolder
    );

  const loadingPromise = (async () => {
    const [walkTexture, runTexture, idleTexture] = await Promise.all([
      loadingWorldPlazaAnimalAvatarSheetWithFallback(
        buildingWildlifeMotionSheetUrls(
          skinRow.spriteFolder,
          'walk',
          wildlifeSpeciesId
        )
      ),
      loadingWorldPlazaAnimalAvatarSheetWithFallback(
        buildingWildlifeMotionSheetUrls(
          skinRow.spriteFolder,
          'run',
          wildlifeSpeciesId
        )
      ),
      loadingWorldPlazaAnimalAvatarSheetWithFallback(
        buildingWildlifeMotionSheetUrls(
          skinRow.spriteFolder,
          'idle',
          wildlifeSpeciesId
        )
      ),
    ]);

    const jumpTexture =
      skinRow.jumpSource === 'jump'
        ? await loadingWorldPlazaAnimalAvatarSheetWithFallback(
            buildingWorldPlazaAnimalAvatarJumpSheetUrls(skinRow.spriteFolder)
          )
        : runTexture;

    return {
      walk: slicingWorldPlazaAnimalAvatarSheetIntoDirectionTextures(
        walkTexture
      ),
      run: slicingWorldPlazaAnimalAvatarSheetIntoDirectionTextures(runTexture),
      idle: slicingWorldPlazaAnimalAvatarSheetIntoDirectionTextures(
        idleTexture
      ),
      jump: slicingWorldPlazaAnimalAvatarSheetIntoDirectionTextures(
        jumpTexture
      ),
    };
  })().catch((error: unknown) => {
    if (
      loadingWorldPlazaAnimalAvatarCharacterTexturesPromises.get(skinId) ===
      loadingPromise
    ) {
      loadingWorldPlazaAnimalAvatarCharacterTexturesPromises.delete(skinId);
    }

    throw error;
  });

  loadingWorldPlazaAnimalAvatarCharacterTexturesPromises.set(
    skinId,
    loadingPromise
  );
  return loadingPromise;
}
