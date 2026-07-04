'use client';

import { DEFINING_WORLD_PLAZA_ENTITY_DEATH_VIGNETTE_OVERLAY_CLASS_NAME } from '@/components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants';

export type RenderingWorldPlazaEntityDeathVignetteOverlayProps = {
  /** When true, the red vignette is shown over the plaza canvas. */
  isVisible: boolean;
};

/**
 * Reusable full-screen death vignette layered over the Pixi plaza canvas.
 */
export function RenderingWorldPlazaEntityDeathVignetteOverlay({
  isVisible,
}: RenderingWorldPlazaEntityDeathVignetteOverlayProps): React.JSX.Element | null {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`${DEFINING_WORLD_PLAZA_ENTITY_DEATH_VIGNETTE_OVERLAY_CLASS_NAME} plaza-death-vignette`}
      aria-hidden
    />
  );
}
