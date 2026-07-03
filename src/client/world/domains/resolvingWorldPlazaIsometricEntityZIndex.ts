import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import { DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_Z_INDEX_SCALE } from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Depth sort key for isometric entities within the entity layer.
 *
 * Uses projected screen Y so depth stays correct for negative grid coordinates.
 *
 * @param gridPoint - Logical grid position.
 */
export function resolvingWorldPlazaIsometricEntityZIndex(
  gridPoint: DefiningWorldPlazaWorldPoint,
): number {
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint);

  return Math.round(screenPoint.y * DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_Z_INDEX_SCALE);
}
