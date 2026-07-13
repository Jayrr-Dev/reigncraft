'use client';

/**
 * World clock dropdown opened from the action-bar day/night orb.
 *
 * @module components/world/components/renderingWorldPlazaDayNightPanel
 */

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_REFRESH_INTERVAL_MS } from '@/components/world/domains/definingWorldPlazaDayNightClockConstants';
import {
  LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL,
  LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_DAY,
  LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIME,
  LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIP,
  LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_TITLE,
  STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_ROW_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_ROW_VALUE_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIME_VALUE_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIP_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_TITLE_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDayNightPanelConstants';
import { formattingWorldPlazaDayNightClockTime } from '@/components/world/domains/formattingWorldPlazaDayNightClockTime';
import { formattingWorldPlazaDayNightDayNumber } from '@/components/world/domains/formattingWorldPlazaDayNightDayNumber';
import {
  gettingWorldPlazaDayNightDebugOverrideRevision,
  subscribingWorldPlazaDayNightDebugOverride,
} from '@/components/world/domains/managingWorldPlazaDayNightDebugOverrideStore';
import { memo, useEffect, useState, useSyncExternalStore } from 'react';

/**
 * Compact parchment panel with shared in-game clock time and day index.
 */
export const RenderingWorldPlazaDayNightPanel = memo(
  function RenderingWorldPlazaDayNightPanel(): React.JSX.Element {
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
      const refreshingClock = (): void => {
        setClockTime(formattingWorldPlazaDayNightClockTime());
        setDayNumber(formattingWorldPlazaDayNightDayNumber());
      };

      refreshingClock();
      const intervalId = window.setInterval(
        refreshingClock,
        DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_REFRESH_INTERVAL_MS
      );

      return () => {
        window.clearInterval(intervalId);
      };
    }, [debugOverrideRevision]);

    return (
      <div
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_CLASS_NAME}
        role="dialog"
        aria-label={LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL}
      >
        <div className={STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_TITLE_CLASS_NAME}>
          {LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_TITLE}
        </div>

        <div className={STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_ROW_CLASS_NAME}>
          <span
            className={STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_ROW_LABEL_CLASS_NAME}
          >
            {LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIME}
          </span>
          <time
            className={
              STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIME_VALUE_CLASS_NAME
            }
            dateTime={clockTime}
          >
            {clockTime}
          </time>
        </div>

        <div className={STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_ROW_CLASS_NAME}>
          <span
            className={STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_ROW_LABEL_CLASS_NAME}
          >
            {LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_DAY}
          </span>
          <span
            className={STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_ROW_VALUE_CLASS_NAME}
          >
            {dayNumber}
          </span>
        </div>

        <p className={STYLING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIP_CLASS_NAME}>
          {LABELING_WORLD_PLAZA_DAY_NIGHT_PANEL_TIP}
        </p>
      </div>
    );
  }
);
