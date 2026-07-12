'use client';

/**
 * Bag storage popover grid opened from a hotbar bag slot.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryBagPopover
 */

import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { Icon } from '@/components/ui/icon';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import { RenderingWorldPlazaInventoryBagSlotCell } from '@/components/world/inventory/components/renderingWorldPlazaInventoryBagSlotCell';
import { RenderingWorldPlazaInventoryItemInfoDialog } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemInfoDialog';
import { DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagConstants';
import { LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import {
  STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_ICON_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryBagContents } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagContents';
import { resolvingWorldPlazaInventoryBagPopoverViewportLayout } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagPopoverViewportLayout';
import { resolvingWorldPlazaInventoryItemDetailPopoverModel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailPopoverModel';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';
import type * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const RENDERING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_PANEL_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.glassPanel} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme} pointer-events-auto absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-none -translate-x-1/2 rounded-md shadow-lg`;

const RENDERING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_INFO_BUTTON_CLASS_NAME = `${STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_CLASS} mx-auto flex w-full cursor-pointer items-center justify-center gap-1 border-0 bg-transparent p-0 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70`;

export type RenderingWorldPlazaInventoryBagPopoverProps = {
  readonly bagItem: DefiningInventoryItem;
  readonly registry: DefiningInventoryItemRegistry;
  readonly isOpen: boolean;
  readonly isEquipped?: boolean;
  readonly onClose: () => void;
  readonly playerEffectiveMaxHealth?: number;
};

/**
 * Renders the internal storage grid for one equipped bag in the hotbar.
 */
export function RenderingWorldPlazaInventoryBagPopover({
  bagItem,
  registry,
  isOpen,
  isEquipped = false,
  playerEffectiveMaxHealth,
}: RenderingWorldPlazaInventoryBagPopoverProps): React.JSX.Element | null {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const bagDefinition =
    DEFINING_WORLD_PLAZA_INVENTORY_BAG_DEFINITION_BY_TYPE_ID[
      bagItem.itemTypeId
    ];
  const bagContents = useMemo(
    () => resolvingWorldPlazaInventoryBagContents(bagItem, registry),
    [bagItem, registry]
  );
  const detailPopoverModel = useMemo(
    () =>
      resolvingWorldPlazaInventoryItemDetailPopoverModel(bagItem, {
        isEquipped,
        playerEffectiveMaxHealth,
      }),
    [bagItem, isEquipped, playerEffectiveMaxHealth]
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

  const openingInfoDialog = useCallback((): void => {
    setIsInfoDialogOpen(true);
  }, []);

  const closingInfoDialog = useCallback((): void => {
    setIsInfoDialogOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsInfoDialogOpen(false);
    }
  }, [isOpen]);

  if (!isOpen || !bagDefinition || !viewportLayout) {
    return null;
  }

  const typeDef = registry.resolvingItemType(bagItem.itemTypeId);
  const plazaTypeDef = resolvingWorldPlazaInventoryItemTypeDefinition(
    bagItem.itemTypeId
  );
  const panelLabel = typeDef?.name ?? bagDefinition.label;
  const panelIcon = plazaTypeDef?.iconifyIcon ?? bagDefinition.iconifyIcon;

  return (
    <>
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
        <button
          type="button"
          className={
            RENDERING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_INFO_BUTTON_CLASS_NAME
          }
          aria-label={LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO}
          onClick={openingInfoDialog}
        >
          {panelLabel}
          <Icon
            icon={panelIcon}
            className={
              STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_ICON_CLASS
            }
            aria-hidden
          />
        </button>
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

      {detailPopoverModel ? (
        <RenderingWorldPlazaInventoryItemInfoDialog
          isOpen={isInfoDialogOpen}
          model={detailPopoverModel}
          onClose={closingInfoDialog}
        />
      ) : null}
    </>
  );
}
