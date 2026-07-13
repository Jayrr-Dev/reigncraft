'use client';

/**
 * Temperature tolerance dropdown opened from the action-bar temp orb.
 *
 * @module components/world/health/components/renderingWorldPlazaTemperaturePanel
 */

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { formattingWorldPlazaTemperature } from '@/components/world/health/domains/convertingWorldPlazaTemperatureUnits';
import {
  LABELING_WORLD_PLAZA_TEMPERATURE_PANEL,
  LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_COLD,
  LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_HEAT,
  LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_TIP,
  LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_TITLE,
  STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_VALUE_CLASS_NAME,
  STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_TIP_CLASS_NAME,
  STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_TITLE_CLASS_NAME,
} from '@/components/world/health/domains/definingWorldPlazaTemperaturePanelConstants';
import type {
  DefiningWorldPlazaEntityTemperatureComfortBand,
  DefiningWorldPlazaTemperatureDisplayUnit,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { resolvingWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureComfortBand';
import { memo, useMemo } from 'react';

export type RenderingWorldPlazaTemperaturePanelProps = {
  readonly temperatureDisplayUnit: DefiningWorldPlazaTemperatureDisplayUnit;
  readonly comfortBand?: DefiningWorldPlazaEntityTemperatureComfortBand | null;
};

/**
 * Compact parchment panel with the player's cold/heat comfort thresholds.
 */
export const RenderingWorldPlazaTemperaturePanel = memo(
  function RenderingWorldPlazaTemperaturePanel({
    temperatureDisplayUnit,
    comfortBand = null,
  }: RenderingWorldPlazaTemperaturePanelProps): React.JSX.Element {
    const resolvedBand = useMemo(
      () =>
        comfortBand ?? resolvingWorldPlazaEntityTemperatureComfortBand(null),
      [comfortBand]
    );
    const coldLabel = useMemo(
      () =>
        formattingWorldPlazaTemperature(
          resolvedBand.comfortLowCelsius,
          temperatureDisplayUnit
        ),
      [resolvedBand.comfortLowCelsius, temperatureDisplayUnit]
    );
    const heatLabel = useMemo(
      () =>
        formattingWorldPlazaTemperature(
          resolvedBand.comfortHighCelsius,
          temperatureDisplayUnit
        ),
      [resolvedBand.comfortHighCelsius, temperatureDisplayUnit]
    );

    return (
      <div
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_CLASS_NAME}
        role="dialog"
        aria-label={LABELING_WORLD_PLAZA_TEMPERATURE_PANEL}
      >
        <div className={STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_TITLE_CLASS_NAME}>
          {LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_TITLE}
        </div>

        <div className={STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_CLASS_NAME}>
          <span
            className={
              STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_LABEL_CLASS_NAME
            }
          >
            {LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_COLD}
          </span>
          <span
            className={
              STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_VALUE_CLASS_NAME
            }
          >
            {coldLabel}
          </span>
        </div>

        <div className={STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_CLASS_NAME}>
          <span
            className={
              STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_LABEL_CLASS_NAME
            }
          >
            {LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_HEAT}
          </span>
          <span
            className={
              STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_ROW_VALUE_CLASS_NAME
            }
          >
            {heatLabel}
          </span>
        </div>

        <p className={STYLING_WORLD_PLAZA_TEMPERATURE_PANEL_TIP_CLASS_NAME}>
          {LABELING_WORLD_PLAZA_TEMPERATURE_PANEL_TIP}
        </p>
      </div>
    );
  }
);
