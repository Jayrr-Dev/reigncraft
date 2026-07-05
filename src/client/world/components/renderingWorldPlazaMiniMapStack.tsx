'use client';

import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { RenderingWorldPlazaMiniMap } from '@/components/world/components/renderingWorldPlazaMiniMap';
import { RenderingWorldPlazaMiniMapEnvironmentBar } from '@/components/world/components/renderingWorldPlazaMiniMapEnvironmentBar';
import { computingWorldPlazaMiniMapLayout } from '@/components/world/domains/computingWorldPlazaMiniMapLayout';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import {
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore,
  usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMemo } from 'react';

const RENDERING_WORLD_PLAZA_MINI_MAP_STACK_EMBEDDED_OFFSET_CLASS_NAME =
  'bottom-3 left-3' as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_STACK_FULLSCREEN_OFFSET_CLASS_NAME =
  'bottom-4 left-4' as const;

const RENDERING_WORLD_PLAZA_MINI_MAP_STACK_BASE_CLASS_NAME =
  'pointer-events-none absolute z-20 flex flex-col gap-1 select-none' as const;

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
}

/**
 * Bottom-left minimap with a compact day/time/temperature bar above it.
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
  const isMinimapVisible =
    performanceProfile.isMinimapEnabled &&
    checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.MINIMAP,
      renderLayerFlags
    );
  const stackOffsetClassName = isFullscreen
    ? RENDERING_WORLD_PLAZA_MINI_MAP_STACK_FULLSCREEN_OFFSET_CLASS_NAME
    : RENDERING_WORLD_PLAZA_MINI_MAP_STACK_EMBEDDED_OFFSET_CLASS_NAME;

  if (!isMinimapVisible) {
    return null;
  }

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className={`${RENDERING_WORLD_PLAZA_MINI_MAP_STACK_BASE_CLASS_NAME} ${stackOffsetClassName}`}
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
