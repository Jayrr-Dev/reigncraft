'use client';

import { Icon } from '@/components/ui/icon';
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
  'flex w-full items-center justify-between gap-2 rounded-md border border-poster-gold/35 bg-poster-teal-deep/75 px-2 py-1.5 text-[10px] font-semibold leading-none tracking-wide text-parchment/90 shadow-[0_2px_8px_rgba(0,0,0,0.35)] backdrop-blur-sm' as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_MOBILE_CLASS_NAME =
  'gap-1.5 px-1.5 py-1 text-[9px]' as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_SEGMENT_CLASS_NAME =
  'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5' as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_VALUE_CLASS_NAME =
  'whitespace-nowrap text-center tabular-nums' as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_ICON_SIZE_PX = 13 as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_MOBILE_ICON_SIZE_PX =
  11 as const;

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

type RenderingWorldPlazaMiniMapEnvironmentBarSegmentProps = {
  icon: string;
  label: string;
  valueClassName?: string;
  iconSizePx: number;
};

function RenderingWorldPlazaMiniMapEnvironmentBarSegment({
  icon,
  label,
  valueClassName = 'text-parchment/90',
  iconSizePx,
}: RenderingWorldPlazaMiniMapEnvironmentBarSegmentProps): React.JSX.Element {
  return (
    <span
      className={
        RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_SEGMENT_CLASS_NAME
      }
    >
      <Icon
        icon={icon}
        width={iconSizePx}
        height={iconSizePx}
        className="shrink-0 opacity-90"
        aria-hidden
      />
      <span
        className={`${RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_VALUE_CLASS_NAME} ${valueClassName}`}
      >
        {label}
      </span>
    </span>
  );
}

/**
 * Compact icon-based day / time / temperature readout above the minimap.
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
  const dayPhaseIcon = sunState.isDaytime
    ? 'mdi:weather-sunny'
    : 'mdi:weather-night';
  const temperatureLabel = useMemo(() => {
    if (localTemperatureCelsius === null) {
      return '—';
    }

    return formattingWorldPlazaTemperature(
      localTemperatureCelsius,
      temperatureDisplayUnit
    );
  }, [localTemperatureCelsius, temperatureDisplayUnit]);
  const iconSizePx = isMobile
    ? RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_MOBILE_ICON_SIZE_PX
    : RENDERING_WORLD_PLAZA_MINI_MAP_ENVIRONMENT_BAR_ICON_SIZE_PX;

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
      <RenderingWorldPlazaMiniMapEnvironmentBarSegment
        icon={dayPhaseIcon}
        label={String(dayNumber)}
        iconSizePx={iconSizePx}
      />
      <RenderingWorldPlazaMiniMapEnvironmentBarSegment
        icon="mdi:clock-outline"
        label={clockTime}
        iconSizePx={iconSizePx}
      />
      <RenderingWorldPlazaMiniMapEnvironmentBarSegment
        icon="mdi:thermometer"
        label={temperatureLabel}
        valueClassName={resolvingWorldPlazaMiniMapEnvironmentTemperatureClassName(
          localTemperatureCelsius
        )}
        iconSizePx={iconSizePx}
      />
    </div>
  );
}
