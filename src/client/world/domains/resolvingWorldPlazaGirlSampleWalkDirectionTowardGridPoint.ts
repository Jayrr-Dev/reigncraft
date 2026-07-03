import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirection";

/**
 * Resolves the GirlSample facing strip from a player position toward a target.
 *
 * @param playerGridPoint - Local avatar position on the plaza grid.
 * @param targetGridPoint - World grid point under the pointer.
 * @param fallbackDirection - Direction to keep when the target overlaps the player.
 */
export function resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint(
  playerGridPoint: DefiningWorldPlazaWorldPoint,
  targetGridPoint: DefiningWorldPlazaWorldPoint,
  fallbackDirection: DefiningWorldPlazaGirlSampleWalkDirection,
): DefiningWorldPlazaGirlSampleWalkDirection {
  return resolvingWorldPlazaGirlSampleWalkDirection(
    targetGridPoint.x - playerGridPoint.x,
    targetGridPoint.y - playerGridPoint.y,
    fallbackDirection,
  );
}
