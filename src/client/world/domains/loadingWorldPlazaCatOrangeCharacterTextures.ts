/**
 * Loads Cat Orange motion sheets and slices each into per-direction row textures.
 *
 * @module components/world/domains/loadingWorldPlazaCatOrangeCharacterTextures
 */

import {
  DEFINING_WORLD_PLAZA_CAT_ORANGE_DIRECTION_ROW_INDEX,
  DEFINING_WORLD_PLAZA_CAT_ORANGE_FRAME_SIZE_PX,
  DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_URLS,
  DEFINING_WORLD_PLAZA_CAT_ORANGE_SHEET_COLUMN_COUNT,
} from "@/components/world/domains/definingWorldPlazaCatOrangeSpriteConstants";
import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type {
  DefiningWorldPlazaGirlSampleCharacterTextures,
  DefiningWorldPlazaGirlSampleWalkDirectionTextures,
} from "@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures";
import { Assets, Rectangle, Texture } from "pixi.js";

/** Full pixel width of one Cat Orange sheet row (all animation columns). */
const DEFINING_WORLD_PLAZA_CAT_ORANGE_SHEET_ROW_WIDTH_PX =
  DEFINING_WORLD_PLAZA_CAT_ORANGE_SHEET_COLUMN_COUNT *
  DEFINING_WORLD_PLAZA_CAT_ORANGE_FRAME_SIZE_PX;

/**
 * Slices one loaded Cat Orange sheet into a per-direction row texture map.
 *
 * @param sheetTexture - Loaded full motion sheet texture.
 */
function slicingWorldPlazaCatOrangeSheetIntoDirectionTextures(
  sheetTexture: Texture,
): DefiningWorldPlazaGirlSampleWalkDirectionTextures {
  const directionEntries = Object.entries(
    DEFINING_WORLD_PLAZA_CAT_ORANGE_DIRECTION_ROW_INDEX,
  ) as Array<[DefiningWorldPlazaGirlSampleWalkDirection, number]>;

  const directionTextureEntries = directionEntries.map(
    ([direction, rowIndex]) => {
      const rowTexture = new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          0,
          rowIndex * DEFINING_WORLD_PLAZA_CAT_ORANGE_FRAME_SIZE_PX,
          DEFINING_WORLD_PLAZA_CAT_ORANGE_SHEET_ROW_WIDTH_PX,
          DEFINING_WORLD_PLAZA_CAT_ORANGE_FRAME_SIZE_PX,
        ),
      });

      return [direction, rowTexture] as const;
    },
  );

  return Object.fromEntries(
    directionTextureEntries,
  ) as DefiningWorldPlazaGirlSampleWalkDirectionTextures;
}

/**
 * Loads one Cat Orange motion sheet as direction row textures.
 *
 * @param sheetUrl - Public URL of the motion sheet.
 */
async function loadingWorldPlazaCatOrangeMotionDirectionTextures(
  sheetUrl: string,
): Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures> {
  const loadedTexture = await Assets.load<Texture>(sheetUrl);

  if (!(loadedTexture instanceof Texture)) {
    throw new Error(`Cat Orange sheet ${sheetUrl} did not load as a Texture.`);
  }

  return slicingWorldPlazaCatOrangeSheetIntoDirectionTextures(loadedTexture);
}

/**
 * Loads Cat Orange walk, run, jump, and idle direction textures.
 */
export async function loadingWorldPlazaCatOrangeCharacterTextures(): Promise<DefiningWorldPlazaGirlSampleCharacterTextures> {
  const [walk, run, idle, jump] = await Promise.all([
    loadingWorldPlazaCatOrangeMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_URLS.walk,
    ),
    loadingWorldPlazaCatOrangeMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_URLS.run,
    ),
    loadingWorldPlazaCatOrangeMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_URLS.idle,
    ),
    loadingWorldPlazaCatOrangeMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_CAT_ORANGE_MOTION_SHEET_URLS.jump,
    ),
  ]);

  return { walk, run, jump, idle };
}
