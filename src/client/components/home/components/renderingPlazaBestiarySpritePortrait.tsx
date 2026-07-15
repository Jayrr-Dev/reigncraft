'use client';

import { DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER } from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import { resolvingPlazaBestiaryPortraitZoom } from '@/components/home/domains/resolvingPlazaBestiaryPortraitZoom';
import { resolvingPlazaBestiarySpritePortrait } from '@/components/home/domains/resolvingPlazaBestiarySpritePortrait';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { useMemo } from 'react';

export type RenderingPlazaBestiarySpritePortraitProps = {
  speciesId: DefiningWildlifeSpeciesId;
  /** Silhouette hides identity for locked entries, Pokedex style. */
  variant: 'silhouette' | 'revealed';
  /** Zoom on the cropped frame; defaults to species card zoom. */
  zoom?: number;
  className?: string;
};

/**
 * One front-facing idle frame cropped from the species sprite sheet, or a
 * gold glow orb for procedural companions without sheets.
 * Locked entries render it as a dark silhouette; sighted entries show it fully.
 */
export function RenderingPlazaBestiarySpritePortrait({
  speciesId,
  variant,
  zoom,
  className = '',
}: RenderingPlazaBestiarySpritePortraitProps): React.JSX.Element | null {
  const portrait = useMemo(
    () => resolvingPlazaBestiarySpritePortrait(speciesId),
    [speciesId]
  );
  const resolvedZoom =
    zoom ?? resolvingPlazaBestiaryPortraitZoom(speciesId, 'card');

  if (!portrait) {
    return null;
  }

  if (portrait.kind === 'glowOrb') {
    const isSilhouette = variant === 'silhouette';

    return (
      <span
        className={`pointer-events-none relative block ${className}`.trim()}
        aria-hidden
        style={{
          transform: `scale(${resolvedZoom})`,
          filter: isSilhouette
            ? DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER
            : 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))',
        }}
      >
        <span
          className="absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: isSilhouette
              ? 'radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, transparent 75%)'
              : `radial-gradient(circle, ${portrait.auraColorCss}cc 0%, ${portrait.auraColorCss}66 40%, transparent 72%)`,
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 size-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: isSilhouette ? '#000000' : portrait.coreColorCss,
            boxShadow: isSilhouette
              ? undefined
              : `0 0 10px ${portrait.auraColorCss}`,
          }}
        />
      </span>
    );
  }

  if (portrait.kind === 'emoji') {
    const isSilhouette = variant === 'silhouette';

    return (
      <span
        className={`pointer-events-none flex items-center justify-center ${className}`.trim()}
        aria-hidden
        style={{
          transform: `scale(${resolvedZoom})`,
          filter: isSilhouette
            ? DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER
            : 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))',
          fontSize: '1.75rem',
          lineHeight: 1,
          opacity: isSilhouette ? 0.85 : 1,
        }}
      >
        {portrait.emoji}
      </span>
    );
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
        transform: `scale(${resolvedZoom})`,
        filter:
          variant === 'silhouette'
            ? DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER
            : 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))',
      }}
    />
  );
}
