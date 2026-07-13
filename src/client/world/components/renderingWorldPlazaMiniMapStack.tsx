'use client';

import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { RenderingWorldPlazaMiniMap } from '@/components/world/components/renderingWorldPlazaMiniMap';
import { computingWorldPlazaMiniMapLayout } from '@/components/world/domains/computingWorldPlazaMiniMapLayout';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT } from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaMiniMapStackViewportStyles } from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportStyles';
import { resolvingWorldPlazaMinimapVisible } from '@/components/world/domains/resolvingWorldPlazaMinimapVisible';
import { usingWorldPlazaMinimapEnabled } from '@/components/world/hooks/usingWorldPlazaMinimapEnabled';
import { usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags } from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMemo } from 'react';

export interface RenderingWorldPlazaMiniMapStackProps {
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  playerRenderPositionRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  isWalkingRef: React.RefObject<boolean>;
  isRunningRef: React.RefObject<boolean>;
  localUserId: string | null;
  isFullscreen: boolean;
  ownedPlotsRef: React.RefObject<DefiningWorldBuildingPlot[]>;
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
}

/**
 * Top-left minimap parchment card (map only; no time/temperature chrome).
 */
export function RenderingWorldPlazaMiniMapStack({
  playerPositionRef,
  playerRenderPositionRegistryRef,
  isWalkingRef,
  isRunningRef,
  localUserId,
  isFullscreen,
  ownedPlotsRef,
  viewportHudScale = 1,
}: RenderingWorldPlazaMiniMapStackProps): React.JSX.Element | null {
  const performanceProfile = usingWorldPlazaPerformanceProfile();
  const { isMinimapPreferenceEnabled } = usingWorldPlazaMinimapEnabled();
  const renderLayerFlags =
    usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  const isMobile = useIsMobile();
  const miniMapLayout = useMemo(
    () =>
      computingWorldPlazaMiniMapLayout(
        isFullscreen,
        isMobile,
        performanceProfile.minimapViewRadiusTiles
      ),
    [isFullscreen, isMobile, performanceProfile.minimapViewRadiusTiles]
  );
  const stackAnchorStyle = useMemo(
    () =>
      resolvingWorldPlazaMiniMapStackViewportStyles({
        viewportHudScale,
        isMobile,
        isFullscreen,
      }),
    [viewportHudScale, isMobile, isFullscreen]
  );
  const isMinimapVisible = resolvingWorldPlazaMinimapVisible({
    isMinimapPreferenceEnabled,
    renderLayerFlags,
  });

  if (!isMinimapVisible) {
    return null;
  }

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className={DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.anchorClassName}
      style={stackAnchorStyle}
    >
      <div
        className={DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.columnClassName}
        style={{ width: miniMapLayout.canvasSizePx }}
      >
        <div
          className={DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.cardClassName}
        >
          <div
            className={
              DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.mapFrameClassName
            }
            style={{ width: miniMapLayout.canvasSizePx }}
          >
            <RenderingWorldPlazaMiniMap
              playerPositionRef={playerPositionRef}
              playerRenderPositionRegistryRef={playerRenderPositionRegistryRef}
              isWalkingRef={isWalkingRef}
              isRunningRef={isRunningRef}
              localUserId={localUserId}
              isFullscreen={isFullscreen}
              ownedPlotsRef={ownedPlotsRef}
              isPositionAnchored={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
