/**
 * Resolves wildlife footstep size tier for one playable animal skin.
 *
 * @module components/world/domains/resolvingWorldPlazaAnimalPlayableAvatarFootstepSizeTier
 */

import { resolvingWorldPlazaAnimalPlayableAvatarSkinRow } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import type { DefiningFilmcowFootstepWildlifeSizeTier } from '@/components/world/footsteps/domains/definingFilmcowFootstepSfxConstants';
import { resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier } from '@/components/world/wildlife/domains/resolvingWildlifeFootstepSizeTier';

/**
 * Maps the selected animal skin's sprite scale to a wildlife footstep size tier.
 */
export function resolvingWorldPlazaAnimalPlayableAvatarFootstepSizeTier(
  skinId: string
): DefiningFilmcowFootstepWildlifeSizeTier {
  const skinRow = resolvingWorldPlazaAnimalPlayableAvatarSkinRow(skinId);

  if (!skinRow) {
    return 'medium';
  }

  return resolvingWildlifeFootstepSizeTierFromVisualSizeMultiplier(
    skinRow.spriteScale
  );
}
