'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_REFRESH_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_TEXT_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDayNightClockConstants';
import { formattingWorldPlazaDayNightClockTime } from '@/components/world/domains/formattingWorldPlazaDayNightClockTime';
import {
  gettingWorldPlazaDayNightDebugOverrideRevision,
  subscribingWorldPlazaDayNightDebugOverride,
} from '@/components/world/domains/managingWorldPlazaDayNightDebugOverrideStore';
import { useEffect, useRef, useSyncExternalStore } from 'react';

export interface RenderingWorldPlazaDayNightClockProps {
  /** When embedded, renders inside the dev panel instead of the top-left HUD. */
  layout?: 'anchored' | 'embedded';
}

/**
 * Top-left in-game clock tied to the shared day/night cycle.
 *
 * Updates the `<time>` label imperatively so the 1s refresh does not re-render.
 */
export function RenderingWorldPlazaDayNightClock({
  layout = 'anchored',
}: RenderingWorldPlazaDayNightClockProps): React.JSX.Element {
  const debugOverrideRevision = useSyncExternalStore(
    subscribingWorldPlazaDayNightDebugOverride,
    gettingWorldPlazaDayNightDebugOverrideRevision,
    () => 0
  );
  const timeElementRef = useRef<HTMLTimeElement>(null);
  const initialClockTime = formattingWorldPlazaDayNightClockTime();

  useEffect(() => {
    const timeElement = timeElementRef.current;
    if (!timeElement) {
      return;
    }

    const refreshingClockTime = (): void => {
      const clockTime = formattingWorldPlazaDayNightClockTime();
      timeElement.textContent = clockTime;
      timeElement.dateTime = clockTime;
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

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className={
        layout === 'embedded'
          ? 'flex select-none'
          : DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_ANCHOR_CLASS_NAME
      }
    >
      <time
        ref={timeElementRef}
        className={DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_TEXT_CLASS_NAME}
        dateTime={initialClockTime}
      >
        {initialClockTime}
      </time>
    </div>
  );
}
