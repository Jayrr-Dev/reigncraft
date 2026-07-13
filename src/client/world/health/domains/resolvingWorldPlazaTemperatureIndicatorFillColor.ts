/**
 * Resolves the solid fill color for the temperature orb from ambient °C.
 *
 * Comfort edges track the character band (#d7edff … #ffcfbf). Cold/hot stops
 * continue that palette beyond the band toward the indicator min/max.
 *
 * @module components/world/health/domains/resolvingWorldPlazaTemperatureIndicatorFillColor
 */

import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_GRADIENT_HEX_STOPS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureIndicatorConstants';
import type { DefiningWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { resolvingWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureComfortBand';

type TemperatureIndicatorRgb = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
};

type TemperatureIndicatorCelsiusStop = {
  readonly celsius: number;
  readonly color: TemperatureIndicatorRgb;
};

function parsingTemperatureIndicatorHexColor(
  hexColor: string
): TemperatureIndicatorRgb | null {
  const normalizedHex = hexColor.trim().replace(/^#/, '');

  if (!/^[0-9a-fA-F]{6}$/.test(normalizedHex)) {
    return null;
  }

  return {
    r: Number.parseInt(normalizedHex.slice(0, 2), 16),
    g: Number.parseInt(normalizedHex.slice(2, 4), 16),
    b: Number.parseInt(normalizedHex.slice(4, 6), 16),
  };
}

function mixingTemperatureIndicatorRgb(
  fromColor: TemperatureIndicatorRgb,
  toColor: TemperatureIndicatorRgb,
  mixRatio: number
): TemperatureIndicatorRgb {
  const clampedRatio = Math.min(1, Math.max(0, mixRatio));

  return {
    r: Math.round(fromColor.r + (toColor.r - fromColor.r) * clampedRatio),
    g: Math.round(fromColor.g + (toColor.g - fromColor.g) * clampedRatio),
    b: Math.round(fromColor.b + (toColor.b - fromColor.b) * clampedRatio),
  };
}

function formattingTemperatureIndicatorRgbCss(
  rgb: TemperatureIndicatorRgb
): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function resolvingTemperatureIndicatorGradientRgbs():
  | TemperatureIndicatorRgb[]
  | null {
  const colors: TemperatureIndicatorRgb[] = [];

  for (const hex of DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_GRADIENT_HEX_STOPS) {
    const rgb = parsingTemperatureIndicatorHexColor(hex);
    if (!rgb) {
      return null;
    }
    colors.push(rgb);
  }

  return colors;
}

/**
 * Builds Celsius-anchored stops: cold ramp → comfort band → hot ramp.
 *
 * Indices 0–2 stretch from indicator min to comfort low.
 * Indices 3–5 sit on comfort low / mid / high.
 * Indices 6–8 stretch from comfort high to indicator max.
 */
function buildingTemperatureIndicatorCelsiusStops(
  comfortBand: DefiningWorldPlazaEntityTemperatureComfortBand,
  colors: readonly TemperatureIndicatorRgb[]
): TemperatureIndicatorCelsiusStop[] {
  const minCelsius = DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS;
  const maxCelsius = DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS;
  const comfortLowCelsius = Math.min(
    maxCelsius,
    Math.max(minCelsius, comfortBand.comfortLowCelsius)
  );
  const comfortHighCelsius = Math.min(
    maxCelsius,
    Math.max(comfortLowCelsius, comfortBand.comfortHighCelsius)
  );
  const comfortMidCelsius = (comfortLowCelsius + comfortHighCelsius) / 2;
  const coldSpan = comfortLowCelsius - minCelsius;
  const hotSpan = maxCelsius - comfortHighCelsius;

  return [
    { celsius: minCelsius, color: colors[0]! },
    { celsius: minCelsius + coldSpan / 3, color: colors[1]! },
    { celsius: minCelsius + (2 * coldSpan) / 3, color: colors[2]! },
    { celsius: comfortLowCelsius, color: colors[3]! },
    { celsius: comfortMidCelsius, color: colors[4]! },
    { celsius: comfortHighCelsius, color: colors[5]! },
    { celsius: comfortHighCelsius + hotSpan / 3, color: colors[6]! },
    { celsius: comfortHighCelsius + (2 * hotSpan) / 3, color: colors[7]! },
    { celsius: maxCelsius, color: colors[8]! },
  ];
}

/**
 * Maps ambient Celsius to a solid orb fill color using the character comfort band.
 *
 * @param temperatureCelsius - Local ambient temperature in °C
 * @param comfortBand - Character comfort low/high; defaults to base human band
 */
export function resolvingWorldPlazaTemperatureIndicatorFillColor(
  temperatureCelsius: number,
  comfortBand?: DefiningWorldPlazaEntityTemperatureComfortBand | null
): string {
  const colors = resolvingTemperatureIndicatorGradientRgbs();
  if (!colors) {
    return DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR;
  }

  const resolvedComfortBand =
    comfortBand ?? resolvingWorldPlazaEntityTemperatureComfortBand(null);
  const stops = buildingTemperatureIndicatorCelsiusStops(
    resolvedComfortBand,
    colors
  );

  if (!Number.isFinite(temperatureCelsius)) {
    return formattingTemperatureIndicatorRgbCss(colors[4]!);
  }

  if (temperatureCelsius <= stops[0]!.celsius) {
    return formattingTemperatureIndicatorRgbCss(stops[0]!.color);
  }

  const lastStop = stops[stops.length - 1]!;
  if (temperatureCelsius >= lastStop.celsius) {
    return formattingTemperatureIndicatorRgbCss(lastStop.color);
  }

  for (let index = 0; index < stops.length - 1; index += 1) {
    const fromStop = stops[index]!;
    const toStop = stops[index + 1]!;

    if (temperatureCelsius > toStop.celsius) {
      continue;
    }

    const span = toStop.celsius - fromStop.celsius;
    if (span <= 0) {
      return formattingTemperatureIndicatorRgbCss(toStop.color);
    }

    return formattingTemperatureIndicatorRgbCss(
      mixingTemperatureIndicatorRgb(
        fromStop.color,
        toStop.color,
        (temperatureCelsius - fromStop.celsius) / span
      )
    );
  }

  return formattingTemperatureIndicatorRgbCss(lastStop.color);
}
