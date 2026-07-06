import gameIconsBrokenHeart from '@iconify-icons/game-icons/broken-heart';
import gameIconsDeathSkull from '@iconify-icons/game-icons/death-skull';
import gameIconsDrop from '@iconify-icons/game-icons/drop';
import gameIconsScythe from '@iconify-icons/game-icons/scythe';
import gameIconsWoodAxe from '@iconify-icons/game-icons/wood-axe';
import mdiArrowDownBold from '@iconify-icons/mdi/arrow-down-bold';
import mdiArrowLeft from '@iconify-icons/mdi/arrow-left';
import mdiArrowUpBold from '@iconify-icons/mdi/arrow-up-bold';
import mdiBagPersonal from '@iconify-icons/mdi/bag-personal';
import mdiBiohazard from '@iconify-icons/mdi/biohazard';
import mdiBloodBag from '@iconify-icons/mdi/blood-bag';
import mdiBookOpenPageVariant from '@iconify-icons/mdi/book-open-page-variant';
import mdiChevronDown from '@iconify-icons/mdi/chevron-down';
import mdiChevronRight from '@iconify-icons/mdi/chevron-right';
import mdiClockOutline from '@iconify-icons/mdi/clock-outline';
import mdiClose from '@iconify-icons/mdi/close';
import mdiCompass from '@iconify-icons/mdi/compass';
import mdiContentSave from '@iconify-icons/mdi/content-save';
import mdiCrosshairsGps from '@iconify-icons/mdi/crosshairs-gps';
import mdiDiceMultiple from '@iconify-icons/mdi/dice-multiple';
import mdiDoorOpen from '@iconify-icons/mdi/door-open';
import mdiFire from '@iconify-icons/mdi/fire';
import mdiFireOff from '@iconify-icons/mdi/fire-off';
import mdiFlash from '@iconify-icons/mdi/flash';
import mdiFoodAppleOutline from '@iconify-icons/mdi/food-apple-outline';
import mdiFoodDrumstick from '@iconify-icons/mdi/food-drumstick';
import mdiFoodDrumstickOff from '@iconify-icons/mdi/food-drumstick-off';
import mdiFruitCherries from '@iconify-icons/mdi/fruit-cherries';
import mdiHammer from '@iconify-icons/mdi/hammer';
import mdiHeartFlash from '@iconify-icons/mdi/heart-flash';
import mdiHeartOutline from '@iconify-icons/mdi/heart-outline';
import mdiHeartPlus from '@iconify-icons/mdi/heart-plus';
import mdiHome from '@iconify-icons/mdi/home';
import mdiLayersTriple from '@iconify-icons/mdi/layers-triple';
import mdiLock from '@iconify-icons/mdi/lock';
import mdiPineTree from '@iconify-icons/mdi/pine-tree';
import mdiPlay from '@iconify-icons/mdi/play';
import mdiRefresh from '@iconify-icons/mdi/refresh';
import mdiRunFast from '@iconify-icons/mdi/run-fast';
import mdiShield from '@iconify-icons/mdi/shield';
import mdiShieldAccount from '@iconify-icons/mdi/shield-account';
import mdiShieldCheck from '@iconify-icons/mdi/shield-check';
import mdiShieldHalfFull from '@iconify-icons/mdi/shield-half-full';
import mdiShieldOff from '@iconify-icons/mdi/shield-off';
import mdiShieldPlus from '@iconify-icons/mdi/shield-plus';
import mdiSnowflake from '@iconify-icons/mdi/snowflake';
import mdiStairsUp from '@iconify-icons/mdi/stairs-up';
import mdiThermometer from '@iconify-icons/mdi/thermometer';
import mdiWeatherNight from '@iconify-icons/mdi/weather-night';
import mdiWeatherSunny from '@iconify-icons/mdi/weather-sunny';
import phHeartHalf from '@iconify-icons/ph/heart-half';
import phPersonSimpleRun from '@iconify-icons/ph/person-simple-run';
import phUsersThreeFill from '@iconify-icons/ph/users-three-fill';
import solarFireBold from '@iconify-icons/solar/fire-bold';
import solarGamepadBold from '@iconify-icons/solar/gamepad-bold';
import solarHeartPulseBold from '@iconify-icons/solar/heart-pulse-bold';
import boxiconsIconSet from '@iconify-json/boxicons/icons.json';
import { addIcon } from '@iconify/react';
import type { IconifyIcon } from '@iconify/types';

