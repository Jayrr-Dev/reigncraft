import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection';

/**
 * True when wildlife lies in the half-plane ahead of the player's facing direction.
 */
export function checkingWildlifeNameTagIsInFrontOfPlayer(
  wildlifePosition: DefiningWorldPlazaWorldPoint,
  playerPosition: DefiningWorldPlazaWorldPoint,
  playerFacingDirection: DefiningWorldPlazaGirlSampleWalkDirection
): boolean {
  const forward = resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection(
    playerFacingDirection
  );

  if (forward.x === 0 && forward.y === 0) {
    return true;
  }

  const offsetX = wildlifePosition.x - playerPosition.x;
  const offsetY = wildlifePosition.y - playerPosition.y;

  return offsetX * forward.x + offsetY * forward.y > 0;
}
