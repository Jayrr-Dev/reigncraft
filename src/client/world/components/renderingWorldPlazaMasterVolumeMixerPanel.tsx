'use client';

/**
 * Settings dropdown for the plaza action bar (volume + gameplay toggles).
 *
 * @module components/world/components/renderingWorldPlazaMasterVolumeMixerPanel
 */

import { Icon } from '@/components/ui/icon';
import {
  LABELING_WORLD_PLAZA_AMBIENCE_VOLUME_SLIDER,
  STYLING_WORLD_PLAZA_AMBIENCE_VOLUME_MIXER_SLIDER_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaAmbienceVolumeConstants';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import { LABELING_WORLD_PLAZA_DANGER_SENSE_TOGGLE } from '@/components/world/domains/definingWorldPlazaDangerSenseHudConstants';
import {
  DEFINING_WORLD_PLAZA_SETTINGS_GUIDE_OPTIONS,
  LABELING_WORLD_PLAZA_MASTER_VOLUME_MIXER,
  LABELING_WORLD_PLAZA_MASTER_VOLUME_SLIDER,
  LABELING_WORLD_PLAZA_SETTINGS_EXIT_HOME,
  STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_SLIDER_CLASS_NAME,
  STYLING_WORLD_PLAZA_SETTINGS_EXIT_HOME_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_SETTINGS_GUIDE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_SETTINGS_GUIDE_STACK_CLASS_NAME,
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
  LABELING_WORLD_PLAZA_SFX_VOLUME_SLIDER,
  STYLING_WORLD_PLAZA_SFX_VOLUME_MIXER_SLIDER_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaSfxVolumeConstants';
import { unlockingWorldPlazaBiomeMusicFromUserGesture } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';
import { LABELING_WORLD_PLAZA_TEMPERATURE_DISPLAY_FAHRENHEIT_TOGGLE } from '@/components/world/health/domains/definingWorldPlazaTemperatureDisplayUnitPreferenceConstants';
import { usingWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/hooks/usingWorldPlazaTemperatureDisplayUnit';
import { usingWorldPlazaAmbienceVolume } from '@/components/world/hooks/usingWorldPlazaAmbienceVolume';
import { usingWorldPlazaDangerSenseEnabled } from '@/components/world/hooks/usingWorldPlazaDangerSenseEnabled';
import { usingWorldPlazaMasterVolume } from '@/components/world/hooks/usingWorldPlazaMasterVolume';
import { usingWorldPlazaMinimapEnabled } from '@/components/world/hooks/usingWorldPlazaMinimapEnabled';
import { usingWorldPlazaMobileAutoJumpEnabled } from '@/components/world/hooks/usingWorldPlazaMobileAutoJumpEnabled';
import { usingWorldPlazaSfxVolume } from '@/components/world/hooks/usingWorldPlazaSfxVolume';
import { LABELING_WORLD_PLAZA_HIDE_ACTIONS_TOGGLE } from '@/components/world/interaction/domains/definingWorldPlazaHideActionsPreferenceConstants';
import { usingWorldPlazaHideActionsEnabled } from '@/components/world/interaction/hooks/usingWorldPlazaHideActionsEnabled';
import { LABELING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_TOGGLE } from '@/components/world/inventory/domains/definingWorldPlazaGroundItemAutoPickupPreferenceConstants';
import { usingWorldPlazaGroundItemAutoPickupEnabled } from '@/components/world/inventory/hooks/usingWorldPlazaGroundItemAutoPickupEnabled';

/** Props for {@link RenderingWorldPlazaMasterVolumeMixerPanel}. */
export type RenderingWorldPlazaMasterVolumeMixerPanelProps = {
  /** When false, renders nothing. */
  isOpen: boolean;
  /** Opens the exit-to-home confirm flow when provided. */
  onRequestExitToHome?: () => void;
  /** Opens a guide overlay (Controls / Mechanics / Lore) when provided. */
  onSelectGuideSection?: (section: WorldPlazaCodexSectionId) => void;
};

/**
 * Dropdown panel with music volume, ambience volume, SFX volume, hide actions,
 * auto-pickup, auto-jump, danger sense, and °F/°C settings.
 */
export function RenderingWorldPlazaMasterVolumeMixerPanel({
  isOpen,
  onRequestExitToHome,
  onSelectGuideSection,
}: RenderingWorldPlazaMasterVolumeMixerPanelProps): React.JSX.Element | null {
  const { masterVolume, settingMasterVolume } = usingWorldPlazaMasterVolume();
  const { ambienceVolume, settingAmbienceVolume } =
    usingWorldPlazaAmbienceVolume();
  const { sfxVolume, settingSfxVolume } = usingWorldPlazaSfxVolume();
  const { isGroundItemAutoPickupEnabled, settingGroundItemAutoPickupEnabled } =
    usingWorldPlazaGroundItemAutoPickupEnabled();
  const { isHideActionsEnabled, settingHideActionsEnabled } =
    usingWorldPlazaHideActionsEnabled();
  const { isMobileAutoJumpEnabled, settingMobileAutoJumpEnabled } =
    usingWorldPlazaMobileAutoJumpEnabled();
  const { isMinimapPreferenceEnabled, settingMinimapEnabled } =
    usingWorldPlazaMinimapEnabled();
  const { isDangerSenseEnabled, settingDangerSenseEnabled } =
    usingWorldPlazaDangerSenseEnabled();
  const { isFahrenheitDisplayEnabled, settingFahrenheitDisplayEnabled } =
    usingWorldPlazaTemperatureDisplayUnit();

  if (!isOpen) {
    return null;
  }

  const volumePercent = Math.round(masterVolume * 100);
  const ambienceVolumePercent = Math.round(ambienceVolume * 100);
  const sfxVolumePercent = Math.round(sfxVolume * 100);

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      className={STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_PANEL_CLASS_NAME}
      role="group"
      aria-label={LABELING_WORLD_PLAZA_MASTER_VOLUME_MIXER}
    >
      {onRequestExitToHome ? (
        <button
          type="button"
          className={STYLING_WORLD_PLAZA_SETTINGS_EXIT_HOME_BUTTON_CLASS_NAME}
          onClick={onRequestExitToHome}
        >
          {LABELING_WORLD_PLAZA_SETTINGS_EXIT_HOME}
        </button>
      ) : null}
      {onSelectGuideSection ? (
        <div className={STYLING_WORLD_PLAZA_SETTINGS_GUIDE_STACK_CLASS_NAME}>
          {DEFINING_WORLD_PLAZA_SETTINGS_GUIDE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={STYLING_WORLD_PLAZA_SETTINGS_GUIDE_BUTTON_CLASS_NAME}
              onClick={() => {
                onSelectGuideSection(option.id);
              }}
            >
              <Icon
                icon={option.icon}
                className="size-4 shrink-0"
                aria-hidden
              />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
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
        htmlFor="world-plaza-ambience-volume"
      >
        {LABELING_WORLD_PLAZA_AMBIENCE_VOLUME_SLIDER} ({ambienceVolumePercent}%)
      </label>
      <input
        id="world-plaza-ambience-volume"
        type="range"
        min={0}
        max={100}
        step={1}
        value={ambienceVolumePercent}
        onPointerDown={() => {
          unlockingWorldPlazaBiomeMusicFromUserGesture();
        }}
        onInput={(event) => {
          unlockingWorldPlazaBiomeMusicFromUserGesture();
          settingAmbienceVolume(
            Number.parseInt(event.currentTarget.value, 10) / 100
          );
        }}
        className={STYLING_WORLD_PLAZA_AMBIENCE_VOLUME_MIXER_SLIDER_CLASS_NAME}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={ambienceVolumePercent}
        aria-valuetext={`${ambienceVolumePercent} percent`}
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
        className={STYLING_WORLD_PLAZA_MINIMAP_TOGGLE_ROW_CLASS_NAME}
        htmlFor="world-plaza-danger-sense-enabled"
      >
        <input
          id="world-plaza-danger-sense-enabled"
          type="checkbox"
          checked={isDangerSenseEnabled}
          className={STYLING_WORLD_PLAZA_MINIMAP_CHECKBOX_CLASS_NAME}
          onChange={(event) => {
            settingDangerSenseEnabled(event.currentTarget.checked);
          }}
        />
        <span>{LABELING_WORLD_PLAZA_DANGER_SENSE_TOGGLE}</span>
      </label>
      <label
        className={STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_TOGGLE_ROW_CLASS_NAME}
        htmlFor="world-plaza-hide-actions"
      >
        <input
          id="world-plaza-hide-actions"
          type="checkbox"
          checked={isHideActionsEnabled}
          className={STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_CHECKBOX_CLASS_NAME}
          onChange={(event) => {
            settingHideActionsEnabled(event.currentTarget.checked);
          }}
        />
        <span>{LABELING_WORLD_PLAZA_HIDE_ACTIONS_TOGGLE}</span>
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
    </div>
  );
}
