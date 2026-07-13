import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_MAX_CELSIUS,
  computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount,
} from './definingWorldPlazaTemperatureConstants';

describe('computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount', () => {
  it('raises temperature with each inventory wood', () => {
    const oneWood =
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(1);
    const twoWood =
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(2);
    const threeWood =
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(3);

    assert.equal(oneWood, DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS);
    assert.ok(twoWood > oneWood);
    assert.ok(threeWood > twoWood);
  });

  it('caps campfire heat below lava-scale temperatures', () => {
    assert.equal(
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(99),
      DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_MAX_CELSIUS
    );
  });
});
