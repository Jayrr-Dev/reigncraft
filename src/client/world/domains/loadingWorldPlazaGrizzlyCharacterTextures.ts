/**
 * Loads Grizzly motion sheets and slices each into per-direction row textures.
 *
 * @module components/world/domains/loadingWorldPlazaGrizzlyCharacterTextures
 */

import {
  DEFINING_WORLD_PLAZA_GRIZZLY_DIRECTION_ROW_INDEX,
  DEFINING_WORLD_PLAZA_GRIZZLY_FRAME_SIZE_PX,
  DEFINING_WORLD_PLAZA_GRIZZLY_MOTION_SHEET_URLS,
  DEFINING_WORLD_PLAZA_GRIZZLY_SHEET_COLUMN_COUNT,
} from "@/components/world/domains/definingWorldPlazaGrizzlySpriteConstants";
import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type {
  DefiningWorldPlazaGirlSampleCharacterTextures,
  DefiningWorldPlazaGirlSampleWalkDirectionTextures,
} from "@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures";
import { Assets, Rectangle, Texture } from "pixi.js";

/** Full pixel width of one Grizzly sheet row (all animation columns). */
const DEFINING_WORLD_PLAZA_GRIZZLY_SHEET_ROW_WIDTH_PX =
  DEFINING_WORLD_PLAZA_GRIZZLY_SHEET_COLUMN_COUNT *
  DEFINING_WORLD_PLAZA_GRIZZLY_FRAME_SIZE_PX;

/**
 * Slices one loaded Grizzly sheet into a per-direction row texture map.
 *
 * @param sheetTexture - Loaded full motion sheet texture.
 */
function slicingWorldPlazaGrizzlySheetIntoDirectionTextures(
  sheetTexture: Texture,
): DefiningWorldPlazaGirlSampleWalkDirectionTextures {
  const directionEntries = Object.entries(
    DEFINING_WORLD_PLAZA_GRIZZLY_DIRECTION_ROW_INDEX,
  ) as Array<[DefiningWorldPlazaGirlSampleWalkDirection, number]>;

  const directionTextureEntries = directionEntries.map(
    ([direction, rowIndex]) => {
      const rowTexture = new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          0,
          rowIndex * DEFINING_WORLD_PLAZA_GRIZZLY_FRAME_SIZE_PX,
          DEFINING_WORLD_PLAZA_GRIZZLY_SHEET_ROW_WIDTH_PX,
          DEFINING_WORLD_PLAZA_GRIZZLY_FRAME_SIZE_PX,
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
 * Loads one Grizzly motion sheet as direction row textures.
 *
 * @param sheetUrl - Public URL of the motion sheet.
 */
async function loadingWorldPlazaGrizzlyMotionDirectionTextures(
  sheetUrl: string,
): Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures> {
  const loadedTexture = await Assets.load<Texture>(sheetUrl);

  if (!(loadedTexture instanceof Texture)) {
    throw new Error(`Grizzly sheet ${sheetUrl} did not load as a Texture.`);
  }

  return slicingWorldPlazaGrizzlySheetIntoDirectionTextures(loadedTexture);
}

/**
 * Loads Grizzly walk, run, jump, and idle direction textures.
 */
export async function loadingWorldPlazaGrizzlyCharacterTextures(): Promise<DefiningWorldPlazaGirlSampleCharacterTextures> {
  const [walk, run, idle, jump] = await Promise.all([
    loadingWorldPlazaGrizzlyMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_GRIZZLY_MOTION_SHEET_URLS.walk,
    ),
    loadingWorldPlazaGrizzlyMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_GRIZZLY_MOTION_SHEET_URLS.run,
    ),
    loadingWorldPlazaGrizzlyMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_GRIZZLY_MOTION_SHEET_URLS.idle,
    ),
    loadingWorldPlazaGrizzlyMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_GRIZZLY_MOTION_SHEET_URLS.jump,
    ),
  ]);

  return { walk, run, jump, idle };
}
