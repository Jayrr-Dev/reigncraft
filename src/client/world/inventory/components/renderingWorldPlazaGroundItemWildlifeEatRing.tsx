'use client';

/**
 * Wildlife eat progress ring: thin wrapper over the reusable ground-item ring.
 *
 * @module components/world/inventory/components/renderingWorldPlazaGroundItemWildlifeEatRing
 */

import {
  RenderingWorldPlazaGroundItemProgressRing,
  type RenderingWorldPlazaGroundItemProgressRingProps,
} from '@/components/world/inventory/components/renderingWorldPlazaGroundItemProgressRing';
import { memo, type RefObject } from 'react';

export type RenderingWorldPlazaGroundItemWildlifeEatRingProps = {
  readonly isActive: boolean;
  readonly progressRatioRef: RefObject<number>;
  readonly viewportHudScale?: number;
};

/**
 * SVG progress ring sized to wrap a ground item glyph while wildlife eats.
 */
export const RenderingWorldPlazaGroundItemWildlifeEatRing = memo(
  function RenderingWorldPlazaGroundItemWildlifeEatRing({
    isActive,
    progressRatioRef,
    viewportHudScale = 1,
  }: RenderingWorldPlazaGroundItemWildlifeEatRingProps): React.JSX.Element {
    const props: RenderingWorldPlazaGroundItemProgressRingProps = {
      isVisible: isActive,
      progressRatioRef,
      viewportHudScale,
      className:
        'world-plaza-ground-item-wildlife-eat-ring pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
    };

    return <RenderingWorldPlazaGroundItemProgressRing {...props} />;
  }
);
