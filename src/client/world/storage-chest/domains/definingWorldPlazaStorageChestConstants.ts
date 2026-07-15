/**
 * Layout and persistence constants for craftable player storage chests.
 *
 * @module components/world/storage-chest/domains/definingWorldPlazaStorageChestConstants
 */

import { DEFINING_WORLD_PLAZA_CHEST_DISPLAY_SCALE } from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import { DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

/** Slot grid columns for one storage chest. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_COLUMNS = 6;

/** Slot grid rows for one storage chest. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_ROWS = 6;

/** Total slots (6×6). */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_CAPACITY =
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_COLUMNS *
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_ROWS;

/** localStorage key prefix: `world-plaza-storage-chest:{ownerId}`. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-storage-chest' as const;

/** Player-facing panel title. */
export const LABELING_WORLD_PLAZA_STORAGE_CHEST_PANEL = 'Chest' as const;

/**
 * Dark wood panel chrome — same shell paint as storage-page hotbar rows.
 */
export const STYLING_WORLD_PLAZA_STORAGE_CHEST_POPOVER_PANEL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventoryHotbarShell} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventoryHotbarShellStorage} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme} pointer-events-auto absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-none -translate-x-1/2 rounded-md` as const;

/** Close control on the dark wood chest header. */
export const STYLING_WORLD_PLAZA_STORAGE_CHEST_POPOVER_CLOSE_BUTTON_CLASS_NAME =
  'rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-parchment/90 hover:bg-black/25' as const;

/** Player-facing Open action label. */
export const LABELING_WORLD_PLAZA_STORAGE_CHEST_OPEN_ACTION = 'Open' as const;

/** Clickable Open button chrome (campfire outlined text). */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_INTERACTION_LABEL_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME;

/** Display scale for placed storage chest sprites (player footlocker size). */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_DISPLAY_SCALE =
  DEFINING_WORLD_PLAZA_CHEST_DISPLAY_SCALE;

/** Extra screen-Y sink so sprite feet meet the tile diamond. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_FOOT_SINK_PX = 4;

/** Ghost alpha while placing a storage chest from craft. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_PLACEMENT_PREVIEW_ALPHA =
  0.72 as const;

/** Synthetic block id for craft/build placement ghost. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_PLACEMENT_PREVIEW_BLOCK_ID =
  'placement-preview-storage-chest' as const;

/** Closed lid sprite for placed storage chests. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_SPRITE_URL_CLOSED =
  '/environment/sprites/props/chest/chest-a-s-closed.webp' as const;

/** Open lid sprite while the storage UI is open. */
export const DEFINING_WORLD_PLAZA_STORAGE_CHEST_SPRITE_URL_OPEN =
  '/environment/sprites/props/chest/chest-a-s-open.webp' as const;

/**
 * Cookbook / recipe-page glyph: single-cell crop of the world chest WebP.
 */
export function resolvingWorldPlazaStorageChestRecipeSpriteSheetIcon(): DefiningWorldPlazaInventorySpriteSheetIcon {
  return {
    spriteSheetUrl: DEFINING_WORLD_PLAZA_STORAGE_CHEST_SPRITE_URL_CLOSED,
    columnCount: 1,
    rowCount: 1,
    columnIndex: 0,
    rowIndex: 0,
  };
}
