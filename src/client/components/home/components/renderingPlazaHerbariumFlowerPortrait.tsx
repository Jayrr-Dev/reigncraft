'use client';

import {
  DEFINING_PLAZA_HERBARIUM_FLOWER_PORTRAIT_CARD_ZOOM,
  DEFINING_PLAZA_HERBARIUM_FLOWER_PORTRAIT_SILHOUETTE_FILTER,
} from '@/components/home/domains/definingPlazaHerbariumFlowerPortraitConstants';
import { resolvingPlazaHerbariumFlowerPortrait } from '@/components/home/domains/resolvingPlazaHerbariumFlowerPortrait';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';
import { useMemo } from 'react';

export type RenderingPlazaHerbariumFlowerPortraitProps = {
  speciesId: WorldFlowerSpeciesId;
  /** Silhouette hides identity for locked entries, Pokedex style. */
  variant: 'silhouette' | 'revealed';
  /** Zoom on the cropped cell; defaults to the card zoom. */
  zoom?: number;
  className?: string;
};

/**
 * One cropped cell from the shared flower inventory sprite sheet.
 * Locked entries render it as a dark silhouette; sighted entries show it fully.
 */
export function RenderingPlazaHerbariumFlowerPortrait({
  speciesId,
  variant,
  zoom = DEFINING_PLAZA_HERBARIUM_FLOWER_PORTRAIT_CARD_ZOOM,
  className = '',
}: RenderingPlazaHerbariumFlowerPortraitProps): React.JSX.Element | null {
  const portrait = useMemo(
    () => resolvingPlazaHerbariumFlowerPortrait(speciesId),
    [speciesId]
  );

  if (!portrait) {
    return null;
  }

  return (
    <span
      className={`pointer-events-none block ${className}`.trim()}
      aria-hidden
      style={{
        backgroundImage: `url("${portrait.sheetUrl}")`,
        backgroundSize: portrait.backgroundSizeCss,
        backgroundPosition: portrait.backgroundPositionCss,
        backgroundRepeat: 'no-repeat',
        transform: `scale(${zoom})`,
        filter:
          variant === 'silhouette'
            ? DEFINING_PLAZA_HERBARIUM_FLOWER_PORTRAIT_SILHOUETTE_FILTER
            : 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))',
      }}
    />
  );
}
