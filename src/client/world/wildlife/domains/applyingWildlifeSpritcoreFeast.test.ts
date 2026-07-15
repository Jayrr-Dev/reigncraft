import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { advancingWildlifeHealthStatusTick } from '@/components/world/wildlife/domains/advancingWildlifeHealthStatusTick';
import {
  applyingWildlifeSpritcoreFeast,
  checkingWildlifeSpritcoreFeastBoostsRegen,
  resolvingWildlifeSpritcoreFeastAttackPowerMultiplier,
} from '@/components/world/wildlife/domains/applyingWildlifeSpritcoreFeast';
import { checkingWildlifeSpeciesMayEatGroundFood } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesMayEatGroundFood';
import { computingWildlifeSpritcoreFeastAttackPowerMultiplier } from '@/components/world/wildlife/domains/computingWildlifeSpritcoreFeastAttackPowerMultiplier';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeNearestEdibleGroundFood } from '@/components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundFood';
import { describe, expect, it } from 'vitest';

describe('wildlife Spritcore feast', () => {
  it('lets every diet eat Spritcore', () => {
    expect(
      checkingWildlifeSpeciesMayEatGroundFood(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT
      )
    ).toBe(true);
    expect(
      checkingWildlifeSpeciesMayEatGroundFood(
        DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT
      )
    ).toBe(true);
    expect(
      checkingWildlifeSpeciesMayEatGroundFood(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.boar,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT
      )
    ).toBe(true);
  });

  it('prefers Spritcore over closer meat stacks', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const nearest = resolvingWildlifeNearestEdibleGroundFood(
      { x: 0.5, y: 0.5, layer: 1 },
      species,
      [
        {
          id: 'meat-near',
          itemTypeId: 'world-plaza-raw-deer-meat',
          quantity: 2,
          gridX: 1,
          gridY: 0,
          layer: 1,
          spawnedAt: 0,
        },
        {
          id: 'sc-far',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT,
          quantity: 40,
          gridX: 8,
          gridY: 0,
          layer: 1,
          spawnedAt: 0,
        },
      ]
    );

    expect(nearest?.id).toBe('sc-far');
  });

  it('scales attack power with SC quantity and caps the multiplier', () => {
    expect(computingWildlifeSpritcoreFeastAttackPowerMultiplier(0)).toBe(1);
    expect(computingWildlifeSpritcoreFeastAttackPowerMultiplier(40)).toBe(1.8);
    expect(computingWildlifeSpritcoreFeastAttackPowerMultiplier(10_000)).toBe(
      3
    );
  });

  it('grants power and fast regen until full HP after a feast', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    const baseMaxHealth = species.vitals.baseMaxHealth;
    const damaged = creatingWildlifeTestInstance({
      speciesId: species.speciesId,
      healthState: {
        ...creatingWorldPlazaEntityHealthInitialState(),
        baseMaxHealth,
        currentHealth: Math.floor(baseMaxHealth / 2),
      },
    });

    const feasted = applyingWildlifeSpritcoreFeast(damaged, 40, 1_000);

    expect(checkingWildlifeSpritcoreFeastBoostsRegen(feasted)).toBe(true);
    expect(
      resolvingWildlifeSpritcoreFeastAttackPowerMultiplier(feasted, 1_000)
    ).toBe(1.8);

    let next = feasted;

    for (let tick = 0; tick < 200; tick += 1) {
      next = advancingWildlifeHealthStatusTick({
        instance: next,
        deltaMs: 100,
        nowMs: 1_000 + tick * 100,
      });

      if (next.healthState.currentHealth >= baseMaxHealth) {
        break;
      }
    }

    expect(next.healthState.currentHealth).toBe(baseMaxHealth);
    expect(checkingWildlifeSpritcoreFeastBoostsRegen(next)).toBe(false);
    expect(
      resolvingWildlifeSpritcoreFeastAttackPowerMultiplier(
        next,
        next.spritcoreFeast?.powerExpiresAtMs
          ? next.spritcoreFeast.powerExpiresAtMs - 1
          : 1_000
      )
    ).toBeGreaterThan(1);
  });
});
