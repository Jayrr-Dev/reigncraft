import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Converts Celsius to Fahrenheit.
 */
export function convertingWorldPlazaCelsiusToFahrenheit(
  celsius: number
): number {
  return celsius * (9 / 5) + 32;
}

/**
 * Converts Fahrenheit to Celsius.
 */
export function convertingWorldPlazaFahrenheitToCelsius(
  fahrenheit: number
): number {
  return (fahrenheit - 32) * (5 / 9);
}

/**
 * Formats a Celsius value for HUD/debug readouts.
 */
export function formattingWorldPlazaTemperature(
  celsius: number,
  unit: DefiningWorldPlazaTemperatureDisplayUnit
): string {
  if (unit === 'fahrenheit') {
    return `${Math.round(convertingWorldPlazaCelsiusToFahrenheit(celsius))}°F`;
  }

  return `${Math.round(celsius)}°C`;
}
