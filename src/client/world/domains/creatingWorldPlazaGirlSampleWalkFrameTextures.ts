import type {
  DefiningWorldPlazaGirlSampleMotionSheetLayout,
  DefiningWorldPlazaGirlSampleWalkDirection,
} from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type { DefiningWorldPlazaGirlSampleWalkDirectionTextures } from "@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures";
import { Rectangle, Texture } from "pixi.js";

/** Cache key for one frame inside a direction strip. */
type DefiningWorldPlazaGirlSampleMotionFrameKey =
  `${DefiningWorldPlazaGirlSampleWalkDirection}-${number}`;

/**
 * Resolves a frame column and row inside a GirlSample motion strip.
 *
 * @param frameIndex - Zero-based animation frame index.
 * @param sheetLayout - Walk or run strip layout metadata.
 */
export function resolvingWorldPlazaGirlSampleMotionFrameGridPosition(
  frameIndex: number,
  sheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout,
): { columnIndex: number; rowIndex: number } {
  const normalizedFrameIndex =
    ((frameIndex % sheetLayout.frameCount) + sheetLayout.frameCount) %
    sheetLayout.frameCount;

  return {
    columnIndex: normalizedFrameIndex % sheetLayout.columnCount,
    rowIndex: Math.floor(normalizedFrameIndex / sheetLayout.columnCount),
  };
}

/**
 * Builds every frame texture from loaded GirlSample direction strips.
 *
 * @param directionTextures - Loaded base texture for each direction.
 * @param sheetLayout - Walk or run strip layout metadata.
 */
export function creatingWorldPlazaGirlSampleMotionFrameTextures(
  directionTextures: DefiningWorldPlazaGirlSampleWalkDirectionTextures,
  sheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout,
): Map<DefiningWorldPlazaGirlSampleMotionFrameKey, Texture> {
  const frameTextures = new Map<
    DefiningWorldPlazaGirlSampleMotionFrameKey,
    Texture
  >();

  for (const [direction, directionTexture] of Object.entries(
    directionTextures,
  ) as Array<[DefiningWorldPlazaGirlSampleWalkDirection, Texture]>) {
    // Direction strips packed into a shared sheet (e.g. Husky rows) carry a
    // non-zero frame origin; full-image strips (GirlSample) report (0, 0).
    const directionFrameOriginX = directionTexture.frame.x;
    const directionFrameOriginY = directionTexture.frame.y;

    for (
      let frameIndex = 0;
      frameIndex < sheetLayout.frameCount;
      frameIndex += 1
    ) {
      const { columnIndex, rowIndex } =
        resolvingWorldPlazaGirlSampleMotionFrameGridPosition(
          frameIndex,
          sheetLayout,
        );
      const frameKey =
        `${direction}-${frameIndex}` satisfies DefiningWorldPlazaGirlSampleMotionFrameKey;

      frameTextures.set(
        frameKey,
        new Texture({
          source: directionTexture.source,
          frame: new Rectangle(
            directionFrameOriginX + columnIndex * sheetLayout.frameWidthPx,
            directionFrameOriginY + rowIndex * sheetLayout.frameHeightPx,
            sheetLayout.frameWidthPx,
            sheetLayout.frameHeightPx,
          ),
        }),
      );
    }
  }

  return frameTextures;
}

/**
 * Resolves one frame texture for a direction and animation index.
 *
 * @param frameTextures - Prebuilt frame texture map.
 * @param direction - Current GirlSample direction.
 * @param frameIndex - Animation frame index.
 * @param sheetLayout - Walk or run strip layout metadata.
 */
export function resolvingWorldPlazaGirlSampleMotionFrameTexture(
  frameTextures: Map<string, Texture>,
  direction: DefiningWorldPlazaGirlSampleWalkDirection,
  frameIndex: number,
  sheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout,
): Texture {
  const { columnIndex, rowIndex } =
    resolvingWorldPlazaGirlSampleMotionFrameGridPosition(
      frameIndex,
      sheetLayout,
    );
  const normalizedFrameIndex =
    rowIndex * sheetLayout.columnCount + columnIndex;
  const frameTexture = frameTextures.get(
    `${direction}-${normalizedFrameIndex}`,
  );

  if (!frameTexture) {
    throw new Error(
      `Missing GirlSample motion frame texture for ${direction}:${normalizedFrameIndex}.`,
    );
  }

  return frameTexture;
}
