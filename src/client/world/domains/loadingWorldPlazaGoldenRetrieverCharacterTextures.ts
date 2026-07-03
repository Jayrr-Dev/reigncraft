/**
 * Loads Golden Retriever motion sheets and slices each into per-direction rows.
 *
 * @module components/world/domains/loadingWorldPlazaGoldenRetrieverCharacterTextures
 */

import {
  DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_DIRECTION_ROW_INDEX,
  DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_FRAME_SIZE_PX,
  DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_URLS,
  DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_SHEET_COLUMN_COUNT,
} from "@/components/world/domains/definingWorldPlazaGoldenRetrieverSpriteConstants";
import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type {
  DefiningWorldPlazaGirlSampleCharacterTextures,
  DefiningWorldPlazaGirlSampleWalkDirectionTextures,
} from "@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures";
import { Assets, Rectangle, Texture } from "pixi.js";

/** Full pixel width of one Golden Retriever sheet row (all animation columns). */
const DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_SHEET_ROW_WIDTH_PX =
  DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_SHEET_COLUMN_COUNT *
  DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_FRAME_SIZE_PX;

/**
 * Slices one loaded Golden Retriever sheet into a per-direction row texture map.
 *
 * @param sheetTexture - Loaded full motion sheet texture.
 */
function slicingWorldPlazaGoldenRetrieverSheetIntoDirectionTextures(
  sheetTexture: Texture,
): DefiningWorldPlazaGirlSampleWalkDirectionTextures {
  const directionEntries = Object.entries(
    DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_DIRECTION_ROW_INDEX,
  ) as Array<[DefiningWorldPlazaGirlSampleWalkDirection, number]>;

  const directionTextureEntries = directionEntries.map(
    ([direction, rowIndex]) => {
      const rowTexture = new Texture({
        source: sheetTexture.source,
        frame: new Rectangle(
          0,
          rowIndex * DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_FRAME_SIZE_PX,
          DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_SHEET_ROW_WIDTH_PX,
          DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_FRAME_SIZE_PX,
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
 * Loads one Golden Retriever motion sheet as direction row textures.
 *
 * @param sheetUrl - Public URL of the motion sheet.
 */
async function loadingWorldPlazaGoldenRetrieverMotionDirectionTextures(
  sheetUrl: string,
): Promise<DefiningWorldPlazaGirlSampleWalkDirectionTextures> {
  const loadedTexture = await Assets.load<Texture>(sheetUrl);

  if (!(loadedTexture instanceof Texture)) {
    throw new Error(
      `Golden Retriever sheet ${sheetUrl} did not load as a Texture.`,
    );
  }

  return slicingWorldPlazaGoldenRetrieverSheetIntoDirectionTextures(
    loadedTexture,
  );
}

/**
 * Loads Golden Retriever walk, run, jump, and idle direction textures.
 */
export async function loadingWorldPlazaGoldenRetrieverCharacterTextures(): Promise<DefiningWorldPlazaGirlSampleCharacterTextures> {
  const [walk, run, idle, jump] = await Promise.all([
    loadingWorldPlazaGoldenRetrieverMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_URLS.walk,
    ),
    loadingWorldPlazaGoldenRetrieverMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_URLS.run,
    ),
    loadingWorldPlazaGoldenRetrieverMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_URLS.idle,
    ),
    loadingWorldPlazaGoldenRetrieverMotionDirectionTextures(
      DEFINING_WORLD_PLAZA_GOLDEN_RETRIEVER_MOTION_SHEET_URLS.jump,
    ),
  ]);

  return { walk, run, jump, idle };
}
