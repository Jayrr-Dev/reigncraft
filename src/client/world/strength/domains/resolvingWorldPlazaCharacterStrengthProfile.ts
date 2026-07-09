/**
 * Translates a character-engine definition into a strength profile.
 *
 * @module components/world/strength/domains/resolvingWorldPlazaCharacterStrengthProfile
 */

import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import {
  computingWorldPlazaStrengthIndexScore,
  type ComputingWorldPlazaStrengthIndexResult,
} from '@/components/world/strength/domains/computingWorldPlazaStrengthIndexScore';
import {
  DEFINING_WORLD_PLAZA_STRENGTH_PLAYER_BASELINE_ATTACK_INTERVAL_MS,
  type DefiningWorldPlazaStrengthModifier,
  type DefiningWorldPlazaStrengthProfile,
} from '@/components/world/strength/domains/definingWorldPlazaStrengthIndexConstants';

/**
 * Builds the normalized strength profile for one playable character.
 * Extra modifiers (equipment, buffs, party bonuses, ...) can be appended by
 * callers without touching this mapping.
 */
export function resolvingWorldPlazaCharacterStrengthProfile(
  definition: DefiningWorldPlazaCharacterEngineDefinition,
  extraModifiers: readonly DefiningWorldPlazaStrengthModifier[] = []
): DefiningWorldPlazaStrengthProfile {
  const derived = computingWorldPlazaCharacterEngineDerivedStats(definition);
  const attacksPerSecond =
    (1000 / DEFINING_WORLD_PLAZA_STRENGTH_PLAYER_BASELINE_ATTACK_INTERVAL_MS) *
    derived.attackSpeed;

  return {
    subjectId: definition.characterId,
    subjectKind: 'player-character',
    displayName: definition.displayName,
    maxHealth: derived.effectiveMaxHealth,
    healthRegenPerSecond: derived.healthRegenPerSecond,
    defense: derived.defense,
    attackPower: derived.attackPower,
    attacksPerSecond,
    walkSpeedGridPerSecond: derived.walkSpeedGridPerSecond,
    runSpeedGridPerSecond: derived.runSpeedGridPerSecond,
    modifiers: extraModifiers,
  };
}

/** Convenience wrapper: definition straight to a scored strength index. */
export function resolvingWorldPlazaCharacterStrengthIndex(
  definition: DefiningWorldPlazaCharacterEngineDefinition,
  extraModifiers: readonly DefiningWorldPlazaStrengthModifier[] = []
): ComputingWorldPlazaStrengthIndexResult {
  return computingWorldPlazaStrengthIndexScore(
    resolvingWorldPlazaCharacterStrengthProfile(definition, extraModifiers)
  );
}
