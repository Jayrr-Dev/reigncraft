'use client';

/**
 * Glyph for one HUD mode-board tool: pixel sprite cell or Iconify fallback.
 *
 * @module components/world/building/components/renderingWorldPlazaHudModeToolGlyph
 */

import { Icon } from '@/components/ui/icon';
import type { DefiningWorldPlazaHudModeToolDefinition } from '@/components/world/building/domains/definingWorldPlazaHudModeToolRegistry';
import { STYLING_WORLD_PLAZA_INVENTORY_SLOT_IMAGE_ICON_CLASS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';

export type RenderingWorldPlazaHudModeToolGlyphProps = {
  readonly toolDefinition: DefiningWorldPlazaHudModeToolDefinition;
  readonly iconStyle: CSSProperties;
  readonly className?: string;
};

/**
 * Renders a tool's sprite-sheet cell when defined, else its Iconify icon.
 */
export function RenderingWorldPlazaHudModeToolGlyph({
  toolDefinition,
  iconStyle,
  className,
}: RenderingWorldPlazaHudModeToolGlyphProps): React.JSX.Element {
  const spriteSheet = toolDefinition.spriteSheetIcon;

  if (spriteSheet) {
    const backgroundPositionX =
      spriteSheet.columnCount <= 1
        ? 0
        : (spriteSheet.columnIndex / (spriteSheet.columnCount - 1)) * 100;
    const backgroundPositionY =
      spriteSheet.rowCount <= 1
        ? 0
        : (spriteSheet.rowIndex / (spriteSheet.rowCount - 1)) * 100;

    return (
      <span
        className={cn(
          STYLING_WORLD_PLAZA_INVENTORY_SLOT_IMAGE_ICON_CLASS,
          className
        )}
        style={{
          ...iconStyle,
          backgroundImage: `url("${spriteSheet.spriteSheetUrl}")`,
          backgroundPosition: `${backgroundPositionX}% ${backgroundPositionY}%`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${spriteSheet.columnCount * 100}% ${spriteSheet.rowCount * 100}%`,
        }}
        aria-hidden
      />
    );
  }

  return (
    <Icon
      icon={toolDefinition.iconifyIcon}
      className={cn('shrink-0', className)}
      style={iconStyle}
      aria-hidden
    />
  );
}
