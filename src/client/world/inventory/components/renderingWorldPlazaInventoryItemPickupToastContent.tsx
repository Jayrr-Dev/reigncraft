'use client';

/**
 * Pickup toast body: message on the left, item glyph on the far right.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryItemPickupToastContent
 */

import { DEFINING_REIGNCRAFT_TOAST_STYLE } from '@/components/ui/domains/definingReigncraftToastConstants';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { formattingWorldPlazaInventoryItemPickupToastMessage } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryItemPickupToastMessage';
import type { JSX } from 'react';

export type RenderingWorldPlazaInventoryItemPickupToastContentProps = {
  readonly itemTypeId: string;
  readonly quantity: number;
};

/**
 * Renders the compact pickup toast row used by Sonner gameplay toasts.
 */
export function RenderingWorldPlazaInventoryItemPickupToastContent({
  itemTypeId,
  quantity,
}: RenderingWorldPlazaInventoryItemPickupToastContentProps): JSX.Element {
  const message = formattingWorldPlazaInventoryItemPickupToastMessage({
    itemTypeId,
    quantity,
  });
  const iconClassName =
    DEFINING_REIGNCRAFT_TOAST_STYLE.gameplayPickupToastIconClassName;

  return (
    <span
      className={DEFINING_REIGNCRAFT_TOAST_STYLE.gameplayPickupToastRowClassName}
    >
      <span
        className={
          DEFINING_REIGNCRAFT_TOAST_STYLE.gameplayPickupToastMessageClassName
        }
      >
        {message}
      </span>
      <RenderingWorldPlazaInventoryItemGlyph
        itemTypeId={itemTypeId}
        registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
        iconClassName={iconClassName}
        emojiClassName={iconClassName}
        fallbackClassName={iconClassName}
      />
    </span>
  );
}
