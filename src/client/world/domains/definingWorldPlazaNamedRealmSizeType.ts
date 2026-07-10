import {
  DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MAX,
  DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MIN,
} from '@/components/world/domains/definingWorldPlazaNamedRealmConstants';

/**
 * Landmass size categories for named realms (from Voronoi size weight).
 *
 * @module components/world/domains/definingWorldPlazaNamedRealmSizeType
 */

/** Player-facing / data size band for a named realm. */
export type DefiningWorldPlazaNamedRealmSizeType =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'big'
  | 'large';

export type DefiningWorldPlazaNamedRealmSizeTypeBand = {
  readonly sizeType: DefiningWorldPlazaNamedRealmSizeType;
  /**
   * Inclusive lower bound of the normalized size unit [0, 1] mapped from
   * sizeWeight between min and max constants.
   */
  readonly minNormalizedInclusive: number;
};

/**
 * Ordered bands (tiny → large). Last band covers through normalized 1.
 * Equal fifths of the size-weight range.
 */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_TYPE_BANDS: readonly DefiningWorldPlazaNamedRealmSizeTypeBand[] =
  [
    { sizeType: 'tiny', minNormalizedInclusive: 0 },
    { sizeType: 'small', minNormalizedInclusive: 0.2 },
    { sizeType: 'medium', minNormalizedInclusive: 0.4 },
    { sizeType: 'big', minNormalizedInclusive: 0.6 },
    { sizeType: 'large', minNormalizedInclusive: 0.8 },
  ];

/**
 * Maps a realm size weight onto Tiny / Small / Medium / Big / Large.
 *
 * @param sizeWeight - Weighted Voronoi claim strength.
 */
export function resolvingWorldPlazaNamedRealmSizeType(
  sizeWeight: number
): DefiningWorldPlazaNamedRealmSizeType {
  const span =
    DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MAX -
    DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MIN;

  const normalized =
    span <= 0
      ? 0
      : Math.min(
          1,
          Math.max(
            0,
            (sizeWeight - DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_WEIGHT_MIN) /
              span
          )
        );

  let resolved: DefiningWorldPlazaNamedRealmSizeType = 'tiny';

  for (const band of DEFINING_WORLD_PLAZA_NAMED_REALM_SIZE_TYPE_BANDS) {
    if (normalized >= band.minNormalizedInclusive) {
      resolved = band.sizeType;
    }
  }

  return resolved;
}
