/**
 * Parses procedural wildlife anchor ids into spawn tile and pack slot.
 *
 * @module components/world/wildlife/domains/parsingWildlifeProceduralAnchorId
 */

export type ParsingWildlifeProceduralAnchorIdResult = {
  tileX: number;
  tileY: number;
  packIndex: number;
};

/** Parses `wildlife:tileX:tileY:packIndex` anchor ids. */
export function parsingWildlifeProceduralAnchorId(
  anchorId: string
): ParsingWildlifeProceduralAnchorIdResult | null {
  const parts = anchorId.split(':');

  if (parts.length !== 4 || parts[0] !== 'wildlife' || parts[1] === 'dev') {
    return null;
  }

  const tileX = Number(parts[1]);
  const tileY = Number(parts[2]);
  const packIndex = Number(parts[3]);

  if (
    !Number.isFinite(tileX) ||
    !Number.isFinite(tileY) ||
    !Number.isFinite(packIndex)
  ) {
    return null;
  }

  return { tileX, tileY, packIndex };
}
