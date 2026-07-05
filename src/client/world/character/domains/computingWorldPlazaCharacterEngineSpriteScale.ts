/**
 * Computes the effective on-screen sprite scale for one character.
 *
 * @module components/world/character/domains/computingWorldPlazaCharacterEngineSpriteScale
 */

import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import type { DefiningWorldPlazaAvatarCharacterDefinition } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';

/**
 * Multiplies presentation sprite scale by the character engine size scale.
 */
export function computingWorldPlazaCharacterEngineSpriteScale(
  avatarDefinition: DefiningWorldPlazaAvatarCharacterDefinition,
  characterDefinition: DefiningWorldPlazaCharacterEngineDefinition
): number {
  const derivedStats =
    computingWorldPlazaCharacterEngineDerivedStats(characterDefinition);

  return avatarDefinition.spriteScale * derivedStats.sizeScale;
}
