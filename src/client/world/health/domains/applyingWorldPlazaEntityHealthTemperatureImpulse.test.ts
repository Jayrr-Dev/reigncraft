import { describe, expect, it } from 'vitest';

import {
  advancingWorldPlazaEntityHealthCombatTemperatureOffset,
  applyingWorldPlazaEntityHealthTemperatureImpulse,
  resolvingWorldPlazaEntityEffectiveLocalTemperatureCelsius,
} from '@/components/world/health/domains/applyingWorldPlazaEntityHealthTemperatureImpulse';
import { DEFINING_WORLD_PLAZA_COMBAT_TEMPERATURE_OFFSET_MAX_ABS_CELSIUS } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

describe('applyingWorldPlazaEntityHealthTemperatureImpulse', () => {
  it('adds heat and cold impulses to the combat offset', () => {
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityHealthTemperatureImpulse(state, 22);
    expect(state.combatTemperatureOffsetCelsius).toBe(22);

    state = applyingWorldPlazaEntityHealthTemperatureImpulse(state, -10);
    expect(state.combatTemperatureOffsetCelsius).toBe(12);
  });

  it('clamps stacked offset to the soft max abs', () => {
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityHealthTemperatureImpulse(state, 200);
    expect(state.combatTemperatureOffsetCelsius).toBe(
      DEFINING_WORLD_PLAZA_COMBAT_TEMPERATURE_OFFSET_MAX_ABS_CELSIUS
    );

    state = applyingWorldPlazaEntityHealthTemperatureImpulse(state, -400);
    expect(state.combatTemperatureOffsetCelsius).toBe(
      -DEFINING_WORLD_PLAZA_COMBAT_TEMPERATURE_OFFSET_MAX_ABS_CELSIUS
    );
  });

  it('decays offset toward zero over time', () => {
    let state = applyingWorldPlazaEntityHealthTemperatureImpulse(
      creatingWorldPlazaEntityHealthInitialState(),
      40
    );

    state = advancingWorldPlazaEntityHealthCombatTemperatureOffset(state, 1000);

    expect(state.combatTemperatureOffsetCelsius).toBeGreaterThan(0);
    expect(state.combatTemperatureOffsetCelsius).toBeLessThan(40);
  });

  it('adds offset into effective local temperature', () => {
    const state = applyingWorldPlazaEntityHealthTemperatureImpulse(
      creatingWorldPlazaEntityHealthInitialState(),
      -18
    );

    expect(
      resolvingWorldPlazaEntityEffectiveLocalTemperatureCelsius(20, state)
    ).toBe(2);
  });
});
