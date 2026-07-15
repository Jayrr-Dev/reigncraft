import { DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_DEFINITIONS } from '@/components/world/character/domains/registeringWorldPlazaCharacterEngineDefinitions';
import { syncingWorldPlazaCharacterEngineHealthDerivedStats } from '@/components/world/character/domains/syncingWorldPlazaCharacterEngineHealthDerivedStats';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';
import { describe, expect, it } from 'vitest';

const girlDefinition =
  DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_DEFINITIONS[
    DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
  ];

describe('syncingWorldPlazaCharacterEngineHealthDerivedStats', () => {
  it('keeps death state when Spritcore max health drops', () => {
    const deadState = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      baseMaxHealth: 2000,
      currentHealth: 0,
      isDead: true,
    };

    const next = syncingWorldPlazaCharacterEngineHealthDerivedStats(
      deadState,
      girlDefinition,
      {
        ...WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
        bonusMaxHealth: 900,
      }
    );

    expect(next.isDead).toBe(true);
    expect(next.currentHealth).toBe(0);
    expect(next.baseMaxHealth).toBe(girlDefinition.vitals.baseMaxHealth + 900);
  });

  it('clamps live current health when max shrinks', () => {
    const liveState = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      baseMaxHealth: 2000,
      currentHealth: 1800,
      isDead: false,
    };

    const next = syncingWorldPlazaCharacterEngineHealthDerivedStats(
      liveState,
      girlDefinition,
      WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES
    );

    expect(next.isDead).toBe(false);
    expect(next.baseMaxHealth).toBe(girlDefinition.vitals.baseMaxHealth);
    expect(next.currentHealth).toBe(girlDefinition.vitals.baseMaxHealth);
  });
});
