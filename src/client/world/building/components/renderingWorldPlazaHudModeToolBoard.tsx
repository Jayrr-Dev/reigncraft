'use client';

/**
 * Inventory-shaped Craft / Build / Claim tool board with empty slots + drag.
 *
 * @module components/world/building/components/renderingWorldPlazaHudModeToolBoard
 */

import {
  DEFINING_INVENTORY_DRAG_ACTIVATION_PX,
  DEFINING_INVENTORY_TOUCH_DRAG_ACTIVATION_DELAY_MS,
  DEFINING_INVENTORY_TOUCH_DRAG_ACTIVATION_TOLERANCE_PX,
} from '@/components/inventory/domains/definingInventoryConstants';
import {
  lockingInventoryDragPageScroll,
  unlockingInventoryDragPageScroll,
} from '@/components/inventory/domains/lockingInventoryDragPageScroll';
import { modifyingInventorySnapCenterToCursor } from '@/components/inventory/domains/modifyingInventoryDragOverlay';
import { RenderingWorldPlazaHudModeToolBoardSlotCell } from '@/components/world/building/components/renderingWorldPlazaHudModeToolBoardSlotCell';
import { RenderingWorldPlazaHudModeToolGlyph } from '@/components/world/building/components/renderingWorldPlazaHudModeToolGlyph';
import {
  LABELING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD,
  type DefiningWorldPlazaHudModeToolBoardId,
} from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';
import {
  parsingWorldPlazaHudModeToolDraggableId,
  parsingWorldPlazaHudModeToolSlotDroppableId,
} from '@/components/world/building/domains/definingWorldPlazaHudModeToolDndIds';
import {
  resolvingWorldPlazaHudModeToolDefinition,
  type DefiningWorldPlazaHudModeToolId,
} from '@/components/world/building/domains/definingWorldPlazaHudModeToolRegistry';
import { resolvingWorldPlazaHudModeToolDndCollisionDetection } from '@/components/world/building/domains/resolvingWorldPlazaHudModeToolDndCollisionDetection';
import { usingWorldPlazaHudModeToolBoard } from '@/components/world/building/hooks/usingWorldPlazaHudModeToolBoard';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  STYLING_WORLD_PLAZA_INVENTORY_GRID_WRAPPER_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_BODY_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DropAnimation,
} from '@dnd-kit/core';
import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { createPortal } from 'react-dom';

const DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_DROP_ANIMATION: DropAnimation = {
  duration: 180,
  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1)',
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export type RenderingWorldPlazaHudModeToolBoardProps = {
  readonly boardId: DefiningWorldPlazaHudModeToolBoardId;
  readonly activeToolId: DefiningWorldPlazaHudModeToolId | null;
  readonly onActivateTool: (toolId: DefiningWorldPlazaHudModeToolId) => void;
  /** Optional popover anchored above the active tool's slot. */
  readonly renderingToolPopover?: (
    toolId: DefiningWorldPlazaHudModeToolId
  ) => ReactNode;
  /** Optional controls rendered beside the slot grid (e.g. mode arrows). */
  readonly trailingContent?: ReactNode;
};

/**
 * Renders a full inventory-row shell of mode tools + empty slots.
 */
