'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_REFRESH_INTERVAL_MS } from '@/components/world/domains/definingWorldPlazaDayNightClockConstants';
import { DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT } from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';
import { formattingWorldPlazaDayNightClockTime } from '@/components/world/domains/formattingWorldPlazaDayNightClockTime';
import {
  gettingWorldPlazaDayNightDebugOverrideRevision,
  subscribingWorldPlazaDayNightDebugOverride,
} from '@/components/world/domains/managingWorldPlazaDayNightDebugOverrideStore';
import { formattingWorldPlazaTemperature } from '@/components/world/health/domains/convertingWorldPlazaTemperatureUnits';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';

export interface RenderingWorldPlazaMiniMapEnvironmentBarProps {
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
 * Compact time and temperature readout in the top row of the minimap card.
 */
export function RenderingWorldPlazaMiniMapEnvironmentBar({
  localTemperatureCelsius,
  temperatureDisplayUnit,
  isMobile = false,
}: RenderingWorldPlazaMiniMapEnvironmentBarProps): React.JSX.Element {
  const debugOverrideRevision = useSyncExternalStore(
    subscribingWorldPlazaDayNightDebugOverride,
    gettingWorldPlazaDayNightDebugOverrideRevision,
    () => 0
  );
  const [clockTime, setClockTime] = useState(() =>
    formattingWorldPlazaDayNightClockTime()
  );

  useEffect(() => {
    const refreshingClockTime = (): void => {
      setClockTime(formattingWorldPlazaDayNightClockTime());
    };

    refreshingClockTime();
    const intervalId = window.setInterval(
      refreshingClockTime,
      DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_REFRESH_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [debugOverrideRevision]);

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
      className={`${DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.environmentBarClassName} ${
        isMobile
          ? DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.environmentBarMobileClassName
          : ''
      }`}
      aria-label={`${clockTime}, temperature ${temperatureLabel}`}
    >
      <time
        className={
          DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.environmentBarValueClassName
        }
        dateTime={clockTime}
      >
        {clockTime}
      </time>
      <span
        className={`${DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.environmentBarValueClassName} ${resolvingWorldPlazaMiniMapEnvironmentTemperatureClassName(
          localTemperatureCelsius
        )}`}
      >
        {temperatureLabel}
      </span>
    </div>
  );
}
