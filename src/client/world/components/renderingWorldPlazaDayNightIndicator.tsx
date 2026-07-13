'use client';

/**
 * Day/night sphere for the plaza action bar: black→sunny daylight fill with a
 * sun or moon sprite that arcs across the disc as the shared cycle advances.
 *
 * @module components/world/components/renderingWorldPlazaDayNightIndicator
 */

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_REFRESH_INTERVAL_MS } from '@/components/world/domains/definingWorldPlazaDayNightClockConstants';
import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_FILL_BACKGROUND_CSS,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_NIGHT_COLOR,
  LABELING_WORLD_PLAZA_ACTION_BAR_DAY_NIGHT,
  STYLING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_CELESTIAL_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_CELESTIAL_LAYER_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_FILL_DISC_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_ORB_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDayNightIndicatorConstants';
import { formattingWorldPlazaDayNightClockTime } from '@/components/world/domains/formattingWorldPlazaDayNightClockTime';
import { resolvingWorldPlazaDayNightCelestialSpriteIconStyle } from '@/components/world/domains/resolvingWorldPlazaDayNightCelestialSpriteIconStyle';
import { resolvingWorldPlazaDayNightIndicatorPresentation } from '@/components/world/domains/resolvingWorldPlazaDayNightIndicatorPresentation';
import { resolvingWorldPlazaDayNightIndicatorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaDayNightIndicatorViewportStyles';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import { cn } from '@/lib/utils';
import { memo, useEffect, useMemo, useState } from 'react';

/** Props for {@link RenderingWorldPlazaDayNightIndicator}. */
export type RenderingWorldPlazaDayNightIndicatorProps = {
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
  /** When true, applies the action bar mobile shrink. */
  isMobile?: boolean;
  /** Whether the world-clock panel is open. */
  isOpen?: boolean;
  /** Toggles the world-clock panel. */
  onToggle?: () => void;
};

/**
 * Circular day/night orb with rising sunny fill and a moving sun/moon.
 */
export const RenderingWorldPlazaDayNightIndicator = memo(
  function RenderingWorldPlazaDayNightIndicator({
    viewportHudScale = 1,
    isMobile = false,
    isOpen = false,
    onToggle,
  }: RenderingWorldPlazaDayNightIndicatorProps): React.JSX.Element {
    const sunState = usingWorldPlazaDayNightSunState();
    const [clockTime, setClockTime] = useState(() =>
      formattingWorldPlazaDayNightClockTime()
    );
    const viewportStyles = useMemo(
      () =>
        resolvingWorldPlazaDayNightIndicatorViewportStyles(
          viewportHudScale,
          isMobile
        ),
      [viewportHudScale, isMobile]
    );
    const presentation = useMemo(
      () =>
        resolvingWorldPlazaDayNightIndicatorPresentation(sunState.cyclePhase),
      [sunState.cyclePhase]
    );
    const celestialSpriteStyle = useMemo(
      () =>
        resolvingWorldPlazaDayNightCelestialSpriteIconStyle(
          presentation.celestialBody,
          viewportStyles.iconSizePx
        ),
      [presentation.celestialBody, viewportStyles.iconSizePx]
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
    }, [sunState.bucketIndex]);

    const ariaLabel = `${LABELING_WORLD_PLAZA_ACTION_BAR_DAY_NIGHT}: ${clockTime}, ${
      presentation.isDaytime ? 'day' : 'night'
    }`;

    return (
      <button
        type="button"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={cn(
          STYLING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_ORB_CLASS_NAME,
          isOpen && 'plaza-day-night-orb--open'
        )}
        style={viewportStyles.sphereStyle}
        aria-label={ariaLabel}
        aria-pressed={isOpen}
        aria-expanded={isOpen}
        title={ariaLabel}
        onClick={onToggle}
      >
        <span
          className={
            STYLING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_FILL_DISC_CLASS_NAME
          }
          style={{
            backgroundColor:
              DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_NIGHT_COLOR,
          }}
          aria-hidden="true"
        >
          <span
            className="absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-out"
            style={{
              height: `${presentation.daylightFillRatio * 100}%`,
              background:
                DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_FILL_BACKGROUND_CSS,
            }}
          />
        </span>
        <span
          className={
            STYLING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_CELESTIAL_LAYER_CLASS_NAME
          }
          aria-hidden="true"
        >
          <span
            className={
              STYLING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_CELESTIAL_CLASS_NAME
            }
            style={{
              left: `${presentation.celestialLeftRatio * 100}%`,
              top: `${presentation.celestialTopRatio * 100}%`,
              ...celestialSpriteStyle,
            }}
          />
        </span>
      </button>
    );
  }
);
