'use client';

import { usingPlazaHomeScreenMusic } from '@/components/home/hooks/usingPlazaHomeScreenMusic';

/**
 * Side-effect component that loops title screen music on the home menu.
 */
export function RenderingPlazaHomeScreenMusic(): null {
  usingPlazaHomeScreenMusic();
  return null;
}
