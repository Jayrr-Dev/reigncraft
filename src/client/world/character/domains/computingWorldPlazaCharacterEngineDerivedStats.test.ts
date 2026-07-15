import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import { DEFINING_WORLD_PLAZA_CHARACTER_DEFAULT_MASS_KG } from '@/components/world/character/domains/definingWorldPlazaCharacterWeightDisplayConstants';
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
    expect(derived.level).toBe(1);
    expect(derived.massKg).toBe(DEFINING_WORLD_PLAZA_CHARACTER_DEFAULT_MASS_KG);
  });

  it('raises display level from Spritcore bonuses via combat power', () => {
    const girl = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    const derived = computingWorldPlazaCharacterEngineDerivedStats(girl, {
      bonusMaxHealth: 19_000,
      bonusAttackPower: 0,
      bonusAttackSpeed: 0,
      totalSpritcoreInvested: 1,
    });

    expect(derived.effectiveMaxHealth).toBe(20_000);
    expect(derived.level).toBe(20);
  });

  it('matches wildlife counterpart HP, attack, defense, and mass at level 1', () => {
    const wildlifeGrizzly = resolvingWildlifeSpeciesDefinition('grizzly');
    expect(wildlifeGrizzly).not.toBeNull();
    if (!wildlifeGrizzly) {
      return;
    }

    const grizzly = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
    );
    const derived = computingWorldPlazaCharacterEngineDerivedStats(grizzly);

    expect(grizzly.scaling.growthLaneLevelOffset).toBeUndefined();
    expect(grizzly.vitals.baseMaxHealth).toBe(
      wildlifeGrizzly.vitals.baseMaxHealth
    );
    expect(grizzly.stats.attackPower).toBe(wildlifeGrizzly.vitals.attackPower);
    expect(grizzly.stats.defense).toBe(wildlifeGrizzly.vitals.defense);
    expect(grizzly.massKg).toBe(wildlifeGrizzly.massKg);

    expect(derived.effectiveMaxHealth).toBe(
      wildlifeGrizzly.vitals.baseMaxHealth
    );
    expect(derived.attackPower).toBe(wildlifeGrizzly.vitals.attackPower);
    expect(derived.defense).toBe(wildlifeGrizzly.vitals.defense);
    expect(derived.massKg).toBe(wildlifeGrizzly.massKg);
    expect(derived.attackSpeed).toBe(
      resolvingWorldPlazaScaledAttackSpeed(grizzly.stats.attackSpeed)
    );
    expect(derived.walkSpeedGridPerSecond).toBe(
      wildlifeGrizzly.vitals.walkSpeedGridPerSecond
    );
    expect(derived.runSpeedGridPerSecond).toBe(
      wildlifeGrizzly.vitals.runSpeedGridPerSecond
    );
  });

  it('applies per-level scaling bonuses above level 1', () => {
    const grizzly = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
    );
    const levelFive = {
      ...grizzly,
      scaling: { ...grizzly.scaling, level: 5 },
    };
    const derived = computingWorldPlazaCharacterEngineDerivedStats(levelFive);

    expect(derived.effectiveMaxHealth).toBe(
      grizzly.vitals.baseMaxHealth + grizzly.scaling.healthPerLevel * 4
    );
    expect(derived.attackPower).toBe(
      grizzly.stats.attackPower + grizzly.scaling.attackPerLevel * 4
    );
    expect(derived.defense).toBe(
      grizzly.stats.defense + grizzly.scaling.defensePerLevel * 4
    );
  });

  it('defaults maxJumpLayerReach to 4 for girl', () => {
    const girl = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    const derived = computingWorldPlazaCharacterEngineDerivedStats(girl);

    expect(derived.maxJumpLayerReach).toBe(4);
  });

  it('inherits wildlife maxJumpLayerReach for animal skins', () => {
    const wildlifeCowBrown = resolvingWildlifeSpeciesDefinition('cow-brown');
    const wildlifeGrizzly = resolvingWildlifeSpeciesDefinition('grizzly');
    expect(wildlifeCowBrown).not.toBeNull();
    expect(wildlifeGrizzly).not.toBeNull();
    if (!wildlifeCowBrown || !wildlifeGrizzly) {
      return;
    }

    const cowBrown = resolvingWorldPlazaCharacterEngineDefinition('cow-brown');
    const grizzly = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
    );

    expect(cowBrown.locomotion.maxJumpLayerReach).toBe(
      wildlifeCowBrown.jump.maxJumpLayerReach
    );
    expect(grizzly.locomotion.maxJumpLayerReach).toBe(
      wildlifeGrizzly.jump.maxJumpLayerReach
    );
    expect(
      computingWorldPlazaCharacterEngineDerivedStats(cowBrown).maxJumpLayerReach
    ).toBe(0);
    expect(
      computingWorldPlazaCharacterEngineDerivedStats(grizzly).maxJumpLayerReach
    ).toBe(4);
    expect(cowBrown.locomotion.allowedMotionKinds.includes('jump')).toBe(false);
    expect(grizzly.locomotion.allowedMotionKinds.includes('jump')).toBe(true);
  });

  it('gives cyroborn a fast jump speed scale with normal distance', () => {
    const cyroborn = resolvingWorldPlazaCharacterEngineDefinition('cyroborn');
    const derived = computingWorldPlazaCharacterEngineDerivedStats(cyroborn);

    expect(derived.jumpDistanceScale).toBe(1);
    expect(derived.jumpSpeedScale).toBe(2);
    expect(derived.maxJumpLayerReach).toBe(8);
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
