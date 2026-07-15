'use client';

import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import type {
  ComputingWorldPlazaCharacterEngineDerivedStats,
  DefiningWorldPlazaCharacterEngineDefinition,
} from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { resolvingWorldPlazaCharacterEngineDefinitionForSkinId } from '@/components/world/character/domains/registeringWorldPlazaCharacterEngineDefinitions';
import { usingWorldPlazaSelectedAvatarCharacterDefinition } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarCharacterDefinition';
import { usingWorldPlazaSpritcoreUpgradeBonuses } from '@/components/world/spritcore/hooks/usingWorldPlazaSpritcoreUpgradeBonuses';

/**
 * Resolves the declarative character engine definition for the local player.
 */
export function usingWorldPlazaSelectedCharacterEngineDefinition(): DefiningWorldPlazaCharacterEngineDefinition {
  const avatarDefinition = usingWorldPlazaSelectedAvatarCharacterDefinition();

  return resolvingWorldPlazaCharacterEngineDefinitionForSkinId(
    avatarDefinition.skinId
  );
}

/**
 * Resolves derived stats for the local player's character definition.
 */
export function usingWorldPlazaSelectedCharacterEngineDerivedStats(): ComputingWorldPlazaCharacterEngineDerivedStats {
  const definition = usingWorldPlazaSelectedCharacterEngineDefinition();
  const spritcoreBonuses = usingWorldPlazaSpritcoreUpgradeBonuses();

  return computingWorldPlazaCharacterEngineDerivedStats(
    definition,
    spritcoreBonuses
  );
}
