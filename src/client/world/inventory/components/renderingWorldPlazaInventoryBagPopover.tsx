'use client';

/**
 * Bag storage popover grid opened from a hotbar bag slot.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryBagPopover
 */

import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import { RenderingWorldPlazaInventoryBagSlotCell } from '@/components/world/inventory/components/renderingWorldPlazaInventoryBagSlotCell';
import { DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagConstants';
import { STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryBagContents } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagContents';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useMemo } from 'react';

const RENDERING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_PANEL_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.glassPanel} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme} pointer-events-auto absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-md p-2 shadow-lg`;

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
  const bagDefinition =
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID[
      bagItem.itemTypeId
    ];
  const bagContents = useMemo(
    () => resolvingWorldPlazaInventoryBagContents(bagItem, registry),
    [bagItem, registry]
  );

  if (!isOpen || !bagDefinition) {
    return null;
  }

  const typeDef = registry.resolvingItemType(bagItem.itemTypeId);
  const panelLabel = typeDef?.name ?? bagDefinition.label;

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className={RENDERING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_PANEL_CLASS_NAME}
      role="dialog"
      aria-label={`${panelLabel} storage`}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <p
        className={cn(
          STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
          'mb-1.5 text-center font-body text-[10px] font-semibold leading-none'
        )}
      >
        {panelLabel}
      </p>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${bagDefinition.columns}, minmax(0, 1fr))`,
        }}
      >
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
