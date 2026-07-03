import type { DefiningWorldPlazaLastPosition } from "@/components/world/domains/definingWorldPlazaLastPosition";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaPlayerWorldLayer } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import type { RefObject } from "react";

/**
 * Writes a saved last-position snapshot onto the live avatar ref.
 *
 * @module components/world/domains/applyingWorldPlazaPlayerWorldPointFromLastPosition
 */

/**
 * Applies one last-position snapshot to the local avatar ref without clearing motion.
 *
 * @param playerPositionRef - Live local avatar position in grid space.
 * @param lastPosition - Saved grid position to restore.
 */
export function applyingWorldPlazaPlayerWorldPointFromLastPosition(
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>,
  lastPosition: DefiningWorldPlazaLastPosition,
): void {
  const playerPosition = playerPositionRef.current;

  if (!playerPosition) {
    return;
  }

  playerPosition.x = lastPosition.x;
  playerPosition.y = lastPosition.y;
  playerPosition.layer = resolvingWorldPlazaPlayerWorldLayer({
    x: lastPosition.x,
    y: lastPosition.y,
    layer: lastPosition.layer,
  });
}
