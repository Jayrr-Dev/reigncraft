/**
 * Loads Husky motion sheets and slices each into per-direction row textures.
 *
 * Each Husky sheet packs all eight facing directions as rows. A per-direction
 * base texture is created by framing one row of the shared sheet source. The
 * shared GirlSample frame-texture builder then slices animation columns inside
 * that row (it adds the base texture's frame offset), so both skins flow through
 * one rendering pipeline.
 *
 * @module components/world/domains/loadingWorldPlazaHuskyCharacterTextures
 */

import {
  DEFINING_WORLD_PLAZA_HUSKY_DIRECTION_ROW_INDEX,
  DEFINING_WORLD_PLAZA_HUSKY_FRAME_SIZE_PX,
  DEFINING_WORLD_PLAZA_HUSKY_MOTION_SHEET_URLS,
  DEFINING_WORLD_PLAZA_HUSKY_SHEET_COLUMN_COUNT,
} from "@/components/world/domains/definingWorldPlazaHuskySpriteConstants";
import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type {
  DefiningWorldPlazaGirlSampleCharacterTextures,
  DefiningWorldPlazaGirlSampleWalkDirectionTextures,
} from "@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures";
import { Assets, Rectangle, Texture } from "pixi.js";

/** Full pixel width of one Husky sheet row (all animation columns). */
const DEFINING_WORLD_PLAZA_HUSKY_SHEET_ROW_WIDTH_PX =
  DEFINING_WORLD_PLAZA_HUSKY_SHEET_COLUMN_COUNT *
  DEFINING_WORLD_PLAZA_HUSKY_FRAME_SIZE_PX;

/**
 * Slices one loaded Husky sheet into a per-direction row texture map.
 *
 * @param sheetTexture - Loaded full motion sheet texture.
 */
function slicingWorldPlazaHuskySheetIntoDirectionTextures(
  sheetTexture: Texture,
): DefiningWorldPlazaGirlSampleWalkDirectionTextures {
  const directionEntries = Object.entries(
    DEFINING_WORLD_PLAZA_HUSKY_DIRECTION_ROW_INDEX,
  ) as Array<[DefiningWorldPlazaGirlSampleWalkDirection, number]>;

  const directionTextureEntries = directionEntries.map(
    ([direction, rowIndex]) => {
      const rowTexture = new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          0,
          rowIndex * DEFINING_WORLD_PLAZA_HUSKY_FRAME_SIZE_PX,
          DEFINING_WORLD_PLAZA_HUSKY_SHEET_ROW_WIDTH_PX,
          DEFINING_WORLD_PLAZA_HUSKY_FRAME_SIZE_PX,
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
 * Loads one Husky motion sheet as direction row textures.
 *
 * @param sheetUrl - Public URL of the motion sheet.
 */
async function loadingWorldPlazaHuskyMotionDirectionTextures(
  sheetUrl: string,
): Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures> {
  const loadedTexture = await Assets.load<Texture>(sheetUrl);

  if (!(loadedTexture instanceof Texture)) {
    throw new Error(`Husky sheet ${sheetUrl} did not load as a Texture.`);
  }

  return slicingWorldPlazaHuskySheetIntoDirectionTextures(loadedTexture);
}

/**
 * Loads Husky walk, run, jump, and idle direction textures for the plaza avatar.
 *
 * The jump motion reuses the Run sheet because the Husky pack has no jump strip.
 */
export async function loadingWorldPlazaHuskyCharacterTextures(): Promise<DefiningWorldPlazaGirlSampleCharacterTextures> {
  const [walk, run, idle, jump] = await Promise.all([
    loadingWorldPlazaHuskyMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_HUSKY_MOTION_SHEET_URLS.walk,
    ),
    loadingWorldPlazaHuskyMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_HUSKY_MOTION_SHEET_URLS.run,
    ),
    loadingWorldPlazaHuskyMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_HUSKY_MOTION_SHEET_URLS.idle,
    ),
    loadingWorldPlazaHuskyMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_HUSKY_MOTION_SHEET_URLS.jump,
    ),
  ]);

  return { walk, run, jump, idle };
}
