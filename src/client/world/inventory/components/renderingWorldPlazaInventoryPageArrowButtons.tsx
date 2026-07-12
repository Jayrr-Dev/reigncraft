'use client';

/**
 * Solid thematic up/down controls for inventory storage pages.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryPageArrowButtons
 */

import { Icon } from '@/components/ui/icon';
import {
  LABELING_WORLD_PLAZA_INVENTORY_PAGE_DOWN,
  LABELING_WORLD_PLAZA_INVENTORY_PAGE_UP,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DOWN_DROPPABLE_ID,
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_UP_DROPPABLE_ID,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryPageArrowDndIds';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICONS,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_DRAG_OVER_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_FACE_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICON_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_STACK_CLASS_NAME,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import type { DefiningWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import type * as React from 'react';

/** Props for {@link RenderingWorldPlazaInventoryPageArrowButtons}. */
export type RenderingWorldPlazaInventoryPageArrowButtonsProps = {
  readonly storagePageIndex: number;
  readonly storagePageCount: number;
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
  readonly onStoragePageIndexChange: (nextPageIndex: number) => void;
};

type RenderingWorldPlazaInventoryPageArrowButtonProps = {
  readonly droppableId: string;
  readonly ariaLabel: string;
  readonly icon: string;
  readonly enabled: boolean;
  readonly viewportStyles: DefiningWorldPlazaInventoryHotbarViewportStyles;
  readonly onActivate: () => void;
};

function RenderingWorldPlazaInventoryPageArrowButton({
  droppableId,
  ariaLabel,
  icon,
  enabled,
  viewportStyles,
  onActivate,
}: RenderingWorldPlazaInventoryPageArrowButtonProps): React.JSX.Element {
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    disabled: !enabled,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_CLASS_NAME}
      style={viewportStyles.pageArrowHitStyle}
      aria-label={ariaLabel}
      disabled={!enabled}
      onClick={() => {
        if (!enabled) {
          return;
        }

        onActivate();
      }}
    >
      <span
        className={cn(
          STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_FACE_CLASS_NAME,
          isOver &&
            enabled &&
            STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_DRAG_OVER_CLASS_NAME
        )}
        style={viewportStyles.pageArrowButtonStyle}
        aria-hidden
      >
        <Icon
          icon={icon}
          className={STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICON_CLASS_NAME}
          style={viewportStyles.pageArrowIconStyle}
          aria-hidden
        />
      </span>
    </button>
  );
}

/**
 * Right-side up/down arrows that page storage rows five slots at a time.
 * Droppable during item drag so hover can flip storage pages.
 */
export function RenderingWorldPlazaInventoryPageArrowButtons({
  storagePageIndex,
  storagePageCount,
  viewportStyles,
  onStoragePageIndexChange,
}: RenderingWorldPlazaInventoryPageArrowButtonsProps): React.JSX.Element {
  const canPageUp = storagePageIndex > 0;
  const canPageDown = storagePageIndex < storagePageCount - 1;

  return (
    <div
      className={STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_STACK_CLASS_NAME}
      style={viewportStyles.pageArrowStackStyle}
    >
      <RenderingWorldPlazaInventoryPageArrowButton
        droppableId={DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_UP_DROPPABLE_ID}
        ariaLabel={LABELING_WORLD_PLAZA_INVENTORY_PAGE_UP}
        icon={DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICONS.up}
        enabled={canPageUp}
        viewportStyles={viewportStyles}
        onActivate={() => {
          onStoragePageIndexChange(storagePageIndex - 1);
        }}
      />
      <RenderingWorldPlazaInventoryPageArrowButton
        droppableId={
          DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DOWN_DROPPABLE_ID
        }
        ariaLabel={LABELING_WORLD_PLAZA_INVENTORY_PAGE_DOWN}
        icon={DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICONS.down}
        enabled={canPageDown}
        viewportStyles={viewportStyles}
        onActivate={() => {
          onStoragePageIndexChange(storagePageIndex + 1);
        }}
      />
    </div>
  );
}
