'use client';

/**
 * Shared inventory item glyph renderer for plaza hotbar and ground pickups.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph
 */

import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_CUSTOM_ITEM_ICON_SOULCORE_SPHERE,
  type DefiningWorldPlazaInventoryCustomItemIconId,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryCustomItemIconIds';
import {
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMOJI_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_FALLBACK_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_FOREGROUND_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_ICON_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';
import { RenderingWorldPlazaSoulcoreSphereIcon } from '@/components/world/soulcore/components/renderingWorldPlazaSoulcoreSphereIcon';
import { Icon as IconifyGlyph } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import type * as React from 'react';

export type RenderingWorldPlazaInventoryItemGlyphProps = {
  readonly itemTypeId: string;
  readonly registry: DefiningInventoryItemRegistry;
  readonly iconStyle?: React.CSSProperties;
  readonly emojiStyle?: React.CSSProperties;
  readonly fallbackTextStyle?: React.CSSProperties;
  readonly iconClassName?: string;
  readonly emojiClassName?: string;
  readonly fallbackClassName?: string;
};

function renderingWorldPlazaInventoryCustomItemIcon(
  customIconId: DefiningWorldPlazaInventoryCustomItemIconId,
  className: string | undefined,
  style: React.CSSProperties | undefined
): React.JSX.Element | null {
  if (
    customIconId ===
    DEFINING_WORLD_PLAZA_INVENTORY_CUSTOM_ITEM_ICON_SOULCORE_SPHERE
  ) {
    return (
      <RenderingWorldPlazaSoulcoreSphereIcon
        className={className}
        style={style}
      />
    );
  }

  return null;
}

/**
 * Renders Lucide, custom, emoji, or fallback glyphs for one item type.
 */
export const RenderingWorldPlazaInventoryItemGlyph = memo(
  function RenderingWorldPlazaInventoryItemGlyph({
    itemTypeId,
    registry,
    iconStyle,
    emojiStyle,
    fallbackTextStyle,
    iconClassName,
    emojiClassName,
    fallbackClassName,
  }: RenderingWorldPlazaInventoryItemGlyphProps): React.JSX.Element {
    const typeDef = registry.resolvingItemType(itemTypeId);
    const plazaTypeDef =
      resolvingWorldPlazaInventoryItemTypeDefinition(itemTypeId);
    const LucideIcon = typeDef?.Icon;
    const resolvedIconClassName = cn(
      STYLING_WORLD_PLAZA_INVENTORY_SLOT_ICON_CLASS,
      STYLING_WORLD_PLAZA_INVENTORY_SLOT_FOREGROUND_CLASS,
      iconClassName
    );

    if (plazaTypeDef?.iconifyIcon) {
      return (
        <IconifyGlyph
          icon={plazaTypeDef.iconifyIcon}
          className={resolvedIconClassName}
          style={iconStyle}
          aria-hidden
        />
      );
    }

    if (plazaTypeDef?.customIconId) {
      const customIcon = renderingWorldPlazaInventoryCustomItemIcon(
        plazaTypeDef.customIconId,
        resolvedIconClassName,
        iconStyle
      );

      if (customIcon) {
        return customIcon;
      }
    }

    if (LucideIcon) {
      return (
        <LucideIcon
          className={resolvedIconClassName}
          style={iconStyle}
          aria-hidden
        />
      );
    }

    if (typeDef?.iconEmoji) {
      return (
        <span
          className={cn(
            STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMOJI_CLASS,
            emojiClassName
          )}
          style={emojiStyle}
          aria-hidden
        >
          {typeDef.iconEmoji}
        </span>
      );
    }

    return (
      <span
        className={cn(
          STYLING_WORLD_PLAZA_INVENTORY_SLOT_FALLBACK_TEXT_CLASS,
          STYLING_WORLD_PLAZA_INVENTORY_SLOT_FOREGROUND_CLASS,
          fallbackClassName
        )}
        style={fallbackTextStyle}
      >
        ?
      </span>
    );
  }
);
