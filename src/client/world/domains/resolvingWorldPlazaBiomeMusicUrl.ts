import {
  DEFINING_WORLD_PLAZA_COZY_TUNES_ASSET_BASE_URL,
  DEFINING_WORLD_PLAZA_COZY_TUNES_CATALOG,
  type DefiningWorldPlazaCozyTuneId,
} from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';

/**
 * Builds a browser-safe public URL for one Cozy Tunes OGG file.
 */
export function resolvingWorldPlazaBiomeMusicUrl(
  tuneId: DefiningWorldPlazaCozyTuneId
): string {
  const tune = DEFINING_WORLD_PLAZA_COZY_TUNES_CATALOG[tuneId];
  const encodedBaseUrl = DEFINING_WORLD_PLAZA_COZY_TUNES_ASSET_BASE_URL.split(
    '/'
  )
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(tune.fileName)}`;
}
