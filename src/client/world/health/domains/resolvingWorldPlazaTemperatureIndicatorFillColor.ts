/**
 * Resolves the solid fill color for the temperature orb from ambient °C.
 *
 * Color anchors are Celsius stops (cool / white band / warm), not fill ratio.
 *
 * @module components/world/health/domains/resolvingWorldPlazaTemperatureIndicatorFillColor
 */

import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COLD_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_EDGE_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_STOP_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_HOT_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_EDGE_COLOR,
  DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_STOP_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureIndicatorConstants';

type TemperatureIndicatorRgb = {
  readonly r: number;
  readonly g: number;
  readonly b: number;
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

function mixingTemperatureIndicatorSegment(
  temperatureCelsius: number,
  fromCelsius: number,
  toCelsius: number,
  fromColor: TemperatureIndicatorRgb,
  toColor: TemperatureIndicatorRgb
): string {
  const span = toCelsius - fromCelsius;

  if (span <= 0) {
    return formattingTemperatureIndicatorRgbCss(toColor);
  }

  return formattingTemperatureIndicatorRgbCss(
    mixingTemperatureIndicatorRgb(
      fromColor,
      toColor,
      (temperatureCelsius - fromCelsius) / span
    )
  );
}

/**
 * Maps ambient Celsius to a solid orb fill color.
 * Cold below 15°C, white-toned 15–25°C, red from 25°C upward.
 *
 * @param temperatureCelsius - Local ambient temperature in °C
 */
export function resolvingWorldPlazaTemperatureIndicatorFillColor(
  temperatureCelsius: number
): string {
  const coldColor = parsingTemperatureIndicatorHexColor(
    DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COLD_COLOR
  );
  const coolEdgeColor = parsingTemperatureIndicatorHexColor(
    DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_EDGE_COLOR
  );
  const midColor = parsingTemperatureIndicatorHexColor(
    DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR
  );
  const warmEdgeColor = parsingTemperatureIndicatorHexColor(
    DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_EDGE_COLOR
  );
  const hotColor = parsingTemperatureIndicatorHexColor(
    DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_HOT_COLOR
  );

  if (!coldColor || !coolEdgeColor || !midColor || !warmEdgeColor || !hotColor) {
    return DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MID_COLOR;
  }

  if (!Number.isFinite(temperatureCelsius)) {
    return formattingTemperatureIndicatorRgbCss(midColor);
  }

  if (
    temperatureCelsius <= DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS
  ) {
    return formattingTemperatureIndicatorRgbCss(coldColor);
  }

  if (
    temperatureCelsius <=
    DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_STOP_CELSIUS
  ) {
    return mixingTemperatureIndicatorSegment(
      temperatureCelsius,
      DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MIN_CELSIUS,
      DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_STOP_CELSIUS,
      coldColor,
      coolEdgeColor
    );
  }

  if (
    temperatureCelsius <
    DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_STOP_CELSIUS
  ) {
    const comfortMidCelsius =
      (DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_STOP_CELSIUS +
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_STOP_CELSIUS) /
      2;

    if (temperatureCelsius <= comfortMidCelsius) {
      return mixingTemperatureIndicatorSegment(
        temperatureCelsius,
        DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_COOL_STOP_CELSIUS,
        comfortMidCelsius,
        coolEdgeColor,
        midColor
      );
    }

    return mixingTemperatureIndicatorSegment(
      temperatureCelsius,
      comfortMidCelsius,
      DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_STOP_CELSIUS,
      midColor,
      warmEdgeColor
    );
  }

  if (
    temperatureCelsius >= DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS
  ) {
    return formattingTemperatureIndicatorRgbCss(hotColor);
  }

  return mixingTemperatureIndicatorSegment(
    temperatureCelsius,
    DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_WARM_STOP_CELSIUS,
    DEFINING_WORLD_PLAZA_TEMPERATURE_INDICATOR_MAX_CELSIUS,
    warmEdgeColor,
    hotColor
  );
}
