/**
 * Module-level store for the plaza temperature display-unit preference.
 *
 * @module components/world/health/domains/managingWorldPlazaTemperatureDisplayUnitStore
 */

import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT_DEFAULT,
  DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT_STORAGE_KEY,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureDisplayUnitPreferenceConstants';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/** Mutable display-unit preference shared across plaza components. */
const managingWorldPlazaTemperatureDisplayUnitState: {
  unit: DefiningWorldPlazaTemperatureDisplayUnit;
} = {
  unit: DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT_DEFAULT,
};

/** React subscribers notified when the preference changes. */
const managingWorldPlazaTemperatureDisplayUnitSubscribers = new Set<
  () => void
>();

/**
 * Parses a stored display-unit string.
 */
function parsingWorldPlazaTemperatureDisplayUnit(
  storedValue: string | null
): DefiningWorldPlazaTemperatureDisplayUnit {
  if (storedValue === 'fahrenheit') {
    return 'fahrenheit';
  }

  return DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT_DEFAULT;
}

/**
 * Reads the persisted display-unit preference from localStorage.
 */
function readingWorldPlazaTemperatureDisplayUnitFromStorage(): DefiningWorldPlazaTemperatureDisplayUnit {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT_DEFAULT;
  }

  return parsingWorldPlazaTemperatureDisplayUnit(
    window.localStorage.getItem(
      DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT_STORAGE_KEY
    )
  );
}

/**
 * Persists the display-unit preference to localStorage.
 *
 * @param unit - HUD readout unit.
 */
function writingWorldPlazaTemperatureDisplayUnitToStorage(
  unit: DefiningWorldPlazaTemperatureDisplayUnit
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_TEMPERATURE_DISPLAY_UNIT_STORAGE_KEY,
    unit
  );
}

/**
 * Hydrates the display unit from localStorage once on the client.
 */
export function initializingWorldPlazaTemperatureDisplayUnitStoreFromStorage(): void {
  const storedUnit = readingWorldPlazaTemperatureDisplayUnitFromStorage();

  if (managingWorldPlazaTemperatureDisplayUnitState.unit === storedUnit) {
    return;
  }

  managingWorldPlazaTemperatureDisplayUnitState.unit = storedUnit;
  notifyingWorldPlazaTemperatureDisplayUnitSubscribers();
}

/**
 * Returns the current temperature display unit.
 */
export function gettingWorldPlazaTemperatureDisplayUnit(): DefiningWorldPlazaTemperatureDisplayUnit {
  return managingWorldPlazaTemperatureDisplayUnitState.unit;
}

/**
 * Sets the temperature display unit and notifies subscribers.
 *
 * @param unit - HUD readout unit.
 */
export function settingWorldPlazaTemperatureDisplayUnit(
  unit: DefiningWorldPlazaTemperatureDisplayUnit
): void {
  if (managingWorldPlazaTemperatureDisplayUnitState.unit === unit) {
    return;
  }

  managingWorldPlazaTemperatureDisplayUnitState.unit = unit;
  writingWorldPlazaTemperatureDisplayUnitToStorage(unit);
  notifyingWorldPlazaTemperatureDisplayUnitSubscribers();
}

/**
 * Flips between Celsius and Fahrenheit and notifies subscribers.
 */
export function togglingWorldPlazaTemperatureDisplayUnit(): void {
  settingWorldPlazaTemperatureDisplayUnit(
    managingWorldPlazaTemperatureDisplayUnitState.unit === 'celsius'
      ? 'fahrenheit'
      : 'celsius'
  );
}

/**
 * Subscribes to display-unit preference changes.
 *
 * @param onStoreChange - Callback invoked when the preference changes.
 */
export function subscribingWorldPlazaTemperatureDisplayUnit(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaTemperatureDisplayUnitSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaTemperatureDisplayUnitSubscribers.delete(onStoreChange);
  };
}

/**
 * Notifies React subscribers that the preference changed.
 */
function notifyingWorldPlazaTemperatureDisplayUnitSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaTemperatureDisplayUnitSubscribers) {
    onStoreChange();
  }
}
