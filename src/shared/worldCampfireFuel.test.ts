import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import {
  computingWorldCampfireEffectiveIntensity,
  computingWorldCampfireEffectiveWoodCount,
  computingWorldCampfireFuelMsFromInventoryWoodRefuel,
  computingWorldCampfireFuelMsFromWoodCount,
  computingWorldCampfireIntensityFromNearbyWoodCount,
  computingWorldCampfireLightBrightnessFromBurnTier,
  computingWorldCampfireLightRadiusScaleFromBurnTier,
  countingWorldCampfireNearbyFuelWoodBlocksFromPlacedBlocks,
  resolvingWorldCampfireBurnTierFromNearbyWoodCount,
  resolvingWorldCampfireFlameIntensityTierFromEffectiveWoodCount,
} from './worldCampfireFuel';

describe('worldCampfireFuel', () => {
  it('maps wood counts to the requested burn durations', () => {
    assert.equal(computingWorldCampfireFuelMsFromWoodCount(1), 180_000);
    assert.equal(computingWorldCampfireFuelMsFromWoodCount(3), 540_000);
    assert.equal(computingWorldCampfireFuelMsFromWoodCount(4), 240_000);
    assert.equal(computingWorldCampfireFuelMsFromWoodCount(5), 300_000);
  });

  it('starts weak and ramps heat with nearby placed wood', () => {
    assert.equal(resolvingWorldCampfireBurnTierFromNearbyWoodCount(0), 'weak');
    assert.equal(resolvingWorldCampfireBurnTierFromNearbyWoodCount(1), 'small');
    assert.equal(resolvingWorldCampfireBurnTierFromNearbyWoodCount(3), 'mid');
    assert.equal(resolvingWorldCampfireBurnTierFromNearbyWoodCount(4), 'big');
    assert.equal(computingWorldCampfireIntensityFromNearbyWoodCount(0), 0.24);
    assert.equal(computingWorldCampfireIntensityFromNearbyWoodCount(3), 0.68);
    assert.equal(computingWorldCampfireIntensityFromNearbyWoodCount(5), 1);
  });

  it('refuels at 3 min per inventory wood until the big tier', () => {
    assert.equal(
      computingWorldCampfireFuelMsFromInventoryWoodRefuel(0),
      180_000
    );
    assert.equal(
      computingWorldCampfireFuelMsFromInventoryWoodRefuel(3),
      180_000
    );
    assert.equal(
      computingWorldCampfireFuelMsFromInventoryWoodRefuel(4),
      60_000
    );
  });

  it('dims flame intensity as fuel depletes', () => {
    const fullFuel = computingWorldCampfireEffectiveIntensity(
      0,
      540_000,
      540_000,
      3
    );
    const lowFuel = computingWorldCampfireEffectiveIntensity(
      0,
      54_000,
      540_000,
      3
    );

    assert.ok(fullFuel > lowFuel);
    assert.ok(lowFuel > 0);
  });

  it('counts inventory wood toward small flame size', () => {
    assert.equal(
      computingWorldCampfireEffectiveIntensity(0, 180_000, 180_000, 1),
      computingWorldCampfireIntensityFromNearbyWoodCount(1) * 1
    );
    assert.equal(
      resolvingWorldCampfireBurnTierFromNearbyWoodCount(
        computingWorldCampfireEffectiveWoodCount(0, 1)
      ),
      'small'
    );
    assert.equal(
      resolvingWorldCampfireFlameIntensityTierFromEffectiveWoodCount(1),
      1
    );
    assert.equal(
      resolvingWorldCampfireFlameIntensityTierFromEffectiveWoodCount(3),
      3
    );
    assert.equal(
      resolvingWorldCampfireFlameIntensityTierFromEffectiveWoodCount(5),
      5
    );
  });

  it('ignores other world layers and the campfire tile when counting placed wood', () => {
    const woodOnCampfireTile = {
      definitionId: 'basic:floor:wood',
      tilePosition: { tileX: 4, tileY: 4 },
      worldLayer: 0,
      metadata: {},
    };
    const woodOnOtherLayer = {
      definitionId: 'basic:floor:wood',
      tilePosition: { tileX: 5, tileY: 4 },
      worldLayer: 1,
      metadata: {},
    };
    const nearbyWood = {
      definitionId: 'basic:floor:wood',
      tilePosition: { tileX: 5, tileY: 4 },
      worldLayer: 0,
      metadata: {},
    };

    assert.equal(
      countingWorldCampfireNearbyFuelWoodBlocksFromPlacedBlocks(4, 4, 0, [
        woodOnCampfireTile,
        woodOnOtherLayer,
        nearbyWood,
      ]),
      1
    );
  });

  it('scales campfire lighting down for the small burn tier', () => {
    assert.equal(
      computingWorldCampfireLightRadiusScaleFromBurnTier(
        'small',
        180_000,
        180_000
      ),
      0.95
    );
    assert.equal(
      computingWorldCampfireLightBrightnessFromBurnTier(
        'small',
        180_000,
        180_000
      ),
      0.55
    );
    assert.ok(
      computingWorldCampfireLightRadiusScaleFromBurnTier(
        'big',
        180_000,
        180_000
      ) >
        computingWorldCampfireLightRadiusScaleFromBurnTier(
          'small',
          180_000,
          180_000
        )
    );
  });
});
