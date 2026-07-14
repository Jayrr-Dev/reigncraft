'use client';

/**
 * Glyph for one disease: microbe sprite-sheet cell, or Iconify fallback.
 *
 * @module components/world/health/components/renderingWorldPlazaEntityDiseaseIconGlyph
 */

import { Icon } from '@/components/ui/icon';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { resolvingWorldPlazaEntityDiseaseSpriteSheetIcon } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseSpriteSheetConstants';
import type { MappingWorldPlazaEntityBuffHudIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';
import { STYLING_WORLD_PLAZA_INVENTORY_SLOT_IMAGE_ICON_CLASS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';

export type RenderingWorldPlazaEntityDiseaseIconGlyphProps = {
  readonly diseaseId: DefiningWorldPlazaEntityDiseaseId;
  readonly fallbackIcon?: MappingWorldPlazaEntityBuffHudIconName;
  readonly className?: string;
  readonly style?: CSSProperties;
  /** Dark silhouette for locked Pathology tiles. */
  readonly variant?: 'revealed' | 'silhouette';
};

const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_ICON_SILHOUETTE_FILTER =
  'brightness(0) opacity(0.35)' as const;

/**
 * Renders a disease microbe sprite when the sheet has a cell, else Iconify.
 */
export function RenderingWorldPlazaEntityDiseaseIconGlyph({
  diseaseId,
  fallbackIcon = 'mdi:biohazard',
  className,
  style,
  variant = 'revealed',
}: RenderingWorldPlazaEntityDiseaseIconGlyphProps): React.JSX.Element {
  const spriteSheet =
    resolvingWorldPlazaEntityDiseaseSpriteSheetIcon(diseaseId);

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
          'block',
          className
        )}
        style={{
          ...style,
          backgroundImage: `url("${spriteSheet.spriteSheetUrl}")`,
          backgroundPosition: `${backgroundPositionX}% ${backgroundPositionY}%`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${spriteSheet.columnCount * 100}% ${spriteSheet.rowCount * 100}%`,
          filter:
            variant === 'silhouette'
              ? DEFINING_WORLD_PLAZA_ENTITY_DISEASE_ICON_SILHOUETTE_FILTER
              : style?.filter,
        }}
        aria-hidden
      />
    );
  }

  return (
    <Icon
      icon={fallbackIcon}
      className={cn('shrink-0', className)}
      style={style}
      aria-hidden
    />
  );
}
