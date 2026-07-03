/**
 * Loads Pinguin motion sheets and slices each into per-direction row textures.
 *
 * @module components/world/domains/loadingWorldPlazaPinguinCharacterTextures
 */

import {
  DEFINING_WORLD_PLAZA_PINGUIN_DIRECTION_ROW_INDEX,
  DEFINING_WORLD_PLAZA_PINGUIN_FRAME_SIZE_PX,
  DEFINING_WORLD_PLAZA_PINGUIN_MOTION_SHEET_URLS,
  DEFINING_WORLD_PLAZA_PINGUIN_SHEET_COLUMN_COUNT,
} from "@/components/world/domains/definingWorldPlazaPinguinSpriteConstants";
import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type {
  DefiningWorldPlazaGirlSampleCharacterTextures,
  DefiningWorldPlazaGirlSampleWalkDirectionTextures,
} from "@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures";
import { Assets, Rectangle, Texture } from "pixi.js";

/** Full pixel width of one Pinguin sheet row (all animation columns). */
const DEFINING_WORLD_PLAZA_PINGUIN_SHEET_ROW_WIDTH_PX =
  DEFINING_WORLD_PLAZA_PINGUIN_SHEET_COLUMN_COUNT *
  DEFINING_WORLD_PLAZA_PINGUIN_FRAME_SIZE_PX;

/**
 * Slices one loaded Pinguin sheet into a per-direction row texture map.
 *
 * @param sheetTexture - Loaded full motion sheet texture.
 */
function slicingWorldPlazaPinguinSheetIntoDirectionTextures(
  sheetTexture: Texture,
): DefiningWorldPlazaGirlSampleWalkDirectionTextures {
  const directionEntries = Object.entries(
    DEFINING_WORLD_PLAZA_PINGUIN_DIRECTION_ROW_INDEX,
  ) as Array<[DefiningWorldPlazaGirlSampleWalkDirection, number]>;

  const directionTextureEntries = directionEntries.map(
    ([direction, rowIndex]) => {
      const rowTexture = new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          0,
          rowIndex * DEFINING_WORLD_PLAZA_PINGUIN_FRAME_SIZE_PX,
          DEFINING_WORLD_PLAZA_PINGUIN_SHEET_ROW_WIDTH_PX,
          DEFINING_WORLD_PLAZA_PINGUIN_FRAME_SIZE_PX,
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
 * Loads one Pinguin motion sheet as direction row textures.
 *
 * @param sheetUrl - Public URL of the motion sheet.
 */
async function loadingWorldPlazaPinguinMotionDirectionTextures(
  sheetUrl: string,
): Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures> {
  const loadedTexture = await Assets.load<Texture>(sheetUrl);

  if (!(loadedTexture instanceof Texture)) {
    throw new Error(`Pinguin sheet ${sheetUrl} did not load as a Texture.`);
  }

  return slicingWorldPlazaPinguinSheetIntoDirectionTextures(loadedTexture);
}

/**
 * Loads Pinguin walk, run, jump, and idle direction textures.
 */
export async function loadingWorldPlazaPinguinCharacterTextures(): Promise<DefiningWorldPlazaGirlSampleCharacterTextures> {
  const [walk, run, idle, jump] = await Promise.all([
    loadingWorldPlazaPinguinMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_PINGUIN_MOTION_SHEET_URLS.walk,
    ),
    loadingWorldPlazaPinguinMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_PINGUIN_MOTION_SHEET_URLS.run,
    ),
    loadingWorldPlazaPinguinMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_PINGUIN_MOTION_SHEET_URLS.idle,
    ),
    loadingWorldPlazaPinguinMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_PINGUIN_MOTION_SHEET_URLS.jump,
    ),
  ]);

  return { walk, run, jump, idle };
}
