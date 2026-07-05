import { blendingWorldPlazaRgbColors } from '@/components/world/domains/blendingWorldPlazaRgbColors';
import { buildingWorldFireDevvitTileKey } from '../../../shared/worldFireDevvit';

/** Scorched grass floor fill after fire fuel is exhausted. */
const RESOLVING_WORLD_PLAZA_BURNT_GRASS_FLOOR_FILL_COLOR = 0x4a3528;

export type ResolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndexParams = {
  tileX: number;
  tileY: number;
  worldLayer?: number;
  baseFillColor: number;
  burntGrassTileKeys?: ReadonlySet<string>;
};

/**
 * Returns the scorched grass-brown fill when a procedural floor tile has burnt.
 */
export function resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex({
  tileX,
  tileY,
  worldLayer = 0,
  baseFillColor,
  burntGrassTileKeys,
}: ResolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndexParams): number {
  if (!burntGrassTileKeys) {
    return baseFillColor;
  }

  const tileKey = buildingWorldFireDevvitTileKey(tileX, tileY, worldLayer);

  if (!burntGrassTileKeys.has(tileKey)) {
    return baseFillColor;
  }

  return blendingWorldPlazaRgbColors(
    baseFillColor,
    RESOLVING_WORLD_PLAZA_BURNT_GRASS_FLOOR_FILL_COLOR,
    0.82
  );
}

/**
 * Returns true when a procedural grass tile has finished burning.
 */
export function checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex(
  tileX: number,
  tileY: number,
  burntGrassTileKeys: ReadonlySet<string> | undefined,
  worldLayer = 0
): boolean {
  if (!burntGrassTileKeys) {
    return false;
  }

  return burntGrassTileKeys.has(
    buildingWorldFireDevvitTileKey(tileX, tileY, worldLayer)
  );
}
