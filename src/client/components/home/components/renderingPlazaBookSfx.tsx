'use client';

import { usingPlazaBookSfx } from '@/components/home/hooks/usingPlazaBookSfx';

/**
 * Side-effect component that preloads tutorial and lore book UI SFX.
 */
export function RenderingPlazaBookSfx(): null {
  usingPlazaBookSfx();
  return null;
}
