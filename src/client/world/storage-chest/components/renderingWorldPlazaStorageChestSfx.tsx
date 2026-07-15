'use client';

import { usingWorldPlazaStorageChestSfx } from '@/components/world/storage-chest/hooks/usingWorldPlazaStorageChestSfx';

/**
 * Side-effect component that preloads storage chest lid open/close SFX.
 */
export function RenderingWorldPlazaStorageChestSfx(): null {
  usingWorldPlazaStorageChestSfx();
  return null;
}
