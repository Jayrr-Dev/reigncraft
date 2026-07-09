'use client';

import {
  DEFINING_PLAZA_BESTIARY_PORTRAIT_CARD_ZOOM,
  DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER,
} from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import { resolvingPlazaBestiarySpritePortrait } from '@/components/home/domains/resolvingPlazaBestiarySpritePortrait';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { useMemo } from 'react';

export type RenderingPlazaBestiarySpritePortraitProps = {
  speciesId: DefiningWildlifeSpeciesId;
  /** Silhouette hides identity for locked entries, Pokedex style. */
  variant: 'silhouette' | 'revealed';
  /** Zoom on the cropped frame; defaults to the card zoom. */
  zoom?: number;
  className?: string;
};

/**
 * One front-facing idle frame cropped from the species sprite sheet.
 * Locked entries render it as a dark silhouette; sighted entries show it fully.
 */
export function RenderingPlazaBestiarySpritePortrait({
  speciesId,
  variant,
  zoom = DEFINING_PLAZA_BESTIARY_PORTRAIT_CARD_ZOOM,
  className = '',
}: RenderingPlazaBestiarySpritePortraitProps): React.JSX.Element | null {
  const portrait = useMemo(
    () => resolvingPlazaBestiarySpritePortrait(speciesId),
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
            ? DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER
            : 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))',
      }}
    />
  );
}
