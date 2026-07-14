'use client';

import {
  DEFINING_PLAZA_HERBARIUM_TREE_PORTRAIT_CARD_ZOOM,
  DEFINING_PLAZA_HERBARIUM_TREE_PORTRAIT_SILHOUETTE_FILTER,
} from '@/components/home/domains/definingPlazaHerbariumTreePortraitConstants';
import { resolvingPlazaHerbariumTreePortrait } from '@/components/home/domains/resolvingPlazaHerbariumTreePortrait';
import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import { useMemo } from 'react';

export type RenderingPlazaHerbariumTreePortraitProps = {
  treeVariant: DefiningWorldPlazaTreeVariantKind;
  /** Silhouette hides identity for locked entries, Pokedex style. */
  variant: 'silhouette' | 'revealed';
  /** Zoom on the cropped cell; defaults to the card zoom. */
  zoom?: number;
  className?: string;
};

/**
 * One cropped cell from the shared herbarium tree sprite sheet.
 * Locked entries render it as a dark silhouette; sighted entries show it fully.
 */
export function RenderingPlazaHerbariumTreePortrait({
  treeVariant,
  variant,
  zoom = DEFINING_PLAZA_HERBARIUM_TREE_PORTRAIT_CARD_ZOOM,
  className = '',
}: RenderingPlazaHerbariumTreePortraitProps): React.JSX.Element | null {
  const portrait = useMemo(
    () => resolvingPlazaHerbariumTreePortrait(treeVariant),
    [treeVariant]
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
            ? DEFINING_PLAZA_HERBARIUM_TREE_PORTRAIT_SILHOUETTE_FILTER
            : 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))',
      }}
    />
  );
}
