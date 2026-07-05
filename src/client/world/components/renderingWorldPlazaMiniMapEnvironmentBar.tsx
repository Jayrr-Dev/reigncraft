'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { formattingWorldPlazaTemperature } from '@/components/world/health/domains/convertingWorldPlazaTemperatureUnits';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { useMemo } from 'react';

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_CLASS_NAME =
  'flex w-full items-center justify-center rounded-md border border-poster-gold/35 bg-poster-teal-deep/75 px-2 py-1.5 text-[10px] font-semibold leading-none tracking-wide shadow-[0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-sm' as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_MOBILE_CLASS_NAME =
  'px-1.5 py-1 text-[9px]' as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_VALUE_CLASS_NAME =
  'whitespace-nowrap text-center tabular-nums' as const;

export interface RenderingWorldPlazaMiniMapEnvironmentBarProps {
  /** Matches the minimap canvas width in CSS pixels. */
  widthPx: number;
  /** Local temperature in °C, or null when unavailable. */
  localTemperatureCelsius: number | null;
  temperatureDisplayUnit: DefiningWorldPlazaTemperatureDisplayUnit;
  isMobile?: boolean;
}

function resolvingWorldPlazaMiniMapEnvironmentTemperatureClassName(
  celsius: number | null
): string {
  if (celsius === null) {
    return 'text-parchment/55';
  }

  if (celsius > DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS) {
    return 'text-amber-200';
  }

  if (celsius < DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS) {
    return 'text-sky-200';
  }

  return 'text-parchment/90';
}

/**
 * Compact temperature readout above the minimap.
 */
export function RenderingWorldPlazaMiniMapEnvironmentBar({
  widthPx,
  localTemperatureCelsius,
  temperatureDisplayUnit,
  isMobile = false,
}: RenderingWorldPlazaMiniMapEnvironmentBarProps): React.JSX.Element {
  const temperatureLabel = useMemo(() => {
    if (localTemperatureCelsius === null) {
      return '—';
    }

    return formattingWorldPlazaTemperature(
      localTemperatureCelsius,
      temperatureDisplayUnit
    );
  }, [localTemperatureCelsius, temperatureDisplayUnit]);

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className={`${RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_CLASS_NAME} ${
        isMobile
          ? RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_MOBILE_CLASS_NAME
          : ''
      }`}
      style={{ width: widthPx }}
      aria-label={`Temperature ${temperatureLabel}`}
    >
      <span
        className={`${RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_VALUE_CLASS_NAME} ${resolvingWorldPlazaMiniMapEnvironmentTemperatureClassName(
          localTemperatureCelsius
        )}`}
      >
        {temperatureLabel}
      </span>
    </div>
  );
}
