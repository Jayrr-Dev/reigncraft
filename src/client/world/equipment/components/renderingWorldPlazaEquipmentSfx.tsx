'use client';

import { usingWorldPlazaEquipmentSfx } from '@/components/world/equipment/hooks/usingWorldPlazaEquipmentSfx';

/**
 * Side-effect component that preloads FilmCow equipment hit SFX.
 */
export function RenderingWorldPlazaEquipmentSfx(): null {
  usingWorldPlazaEquipmentSfx();
  return null;
}
