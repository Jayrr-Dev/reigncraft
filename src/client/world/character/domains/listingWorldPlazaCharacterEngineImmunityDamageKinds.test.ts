import { listingWorldPlazaCharacterEngineImmunityDamageKinds } from '@/components/world/character/domains/applyingWorldPlazaCharacterEngineImmunities';
import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { DEFINING_WORLD_PLAZA_ENTITY_BLEED_IMMUNITY_DAMAGE_KINDS } from '@/components/world/health/domains/definingWorldPlazaEntityBuffImmunityDamageKinds';
import { describe, expect, it } from 'vitest';

function buildingDefinition(
  immunities: DefiningWorldPlazaCharacterEngineDefinition['immunities']
): DefiningWorldPlazaCharacterEngineDefinition {
  return {
    characterId: 'test',
    displayName: 'Test',
    presentation: { skinId: 'test' },
    size: { sizeScale: 1 },
    locomotion: { allowedMotionKinds: ['idle', 'walk', 'run', 'jump'] },
    vitals: { baseMaxHealth: 100 },
    massKg: 70,
    stats: {
      attackPower: 10,
      attackSpeed: 1,
      defense: 1,
      hungerDrainMultiplier: 1,
    },
    scaling: {
      level: 1,
      healthPerLevel: 1,
      attackPerLevel: 1,
      defensePerLevel: 1,
    },
    immunities,
    startingStatusEffectIds: [],
    skillIds: [],
  };
}

describe('listingWorldPlazaCharacterEngineImmunityDamageKinds', () => {
  it('expands bleed immunity to the full bleed DoT group', () => {
    const kinds = listingWorldPlazaCharacterEngineImmunityDamageKinds(
      buildingDefinition(['bleed'])
    );

    for (const kind of DEFINING_WORLD_PLAZA_ENTITY_BLEED_IMMUNITY_DAMAGE_KINDS) {
      expect(kinds).toContain(kind);
    }
  });
});
