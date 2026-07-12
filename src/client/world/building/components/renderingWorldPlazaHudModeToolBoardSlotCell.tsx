'use client';

/**
 * One inventory-shaped slot on a HUD mode tool board (empty droppable or tool).
 *
 * @module components/world/building/components/renderingWorldPlazaHudModeToolBoardSlotCell
 */

import { Icon } from '@/components/ui/icon';
import { STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_SLOT_ANCHOR_CLASS_NAME } from '@/components/world/building/domains/definingWorldPlazaBuildModeFunctionHotbarConstants';
import type { DefiningWorldPlazaHudModeToolBoardId } from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';
import {
  definingWorldPlazaHudModeToolDraggableId,
  definingWorldPlazaHudModeToolSlotDroppableId,
} from '@/components/world/building/domains/definingWorldPlazaHudModeToolDndIds';
import type { DefiningWorldPlazaHudModeToolDefinition } from '@/components/world/building/domains/definingWorldPlazaHudModeToolRegistry';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DRAG_SURFACE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import type { DefiningWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { cn } from '@/lib/utils';
import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import type { CSSProperties, ReactNode } from 'react';

export type RenderingWorldPlazaHudModeToolBoardSlotCellProps = {
  readonly boardId: DefiningWorldPlazaHudModeToolBoardId;
  readonly slotIndex: number;
  readonly toolDefinition: DefiningWorldPlazaHudModeToolDefinition | null;
  readonly isActive: boolean;
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
  readonly onActivateTool: (toolId: string) => void;
  readonly popover: ReactNode;
};

/**
 * Renders one mode-board slot: empty drop target or draggable tool icon.
 */
export function RenderingWorldPlazaHudModeToolBoardSlotCell({
  boardId,
  slotIndex,
  toolDefinition,
  isActive,
  viewportStyles,
  onActivateTool,
  popover,
}: RenderingWorldPlazaHudModeToolBoardSlotCellProps): React.JSX.Element {
  const droppableId = definingWorldPlazaHudModeToolSlotDroppableId(
    boardId,
    slotIndex
  );
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: droppableId,
    data: { boardId, slotIndex },
  });
  const { active } = useDndContext();
  const showDropHighlight = isOver && active !== null;

  if (toolDefinition === null) {
    return (
      <div
        className={
          STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_SLOT_ANCHOR_CLASS_NAME
        }
      >
        <div
          ref={setDropRef}
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          className={cn(
            STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
            STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
            showDropHighlight &&
              STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS
          )}
          style={viewportStyles.slotStyle}
          aria-label={`Empty tool slot ${slotIndex + 1}`}
        />
      </div>
    );
  }

  return (
    <RenderingWorldPlazaHudModeToolBoardFilledSlot
      boardId={boardId}
      slotIndex={slotIndex}
      toolDefinition={toolDefinition}
      isActive={isActive}
      viewportStyles={viewportStyles}
      onActivateTool={onActivateTool}
      popover={popover}
      setDropRef={setDropRef}
      showDropHighlight={showDropHighlight}
    />
  );
}

type RenderingWorldPlazaHudModeToolBoardFilledSlotProps = {
  readonly boardId: DefiningWorldPlazaHudModeToolBoardId;
  readonly slotIndex: number;
  readonly toolDefinition: DefiningWorldPlazaHudModeToolDefinition;
  readonly isActive: boolean;
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
  readonly onActivateTool: (toolId: string) => void;
  readonly popover: ReactNode;
  readonly setDropRef: (node: HTMLElement | null) => void;
  readonly showDropHighlight: boolean;
};

function RenderingWorldPlazaHudModeToolBoardFilledSlot({
  boardId,
  slotIndex,
  toolDefinition,
  isActive,
  viewportStyles,
  onActivateTool,
  popover,
  setDropRef,
  showDropHighlight,
}: RenderingWorldPlazaHudModeToolBoardFilledSlotProps): React.JSX.Element {
  const draggableId = definingWorldPlazaHudModeToolDraggableId(
    boardId,
    toolDefinition.id
  );
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: draggableId,
    data: {
      boardId,
      slotIndex,
      toolId: toolDefinition.id,
    },
  });

  const combiningRefs = (node: HTMLElement | null): void => {
    setDropRef(node);
    setDragRef(node);
  };

  const dragSurfaceStyle: CSSProperties = {
    ...viewportStyles.dragSurfaceStyle,
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div
      className={STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_SLOT_ANCHOR_CLASS_NAME}
    >
      {popover}
      <button
        type="button"
        ref={combiningRefs}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        {...attributes}
        {...listeners}
        aria-label={toolDefinition.ariaLabel}
        aria-pressed={isActive}
        title={toolDefinition.label}
        onClick={() => {
          onActivateTool(toolDefinition.id);
        }}
        className={cn(
          STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
          STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
          STYLING_WORLD_PLAZA_INVENTORY_SLOT_DRAG_SURFACE_CLASS,
          isActive && STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS,
          showDropHighlight &&
            STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS,
          'flex items-center justify-center'
        )}
        style={dragSurfaceStyle}
      >
        <Icon
          icon={toolDefinition.iconifyIcon}
          className="shrink-0"
          style={viewportStyles.iconStyle}
          aria-hidden
        />
      </button>
    </div>
  );
}
