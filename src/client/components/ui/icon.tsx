import { registeringBundledIconifyIcons } from '@/components/ui/registeringBundledIconifyIcons';
import {
  Icon as IconifyIcon,
  type IconProps as IconifyIconProps,
} from '@iconify/react';

registeringBundledIconifyIcons();

export type IconProps = IconifyIconProps;

/**
 * Renders an icon from [Iconify](https://iconify.design/) by set prefix and name
 * (e.g. `mdi:home`, `ph:users-three`, `solar:gamepad-bold`).
 *
 * Icons must be registered in `registeringBundledIconifyIcons.ts` so they work
 * inside the Devvit iframe (no CDN fetch).
 */
export function Icon(props: IconProps): React.JSX.Element {
  return <IconifyIcon {...props} />;
}
