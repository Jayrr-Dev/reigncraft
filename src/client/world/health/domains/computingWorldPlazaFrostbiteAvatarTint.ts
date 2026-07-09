/**
 * Avatar tint for frostbite stages.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteAvatarTint
 */

import { DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_NECROTIC_AVATAR_TINT } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';
import type { DefiningWorldPlazaEntityFrostbiteStageId } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry';

/** Default Pixi white tint (no status color). */
export const COMPUTING_WORLD_PLAZA_FROSTBITE_AVATAR_TINT_NONE = 0xffffff;

/**
 * Returns a Pixi sprite tint for the active frostbite stage, or white if none.
 */
export function computingWorldPlazaFrostbiteAvatarTint(
  stageId: DefiningWorldPlazaEntityFrostbiteStageId | null
): number {
  if (stageId === 'necrotic') {
    return DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_NECROTIC_AVATAR_TINT;
  }

  return COMPUTING_WORLD_PLAZA_FROSTBITE_AVATAR_TINT_NONE;
}
