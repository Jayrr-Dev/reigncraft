import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { resolvingWorldPlazaMiniMapStackViewportLayout } from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportLayout';
import type { CSSProperties } from 'react';

export type ResolvingWorldPlazaMiniMapEnvironmentBarViewportStylesParams = {
  viewportHudScale: number;
  isMobile: boolean;
  isFullscreen: boolean;
};

export type DefiningWorldPlazaMiniMapEnvironmentBarViewportStyles = {
  readonly valueStyle: CSSProperties;
};

/**
 * Resolves time/temperature label sizes for every plaza viewport profile.
 *
 * Profiles: embedded desktop, embedded mobile, fullscreen desktop, fullscreen mobile.
 * Values are scaled by the live viewport HUD scale so Devvit preview sizes stay crisp.
 */
export function resolvingWorldPlazaMiniMapEnvironmentBarViewportStyles({
  viewportHudScale,
  isMobile,
  isFullscreen,
}: ResolvingWorldPlazaMiniMapEnvironmentBarViewportStylesParams): DefiningWorldPlazaMiniMapEnvironmentBarViewportStyles {
  const viewportLayout = resolvingWorldPlazaMiniMapStackViewportLayout(
    isMobile,
    isFullscreen
  );
  const fontSizePx = computingWorldPlazaViewportHudScaledPx(
    viewportLayout.environmentBarValueTextBasePx,
    viewportHudScale
  );

  return {
    valueStyle: {
      fontSize: fontSizePx,
    },
  };
}
