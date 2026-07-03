"use client";

import { RenderingWorldPlazaAvatarSkinSelectorControl } from "@/components/world/components/renderingWorldPlazaAvatarSkinSelectorControl";
import { RenderingWorldPlazaFeaturesDebugControls } from "@/components/world/components/renderingWorldPlazaFeaturesDebugControls";
import { RenderingWorldPlazaPerformanceDiagnosticsOverlay } from "@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsOverlay";
import { RenderingWorldPlazaPerformanceDiagnosticsToggleButton } from "@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsToggleButton";
import { RenderingWorldPlazaTerrainCollisionBlockerHitDebugLabel } from "@/components/world/components/renderingWorldPlazaTerrainCollisionBlockerHitDebugLabel";
import { RenderingWorldPlazaTerrainCollisionDebugToggleButton } from "@/components/world/components/renderingWorldPlazaTerrainCollisionDebugToggleButton";
import {
  DEFINING_WORLD_PLAZA_DEBUG_CONTROLS_STACK_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_DEBUG_CONTROLS_STACK_GAP_CLASS_NAME,
  resolvingWorldPlazaDebugControlsStackAnchorTopClassName,
} from "@/components/world/domains/definingWorldPlazaDebugControlsStackUiConstants";

export interface RenderingWorldPlazaDebugControlsStackProps {
  /** True when the stamina HUD sits above the layer debug labels. */
  hasStaminaBar: boolean;
  /** True when build mode adds a second layer debug line. */
  isBuildModeActive: boolean;
  /** True when collision debug overlays are visible. */
  isTerrainCollisionDebugVisible: boolean;
  /** Flips collision debug visibility. */
  onToggleTerrainCollisionDebug: () => void;
  /** True when perf diagnostics can be toggled in this environment. */
  isPerformanceDiagnosticsFeatureAvailable: boolean;
  /** True when the perf diagnostics HUD is visible. */
  isPerformanceDiagnosticsVisible: boolean;
  /** Flips perf diagnostics visibility. */
  onTogglePerformanceDiagnostics: () => void;
  /** True when the avatar skin selector panel is open. */
  isAvatarSkinSelectorVisible: boolean;
  /** Flips avatar skin selector panel visibility. */
  onToggleAvatarSkinSelector: () => void;
  /** True when the Features panel is open. */
  isFeaturesDebugVisible: boolean;
  /** Flips Features panel visibility. */
  onToggleFeaturesDebug: () => void;
}

/**
 * Left-side stack of Collision, Perf, and Character debug controls.
 */
export function RenderingWorldPlazaDebugControlsStack({
  hasStaminaBar,
  isBuildModeActive,
  isTerrainCollisionDebugVisible,
  onToggleTerrainCollisionDebug,
  isPerformanceDiagnosticsFeatureAvailable,
  isPerformanceDiagnosticsVisible,
  onTogglePerformanceDiagnostics,
  isAvatarSkinSelectorVisible,
  onToggleAvatarSkinSelector,
  isFeaturesDebugVisible,
  onToggleFeaturesDebug,
}: RenderingWorldPlazaDebugControlsStackProps): React.JSX.Element {
  const anchorTopClassName =
    resolvingWorldPlazaDebugControlsStackAnchorTopClassName(
      hasStaminaBar,
      isBuildModeActive,
    );

  return (
    <>
      <div
        className={`${DEFINING_WORLD_PLAZA_DEBUG_CONTROLS_STACK_ANCHOR_CLASS_NAME} ${DEFINING_WORLD_PLAZA_DEBUG_CONTROLS_STACK_GAP_CLASS_NAME} ${anchorTopClassName}`}
      >
        <RenderingWorldPlazaTerrainCollisionDebugToggleButton
          isVisible={isTerrainCollisionDebugVisible}
          onToggle={onToggleTerrainCollisionDebug}
        />
        <RenderingWorldPlazaTerrainCollisionBlockerHitDebugLabel
          isVisible={isTerrainCollisionDebugVisible}
        />
        {isPerformanceDiagnosticsFeatureAvailable ? (
          <RenderingWorldPlazaPerformanceDiagnosticsToggleButton
            isVisible={isPerformanceDiagnosticsVisible}
            onToggle={onTogglePerformanceDiagnostics}
          />
        ) : null}
        <RenderingWorldPlazaAvatarSkinSelectorControl
          isVisible={isAvatarSkinSelectorVisible}
          onToggle={onToggleAvatarSkinSelector}
        />
        <RenderingWorldPlazaFeaturesDebugControls
          isVisible={isFeaturesDebugVisible}
          onToggle={onToggleFeaturesDebug}
        />
      </div>
      {isPerformanceDiagnosticsFeatureAvailable ? (
        <RenderingWorldPlazaPerformanceDiagnosticsOverlay
          isVisible={isPerformanceDiagnosticsVisible}
        />
      ) : null}
    </>
  );
}
