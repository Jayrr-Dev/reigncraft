import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import {
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET,
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_UNLOCK_FLOOR_RATIO,
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_PARITY_LEVEL,
} from '@/components/world/character/domains/definingWorldPlazaCharacterEngineGrowthLaneConstants';
import { DEFINING_WORLD_PLAZA_CHARACTER_DEFAULT_MASS_KG } from '@/components/world/character/domains/definingWorldPlazaCharacterWeightDisplayConstants';
import { resolvingWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/registeringWorldPlazaCharacterEngineDefinitions';
import {
  computingWorldPlazaAnimalTransformMatureCombatStat,
  DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_ATTACK_FROM_AUTHOR_MULTIPLIER,
  DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_HEALTH_FROM_AUTHOR_MULTIPLIER,
} from '@/components/world/domains/definingWorldPlazaAnimalTransformVitalsScaleConstants';
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
    expect(derived.massKg).toBe(DEFINING_WORLD_PLAZA_CHARACTER_DEFAULT_MASS_KG);
  });

  it('scales wildlife vitals into player transform space with a 25% unlock floor', () => {
    const wildlifeGrizzly = resolvingWildlifeSpeciesDefinition('grizzly');
    expect(wildlifeGrizzly).not.toBeNull();
    if (!wildlifeGrizzly) {
      return;
    }

    const matureMaxHealth = computingWorldPlazaAnimalTransformMatureCombatStat({
      wildlifeRuntimeStat: wildlifeGrizzly.vitals.baseMaxHealth,
      fromAuthorMultiplier:
        DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_HEALTH_FROM_AUTHOR_MULTIPLIER,
    });
    const matureAttackPower =
      computingWorldPlazaAnimalTransformMatureCombatStat({
        wildlifeRuntimeStat: wildlifeGrizzly.vitals.attackPower,
        fromAuthorMultiplier:
          DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_ATTACK_FROM_AUTHOR_MULTIPLIER,
      });

    const grizzly = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
    );
    const derived = computingWorldPlazaCharacterEngineDerivedStats(grizzly);

    expect(grizzly.scaling.growthLaneLevelOffset).toBe(
      DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_LEVEL_OFFSET
    );
    expect(grizzly.vitals.baseMaxHealth).toBe(matureMaxHealth);
    expect(grizzly.stats.attackPower).toBe(matureAttackPower);
    expect(grizzly.stats.defense).toBe(wildlifeGrizzly.vitals.defense);
    expect(grizzly.massKg).toBe(wildlifeGrizzly.massKg);
    expect(grizzly.immunities).toContain('cold');

    expect(derived.effectiveMaxHealth).toBeCloseTo(
      matureMaxHealth *
        DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_UNLOCK_FLOOR_RATIO
    );
    expect(derived.attackPower).toBeCloseTo(
      matureAttackPower *
        DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_UNLOCK_FLOOR_RATIO
    );
    expect(derived.defense).toBeCloseTo(
      wildlifeGrizzly.vitals.defense *
        DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_GROWTH_LANE_UNLOCK_FLOOR_RATIO
    );
    expect(derived.massKg).toBe(wildlifeGrizzly.massKg);
    expect(derived.attackSpeed).toBe(
      resolvingWorldPlazaScaledAttackSpeed(grizzly.stats.attackSpeed)
    );
  });

  it('reaches mature scaled wildlife stats at the unlocked-transform parity level', () => {
    const wildlifeGrizzly = resolvingWildlifeSpeciesDefinition('grizzly');
    expect(wildlifeGrizzly).not.toBeNull();
    if (!wildlifeGrizzly) {
      return;
    }

    const matureMaxHealth = computingWorldPlazaAnimalTransformMatureCombatStat({
      wildlifeRuntimeStat: wildlifeGrizzly.vitals.baseMaxHealth,
      fromAuthorMultiplier:
        DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_HEALTH_FROM_AUTHOR_MULTIPLIER,
    });
    const matureAttackPower =
      computingWorldPlazaAnimalTransformMatureCombatStat({
        wildlifeRuntimeStat: wildlifeGrizzly.vitals.attackPower,
        fromAuthorMultiplier:
          DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_ATTACK_FROM_AUTHOR_MULTIPLIER,
      });

    const grizzly = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
    );
    const parity = {
      ...grizzly,
      scaling: {
        ...grizzly.scaling,
        level:
          DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_UNLOCKED_TRANSFORM_PARITY_LEVEL,
      },
    };
    const derived = computingWorldPlazaCharacterEngineDerivedStats(parity);

    expect(derived.effectiveMaxHealth).toBeCloseTo(matureMaxHealth);
    expect(derived.attackPower).toBeCloseTo(matureAttackPower);
    expect(derived.defense).toBeCloseTo(wildlifeGrizzly.vitals.defense);
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
    expect(derived.effectiveMaxHealth).toBeCloseTo(
      Math.max(
        100,
        grizzly.vitals.baseMaxHealth + grizzly.scaling.healthPerLevel * -16
      )
    );
    expect(derived.attackPower).toBeCloseTo(
      Math.max(
        1,
        grizzly.stats.attackPower + grizzly.scaling.attackPerLevel * -16
      )
    );
    expect(derived.defense).toBeCloseTo(
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
