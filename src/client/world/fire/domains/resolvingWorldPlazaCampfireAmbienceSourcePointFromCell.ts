import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

/**
 * Maps a lit campfire fire cell to the world point used for ambience falloff.
 */
export function resolvingWorldPlazaCampfireAmbienceSourcePointFromCell(
  cell: WorldFireDevvitCell
): DefiningWorldPlazaWorldPoint {
  return {
    x: cell.tileX + 0.5,
    y: cell.tileY + 0.5,
    layer: cell.worldLayer,
  };
}
