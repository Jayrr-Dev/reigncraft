import {
  checkingWorldPlazaIceSlideVelocityIsNegligible,
  type DefiningWorldPlazaIceSlideVelocity,
} from "@/components/world/domains/computingWorldPlazaIceSlideVelocity";
import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from "@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";

/**
 * Returns true when the avatar should keep sliding on ice after an ice run ends.
 *
 * Takes priority over walk input so releasing run does not drop into the walk cycle.
 *
 * @module components/world/domains/checkingWorldPlazaPlayerShouldSlideOnIceAfterRun
 */

/**
 * @param playerPosition - Live local avatar position in grid space.
 * @param iceSlideVelocity - Residual grid velocity from running on ice.
 * @param wasRunningOnIce - True once the avatar has run on frozen water this stop.
 * @param isRunning - True while hold-to-run is still active.
 */
export function checkingWorldPlazaPlayerShouldSlideOnIceAfterRun(
  playerPosition: DefiningWorldPlazaWorldPoint,
  iceSlideVelocity: DefiningWorldPlazaIceSlideVelocity,
  wasRunningOnIce: boolean,
  isRunning: boolean,
): boolean {
  if (isRunning || !wasRunningOnIce) {
    return false;
  }

  if (checkingWorldPlazaIceSlideVelocityIsNegligible(iceSlideVelocity)) {
    return false;
  }

  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);

  return checkingWorldPlazaWaterIsFrozenAtTileIndex(
    standingTile.tileX,
    standingTile.tileY,
  );
}
