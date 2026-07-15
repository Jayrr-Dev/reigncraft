'use client';

/**
 * Compass orb for the plaza action bar; click opens the minimap dropdown.
 *
 * @module components/world/components/renderingWorldPlazaWorldLayerIndicator
 */

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_COMPASS_ICON,
  DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_FILL_COLOR,
  DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_HIT_SLOP_PX,
  LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER,
  LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER_MINIMAP_HINT,
  STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_FILL_DISC_CLASS_NAME,
  STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_ICON_CLASS_NAME,
  STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_ORB_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaWorldLayerIndicatorConstants';
import { resolvingWorldPlazaWorldLayerIndicatorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaWorldLayerIndicatorViewportStyles';
import { DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';
import { memo, useMemo } from 'react';

/** Props for {@link RenderingWorldPlazaWorldLayerIndicator}. */
export type RenderingWorldPlazaWorldLayerIndicatorProps = {
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
  /** When true, applies the action bar mobile shrink. */
  isMobile?: boolean;
  /** Whether the minimap is currently visible (pressed state). */
  isOpen?: boolean;
  /** Toggles the minimap. */
  onToggle?: () => void;
};

/**
 * Circular compass orb; click opens the minimap.
 */
export const RenderingWorldPlazaWorldLayerIndicator = memo(
  function RenderingWorldPlazaWorldLayerIndicator({
    viewportHudScale = 1,
    isMobile = false,
    isOpen = false,
    onToggle,
  }: RenderingWorldPlazaWorldLayerIndicatorProps): React.JSX.Element {
    const viewportStyles = useMemo(
      () =>
        resolvingWorldPlazaWorldLayerIndicatorViewportStyles(
          viewportHudScale,
          isMobile
        ),
      [viewportHudScale, isMobile]
    );

    const sphereStyle = useMemo((): CSSProperties => {
      return {
        ...viewportStyles.sphereStyle,
        ['--plaza-world-layer-hit-slop' as string]: `${DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_HIT_SLOP_PX}px`,
      };
    }, [viewportStyles.sphereStyle]);

    const ariaLabel = `${LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER}. ${LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER_MINIMAP_HINT}`;

    return (
      <button
        type="button"
        {...{
          [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true,
          [DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE]: 'minimap-orb',
        }}
        className={cn(
          STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_ORB_CLASS_NAME,
          isOpen && 'plaza-world-layer-orb--open'
        )}
        style={sphereStyle}
        aria-label={ariaLabel}
        aria-pressed={isOpen}
        title={ariaLabel}
        onClick={onToggle}
      >
        <span
          className={
            STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_FILL_DISC_CLASS_NAME
          }
          style={{
            backgroundColor:
              DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_FILL_COLOR,
          }}
          aria-hidden="true"
        />
        <Icon
          icon={DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_COMPASS_ICON}
          className={STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_ICON_CLASS_NAME}
          style={{
            width: viewportStyles.iconSizePx,
            height: viewportStyles.iconSizePx,
          }}
          aria-hidden="true"
        />
      </button>
    );
  }
);
