'use client';

/**
 * Temperature sphere for the plaza action bar: full disc filled with a
 * solid color that shifts cold → mid → hot from ambient °C, plus readout.
 *
 * @module components/world/health/components/renderingWorldPlazaTemperatureIndicator
 */

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { formattingWorldPlazaTemperature } from '@/components/world/health/domains/convertingWorldPlazaTemperatureUnits';
import {
  LABELING_WORLD_PLAZA_ACTION_BAR_TEMPERATURE,
  STYLING_WORLD_PLAZA_TEMPERATURE_INDICATOR_FILL_DISC_CLASS_NAME,
  STYLING_WORLD_PLAZA_TEMPERATURE_INDICATOR_ORB_CLASS_NAME,
  STYLING_WORLD_PLAZA_TEMPERATURE_INDICATOR_VALUE_CLASS_NAME,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureIndicatorConstants';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { resolvingWorldPlazaTemperatureIndicatorFillColor } from '@/components/world/health/domains/resolvingWorldPlazaTemperatureIndicatorFillColor';
import { resolvingWorldPlazaTemperatureIndicatorViewportStyles } from '@/components/world/health/domains/resolvingWorldPlazaTemperatureIndicatorViewportStyles';
import { memo, useMemo } from 'react';

/** Props for {@link RenderingWorldPlazaTemperatureIndicator}. */
export type RenderingWorldPlazaTemperatureIndicatorProps = {
  /** Local ambient temperature in °C, or null when unavailable. */
  localTemperatureCelsius: number | null;
  /** Preferred HUD unit (°C or °F). */
  temperatureDisplayUnit: DefiningWorldPlazaTemperatureDisplayUnit;
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
  /** When true, applies the action bar mobile shrink. */
  isMobile?: boolean;
};

/**
 * Circular temperature orb filled solid from ambient °C, with numeric readout.
 */
export const RenderingWorldPlazaTemperatureIndicator = memo(
  function RenderingWorldPlazaTemperatureIndicator({
    localTemperatureCelsius,
    temperatureDisplayUnit,
    viewportHudScale = 1,
    isMobile = false,
  }: RenderingWorldPlazaTemperatureIndicatorProps): React.JSX.Element | null {
    const viewportStyles = useMemo(
      () =>
        resolvingWorldPlazaTemperatureIndicatorViewportStyles(
          viewportHudScale,
          isMobile
        ),
      [viewportHudScale, isMobile]
    );

    const temperatureLabel = useMemo(() => {
      if (localTemperatureCelsius === null) {
        return null;
      }

      return formattingWorldPlazaTemperature(
        localTemperatureCelsius,
        temperatureDisplayUnit
      );
    }, [localTemperatureCelsius, temperatureDisplayUnit]);

    const fillColor = useMemo(() => {
      if (localTemperatureCelsius === null) {
        return null;
      }

      return resolvingWorldPlazaTemperatureIndicatorFillColor(
        localTemperatureCelsius
      );
    }, [localTemperatureCelsius]);

    if (temperatureLabel === null || fillColor === null) {
      return null;
    }

    const ariaLabel = `${LABELING_WORLD_PLAZA_ACTION_BAR_TEMPERATURE}: ${temperatureLabel}`;

    return (
      <div
        role="status"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={STYLING_WORLD_PLAZA_TEMPERATURE_INDICATOR_ORB_CLASS_NAME}
        style={viewportStyles.sphereStyle}
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        <span
          className={
            STYLING_WORLD_PLAZA_TEMPERATURE_INDICATOR_FILL_DISC_CLASS_NAME
          }
          style={{
            backgroundColor: fillColor,
          }}
          aria-hidden="true"
        />
        <span
          className={STYLING_WORLD_PLAZA_TEMPERATURE_INDICATOR_VALUE_CLASS_NAME}
          style={viewportStyles.valueStyle}
        >
          {temperatureLabel}
        </span>
      </div>
    );
  }
);
