import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import type { DefiningWorldPlazaColumnRockMetadata } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';
import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';

/**
 * Counts mineable world layers on a column rock (surface minus ground).
 */
export function computingWorldPlazaRockMineableLayerCount(
  metadata: DefiningWorldPlazaColumnRockMetadata
): number {
  return Math.max(
    0,
    metadata.surfaceWorldLayer - DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
  );
}

/**
 * Resolves the remaining visual surface layer after prior mines.
 */
export function resolvingWorldPlazaRockRemainingVisualLayer(
  metadata: DefiningWorldPlazaColumnRockMetadata,
  minedState: DefiningWorldPlazaMinedRockTileState | undefined
): number {
  const standingSurfaceLayer = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
  const fullVisualLayer = metadata.surfaceWorldLayer;

  if (!minedState) {
    return fullVisualLayer;
  }

  if (minedState.isDepleted) {
    return standingSurfaceLayer;
  }

  return Math.max(standingSurfaceLayer, minedState.remainingVisualLayer);
}

/**
 * Applies mine persistence to column-rock metadata; returns null when depleted.
 */
export function applyingWorldPlazaRockMineStateToColumnRockMetadata(
  metadata: DefiningWorldPlazaColumnRockMetadata,
  minedState: DefiningWorldPlazaMinedRockTileState | undefined
): DefiningWorldPlazaColumnRockMetadata | null {
  if (!minedState) {
    return metadata;
  }

  if (minedState.isDepleted) {
    return null;
  }

  const standingSurfaceLayer = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
  const remainingVisualLayer = resolvingWorldPlazaRockRemainingVisualLayer(
    metadata,
    minedState
  );

  if (remainingVisualLayer <= standingSurfaceLayer) {
    return null;
  }

  if (remainingVisualLayer === metadata.surfaceWorldLayer) {
    return metadata;
  }

  return {
    ...metadata,
    surfaceWorldLayer: remainingVisualLayer,
  };
}
