'use client';

/**
 * World-layer sphere for the plaza action bar: standing layer as `4L`,
 * toggles the minimap when clicked.
 *
 * @module components/world/components/renderingWorldPlazaWorldLayerIndicator
 */

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_FILL_COLOR,
  DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_REFRESH_INTERVAL_MS,
  LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER,
  LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER_MINIMAP_HINT,
  STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_FILL_DISC_CLASS_NAME,
  STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_ORB_CLASS_NAME,
  STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_VALUE_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaWorldLayerIndicatorConstants';
import { formattingWorldPlazaWorldLayerIndicatorLabel } from '@/components/world/domains/formattingWorldPlazaWorldLayerIndicatorLabel';
import { resolvingWorldPlazaWorldLayerIndicatorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaWorldLayerIndicatorViewportStyles';
import { cn } from '@/lib/utils';
import { memo, useEffect, useMemo, useState } from 'react';

/** Props for {@link RenderingWorldPlazaWorldLayerIndicator}. */
export type RenderingWorldPlazaWorldLayerIndicatorProps = {
  /** Live local player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
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
 * Circular world-layer orb with compact `NL` readout; click opens the minimap.
 */
export const RenderingWorldPlazaWorldLayerIndicator = memo(
  function RenderingWorldPlazaWorldLayerIndicator({
    playerPositionRef,
    viewportHudScale = 1,
    isMobile = false,
    isOpen = false,
    onToggle,
  }: RenderingWorldPlazaWorldLayerIndicatorProps): React.JSX.Element {
    const [worldLayer, setWorldLayer] = useState(() =>
      resolvingWorldPlazaPlayerWorldLayer(
        playerPositionRef.current ?? { x: 0, y: 0 }
      )
    );
    const viewportStyles = useMemo(
      () =>
        resolvingWorldPlazaWorldLayerIndicatorViewportStyles(
          viewportHudScale,
          isMobile
        ),
      [viewportHudScale, isMobile]
    );
    const layerLabel = useMemo(
      () => formattingWorldPlazaWorldLayerIndicatorLabel(worldLayer),
      [worldLayer]
    );

    useEffect(() => {
      const refreshingWorldLayer = (): void => {
        const playerPosition = playerPositionRef.current;

        if (!playerPosition) {
          return;
        }

        setWorldLayer(resolvingWorldPlazaPlayerWorldLayer(playerPosition));
      };

      refreshingWorldLayer();
      const intervalId = window.setInterval(
        refreshingWorldLayer,
        DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_REFRESH_INTERVAL_MS
      );

      return () => {
        window.clearInterval(intervalId);
      };
    }, [playerPositionRef]);

    const ariaLabel = `${LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER}: ${layerLabel}. ${LABELING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER_MINIMAP_HINT}`;

    return (
      <button
        type="button"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={cn(
          STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_ORB_CLASS_NAME,
          isOpen && 'plaza-world-layer-orb--open'
        )}
        style={viewportStyles.sphereStyle}
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
        <span
          className={STYLING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_VALUE_CLASS_NAME}
          style={viewportStyles.valueStyle}
        >
          {layerLabel}
        </span>
      </button>
    );
  }
);
