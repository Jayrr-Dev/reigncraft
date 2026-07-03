/**
 * Builds an irregular cluster of overlapping canopy blobs for one tree crown.
 *
 * Lobes are distributed around the canopy center on jittered angular spokes so
 * crowns stay rounded yet no two trees share the same silhouette. Spread is
 * expressed as fractions of the crown radius and biased upward so foliage piles
 * above the trunk instead of drooping past the depth-sort footprint.
 *
 * @module components/world/domains/buildingWorldPlazaTreeCanopyLobeCluster
 */

/** Full circle in radians. */
const BUILDING_WORLD_PLAZA_TREE_CANOPY_TWO_PI = Math.PI * 2;

/** One painted canopy blob in absolute screen space. */
export interface DefiningWorldPlazaTreeCanopyLobe {
  /** Lobe center X (screen px). */
  x: number;
  /** Lobe center Y (screen px). */
  y: number;
  /** Lobe radius (screen px). */
  radius: number;
}

/** Input for {@link buildingWorldPlazaTreeCanopyLobeCluster}. */
export interface BuildingWorldPlazaTreeCanopyLobeClusterInput {
  /** Crown center X (screen px). */
  centerX: number;
  /** Crown center Y (screen px). */
  centerY: number;
  /** Reference crown radius the spreads scale against (screen px). */
  baseRadius: number;
  /** Seeded generator returning floats in [0, 1). */
  random: () => number;
  /** Number of satellite lobes around the central anchor lobe. */
  satelliteCount: number;
  /** Horizontal reach of satellites as a fraction of the crown radius. */
  horizontalSpread: number;
  /** Upward reach of satellites as a fraction of the crown radius. */
  upwardSpread: number;
  /** Downward reach of satellites as a fraction of the crown radius. */
  downwardSpread: number;
  /** Minimum lobe radius as a fraction of the crown radius. */
  minRadiusFraction: number;
  /** Maximum lobe radius as a fraction of the crown radius. */
  maxRadiusFraction: number;
}

/** Linearly interpolates between two bounds. */
function interpolatingWorldPlazaTreeLobeValue(
  from: number,
  to: number,
  mix: number,
): number {
  return from + (to - from) * mix;
}

/**
 * Generates an organic set of canopy lobes for one crown.
 *
 * @param input - Crown center, reference radius, spreads, and seeded generator.
 */
export function buildingWorldPlazaTreeCanopyLobeCluster(
  input: BuildingWorldPlazaTreeCanopyLobeClusterInput,
): DefiningWorldPlazaTreeCanopyLobe[] {
  const lobes: DefiningWorldPlazaTreeCanopyLobe[] = [
    {
      x: input.centerX,
      y: input.centerY,
      radius:
        input.baseRadius *
        interpolatingWorldPlazaTreeLobeValue(0.92, 1, input.random()),
    },
  ];

  const angleStep = BUILDING_WORLD_PLAZA_TREE_CANOPY_TWO_PI / input.satelliteCount;

  for (let satellite = 0; satellite < input.satelliteCount; satellite += 1) {
    const angle =
      satellite * angleStep + (input.random() - 0.5) * angleStep;
    const reach = interpolatingWorldPlazaTreeLobeValue(0.45, 1, input.random());
    const directionX = Math.cos(angle);
    const directionY = Math.sin(angle);
    const verticalSpread =
      directionY < 0 ? input.upwardSpread : input.downwardSpread;

    lobes.push({
      x: input.centerX + directionX * input.horizontalSpread * reach * input.baseRadius,
      y: input.centerY + directionY * verticalSpread * reach * input.baseRadius,
      radius:
        input.baseRadius *
        interpolatingWorldPlazaTreeLobeValue(
          input.minRadiusFraction,
          input.maxRadiusFraction,
          input.random(),
        ),
    });
  }

  return lobes;
}
