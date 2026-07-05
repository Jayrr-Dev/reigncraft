'use client';

import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { RenderingWorldPlazaMiniMap } from '@/components/world/components/renderingWorldPlazaMiniMap';
import { RenderingWorldPlazaMiniMapEnvironmentBar } from '@/components/world/components/renderingWorldPlazaMiniMapEnvironmentBar';
import { computingWorldPlazaMiniMapLayout } from '@/components/world/domains/computingWorldPlazaMiniMapLayout';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT } from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaMiniMapStackViewportStyles } from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportStyles';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import {
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore,
  usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';
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
  localTemperatureCelsius: number | null;
  temperatureDisplayUnit: DefiningWorldPlazaTemperatureDisplayUnit;
  isTemperatureVisible: boolean;
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
  /** When true, lifts the stack above the bottom-center inventory hotbar. */
  isInventoryHotbarVisible?: boolean;
}

/**
 * Bottom-left minimap with a compact time/temperature readout above it.
 */
export function RenderingWorldPlazaMiniMapStack({
  playerPositionRef,
  playerRenderPositionRegistryRef,
  isWalkingRef,
  isRunningRef,
  localUserId,
  isFullscreen,
  ownedPlotsRef,
  localTemperatureCelsius,
  temperatureDisplayUnit,
  isTemperatureVisible,
  viewportHudScale = 1,
  isInventoryHotbarVisible = false,
}: RenderingWorldPlazaMiniMapStackProps): React.JSX.Element | null {
  const performanceProfile = usingWorldPlazaPerformanceProfile();
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
        isInventoryHotbarVisible,
      }),
    [viewportHudScale, isMobile, isFullscreen, isInventoryHotbarVisible]
  );
  const isMinimapVisible =
    performanceProfile.isMinimapEnabled &&
    checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.MINIMAP,
      renderLayerFlags
    );

  if (!isMinimapVisible) {
    return null;
  }

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className={DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.anchorClassName}
      style={stackAnchorStyle}
    >
      <RenderingWorldPlazaMiniMapEnvironmentBar
        widthPx={miniMapLayout.canvasSizePx}
        localTemperatureCelsius={
          isTemperatureVisible ? localTemperatureCelsius : null
        }
        temperatureDisplayUnit={temperatureDisplayUnit}
        isMobile={isMobile}
      />
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
  );
}
