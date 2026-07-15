/**
 * @module components/world/fishing/domains/resolvingWorldPlazaFishingSfxStarAudioId
 */

import type { DefiningWorldPlazaFishingSfxClipId } from '@/components/world/fishing/domains/definingWorldPlazaFishingSfxConstants';

export const DEFINING_WORLD_PLAZA_FISHING_SFX_STAR_AUDIO_ID_PREFIX =
  'world-plaza.fishing.sfx' as const;

export function resolvingWorldPlazaFishingSfxStarAudioId(
  clipId: DefiningWorldPlazaFishingSfxClipId
): string {
  return `${DEFINING_WORLD_PLAZA_FISHING_SFX_STAR_AUDIO_ID_PREFIX}.${clipId}`;
}
