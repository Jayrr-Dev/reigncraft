'use client';

import { usingWorldPlazaWorldLoadingBiomeMusic } from '@/components/world/loading/hooks/usingWorldPlazaWorldLoadingBiomeMusic';

/**
 * Side-effect component that starts spawn-biome music on the loading screen.
 */
export function RenderingWorldPlazaWorldLoadingBiomeMusic(): null {
  usingWorldPlazaWorldLoadingBiomeMusic();
  return null;
}
