import mdiArrowLeft from '@iconify-icons/mdi/arrow-left';
import mdiChevronDown from '@iconify-icons/mdi/chevron-down';
import mdiChevronRight from '@iconify-icons/mdi/chevron-right';
import mdiCompass from '@iconify-icons/mdi/compass';
import mdiContentSave from '@iconify-icons/mdi/content-save';
import mdiDoorOpen from '@iconify-icons/mdi/door-open';
import mdiHome from '@iconify-icons/mdi/home';
import mdiLock from '@iconify-icons/mdi/lock';
import mdiPlay from '@iconify-icons/mdi/play';
import mdiRefresh from '@iconify-icons/mdi/refresh';
import phUsersThreeFill from '@iconify-icons/ph/users-three-fill';
import solarGamepadBold from '@iconify-icons/solar/gamepad-bold';
import { addIcon } from '@iconify/react';
import type { IconifyIcon } from '@iconify/types';

const bundledIconifyIcons: Record<string, IconifyIcon> = {
  'mdi:arrow-left': mdiArrowLeft,
  'mdi:chevron-down': mdiChevronDown,
  'mdi:chevron-right': mdiChevronRight,
  'mdi:compass': mdiCompass,
  'mdi:content-save': mdiContentSave,
  'mdi:door-open': mdiDoorOpen,
  'mdi:home': mdiHome,
  'mdi:lock': mdiLock,
  'mdi:play': mdiPlay,
  'mdi:refresh': mdiRefresh,
  'ph:users-three-fill': phUsersThreeFill,
  'solar:gamepad-bold': solarGamepadBold,
};

let hasRegisteredBundledIconifyIcons = false;

/**
 * Registers Iconify glyphs bundled at build time. Required in Devvit because
 * the iframe blocks runtime fetches to the Iconify CDN.
 */
export function registeringBundledIconifyIcons(): void {
  if (hasRegisteredBundledIconifyIcons) {
    return;
  }

  for (const [iconName, iconData] of Object.entries(bundledIconifyIcons)) {
    addIcon(iconName, iconData);
  }

  hasRegisteredBundledIconifyIcons = true;
}
