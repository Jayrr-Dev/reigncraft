'use client';

import {
  DEFINING_PLAZA_HERBARIUM_BERRY_PORTRAIT_CARD_ZOOM,
  DEFINING_PLAZA_HERBARIUM_BERRY_PORTRAIT_SILHOUETTE_FILTER,
} from '@/components/home/domains/definingPlazaHerbariumBerryPortraitConstants';
import { resolvingPlazaHerbariumBerryPortrait } from '@/components/home/domains/resolvingPlazaHerbariumBerryPortrait';
import { useMemo } from 'react';
import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';

export type RenderingPlazaHerbariumBerryPortraitProps = {
  berryLootKind: WorldShrubBerryLootKind;
  variant: 'silhouette' | 'revealed';
  zoom?: number;
  className?: string;
};

/** One cropped cell from the berry or tea leaves inventory sprite sheet. */
export function RenderingPlazaHerbariumBerryPortrait({
  berryLootKind,
  variant,
  zoom = DEFINING_PLAZA_HERBARIUM_BERRY_PORTRAIT_CARD_ZOOM,
  className = '',
}: RenderingPlazaHerbariumBerryPortraitProps): React.JSX.Element | null {
  const portrait = useMemo(
    () => resolvingPlazaHerbariumBerryPortrait(berryLootKind),
    [berryLootKind]
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
            ? DEFINING_PLAZA_HERBARIUM_BERRY_PORTRAIT_SILHOUETTE_FILTER
            : 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))',
      }}
    />
  );
}
