'use client';

import {
  DEFINING_REIGNCRAFT_TOAST_WIDTH_EXTRA_PX,
  DEFINING_REIGNCRAFT_TOASTER_ID,
} from '@/components/ui/domains/definingReigncraftToastConstants';
import { RenderingReigncraftToaster } from '@/components/ui/sonner';
import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { RenderingWorldPlazaMiniMap } from '@/components/world/components/renderingWorldPlazaMiniMap';
import { RenderingWorldPlazaMiniMapEnvironmentBar } from '@/components/world/components/renderingWorldPlazaMiniMapEnvironmentBar';
import { computingWorldPlazaMiniMapLayout } from '@/components/world/domains/computingWorldPlazaMiniMapLayout';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT } from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaMiniMapStackViewportStyles } from '@/components/world/domains/resolvingWorldPlazaMiniMapStackViewportStyles';
import { resolvingWorldPlazaMinimapVisible } from '@/components/world/domains/resolvingWorldPlazaMinimapVisible';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
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
  localTemperatureCelsius: number | null;
  temperatureDisplayUnit: DefiningWorldPlazaTemperatureDisplayUnit;
  isTemperatureVisible: boolean;
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
  /** When true, lifts the stack above the bottom-center inventory hotbar. */
  isInventoryHotbarVisible?: boolean;
}

/**
 * Bottom-left minimap inside a unified time/temperature + map card.
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
        isInventoryHotbarVisible,
      }),
    [viewportHudScale, isMobile, isFullscreen, isInventoryHotbarVisible]
  );
  const isMinimapVisible = resolvingWorldPlazaMinimapVisible({
    isMinimapPreferenceEnabled,
    renderLayerFlags,
  });
  const toastWidthPx =
    miniMapLayout.canvasSizePx + DEFINING_REIGNCRAFT_TOAST_WIDTH_EXTRA_PX;

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
          className={
            DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.toastHostClassName
          }
          style={{
            width:
              miniMapLayout.canvasSizePx +
              DEFINING_REIGNCRAFT_TOAST_WIDTH_EXTRA_PX,
          }}
        >
          <RenderingReigncraftToaster
            toasterId={DEFINING_REIGNCRAFT_TOASTER_ID.plaza}
            variant="gameplay"
            position="bottom-left"
            offset={0}
            mobileOffset={0}
            toastWidthPx={toastWidthPx}
          />
        </div>
        <div
          className={DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.cardClassName}
        >
          <RenderingWorldPlazaMiniMapEnvironmentBar
            localTemperatureCelsius={
              isTemperatureVisible ? localTemperatureCelsius : null
            }
            temperatureDisplayUnit={temperatureDisplayUnit}
            isMobile={isMobile}
            isFullscreen={isFullscreen}
            viewportHudScale={viewportHudScale}
          />
          {isMinimapVisible ? (
            <div
              className={
                DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.mapFrameClassName
              }
              style={{ width: miniMapLayout.canvasSizePx }}
            >
              <RenderingWorldPlazaMiniMap
                playerPositionRef={playerPositionRef}
                playerRenderPositionRegistryRef={
                  playerRenderPositionRegistryRef
                }
                isWalkingRef={isWalkingRef}
                isRunningRef={isRunningRef}
                localUserId={localUserId}
                isFullscreen={isFullscreen}
                ownedPlotsRef={ownedPlotsRef}
                isPositionAnchored={false}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
