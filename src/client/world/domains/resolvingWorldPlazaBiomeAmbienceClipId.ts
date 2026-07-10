import {
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_BY_KIND,
  type DefiningWorldPlazaBiomeAmbienceClipId,
} from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaFlowingWaterAmbienceNearPlayer } from '@/components/world/domains/resolvingWorldPlazaFlowingWaterAmbienceNearPlayer';

/**
 * Picks the biome-only ambience loop, if any.
 */
export function resolvingWorldPlazaBiomeAmbienceClipIdForBiomeKind(
  biomeKind: DefiningWorldPlazaBiomeKind
): DefiningWorldPlazaBiomeAmbienceClipId | null {
  return DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_BY_KIND[biomeKind] ?? null;
}

/**
 * Picks the active ambience loop for the player.
 *
 * Nearby procedural streams and rivers override the biome bed.
 */
export function resolvingWorldPlazaBiomeAmbienceClipId(
  biomeKind: DefiningWorldPlazaBiomeKind,
  listenerPoint: DefiningWorldPlazaWorldPoint | null
): DefiningWorldPlazaBiomeAmbienceClipId | null {
  const flowingWaterAmbience =
    resolvingWorldPlazaFlowingWaterAmbienceNearPlayer(listenerPoint);

  if (flowingWaterAmbience) {
    return flowingWaterAmbience.clipId;
  }

  return resolvingWorldPlazaBiomeAmbienceClipIdForBiomeKind(biomeKind);
}
