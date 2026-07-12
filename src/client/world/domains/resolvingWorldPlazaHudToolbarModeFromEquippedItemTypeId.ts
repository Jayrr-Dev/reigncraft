/**
 * Derives HUD toolbar mode from the equipped weapon/tool slot item.
 *
 * @module components/world/domains/resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId
 */

import { checkingWorldPlazaItemTypeHasEquipmentToolKind } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';
import {
  DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID,
  type DefiningWorldPlazaHudToolbarModeId,
} from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';

/**
 * Maps the equipped fist-slot item to Items / Craft / Build / Claim.
 * Empty or non-mode tools stay on Items.
 *
 * @param equippedItemTypeId - Item type in the reserved weapon/tool slot
 */
export function resolvingWorldPlazaHudToolbarModeFromEquippedItemTypeId(
  equippedItemTypeId: string | null | undefined
): DefiningWorldPlazaHudToolbarModeId {
  if (!equippedItemTypeId) {
    return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS;
  }

  if (
    checkingWorldPlazaItemTypeHasEquipmentToolKind(equippedItemTypeId, 'craft')
  ) {
    return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT;
  }

  if (
    checkingWorldPlazaItemTypeHasEquipmentToolKind(equippedItemTypeId, 'build')
  ) {
    return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD;
  }

  if (
    checkingWorldPlazaItemTypeHasEquipmentToolKind(equippedItemTypeId, 'claim')
  ) {
    return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM;
  }

  return DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS;
}
