'use client';

import { usingWorldPlazaInventoryBagSfx } from '@/components/world/inventory/hooks/usingWorldPlazaInventoryBagSfx';

/**
 * Side-effect component that preloads inventory pickup/drop SFX.
 */
export function RenderingWorldPlazaInventoryBagSfx(): null {
  usingWorldPlazaInventoryBagSfx();
  return null;
}
