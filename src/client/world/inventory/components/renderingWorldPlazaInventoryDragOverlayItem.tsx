'use client';

import type { RenderingInventoryDragOverlayItemProps } from '@/components/inventory/renderingInventorySlotCell';
import { usingWorldPlazaViewportHudScaleContext } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import {
  STYLING_WORLD_PLAZA_INVENTORY_DRAG_OVERLAY_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_ITEM_ICON_WRAPPER_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import { resolvingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStackQuantityLabel';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

/**
 * Parchment-themed drag overlay preview for plaza inventory items.
 */
export function RenderingWorldPlazaInventoryDragOverlayItem({
  item,
  registry,
}: RenderingInventoryDragOverlayItemProps): React.JSX.Element {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();
  const viewportStyles = useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale]
  );

  return (
    <div
      className={cn(
        STYLING_WORLD_PLAZA_INVENTORY_DRAG_OVERLAY_CLASS,
        'flex items-center justify-center'
      )}
      style={viewportStyles.slotStyle}
    >
      <div className={STYLING_WORLD_PLAZA_INVENTORY_ITEM_ICON_WRAPPER_CLASS}>
        <RenderingWorldPlazaInventoryItemGlyph
          itemTypeId={item.itemTypeId}
          registry={registry}
          iconStyle={viewportStyles.iconStyle}
          emojiStyle={viewportStyles.emojiStyle}
          fallbackTextStyle={viewportStyles.fallbackTextStyle}
        />
        {item.quantity > 1 ? (
          <span
            className={STYLING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_CLASS}
            style={viewportStyles.quantityBadgeStyle}
          >
            {resolvingWorldPlazaInventoryStackQuantityLabel(
              item.itemTypeId,
              item.quantity
            )}
          </span>
        ) : null}
      </div>
    </div>
  );
}
