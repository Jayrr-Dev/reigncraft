import {
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_BY_KIND,
  type DefiningWorldPlazaBiomeAmbienceClipId,
} from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Picks the FilmCow ambience loop for one biome, if any.
 */
export function resolvingWorldPlazaBiomeAmbienceClipId(
  biomeKind: DefiningWorldPlazaBiomeKind
): DefiningWorldPlazaBiomeAmbienceClipId | null {
  return DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_BY_KIND[biomeKind] ?? null;
}
