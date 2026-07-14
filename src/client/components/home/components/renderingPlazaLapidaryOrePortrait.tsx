'use client';

import {
  DEFINING_PLAZA_LAPIDARY_ORE_PORTRAIT_CARD_ZOOM,
  DEFINING_PLAZA_LAPIDARY_ORE_PORTRAIT_SILHOUETTE_FILTER,
} from '@/components/home/domains/definingPlazaLapidaryOrePortraitConstants';
import { resolvingPlazaLapidaryOrePortrait } from '@/components/home/domains/resolvingPlazaLapidaryOrePortrait';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';
import { useMemo } from 'react';

export type RenderingPlazaLapidaryOrePortraitProps = {
  speciesId: WorldOreSpeciesId;
  /** Silhouette hides identity for locked entries, Pokedex style. */
  variant: 'silhouette' | 'revealed';
  /** Zoom on the cropped cell; defaults to the card zoom. */
  zoom?: number;
  className?: string;
};

/**
 * One cropped cell from the shared ore inventory sprite sheet.
 * Locked entries render it as a dark silhouette; sighted entries show it fully.
 */
export function RenderingPlazaLapidaryOrePortrait({
  speciesId,
  variant,
  zoom = DEFINING_PLAZA_LAPIDARY_ORE_PORTRAIT_CARD_ZOOM,
  className = '',
}: RenderingPlazaLapidaryOrePortraitProps): React.JSX.Element | null {
  const portrait = useMemo(
    () => resolvingPlazaLapidaryOrePortrait(speciesId),
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
            ? DEFINING_PLAZA_LAPIDARY_ORE_PORTRAIT_SILHOUETTE_FILTER
            : 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))',
      }}
    />
  );
}
