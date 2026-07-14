import {
  DEFINING_WORLD_PLAZA_BIOME_DECORATION_DOT_RADIUS_PX,
  DEFINING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SCALE_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SCALE_MIN,
} from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';

/** Salt kept independent from placement, species, and petal-color rolls. */
const RESOLVING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SALT = 103;

/** Returns one stable flower radius for a world tile. */
export function resolvingWorldPlazaFlowerDecorationRadiusAtTileIndex(
  tileX: number,
  tileY: number
): number {
  const scale = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      RESOLVING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SALT
    ),
    DEFINING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SCALE_MIN,
    DEFINING_WORLD_PLAZA_FLOWER_DECORATION_RADIUS_SCALE_MAX
  );

  return DEFINING_WORLD_PLAZA_BIOME_DECORATION_DOT_RADIUS_PX * scale;
}
