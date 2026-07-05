'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_REFRESH_INTERVAL_MS } from '@/components/world/domains/definingWorldPlazaDayNightClockConstants';
import { formattingWorldPlazaDayNightClockTime } from '@/components/world/domains/formattingWorldPlazaDayNightClockTime';
import { formattingWorldPlazaDayNightDayNumber } from '@/components/world/domains/formattingWorldPlazaDayNightDayNumber';
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
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_CLASS_NAME =
  'flex w-full items-center justify-between gap-1 rounded-md border border-poster-gold/35 bg-poster-teal-deep/75 px-2 py-1 text-[10px] font-semibold leading-none tracking-wide text-parchment/90 shadow-[0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-sm' as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_MOBILE_CLASS_NAME =
  'text-[9px] px-1.5 py-0.5' as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_SEGMENT_CLASS_NAME =
  'min-w-0 truncate tabular-nums' as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_DIVIDER_CLASS_NAME =
  'shrink-0 text-parchment/35' as const;

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
 * Compact day / time / temperature readout rendered above the minimap.
 */
export function RenderingWorldPlazaMiniMapEnvironmentBar({
  widthPx,
  localTemperatureCelsius,
  temperatureDisplayUnit,
  isMobile = false,
}: RenderingWorldPlazaMiniMapEnvironmentBarProps): React.JSX.Element {
  const sunState = usingWorldPlazaDayNightSunState();
  const debugOverrideRevision = useSyncExternalStore(
    subscribingWorldPlazaDayNightDebugOverride,
    gettingWorldPlazaDayNightDebugOverrideRevision,
    () => 0
  );
  const [clockTime, setClockTime] = useState(() =>
    formattingWorldPlazaDayNightClockTime()
  );
  const [dayNumber, setDayNumber] = useState(() =>
    formattingWorldPlazaDayNightDayNumber()
  );

  useEffect(() => {
    const refreshingClockState = (): void => {
      setClockTime(formattingWorldPlazaDayNightClockTime());
      setDayNumber(formattingWorldPlazaDayNightDayNumber());
    };

    refreshingClockState();
    const intervalId = window.setInterval(
      refreshingClockState,
      DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_REFRESH_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [debugOverrideRevision]);

  const dayPhaseLabel = sunState.isDaytime ? 'Day' : 'Night';
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
      aria-label={`${dayPhaseLabel} ${dayNumber}, ${clockTime}, temperature ${temperatureLabel}`}
    >
      <span
        className={
          RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_SEGMENT_CLASS_NAME
        }
      >
        {dayPhaseLabel} {dayNumber}
      </span>
      <span
        className={
          RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_DIVIDER_CLASS_NAME
        }
        aria-hidden
      >
        ·
      </span>
      <time
        className={`${RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_SEGMENT_CLASS_NAME} text-center`}
        dateTime={clockTime}
      >
        {clockTime}
      </time>
      <span
        className={
          RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_DIVIDER_CLASS_NAME
        }
        aria-hidden
      >
        ·
      </span>
      <span
        className={`${RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_SEGMENT_CLASS_NAME} text-right ${resolvingWorldPlazaMiniMapEnvironmentTemperatureClassName(localTemperatureCelsius)}`}
      >
        {temperatureLabel}
      </span>
    </div>
  );
}
