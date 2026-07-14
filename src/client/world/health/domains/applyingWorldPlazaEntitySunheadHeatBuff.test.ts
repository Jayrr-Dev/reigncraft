import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { checkingWorldPlazaEntityBuffIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityBuffIsActive';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityHealthEffectiveTemperatureResistance } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthEffectiveTemperatureResistance';
import { DEFINING_WORLD_PLAZA_TEMPERATURE_SUNHEAD_HEAT_TOLERANCE_BONUS_CELSIUS } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { describe, expect, it } from 'vitest';

describe('well-fed-sunhead-heat-buff', () => {
  it('adds timed +30°C heat tolerance', () => {
    const nowMs = 10_000;
    const next = applyingWorldPlazaEntityBuff(
      creatingWorldPlazaEntityHealthInitialState(),
      'well-fed-sunhead-heat-buff',
      nowMs
    );

    expect(
      checkingWorldPlazaEntityBuffIsActive({
        buffId: 'well-fed-sunhead-heat-buff',
        state: next,
        nowMs: nowMs + 1_000,
        defenderModifierIds: [],
        attackerModifierIds: [],
      })
    ).toBe(true);

    const resistance = resolvingWorldPlazaEntityHealthEffectiveTemperatureResistance(
      next,
      nowMs + 1_000
    );

    expect(resistance.heatComfortBonusCelsius).toBe(
      DEFINING_WORLD_PLAZA_TEMPERATURE_SUNHEAD_HEAT_TOLERANCE_BONUS_CELSIUS
    );
  });

  it('expires after the timed window', () => {
    const nowMs = 10_000;
    const next = applyingWorldPlazaEntityBuff(
      creatingWorldPlazaEntityHealthInitialState(),
      'well-fed-sunhead-heat-buff',
      nowMs
    );

    expect(
      checkingWorldPlazaEntityBuffIsActive({
        buffId: 'well-fed-sunhead-heat-buff',
        state: next,
        nowMs: nowMs + 90_001,
        defenderModifierIds: [],
        attackerModifierIds: [],
      })
    ).toBe(false);

    const resistance = resolvingWorldPlazaEntityHealthEffectiveTemperatureResistance(
      next,
      nowMs + 90_001
    );

    expect(resistance.heatComfortBonusCelsius).toBe(0);
  });
});
