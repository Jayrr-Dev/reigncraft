import type { DefiningFilmcowFootstepClipId } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingFilmcowFootstepSfxUrl } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSfxUrl';

/**
 * Builds a browser-safe public URL for one avatar footstep clip.
 */
export function resolvingWorldPlazaAvatarFootstepSfxUrl(
  clipId: DefiningFilmcowFootstepClipId
): string {
  return resolvingFilmcowFootstepSfxUrl(clipId);
}
