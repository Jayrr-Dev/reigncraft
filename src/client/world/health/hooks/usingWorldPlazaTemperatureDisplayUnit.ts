'use client';

/**
 * React subscription to the plaza temperature display-unit preference store.
 *
 * @module components/world/health/hooks/usingWorldPlazaTemperatureDisplayUnit
 */

import { DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT_DEFAULT } from '@/components/world/health/domains/definingWorldPlazaTemperatureDisplayUnitPreferenceConstants';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import {
  gettingWorldPlazaTemperatureDisplayUnit,
  initializingWorldPlazaTemperatureDisplayUnitStoreFromStorage,
  settingWorldPlazaTemperatureDisplayUnit,
  subscribingWorldPlazaTemperatureDisplayUnit,
} from '@/components/world/health/domains/managingWorldPlazaTemperatureDisplayUnitStore';
import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react';

export type UsingWorldPlazaTemperatureDisplayUnitResult = {
  /** Current HUD readout unit. */
  temperatureDisplayUnit: DefiningWorldPlazaTemperatureDisplayUnit;
  /** True when the HUD shows Fahrenheit. */
  isFahrenheitDisplayEnabled: boolean;
  /** Sets the HUD readout unit. */
  settingTemperatureDisplayUnit: (
    unit: DefiningWorldPlazaTemperatureDisplayUnit
  ) => void;
  /** Enables or disables Fahrenheit display (unchecked = Celsius). */
  settingFahrenheitDisplayEnabled: (isEnabled: boolean) => void;
};

/**
 * Subscribes to the temperature display-unit preference store.
 */
export function usingWorldPlazaTemperatureDisplayUnit(): UsingWorldPlazaTemperatureDisplayUnitResult {
  useLayoutEffect(() => {
    initializingWorldPlazaTemperatureDisplayUnitStoreFromStorage();
  }, []);

  const temperatureDisplayUnit = useSyncExternalStore(
    subscribingWorldPlazaTemperatureDisplayUnit,
    gettingWorldPlazaTemperatureDisplayUnit,
    () => DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT_DEFAULT
  );

  const settingTemperatureDisplayUnit = useCallback(
    (unit: DefiningWorldPlazaTemperatureDisplayUnit): void => {
      settingWorldPlazaTemperatureDisplayUnit(unit);
    },
    []
  );

  const settingFahrenheitDisplayEnabled = useCallback(
    (isEnabled: boolean): void => {
      settingWorldPlazaTemperatureDisplayUnit(
        isEnabled ? 'fahrenheit' : 'celsius'
      );
    },
    []
  );

  return {
    temperatureDisplayUnit,
    isFahrenheitDisplayEnabled: temperatureDisplayUnit === 'fahrenheit',
    settingTemperatureDisplayUnit,
    settingFahrenheitDisplayEnabled,
  };
}
