"use client";

import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_REFRESH_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_TEXT_CLASS_NAME,
} from "@/components/world/domains/definingWorldPlazaDayNightClockConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { formattingWorldPlazaDayNightClockTime } from "@/components/world/domains/formattingWorldPlazaDayNightClockTime";
import { useEffect, useState } from "react";

/**
 * Top-left in-game clock tied to the shared day/night cycle.
 */
export function RenderingWorldPlazaDayNightClock(): React.JSX.Element {
  const [clockTime, setClockTime] = useState(() =>
    formattingWorldPlazaDayNightClockTime(),
  );

  useEffect(() => {
    const refreshingClockTime = (): void => {
      setClockTime(formattingWorldPlazaDayNightClockTime());
    };

    refreshingClockTime();
    const intervalId = window.setInterval(
      refreshingClockTime,
      DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_REFRESH_INTERVAL_MS,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: "" }}
      className={DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_ANCHOR_CLASS_NAME}
    >
      <time
        className={DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_TEXT_CLASS_NAME}
        dateTime={clockTime}
      >
        {clockTime}
      </time>
    </div>
  );
}
