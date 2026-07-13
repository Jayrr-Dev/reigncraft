'use client';

/**
 * Standing-layer readout in the top row of the minimap card (old time slot).
 *
 * @module components/world/components/renderingWorldPlazaMiniMapLayerBar
 */

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT } from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';
import {
  resolvingWorldPlazaPlayerWorldLayer,
  type DefiningWorldPlazaWorldPoint,
} from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_WORLD_LAYER_INDICATOR_REFRESH_INTERVAL_MS } from '@/components/world/domains/definingWorldPlazaWorldLayerIndicatorConstants';
import { formattingWorldPlazaWorldLayerIndicatorLabel } from '@/components/world/domains/formattingWorldPlazaWorldLayerIndicatorLabel';
import { useEffect, useMemo, useState } from 'react';

export type RenderingWorldPlazaMiniMapLayerBarProps = {
  /** Live local player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  isMobile?: boolean;
};

/**
 * Compact `Elevation N` label above the minimap canvas.
 */
export function RenderingWorldPlazaMiniMapLayerBar({
  playerPositionRef,
  isMobile = false,
}: RenderingWorldPlazaMiniMapLayerBarProps): React.JSX.Element {
  const [worldLayer, setWorldLayer] = useState(() =>
    resolvingWorldPlazaPlayerWorldLayer(
      playerPositionRef.current ?? { x: 0, y: 0 }
    )
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

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className={`${DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.layerBarClassName} ${
        isMobile
          ? DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.layerBarMobileClassName
          : ''
      }`}
      aria-label={layerLabel}
    >
      <span
        className={`${DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.layerBarValueClassName}${
          isMobile
            ? ` ${DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.layerBarValueMobileClassName}`
            : ''
        }`}
      >
        {layerLabel}
      </span>
    </div>
  );
}
