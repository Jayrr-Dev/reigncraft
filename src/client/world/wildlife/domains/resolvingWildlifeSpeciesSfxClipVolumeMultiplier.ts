import type { DefiningWildlifeSpeciesSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';
import { DEFINING_WILDLIFE_SPECIES_SFX_CLIP_VOLUME_MULTIPLIER_BY_CLIP_ID } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipVolumeMultipliers';

/**
 * Resolves optional per-clip gain trim for one species vocal clip.
 */
export function resolvingWildlifeSpeciesSfxClipVolumeMultiplier(
  clipId: DefiningWildlifeSpeciesSfxClipId
): number {
  return (
    DEFINING_WILDLIFE_SPECIES_SFX_CLIP_VOLUME_MULTIPLIER_BY_CLIP_ID[clipId] ?? 1
  );
}
