/**
 * Resolves wildlife texture eviction tuning from the active viewport profile.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile
 */

import { DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaViewportProfileConstants';
import {
  DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS,
  DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS_MOBILE,
  DEFINING_WILDLIFE_TEXTURE_EVICTION_MAX_CACHED_SPECIES_MOBILE,
} from '@/components/world/wildlife/domains/definingWildlifeTextureEvictionConstants';

export type ResolvingWildlifeTextureEvictionProfile = {
  readonly graceMs: number;
  readonly maxCachedSpecies: number | null;
};

function checkingWildlifeTextureEvictionMobileViewport(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const hasCoarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;

  return (
    window.innerWidth <= DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX ||
    hasCoarsePointer
  );
}

/** Returns grace and cache caps for the current viewport. */
export function resolvingWildlifeTextureEvictionProfile(): ResolvingWildlifeTextureEvictionProfile {
  if (checkingWildlifeTextureEvictionMobileViewport()) {
    return {
      graceMs: DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS_MOBILE,
      maxCachedSpecies:
        DEFINING_WILDLIFE_TEXTURE_EVICTION_MAX_CACHED_SPECIES_MOBILE,
    };
  }

  return {
    graceMs: DEFINING_WILDLIFE_TEXTURE_EVICTION_GRACE_MS,
    maxCachedSpecies: null,
  };
}
