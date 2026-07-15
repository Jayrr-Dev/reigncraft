'use client';

import {
  usingPlazaHomeScreenButtonSfx,
  type UsingPlazaHomeScreenButtonSfxOptions,
} from '@/components/home/hooks/usingPlazaHomeScreenButtonSfx';

export type RenderingPlazaHomeScreenButtonSfxProps =
  UsingPlazaHomeScreenButtonSfxOptions;

/**
 * Mounts home screen button click SFX preload and playback wiring.
 */
export function RenderingPlazaHomeScreenButtonSfx(
  props: RenderingPlazaHomeScreenButtonSfxProps = {}
): null {
  usingPlazaHomeScreenButtonSfx({
    trackDefaultButtonPresses: props.trackDefaultButtonPresses ?? true,
    defaultButtonPressVolumeMultiplier:
      props.defaultButtonPressVolumeMultiplier ?? 1,
  });
  return null;
}
