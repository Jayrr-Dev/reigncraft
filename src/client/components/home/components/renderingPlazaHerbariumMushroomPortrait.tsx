'use client';

import {
  DEFINING_PLAZA_HERBARIUM_MUSHROOM_PORTRAIT_CARD_ZOOM,
  DEFINING_PLAZA_HERBARIUM_MUSHROOM_PORTRAIT_SILHOUETTE_FILTER,
} from '@/components/home/domains/definingPlazaHerbariumMushroomPortraitConstants';
import { resolvingPlazaHerbariumMushroomPortrait } from '@/components/home/domains/resolvingPlazaHerbariumMushroomPortrait';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import { useMemo } from 'react';

export type RenderingPlazaHerbariumMushroomPortraitProps = {
  speciesId: DefiningWorldPlazaMushroomSpeciesId;
  variant: 'silhouette' | 'revealed';
  zoom?: number;
  className?: string;
};

/** One cropped cell from the raw mushroom inventory sprite sheet. */
export function RenderingPlazaHerbariumMushroomPortrait({
  speciesId,
  variant,
  zoom = DEFINING_PLAZA_HERBARIUM_MUSHROOM_PORTRAIT_CARD_ZOOM,
  className = '',
}: RenderingPlazaHerbariumMushroomPortraitProps): React.JSX.Element {
  const portrait = useMemo(
    () => resolvingPlazaHerbariumMushroomPortrait(speciesId),
    [speciesId]
  );

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
            ? DEFINING_PLAZA_HERBARIUM_MUSHROOM_PORTRAIT_SILHOUETTE_FILTER
            : 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))',
      }}
    />
  );
}
