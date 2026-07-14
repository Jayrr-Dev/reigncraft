'use client';

/**
 * Cookbook left-page sprite-sheet recipe art.
 *
 * @module components/world/building/components/renderingWorldPlazaCraftModeRecipeSpriteSheetPreview
 */

import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { cn } from '@/lib/utils';

export type RenderingWorldPlazaCraftModeRecipeSpriteSheetPreviewProps = {
  readonly spriteSheetIcon: DefiningWorldPlazaInventorySpriteSheetIcon;
  readonly className?: string;
  readonly style?: React.CSSProperties;
};

/**
 * Renders one sprite-sheet cell for a craft cookbook left page.
 */
export function RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview({
  spriteSheetIcon,
  className,
  style,
}: RenderingWorldPlazaCraftModeRecipeSpriteSheetPreviewProps): React.JSX.Element {
  const columnPercent =
    spriteSheetIcon.columnCount <= 1
      ? 0
      : (spriteSheetIcon.columnIndex / (spriteSheetIcon.columnCount - 1)) * 100;
  const rowPercent =
    spriteSheetIcon.rowCount <= 1
      ? 0
      : (spriteSheetIcon.rowIndex / (spriteSheetIcon.rowCount - 1)) * 100;

  return (
    <div
      className={cn(
        'size-20 shrink-0 sm:size-24',
        className
      )}
      style={{
        backgroundImage: `url(${spriteSheetIcon.spriteSheetUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${spriteSheetIcon.columnCount * 100}% ${spriteSheetIcon.rowCount * 100}%`,
        backgroundPosition: `${columnPercent}% ${rowPercent}%`,
        imageRendering: 'pixelated',
        ...style,
      }}
      aria-hidden
    />
  );
}
