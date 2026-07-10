import { advancingWorldPlazaEntityFrostbiteTick } from '@/components/world/health/domains/advancingWorldPlazaEntityFrostbiteTick';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { applyingWorldPlazaEntityFrostbiteStack } from '@/components/world/health/domains/applyingWorldPlazaEntityFrostbiteStack';
import { describe, expect, it } from 'vitest';

describe('advancingWorldPlazaEntityFrostbiteTick warm decay', () => {
  it('anchors the decay clock on the first warm frame then decays after one interval', () => {
    const tickIntervalMs =
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS;
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = applyingWorldPlazaEntityFrostbiteStack({
      state,
      stackCount: 500,
      nowMs: 0,
    }).state;

    const anchored = advancingWorldPlazaEntityFrostbiteTick({
      state,
      nowMs: 1000,
      deltaMs: 16,
      localTemperatureCelsius: 10,
    });

    expect(anchored.state.frostbite?.stackCount).toBe(500);
    expect(anchored.state.frostbite?.lastDecayAtMs).toBe(1000);

    const decayed = advancingWorldPlazaEntityFrostbiteTick({
      state: anchored.state,
      nowMs: 1000 + tickIntervalMs,
      deltaMs: tickIntervalMs,
      localTemperatureCelsius: 10,
    });

    expect(decayed.state.frostbite?.stackCount).toBe(480);
    expect(decayed.state.frostbite?.lastDecayAtMs).toBe(
      1000 + tickIntervalMs
    );
  });

  it('does not decay while still below comfort low', () => {
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = applyingWorldPlazaEntityFrostbiteStack({
      state,
      stackCount: 471,
      nowMs: 0,
    }).state;

    const result = advancingWorldPlazaEntityFrostbiteTick({
      state,
      nowMs: 5000,
      deltaMs: 16,
      localTemperatureCelsius: -12,
    });

    expect(result.state.frostbite?.stackCount).toBe(471);
    expect(result.state.frostbite?.lastDecayAtMs).toBeNull();
  });
});
