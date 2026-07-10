'use client';

import { usingWildlifeStudySfx } from '@/components/world/wildlife/hooks/usingWildlifeStudySfx';

/**
 * Side-effect component that preloads corpse Study completion SFX.
 */
export function RenderingWildlifeStudySfx(): null {
  usingWildlifeStudySfx();
  return null;
}
