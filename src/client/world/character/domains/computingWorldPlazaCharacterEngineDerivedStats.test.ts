import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import { resolvingWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/registeringWorldPlazaCharacterEngineDefinitions';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaCharacterEngineDerivedStats', () => {
  it('scales grizzly health and collision radius by size', () => {
    const grizzly = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
    );
    const derived = computingWorldPlazaCharacterEngineDerivedStats(grizzly);

    expect(derived.effectiveMaxHealth).toBe(1400);
    expect(derived.sizeScale).toBe(1.25);
    expect(derived.heightWorldLayers).toBe(5);
    expect(derived.collisionRadiusGrid).toBeCloseTo(0.3125);
    expect(derived.hungerDrainMultiplier).toBe(1.3);
  });

  it('applies per-level scaling bonuses', () => {
    const grizzly = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
    );
    const levelFive = {
      ...grizzly,
      scaling: { ...grizzly.scaling, level: 5 },
    };
    const derived = computingWorldPlazaCharacterEngineDerivedStats(levelFive);

    expect(derived.effectiveMaxHealth).toBe(1400 + 80 * 4);
    expect(derived.attackPower).toBe(300 + 3 * 4);
    expect(derived.defense).toBe(10 + 2 * 4);
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
