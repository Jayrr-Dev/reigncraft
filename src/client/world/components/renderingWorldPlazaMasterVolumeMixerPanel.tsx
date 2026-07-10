'use client';

/**
 * Settings dropdown for the plaza action bar (volume + gameplay toggles).
 *
 * @module components/world/components/renderingWorldPlazaMasterVolumeMixerPanel
 */

import { copyingWorldPlazaMobileDebugReportFromLiveContext } from '@/components/world/domains/copyingWorldPlazaMobileDebugReport';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  LABELING_WORLD_PLAZA_MASTER_VOLUME_MIXER,
  LABELING_WORLD_PLAZA_MASTER_VOLUME_SLIDER,
  STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_SLIDER_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaMasterVolumeConstants';
import {
  LABELING_WORLD_PLAZA_MINIMAP_TOGGLE,
  STYLING_WORLD_PLAZA_MINIMAP_CHECKBOX_CLASS_NAME,
  STYLING_WORLD_PLAZA_MINIMAP_TOGGLE_ROW_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaMinimapPreferenceConstants';
import {
  LABELING_WORLD_PLAZA_MOBILE_AUTO_JUMP_TOGGLE,
  STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_CHECKBOX_CLASS_NAME,
  STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_TOGGLE_ROW_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaMobileAutoJumpConstants';
import {
  LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_REPORT,
  STYLING_WORLD_PLAZA_MOBILE_DEBUG_SETTINGS_BUTTON_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaMobileDebugConstants';
import {
  LABELING_WORLD_PLAZA_SFX_VOLUME_SLIDER,
  STYLING_WORLD_PLAZA_SFX_VOLUME_MIXER_SLIDER_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaSfxVolumeConstants';
import { unlockingWorldPlazaBiomeMusicFromUserGesture } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { LABELING_WORLD_PLAZA_TEMPERATURE_DISPLAY_FAHRENHEIT_TOGGLE } from '@/components/world/health/domains/definingWorldPlazaTemperatureDisplayUnitPreferenceConstants';
import { usingWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/hooks/usingWorldPlazaTemperatureDisplayUnit';
import { usingWorldPlazaMasterVolume } from '@/components/world/hooks/usingWorldPlazaMasterVolume';
import { usingWorldPlazaMinimapEnabled } from '@/components/world/hooks/usingWorldPlazaMinimapEnabled';
import { usingWorldPlazaMobileAutoJumpEnabled } from '@/components/world/hooks/usingWorldPlazaMobileAutoJumpEnabled';
import { usingWorldPlazaSfxVolume } from '@/components/world/hooks/usingWorldPlazaSfxVolume';
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
  const { sfxVolume, settingSfxVolume } = usingWorldPlazaSfxVolume();
  const { isGroundItemAutoPickupEnabled, settingGroundItemAutoPickupEnabled } =
    usingWorldPlazaGroundItemAutoPickupEnabled();
  const { isMobileAutoJumpEnabled, settingMobileAutoJumpEnabled } =
    usingWorldPlazaMobileAutoJumpEnabled();
  const { isMinimapPreferenceEnabled, settingMinimapEnabled } =
    usingWorldPlazaMinimapEnabled();
  const { isFahrenheitDisplayEnabled, settingFahrenheitDisplayEnabled } =
    usingWorldPlazaTemperatureDisplayUnit();

  if (!isOpen) {
    return null;
  }

  const volumePercent = Math.round(masterVolume * 100);
  const sfxVolumePercent = Math.round(sfxVolume * 100);

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
        className={STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_LABEL_CLASS_NAME}
        htmlFor="world-plaza-sfx-volume"
      >
        {LABELING_WORLD_PLAZA_SFX_VOLUME_SLIDER} ({sfxVolumePercent}%)
      </label>
      <input
        id="world-plaza-sfx-volume"
        type="range"
        min={0}
        max={100}
        step={1}
        value={sfxVolumePercent}
        onPointerDown={() => {
          unlockingWorldPlazaBiomeMusicFromUserGesture();
        }}
        onInput={(event) => {
          unlockingWorldPlazaBiomeMusicFromUserGesture();
          settingSfxVolume(
            Number.parseInt(event.currentTarget.value, 10) / 100
          );
        }}
        className={STYLING_WORLD_PLAZA_SFX_VOLUME_MIXER_SLIDER_CLASS_NAME}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={sfxVolumePercent}
        aria-valuetext={`${sfxVolumePercent} percent`}
      />
      <label
        className={STYLING_WORLD_PLAZA_MINIMAP_TOGGLE_ROW_CLASS_NAME}
        htmlFor="world-plaza-minimap-enabled"
      >
        <input
          id="world-plaza-minimap-enabled"
          type="checkbox"
          checked={isMinimapPreferenceEnabled}
          className={STYLING_WORLD_PLAZA_MINIMAP_CHECKBOX_CLASS_NAME}
          onChange={(event) => {
            settingMinimapEnabled(event.currentTarget.checked);
          }}
        />
        <span>{LABELING_WORLD_PLAZA_MINIMAP_TOGGLE}</span>
      </label>
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
      <button
        type="button"
        className={STYLING_WORLD_PLAZA_MOBILE_DEBUG_SETTINGS_BUTTON_CLASS_NAME}
        onClick={() => {
          void copyingWorldPlazaMobileDebugReportFromLiveContext();
        }}
      >
        {LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_REPORT}
      </button>
    </div>
  );
}
