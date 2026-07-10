'use client';

/**
 * Settings dropdown for the plaza action bar (volume + gameplay toggles).
 *
 * @module components/world/components/renderingWorldPlazaMasterVolumeMixerPanel
 */

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  LABELING_WORLD_PLAZA_MASTER_VOLUME_MIXER,
  LABELING_WORLD_PLAZA_MASTER_VOLUME_SLIDER,
  STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_SLIDER_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaMasterVolumeConstants';
import {
  LABELING_WORLD_PLAZA_MOBILE_AUTO_JUMP_TOGGLE,
  STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_CHECKBOX_CLASS_NAME,
  STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_TOGGLE_ROW_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaMobileAutoJumpConstants';
import { unlockingWorldPlazaBiomeMusicFromUserGesture } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { LABELING_WORLD_PLAZA_TEMPERATURE_DISPLAY_FAHRENHEIT_TOGGLE } from '@/components/world/health/domains/definingWorldPlazaTemperatureDisplayUnitPreferenceConstants';
import { usingWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/hooks/usingWorldPlazaTemperatureDisplayUnit';
import { usingWorldPlazaMasterVolume } from '@/components/world/hooks/usingWorldPlazaMasterVolume';
import { usingWorldPlazaMobileAutoJumpEnabled } from '@/components/world/hooks/usingWorldPlazaMobileAutoJumpEnabled';
import { LABELING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_TOGGLE } from '@/components/world/inventory/domains/definingWorldPlazaGroundItemAutoPickupPreferenceConstants';
import { usingWorldPlazaGroundItemAutoPickupEnabled } from '@/components/world/inventory/hooks/usingWorldPlazaGroundItemAutoPickupEnabled';

/** Props for {@link RenderingWorldPlazaMasterVolumeMixerPanel}. */
export type RenderingWorldPlazaMasterVolumeMixerPanelProps = {
  /** When false, renders nothing. */
  isOpen: boolean;
};

/**
 * Dropdown panel with master volume, auto-pickup, auto-jump, and °F/°C settings.
 */
export function RenderingWorldPlazaMasterVolumeMixerPanel({
  isOpen,
}: RenderingWorldPlazaMasterVolumeMixerPanelProps): React.JSX.Element | null {
  const { masterVolume, settingMasterVolume } = usingWorldPlazaMasterVolume();
  const { isGroundItemAutoPickupEnabled, settingGroundItemAutoPickupEnabled } =
    usingWorldPlazaGroundItemAutoPickupEnabled();
  const { isMobileAutoJumpEnabled, settingMobileAutoJumpEnabled } =
    usingWorldPlazaMobileAutoJumpEnabled();
  const { isFahrenheitDisplayEnabled, settingFahrenheitDisplayEnabled } =
    usingWorldPlazaTemperatureDisplayUnit();

  if (!isOpen) {
    return null;
  }

  const volumePercent = Math.round(masterVolume * 100);

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      className={STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_PANEL_CLASS_NAME}
      role="group"
      aria-label={LABELING_WORLD_PLAZA_MASTER_VOLUME_MIXER}
    >
      <label
        className={STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_LABEL_CLASS_NAME}
        htmlFor="world-plaza-master-volume"
      >
        {LABELING_WORLD_PLAZA_MASTER_VOLUME_SLIDER} ({volumePercent}%)
      </label>
      <input
        id="world-plaza-master-volume"
        type="range"
        min={0}
        max={100}
        step={1}
        value={volumePercent}
        onPointerDown={() => {
          unlockingWorldPlazaBiomeMusicFromUserGesture();
        }}
        onInput={(event) => {
          unlockingWorldPlazaBiomeMusicFromUserGesture();
          settingMasterVolume(
            Number.parseInt(event.currentTarget.value, 10) / 100
          );
        }}
        className={STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_SLIDER_CLASS_NAME}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={volumePercent}
        aria-valuetext={`${volumePercent} percent`}
      />
      <label
        className={STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_TOGGLE_ROW_CLASS_NAME}
        htmlFor="world-plaza-ground-item-auto-pickup"
      >
        <input
          id="world-plaza-ground-item-auto-pickup"
          type="checkbox"
          checked={isGroundItemAutoPickupEnabled}
          className={STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_CHECKBOX_CLASS_NAME}
          onChange={(event) => {
            settingGroundItemAutoPickupEnabled(event.currentTarget.checked);
          }}
        />
        <span>{LABELING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_TOGGLE}</span>
      </label>
      <label
        className={STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_TOGGLE_ROW_CLASS_NAME}
        htmlFor="world-plaza-mobile-auto-jump"
      >
        <input
          id="world-plaza-mobile-auto-jump"
          type="checkbox"
          checked={isMobileAutoJumpEnabled}
          className={STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_CHECKBOX_CLASS_NAME}
          onChange={(event) => {
            settingMobileAutoJumpEnabled(event.currentTarget.checked);
          }}
        />
        <span>{LABELING_WORLD_PLAZA_MOBILE_AUTO_JUMP_TOGGLE}</span>
      </label>
      <label
        className={STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_TOGGLE_ROW_CLASS_NAME}
        htmlFor="world-plaza-temperature-display-fahrenheit"
      >
        <input
          id="world-plaza-temperature-display-fahrenheit"
          type="checkbox"
          checked={isFahrenheitDisplayEnabled}
          className={STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_CHECKBOX_CLASS_NAME}
          onChange={(event) => {
            settingFahrenheitDisplayEnabled(event.currentTarget.checked);
          }}
        />
        <span>
          {LABELING_WORLD_PLAZA_TEMPERATURE_DISPLAY_FAHRENHEIT_TOGGLE}
        </span>
      </label>
    </div>
  );
}