export function RenderingWorldPlazaHudModeToolBoard({
  boardId,
  activeToolId,
  onActivateTool,
  renderingToolPopover,
  trailingContent,
}: RenderingWorldPlazaHudModeToolBoardProps): React.JSX.Element {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const { layout, movingTool } = usingWorldPlazaHudModeToolBoard(boardId);
  const [draggingToolId, setDraggingToolId] = useState<string | null>(null);

  const viewportStyles = useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale]
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: DEFINING_INVENTORY_DRAG_ACTIVATION_PX,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: DEFINING_INVENTORY_TOUCH_DRAG_ACTIVATION_DELAY_MS,
        tolerance: DEFINING_INVENTORY_TOUCH_DRAG_ACTIVATION_TOLERANCE_PX,
      },
    })
  );

  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  const handlingDragStart = useCallback((event: DragStartEvent): void => {
    const parsed = parsingWorldPlazaHudModeToolDraggableId(
      String(event.active.id)
    );
    setDraggingToolId(parsed?.toolId ?? null);
    lockingInventoryDragPageScroll();
  }, []);

  const handlingDragCancel = useCallback((): void => {
    setDraggingToolId(null);
    unlockingInventoryDragPageScroll();
  }, []);

  const handlingDragEnd = useCallback(
    (event: DragEndEvent): void => {
      setDraggingToolId(null);
      unlockingInventoryDragPageScroll();

      const activeParsed = parsingWorldPlazaHudModeToolDraggableId(
        String(event.active.id)
      );

      if (activeParsed === null || activeParsed.boardId !== boardId) {
        return;
      }

      const fromSlotIndex = layout.findIndex(
        (slotToolId) => slotToolId === activeParsed.toolId
      );

      if (fromSlotIndex < 0 || event.over === null) {
        return;
      }

      const overParsed = parsingWorldPlazaHudModeToolSlotDroppableId(
        String(event.over.id)
      );

      if (overParsed === null || overParsed.boardId !== boardId) {
        const overToolParsed = parsingWorldPlazaHudModeToolDraggableId(
          String(event.over.id)
        );

        if (overToolParsed === null || overToolParsed.boardId !== boardId) {
          return;
        }

        const toSlotIndex = layout.findIndex(
          (slotToolId) => slotToolId === overToolParsed.toolId
        );

        if (toSlotIndex < 0) {
          return;
        }

        movingTool(fromSlotIndex, toSlotIndex);
        return;
      }

      movingTool(fromSlotIndex, overParsed.slotIndex);
    },
    [boardId, layout, movingTool]
  );

  const draggingToolDefinition =
    draggingToolId === null
      ? null
      : resolvingWorldPlazaHudModeToolDefinition(draggingToolId);

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      className={cn(
        STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
        STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS
      )}
      style={viewportStyles.shellStyle}
      aria-label={LABELING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD[boardId]}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={stoppingPlazaWalkPointerPropagation}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={resolvingWorldPlazaHudModeToolDndCollisionDetection}
        onDragStart={handlingDragStart}
        onDragCancel={handlingDragCancel}
        onDragEnd={handlingDragEnd}
      >
        <div
          className={STYLING_WORLD_PLAZA_INVENTORY_SHELL_BODY_CLASS_NAME}
          style={viewportStyles.shellBodyStyle}
        >
          <div
            className={STYLING_WORLD_PLAZA_INVENTORY_GRID_WRAPPER_CLASS_NAME}
            style={viewportStyles.gridStyle}
          >
            {layout.map((slotToolId, slotIndex) => {
              const toolDefinition =
                slotToolId === null
                  ? null
                  : resolvingWorldPlazaHudModeToolDefinition(slotToolId);
              const isActive =
                slotToolId !== null && slotToolId === activeToolId;

              return (
                <RenderingWorldPlazaHudModeToolBoardSlotCell
                  key={`${boardId}-slot-${slotIndex}`}
                  boardId={boardId}
                  slotIndex={slotIndex}
                  toolDefinition={toolDefinition}
                  isActive={isActive}
                  viewportStyles={viewportStyles}
                  onActivateTool={(toolId) => {
                    onActivateTool(toolId as DefiningWorldPlazaHudModeToolId);
                  }}
                  popover={
                    isActive &&
                    slotToolId !== null &&
                    renderingToolPopover !== undefined
                      ? renderingToolPopover(slotToolId)
                      : null
                  }
                />
              );
            })}
          </div>
          {trailingContent ?? null}
        </div>

        {createPortal(
          // Portal escapes the hotbar shell: its `transform: translateZ(0)`
          // makes it the containing block for the overlay's fixed positioning,
          // which offsets the ghost away from the pointer.
          <DragOverlay
            dropAnimation={DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_DROP_ANIMATION}
            modifiers={[modifyingInventorySnapCenterToCursor]}
            style={{ pointerEvents: 'none' }}
          >
            {draggingToolDefinition !== null ? (
              <div
                className={cn(
                  STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
                  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
                  'flex items-center justify-center'
                )}
                style={viewportStyles.slotStyle}
              >
                <RenderingWorldPlazaHudModeToolGlyph
                  toolDefinition={draggingToolDefinition}
                  iconStyle={viewportStyles.iconStyle}
                />
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
