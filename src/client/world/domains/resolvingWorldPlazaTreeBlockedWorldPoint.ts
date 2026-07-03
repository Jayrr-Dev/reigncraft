import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaBlockedWorldPoint } from "@/components/world/domains/resolvingWorldPlazaBlockedWorldPoint";

/**
 * Tree trunk collision: blocks tile occupancy and pushes avatars out of trunks.
 *
 * @module components/world/domains/resolvingWorldPlazaTreeBlockedWorldPoint
 */

/**
 * Returns a position with any tree-trunk overlap resolved.
 *
 * @param desired - Candidate avatar grid position for this frame.
 */
export function resolvingWorldPlazaTreeBlockedWorldPoint(
  desired: DefiningWorldPlazaWorldPoint,
): DefiningWorldPlazaWorldPoint {
  return resolvingWorldPlazaBlockedWorldPoint(desired);
}
