'use client';

/**
 * Storage chest 6×6 DnD panel (hosted inside the inventory hotbar DnD tree).
 *
 * @module components/world/storage-chest/components/renderingWorldPlazaStorageChestPopover
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { Icon } from '@/components/ui/icon';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_ICON_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryBagPopoverViewportLayout } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagPopoverViewportLayout';
import { RenderingWorldPlazaStorageChestSlotCell } from '@/components/world/storage-chest/components/renderingWorldPlazaStorageChestSlotCell';
import {
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_COLUMNS,
  DEFINING_WORLD_PLAZA_STORAGE_CHEST_ROWS,
  LABELING_WORLD_PLAZA_STORAGE_CHEST_PANEL,
  STYLING_WORLD_PLAZA_STORAGE_CHEST_POPOVER_CLOSE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_STORAGE_CHEST_POPOVER_PANEL_CLASS_NAME,
} from '@/components/world/storage-chest/domains/definingWorldPlazaStorageChestConstants';
import type * as React from 'react';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';

export type RenderingWorldPlazaStorageChestPopoverProps = {
  readonly blockId: string;
  readonly contents: DefiningInventoryState;
  readonly onClose: () => void;
};

export function RenderingWorldPlazaStorageChestPopover({
  blockId,
  contents,
  onClose,
}: RenderingWorldPlazaStorageChestPopoverProps): React.JSX.Element {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const viewportLayout = useMemo(
    () =>
      resolvingWorldPlazaInventoryBagPopoverViewportLayout(
        viewportHudScale,
        DEFINING_WORLD_PLAZA_STORAGE_CHEST_COLUMNS,
        DEFINING_WORLD_PLAZA_STORAGE_CHEST_ROWS
      ),
    [viewportHudScale]
  );

  if (typeof document === 'undefined') {
    return <></>;
  }

  // Portal escapes hotbar shell transform containing-block (same as kiln/teapot).
  return createPortal(
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className={STYLING_WORLD_PLAZA_STORAGE_CHEST_POPOVER_PANEL_CLASS_NAME}
      style={viewportLayout.panelStyle}
      role="dialog"
      aria-label={LABELING_WORLD_PLAZA_STORAGE_CHEST_PANEL}
    >
      <div className="flex items-center justify-between gap-2 px-2 pt-2">
        <p
          className={`${STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_CLASS} flex items-center gap-1`}
        >
          <Icon
            icon="mdi:treasure-chest"
            className={
              STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_ICON_CLASS
            }
          />
          {LABELING_WORLD_PLAZA_STORAGE_CHEST_PANEL}
        </p>
        <button
          type="button"
          className={
            STYLING_WORLD_PLAZA_STORAGE_CHEST_POPOVER_CLOSE_BUTTON_CLASS_NAME
          }
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <div
        className="grid gap-1 p-2"
        style={{
          gridTemplateColumns: `repeat(${DEFINING_WORLD_PLAZA_STORAGE_CHEST_COLUMNS}, minmax(0, 1fr))`,
        }}
      >
        {contents.slots.map((item, slotIndex) => (
          <RenderingWorldPlazaStorageChestSlotCell
            key={`${blockId}:${slotIndex}`}
            blockId={blockId}
            slotIndex={slotIndex}
            item={item}
            registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
          />
        ))}
      </div>
    </div>,
    document.body
  );
}
