'use client';

/**
 * Bottom-center inventory hotbar for the world plaza.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryHotbar
 */

import { SortingInventory } from '@/components/inventory/sortingInventory';
import { RoughDiv } from '@/components/ui/rough-div';
import { ProvidingWorldPlazaViewportHudScale } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  RenderingWorldPlazaInventoryRoughDragOverlayItem,
  RenderingWorldPlazaInventoryRoughSlotCell,
} from '@/components/world/inventory/components/renderingWorldPlazaInventoryRoughSlotCell';
import {
  LABELING_WORLD_PLAZA_INVENTORY_HOTBAR,
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_FILL_OPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_FILL_STYLE,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_SKETCH_COLORS,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SKETCH_PROPS,
  STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_LOADING_SHELL_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_LOADING_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SHELL_TEXT_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryRoughSketchConstants';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import type { TrackingWorldPlazaInventoryDropPlacementResult } from '@/components/world/inventory/hooks/trackingWorldPlazaInventoryDropPlacement';
import { usingWorldPlazaInventory } from '@/components/world/inventory/hooks/usingWorldPlazaInventory';
import { cn } from '@/lib/utils';
import type { DragEndEvent } from '@dnd-kit/core';
import type * as React from 'react';
import { useCallback, useMemo } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

/** Props for {@link RenderingWorldPlazaInventoryHotbar}. */
export interface RenderingWorldPlazaInventoryHotbarProps {
  /** Authenticated user id for online persistence. */
  readonly onlineUserId?: string | null;
  /** Offline session owner id for localStorage persistence. */
  readonly localPersistenceOwnerId?: string | null;
  /** Reddit user id for signed-in single-player cloud saves. */
  readonly redditUserId?: string | null;
  /** Active single-player save slot (1–3). */
  readonly saveSlotIndex?: PlazaSaveSlotIndex | null;
  /** Public username; applies the Kingpin founder test load when matched. */
  readonly onlineUsername?: string | null;
  /** Live HUD scale from the plaza viewport frame. */
  readonly viewportHudScale?: number;
  /** Optional drag-to-ground placement controller from the plaza scene. */
  readonly inventoryDropPlacement?: Pick<
    TrackingWorldPlazaInventoryDropPlacementResult,
    | 'handlingDragStart'
    | 'handlingDragMove'
    | 'handlingDragPointerMove'
    | 'handlingDragEnd'
    | 'handlingDragCancel'
  >;
  /** Selected hotbar slot for equipped tool actions. */
  readonly selectedSlotIndex?: number | null;
  /** Selects or toggles a hotbar slot as equipped. */
  readonly onSelectHotbarSlot?: (slotIndex: number) => void;
}

/**
 * Bottom-center inventory hotbar overlay for the plaza viewport.
 */
export function RenderingWorldPlazaInventoryHotbar({
  onlineUserId = null,
  localPersistenceOwnerId = null,
  redditUserId = null,
  saveSlotIndex = null,
  onlineUsername = null,
  viewportHudScale = 1,
  inventoryDropPlacement,
  selectedSlotIndex = null,
  onSelectHotbarSlot,
}: RenderingWorldPlazaInventoryHotbarProps): React.JSX.Element {
  const { state, isLoading, handleDragEnd } = usingWorldPlazaInventory({
    onlineUserId,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex,
    onlineUsername,
  });

  const handlingInventoryDragEnd = useCallback(
    (event: DragEndEvent): void => {
      if (inventoryDropPlacement) {
        inventoryDropPlacement.handlingDragEnd(
          event,
          state,
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
        );
        return;
      }

      handleDragEnd(event);
    },
    [handleDragEnd, inventoryDropPlacement, state]
  );

  const viewportStyles = useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale]
  );

  const RenderingWorldPlazaInventoryRoughDragOverlayItemScaled = useCallback(
    (
      props: React.ComponentProps<
        typeof RenderingWorldPlazaInventoryRoughDragOverlayItem
      >
    ) => (
      <RenderingWorldPlazaInventoryRoughDragOverlayItem
        {...props}
        viewportHudScale={viewportHudScale}
      />
    ),
    [viewportHudScale]
  );

  const RenderingWorldPlazaInventoryRoughSlotCellEquipped = useCallback(
    (
      props: React.ComponentProps<
        typeof RenderingWorldPlazaInventoryRoughSlotCell
      >
    ) => (
      <RenderingWorldPlazaInventoryRoughSlotCell
        {...props}
        isEquipped={props.slotIndex === selectedSlotIndex}
        onEquipSlot={onSelectHotbarSlot}
      />
    ),
    [onSelectHotbarSlot, selectedSlotIndex]
  );

  return (
    <div
      className={cn(
        STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME,
        STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS
      )}
      aria-label={LABELING_WORLD_PLAZA_INVENTORY_HOTBAR}
    >
      <ProvidingWorldPlazaViewportHudScale viewportHudScale={viewportHudScale}>
        <RoughDiv
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
          variant="secondary"
          {...DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SKETCH_PROPS}
          fillStyle={DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_FILL_STYLE}
          fillOpacity={DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_FILL_OPACITY}
          sketchColors={
            DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_SKETCH_COLORS
          }
          className={cn(
            STYLING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_SHELL_CLASS_NAME,
            STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SHELL_TEXT_CLASS
          )}
          style={viewportStyles.shellStyle}
        >
          {isLoading ? (
            <div
              className={
                STYLING_WORLD_PLAZA_INVENTORY_ROUGH_LOADING_SHELL_CLASS
              }
              style={viewportStyles.loadingShellStyle}
            >
              <span
                className={
                  STYLING_WORLD_PLAZA_INVENTORY_ROUGH_LOADING_TEXT_CLASS
                }
                style={viewportStyles.loadingTextStyle}
              >
                Loading inventory...
              </span>
            </div>
          ) : (
            <SortingInventory
              state={state}
              registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
              onDragStart={inventoryDropPlacement?.handlingDragStart}
              onDragMove={inventoryDropPlacement?.handlingDragMove}
              onDragPointerMove={
                inventoryDropPlacement?.handlingDragPointerMove
              }
              onDragCancel={inventoryDropPlacement?.handlingDragCancel}
              onDragEnd={handlingInventoryDragEnd}
              gridStyle={viewportStyles.gridStyle}
              SlotCellComponent={
                RenderingWorldPlazaInventoryRoughSlotCellEquipped
              }
              DragOverlayItemComponent={
                RenderingWorldPlazaInventoryRoughDragOverlayItemScaled
              }
            />
          )}
        </RoughDiv>
      </ProvidingWorldPlazaViewportHudScale>
    </div>
  );
}
