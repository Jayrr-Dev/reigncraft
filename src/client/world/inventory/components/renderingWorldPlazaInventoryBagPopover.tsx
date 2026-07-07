'use client';

/**
 * Bag storage popover grid opened from a hotbar bag slot.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryBagPopover
 */

import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import { RenderingWorldPlazaInventoryBagSlotCell } from '@/components/world/inventory/components/renderingWorldPlazaInventoryBagSlotCell';
import { DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagConstants';
import { STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_CLASS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryBagContents } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagContents';
import { resolvingWorldPlazaInventoryBagPopoverViewportLayout } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagPopoverViewportLayout';
import type * as React from 'react';
import { useMemo } from 'react';

const RENDERING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_PANEL_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.glassPanel} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme} pointer-events-auto absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-none -translate-x-1/2 rounded-md shadow-lg`;

export type RenderingWorldPlazaInventoryBagPopoverProps = {
  readonly bagItem: DefiningInventoryItem;
  readonly registry: DefiningInventoryItemRegistry;
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

/**
 * Renders the internal storage grid for one equipped bag in the hotbar.
 */
export function RenderingWorldPlazaInventoryBagPopover({
  bagItem,
  registry,
  isOpen,
}: RenderingWorldPlazaInventoryBagPopoverProps): React.JSX.Element | null {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const bagDefinition =
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID[
      bagItem.itemTypeId
    ];
  const bagContents = useMemo(
    () => resolvingWorldPlazaInventoryBagContents(bagItem, registry),
    [bagItem, registry]
  );
  const viewportLayout = useMemo(() => {
    if (!bagDefinition) {
      return null;
    }

    return resolvingWorldPlazaInventoryBagPopoverViewportLayout(
      viewportHudScale,
      bagDefinition.columns,
      bagDefinition.rows
    );
  }, [bagDefinition, viewportHudScale]);

  if (!isOpen || !bagDefinition || !viewportLayout) {
    return null;
  }

  const typeDef = registry.resolvingItemType(bagItem.itemTypeId);
  const panelLabel = typeDef?.name ?? bagDefinition.label;

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className={RENDERING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_PANEL_CLASS_NAME}
      style={viewportLayout.panelStyle}
      role="dialog"
      aria-label={`${panelLabel} storage`}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <p className={STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_CLASS}>
        {panelLabel}
      </p>
      <div className="grid shrink-0" style={viewportLayout.gridStyle}>
        {bagContents.slots.map((slotItem, bagSlotIndex) => (
          <RenderingWorldPlazaInventoryBagSlotCell
            key={`${bagItem.id}-bag-slot-${bagSlotIndex}`}
            bagItemInstanceId={bagItem.id}
            bagSlotIndex={bagSlotIndex}
            item={slotItem}
            registry={registry}
          />
        ))}
      </div>
    </div>
  );
}
