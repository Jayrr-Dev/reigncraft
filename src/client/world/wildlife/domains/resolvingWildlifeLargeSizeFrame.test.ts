import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_OBESE_HEALTH_MULTIPLIER_TIER_1 } from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import { DEFINING_WILDLIFE_TURTLE_OBESE_SIZE_AND_HEALTH_BOOST_MULTIPLIER } from '@/components/world/wildlife/domains/definingWildlifeSpeciesPassiveTraitConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeInstanceBaseMaxHealth,
  resolvingWildlifeInstanceCollisionRadiusGrid,
  resolvingWildlifeInstanceCombatStatMultiplier,
  resolvingWildlifeInstanceMaxStaminaRatio,
  resolvingWildlifeInstanceRunSpeedGridPerSecond,
  resolvingWildlifeInstanceSizeScale,
  resolvingWildlifeInstanceStaminaConfig,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { resolvingWildlifeLargeSizeFrameFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameFromAnchor';
import { resolvingWildlifeMeatDropQuantity } from '@/components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameMeatDropQuantity';
import { describe, expect, it } from 'vitest';

function buildingAnchor(
  tileX: number,
  tileY: number
): DefiningWildlifeSpawnAnchor {
  return {
    anchorId: `wildlife:${tileX}:${tileY}:0`,
    tileX,
    tileY,
    speciesId: 'grey-wolf',
    packIndex: 0,
    packSize: 1,
    seed: 0.5,
  };
}

describe('resolvingWildlifeLargeSizeFrameFromAnchor', () => {
  it('returns obese or apex only for +1σ, +2σ, +3σ, and +4σ tiers', () => {
    expect(
      resolvingWildlifeLargeSizeFrameFromAnchor(buildingAnchor(120, 84), 0)
    ).toBeNull();
    expect(
      resolvingWildlifeLargeSizeFrameFromAnchor(buildingAnchor(120, 84), 1)
    ).toMatch(/^(obese|apex)$/);
    expect(
      resolvingWildlifeLargeSizeFrameFromAnchor(buildingAnchor(120, 84), 2)
    ).toMatch(/^(obese|apex)$/);
    expect(
      resolvingWildlifeLargeSizeFrameFromAnchor(buildingAnchor(120, 84), 3)
    ).toMatch(/^(obese|apex)$/);
    expect(
      resolvingWildlifeLargeSizeFrameFromAnchor(buildingAnchor(120, 84), 4)
    ).toMatch(/^(obese|apex)$/);
  });
});

describe('resolvingWildlifeLargeSizeFrame combat and loot', () => {
  const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];

  it('buffs obese health and slows obese movement', () => {
    const apexInstance = creatingWildlifeTestInstance({
      sizeScaleSample: 1,
      largeSizeFrame: 'apex',
    });
    const obeseInstance = creatingWildlifeTestInstance({
      sizeScaleSample: 1,
      largeSizeFrame: 'obese',
    });

    expect(
      resolvingWildlifeInstanceBaseMaxHealth(species, obeseInstance)
    ).toBeGreaterThan(
      resolvingWildlifeInstanceBaseMaxHealth(species, apexInstance)
    );
    expect(
      resolvingWildlifeInstanceRunSpeedGridPerSecond(species, obeseInstance)
    ).toBeLessThan(
      resolvingWildlifeInstanceRunSpeedGridPerSecond(species, apexInstance)
    );
  });

  it('raises apex stamina cap and regen over normal large peers', () => {
    expect(
      resolvingWildlifeInstanceMaxStaminaRatio({ largeSizeFrame: 'apex' })
    ).toBe(1.3);

    const apexInstance = creatingWildlifeTestInstance({
      sizeScaleSample: 1,
      largeSizeFrame: 'apex',
    });
    const normalLargeInstance = creatingWildlifeTestInstance({
      sizeScaleSample: 1,
      largeSizeFrame: null,
    });

    expect(
      resolvingWildlifeInstanceStaminaConfig(species, apexInstance)
        .regenMultiplier
    ).toBeGreaterThan(
      resolvingWildlifeInstanceStaminaConfig(species, normalLargeInstance)
        .regenMultiplier
    );
  });

  it('drops extra meat for obese large animals', () => {
    expect(
      resolvingWildlifeMeatDropQuantity(
        creatingWildlifeTestInstance({
          largeSizeFrame: 'obese',
          sizeScaleSample: 2,
          spawnAnchor: { x: 120.5, y: 84.5, layer: 1 },
        }),
        species
      )
    ).toBeGreaterThanOrEqual(3);
    expect(
      resolvingWildlifeMeatDropQuantity(
        creatingWildlifeTestInstance({
          largeSizeFrame: 'apex',
          sizeScaleSample: 2,
        }),
        species
      )
    ).toBe(species.loot.quantity);
  });
});

describe('obese turtle presentation and health', () => {
  const turtle = DEFINING_WILDLIFE_SPECIES_REGISTRY.turtle;

  it('renders and collides at double same-tier turtle size', () => {
    const apexTurtle = creatingWildlifeTestInstance({
      speciesId: 'turtle',
      sizeScaleSample: 1,
      largeSizeFrame: 'apex',
    });
    const obeseTurtle = creatingWildlifeTestInstance({
      speciesId: 'turtle',
      sizeScaleSample: 1,
      largeSizeFrame: 'obese',
    });

    expect(resolvingWildlifeInstanceSizeScale(turtle, obeseTurtle)).toBeCloseTo(
      resolvingWildlifeInstanceSizeScale(turtle, apexTurtle) *
        DEFINING_WILDLIFE_TURTLE_OBESE_SIZE_AND_HEALTH_BOOST_MULTIPLIER
    );
    expect(
      resolvingWildlifeInstanceCollisionRadiusGrid(turtle, obeseTurtle)
    ).toBeCloseTo(
      resolvingWildlifeInstanceCollisionRadiusGrid(turtle, apexTurtle) *
        DEFINING_WILDLIFE_TURTLE_OBESE_SIZE_AND_HEALTH_BOOST_MULTIPLIER
    );
  });

  it('doubles obese health over a same-tier apex turtle', () => {
    const obeseTurtle = creatingWildlifeTestInstance({
      speciesId: 'turtle',
      sizeScaleSample: 1,
      largeSizeFrame: 'obese',
    });
    const combatMultiplier = resolvingWildlifeInstanceCombatStatMultiplier(
      turtle,
      obeseTurtle
    );

    expect(resolvingWildlifeInstanceBaseMaxHealth(turtle, obeseTurtle)).toBe(
      Math.round(
        turtle.vitals.baseMaxHealth *
          combatMultiplier *
          DEFINING_WILDLIFE_TURTLE_OBESE_SIZE_AND_HEALTH_BOOST_MULTIPLIER
      )
    );
    expect(combatMultiplier).toBeCloseTo(
      resolvingWildlifeInstanceCombatStatMultiplier(
        turtle,
        creatingWildlifeTestInstance({
          speciesId: 'turtle',
          sizeScaleSample: 1,
          largeSizeFrame: 'apex',
        })
      ) * DEFINING_WILDLIFE_OBESE_HEALTH_MULTIPLIER_TIER_1
    );
  });
});
