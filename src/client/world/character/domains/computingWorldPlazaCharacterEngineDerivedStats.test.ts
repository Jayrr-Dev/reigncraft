import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import {
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET,
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_PARITY_LEVEL,
} from '@/components/world/character/domains/definingWorldPlazaCharacterEngineGrowthLaneConstants';
import { resolvingWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/registeringWorldPlazaCharacterEngineDefinitions';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { resolvingWorldPlazaScaledAttackSpeed } from '@/components/world/domains/resolvingWorldPlazaGlobalAttackSpeedScale';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaCharacterEngineDerivedStats', () => {
  it('keeps girl at full catalog power with no growth-lane offset', () => {
    const girl = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    const derived = computingWorldPlazaCharacterEngineDerivedStats(girl);

    expect(girl.scaling.growthLaneLevelOffset).toBeUndefined();
    expect(derived.effectiveMaxHealth).toBe(1000);
    expect(derived.attackPower).toBe(300);
    expect(derived.defense).toBe(5);
  });

  it('inherits wildlife vitals for unlocked animal transforms', () => {
    const wildlifeGrizzly = resolvingWildlifeSpeciesDefinition('grizzly');
    expect(wildlifeGrizzly).not.toBeNull();
    if (!wildlifeGrizzly) {
      return;
    }

    const grizzly = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
    );
    const derived = computingWorldPlazaCharacterEngineDerivedStats(grizzly);

    expect(grizzly.scaling.growthLaneLevelOffset).toBe(
      DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET
    );
    expect(grizzly.vitals.baseMaxHealth).toBe(
      wildlifeGrizzly.vitals.baseMaxHealth
    );
    expect(grizzly.stats.attackPower).toBe(wildlifeGrizzly.vitals.attackPower);
    expect(grizzly.stats.defense).toBe(wildlifeGrizzly.vitals.defense);
    expect(grizzly.locomotion.walkSpeedGridPerSecond).toBe(
      wildlifeGrizzly.vitals.walkSpeedGridPerSecond
    );
    expect(grizzly.locomotion.runSpeedGridPerSecond).toBe(
      wildlifeGrizzly.vitals.runSpeedGridPerSecond
    );
    expect(grizzly.immunities).toContain('cold');

    // Unlock lane: mature − 20 × perLevel, floors applied
    expect(derived.effectiveMaxHealth).toBe(100);
    expect(derived.attackPower).toBe(1);
    expect(derived.defense).toBe(0);
    expect(derived.attackSpeed).toBe(
      resolvingWorldPlazaScaledAttackSpeed(grizzly.stats.attackSpeed)
    );
    expect(derived.sizeScale).toBe(wildlifeGrizzly.sizeScale);
    expect(derived.collisionRadiusGrid).toBe(
      wildlifeGrizzly.collisionRadiusGrid
    );
    expect(derived.hungerDrainMultiplier).toBe(1.3);
  });

  it('reaches mature wildlife stats at the unlocked-transform parity level', () => {
    const wildlifeGrizzly = resolvingWildlifeSpeciesDefinition('grizzly');
    expect(wildlifeGrizzly).not.toBeNull();
    if (!wildlifeGrizzly) {
      return;
    }

    const grizzly = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
    );
    const parity = {
      ...grizzly,
      scaling: {
        ...grizzly.scaling,
        level: DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_PARITY_LEVEL,
      },
    };
    const derived = computingWorldPlazaCharacterEngineDerivedStats(parity);

    expect(derived.effectiveMaxHealth).toBe(
      wildlifeGrizzly.vitals.baseMaxHealth
    );
    expect(derived.attackPower).toBe(wildlifeGrizzly.vitals.attackPower);
    expect(derived.defense).toBe(wildlifeGrizzly.vitals.defense);
  });

  it('applies per-level scaling bonuses on top of the growth lane', () => {
    const grizzly = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
    );
    const levelFive = {
      ...grizzly,
      scaling: { ...grizzly.scaling, level: 5 },
    };
    const derived = computingWorldPlazaCharacterEngineDerivedStats(levelFive);

    // bonus steps = (5 - 1) + (-20) = -16
    expect(derived.effectiveMaxHealth).toBe(
      Math.max(100, grizzly.vitals.baseMaxHealth + grizzly.scaling.healthPerLevel * -16)
    );
    expect(derived.attackPower).toBe(
      Math.max(1, grizzly.stats.attackPower + grizzly.scaling.attackPerLevel * -16)
    );
    expect(derived.defense).toBe(
      Math.max(0, grizzly.stats.defense + grizzly.scaling.defensePerLevel * -16)
    );
  });

  it('allows an explicit collision height override', () => {
    const girl = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    const derived = computingWorldPlazaCharacterEngineDerivedStats({
      ...girl,
      size: { ...girl.size, heightWorldLayers: 3.5 },
    });

    expect(derived.heightWorldLayers).toBe(3.5);
  });
});
