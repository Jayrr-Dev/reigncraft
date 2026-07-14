'use client';

import {
  DEFINING_PLAZA_HERBARIUM_CLOVER_PORTRAIT_CARD_ZOOM,
  DEFINING_PLAZA_HERBARIUM_CLOVER_PORTRAIT_SILHOUETTE_FILTER,
} from '@/components/home/domains/definingPlazaHerbariumCloverPortraitConstants';
import { resolvingPlazaHerbariumCloverPortrait } from '@/components/home/domains/resolvingPlazaHerbariumCloverPortrait';
import { useMemo } from 'react';
import type { WorldCloverSearchLootKind } from '../../../../shared/worldCloverSearchLoot';

export type RenderingPlazaHerbariumCloverPortraitProps = {
  cloverKind: WorldCloverSearchLootKind;
  variant: 'silhouette' | 'revealed';
  zoom?: number;
  className?: string;
};

/** One cropped cell from the clover inventory sprite sheet. */
export function RenderingPlazaHerbariumCloverPortrait({
  cloverKind,
  variant,
  zoom = DEFINING_PLAZA_HERBARIUM_CLOVER_PORTRAIT_CARD_ZOOM,
  className = '',
}: RenderingPlazaHerbariumCloverPortraitProps): React.JSX.Element | null {
  const portrait = useMemo(
    () => resolvingPlazaHerbariumCloverPortrait(cloverKind),
    [cloverKind]
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
            ? DEFINING_PLAZA_HERBARIUM_CLOVER_PORTRAIT_SILHOUETTE_FILTER
            : 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))',
      }}
    />
  );
}