const boxiconsTarget: IconifyIcon = {
  ...boxiconsIconSet.icons.target,
  width: 24,
  height: 24,
};

const boxiconsSwordFilled: IconifyIcon = {
  ...boxiconsIconSet.icons['sword-filled'],
  width: 24,
  height: 24,
};

const bundledIconifyIcons: Record<string, IconifyIcon> = {
  'boxicons:sword-filled': boxiconsSwordFilled,
  'boxicons:target': boxiconsTarget,
  'game-icons:broken-heart': gameIconsBrokenHeart,
  'game-icons:death-skull': gameIconsDeathSkull,
  'game-icons:drop': gameIconsDrop,
  'game-icons:scythe': gameIconsScythe,
  'game-icons:wood-axe': gameIconsWoodAxe,
  'mdi:arrow-down-bold': mdiArrowDownBold,
  'mdi:arrow-left': mdiArrowLeft,
  'mdi:arrow-up-bold': mdiArrowUpBold,
  'mdi:bag-personal': mdiBagPersonal,
  'mdi:biohazard': mdiBiohazard,
  'mdi:blood-bag': mdiBloodBag,
  'mdi:book-open-page-variant': mdiBookOpenPageVariant,
  'mdi:chevron-down': mdiChevronDown,
  'mdi:chevron-right': mdiChevronRight,
  'mdi:close': mdiClose,
  'mdi:clock-outline': mdiClockOutline,
  'mdi:compass': mdiCompass,
  'mdi:content-save': mdiContentSave,
  'mdi:crosshairs-gps': mdiCrosshairsGps,
  'mdi:dice-multiple': mdiDiceMultiple,
  'mdi:door-open': mdiDoorOpen,
  'mdi:fire': mdiFire,
  'mdi:fire-off': mdiFireOff,
  'mdi:flash': mdiFlash,
  'mdi:food-apple-outline': mdiFoodAppleOutline,
  'mdi:food-drumstick': mdiFoodDrumstick,
  'mdi:food-drumstick-off': mdiFoodDrumstickOff,
  'mdi:fruit-cherries': mdiFruitCherries,
  'mdi:hammer': mdiHammer,
  'mdi:heart-flash': mdiHeartFlash,
  'mdi:heart-outline': mdiHeartOutline,
  'mdi:heart-plus': mdiHeartPlus,
  'mdi:home': mdiHome,
  'mdi:layers-triple': mdiLayersTriple,
  'mdi:lock': mdiLock,
  'mdi:play': mdiPlay,
  'mdi:pine-tree': mdiPineTree,
  'mdi:refresh': mdiRefresh,
  'mdi:run-fast': mdiRunFast,
  'mdi:shield': mdiShield,
  'mdi:shield-check': mdiShieldCheck,
  'mdi:shield-half-full': mdiShieldHalfFull,
  'mdi:shield-account': mdiShieldAccount,
  'mdi:shield-off': mdiShieldOff,
  'mdi:shield-plus': mdiShieldPlus,
  'mdi:snowflake': mdiSnowflake,
  'mdi:stairs-up': mdiStairsUp,
  'mdi:thermometer': mdiThermometer,
  'mdi:weather-night': mdiWeatherNight,
  'mdi:weather-sunny': mdiWeatherSunny,
  'ph:heart-half': phHeartHalf,
  'ph:person-simple-run': phPersonSimpleRun,
  'ph:users-three-fill': phUsersThreeFill,
  'solar:fire-bold': solarFireBold,
  'solar:gamepad-bold': solarGamepadBold,
  'solar:heart-pulse-bold': solarHeartPulseBold,
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
