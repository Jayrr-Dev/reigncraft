'use client';

/**
 * Master volume mixer dropdown for the plaza action bar settings button.
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
import { usingWorldPlazaMasterVolume } from '@/components/world/hooks/usingWorldPlazaMasterVolume';

/** Props for {@link RenderingWorldPlazaMasterVolumeMixerPanel}. */
export type RenderingWorldPlazaMasterVolumeMixerPanelProps = {
  /** When false, renders nothing. */
  isOpen: boolean;
};

/**
 * Dropdown panel with a single master volume slider.
 */
export function RenderingWorldPlazaMasterVolumeMixerPanel({
  isOpen,
}: RenderingWorldPlazaMasterVolumeMixerPanelProps): React.JSX.Element | null {
  const { masterVolume, settingMasterVolume } = usingWorldPlazaMasterVolume();

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
        onChange={(event) => {
          settingMasterVolume(Number.parseInt(event.target.value, 10) / 100);
        }}
        className={STYLING_WORLD_PLAZA_MASTER_VOLUME_MIXER_SLIDER_CLASS_NAME}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={volumePercent}
        aria-valuetext={`${volumePercent} percent`}
      />
    </div>
  );
}
