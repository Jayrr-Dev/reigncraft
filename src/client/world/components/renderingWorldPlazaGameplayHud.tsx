'use client';

import { resolvingWorldPlazaGameplayHudOverlayLayerClassName } from '@/components/world/domains/resolvingWorldPlazaGameplayHudOverlayLayerClassName';
import type { ReactNode } from 'react';

export type RenderingWorldPlazaGameplayHudProps = {
  /** All fixed and world-anchored HUD overlays for the plaza viewport. */
  children: ReactNode;
};

/**
 * Unified mount point for all plaza gameplay HUD overlays.
 *
 * Layout anchors, z-index, and corner insets are declared in
 * `definingWorldPlazaGameplayHudLayoutConstants.ts`.
 */
export function RenderingWorldPlazaGameplayHud({
  children,
}: RenderingWorldPlazaGameplayHudProps): React.JSX.Element {
  return (
    <div className={resolvingWorldPlazaGameplayHudOverlayLayerClassName()}>
      {children}
    </div>
  );
}
