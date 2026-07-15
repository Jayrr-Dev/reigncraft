'use client';

/**
 * Shared inventory item glyph renderer for plaza hotbar and ground pickups.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph
 */

import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { Icon as IconifyGlyph } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_CUSTOM_ITEM_ICON_SPRITCORE_SPHERE,
  type DefiningWorldPlazaInventoryCustomItemIconId,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryCustomItemIconIds';
import {
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMOJI_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_FALLBACK_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_FOREGROUND_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_ICON_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_IMAGE_ICON_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';
import { RenderingWorldPlazaSpritcoreSphereIcon } from '@/components/world/spritcore/components/renderingWorldPlazaSpritcoreSphereIcon';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import { memo } from 'react';

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
    DEFINING_WORLD_PLAZA_INVENTORY_CUSTOM_ITEM_ICON_SPRITCORE_SPHERE
  ) {
    return (
      <RenderingWorldPlazaSpritcoreSphereIcon
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

    if (plazaTypeDef?.iconSpriteSheet) {
      const spriteSheet = plazaTypeDef.iconSpriteSheet;
      const backgroundPositionX =
        spriteSheet.columnCount <= 1
          ? 0
          : (spriteSheet.columnIndex / (spriteSheet.columnCount - 1)) * 100;
      const backgroundPositionY =
        spriteSheet.rowCount <= 1
          ? 0
          : (spriteSheet.rowIndex / (spriteSheet.rowCount - 1)) * 100;
      const backgroundPosition = `${backgroundPositionX}% ${backgroundPositionY}%`;
      const backgroundSize = `${spriteSheet.columnCount * 100}% ${spriteSheet.rowCount * 100}%`;
      const spriteSheetStyle: React.CSSProperties = {
        backgroundImage: `url("${spriteSheet.spriteSheetUrl}")`,
        backgroundPosition,
        backgroundRepeat: 'no-repeat',
        backgroundSize,
      };
      const overlayColor = plazaTypeDef.iconSpriteOverlayColor;

      if (!overlayColor) {
        return (
          <span
            className={cn(
              STYLING_WORLD_PLAZA_INVENTORY_SLOT_IMAGE_ICON_CLASS,
              iconClassName
            )}
            style={{
              ...iconStyle,
              ...spriteSheetStyle,
            }}
            aria-hidden
          />
        );
      }

      return (
        <span
          className={cn(
            STYLING_WORLD_PLAZA_INVENTORY_SLOT_IMAGE_ICON_CLASS,
            'relative overflow-hidden',
            iconClassName
          )}
          style={iconStyle}
          aria-hidden
        >
          <span
            className="absolute inset-0 bg-no-repeat [image-rendering:pixelated]"
            style={spriteSheetStyle}
          />
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundColor: overlayColor,
              mixBlendMode: 'color',
              opacity: 0.92,
              WebkitMaskImage: `url("${spriteSheet.spriteSheetUrl}")`,
              maskImage: `url("${spriteSheet.spriteSheetUrl}")`,
              WebkitMaskPosition: backgroundPosition,
              maskPosition: backgroundPosition,
              WebkitMaskSize: backgroundSize,
              maskSize: backgroundSize,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          />
        </span>
      );
    }

    if (plazaTypeDef?.iconImageUrl) {
      return (
        <img
          src={plazaTypeDef.iconImageUrl}
          alt=""
          draggable={false}
          className={cn(
            STYLING_WORLD_PLAZA_INVENTORY_SLOT_IMAGE_ICON_CLASS,
            iconClassName
          )}
          style={iconStyle}
          aria-hidden
          onContextMenu={(event) => {
            event.preventDefault();
          }}
          onDragStart={(event) => {
            event.preventDefault();
          }}
        />
      );
    }

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
