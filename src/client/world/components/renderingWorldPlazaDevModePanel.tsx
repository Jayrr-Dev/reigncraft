'use client';

/**
 * Consolidated dev tools panel for the plaza viewport.
 *
 * @module components/world/components/renderingWorldPlazaDevModePanel
 */

import { RenderingWorldPlazaAvatarSkinSelectorControl } from '@/components/world/components/renderingWorldPlazaAvatarSkinSelectorControl';
import { RenderingWorldPlazaClientDebugStatusReadout } from '@/components/world/components/renderingWorldPlazaClientDebugStatusReadout';
import { RenderingWorldPlazaDayNightClock } from '@/components/world/components/renderingWorldPlazaDayNightClock';
import { RenderingWorldPlazaFeaturesDebugControls } from '@/components/world/components/renderingWorldPlazaFeaturesDebugControls';
import { RenderingWorldPlazaPerformanceDiagnosticsOverlay } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsOverlay';
import { RenderingWorldPlazaPerformanceDiagnosticsToggleButton } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsToggleButton';
import { RenderingWorldPlazaPlayerWorldLayerDebugLabel } from '@/components/world/components/renderingWorldPlazaPlayerWorldLayerDebugLabel';
import { RenderingWorldPlazaTerrainCollisionBlockerHitDebugLabel } from '@/components/world/components/renderingWorldPlazaTerrainCollisionBlockerHitDebugLabel';
import { RenderingWorldPlazaTerrainCollisionDebugToggleButton } from '@/components/world/components/renderingWorldPlazaTerrainCollisionDebugToggleButton';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  LABELING_WORLD_PLAZA_DEV_MODE_LAUNCHER,
  LABELING_WORLD_PLAZA_DEV_MODE_PANEL_CLOSE,
  LABELING_WORLD_PLAZA_DEV_MODE_PANEL_TITLE,
  STYLING_WORLD_PLAZA_DEV_MODE_LAUNCHER_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CLOSE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HEADER_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TITLE_CLASS_NAME,
  resolvingWorldPlazaDevModePanelAnchorTopClassName,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { RenderingWorldPlazaDevModeHealthControls } from '@/components/world/health/components/renderingWorldPlazaDevModeHealthControls';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';

export interface RenderingWorldPlazaDevModePanelProps {
  /** True when the consolidated dev panel is expanded. */
  isOpen: boolean;
  /** Flips dev panel visibility. */
  onToggle: () => void;
  /** Collapses the dev panel. */
  onClose: () => void;
  /** True when the stamina HUD sits above this panel. */
  hasStaminaBar: boolean;
  /** True when build mode adds a second layer debug line. */
  isBuildModeActive: boolean;
  /** Live local player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** True while block build mode is active. */
  isBlockBuildModeActive: boolean;
  /** Sidebar placement layer when build mode is active. */
  selectedWorldLayer: number;
  /** Effective preview/placement layer for the hovered or selected tile. */
  previewWorldLayer: number;
  /** True when a build preview tile is active. */
  hasBuildPreviewTile: boolean;
  /** Selected block extrusion height when build mode is active. */
  selectedBlockHeight: number;
  /** Effective preview block height for the hovered or selected tile. */
  previewBlockHeight: number;
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
  /** Live local player health HUD snapshot for dev readout. */
  healthHudSnapshot?: UsingWorldPlazaPlayerHealthHudSnapshot;
  onHealthDamage?: () => void;
  onHealthHeal?: () => void;
  onHealthPoison?: () => void;
  onHealthShield?: () => void;
  onHealthToggleInvincible?: () => void;
  onHealthDoubleMax?: () => void;
  onHealthHalveMax?: () => void;
  onHealthTempMax?: () => void;
  onHealthHalfDamageBuff?: () => void;
  onHealthToggleArmor?: () => void;
  onHealthKill?: () => void;
  onHealthRevive?: () => void;
}

/**
 * Single dev launcher and panel that groups plaza debug tooling.
 */
export function RenderingWorldPlazaDevModePanel({
  isOpen,
  onToggle,
  onClose,
  hasStaminaBar,
  isBuildModeActive,
  playerPositionRef,
  isBlockBuildModeActive,
  selectedWorldLayer,
  previewWorldLayer,
  hasBuildPreviewTile,
  selectedBlockHeight,
  previewBlockHeight,
  isTerrainCollisionDebugVisible,
  onToggleTerrainCollisionDebug,
  isPerformanceDiagnosticsFeatureAvailable,
  isPerformanceDiagnosticsVisible,
  onTogglePerformanceDiagnostics,
  isAvatarSkinSelectorVisible,
  onToggleAvatarSkinSelector,
  isFeaturesDebugVisible,
  onToggleFeaturesDebug,
  healthHudSnapshot,
  onHealthDamage,
  onHealthHeal,
  onHealthPoison,
  onHealthShield,
  onHealthToggleInvincible,
  onHealthDoubleMax,
  onHealthHalveMax,
  onHealthTempMax,
  onHealthHalfDamageBuff,
  onHealthToggleArmor,
  onHealthKill,
  onHealthRevive,
}: RenderingWorldPlazaDevModePanelProps): React.JSX.Element {
  const anchorTopClassName =
    resolvingWorldPlazaDevModePanelAnchorTopClassName(hasStaminaBar);

  return (
    <>
      <div
        className={`${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ANCHOR_CLASS_NAME} ${anchorTopClassName}`}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      >
        {isOpen ? (
          <div className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SHELL_CLASS_NAME}>
            <div
              className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HEADER_CLASS_NAME}
            >
              <span
                className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TITLE_CLASS_NAME}
              >
                {LABELING_WORLD_PLAZA_DEV_MODE_PANEL_TITLE}
              </span>
              <button
                type="button"
                aria-label={LABELING_WORLD_PLAZA_DEV_MODE_PANEL_CLOSE}
                className={
                  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CLOSE_BUTTON_CLASS_NAME
                }
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <RenderingWorldPlazaClientDebugStatusReadout />

            <div className="flex flex-col gap-1">
              <span
                className={
                  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME
                }
              >
                World state
              </span>
              <RenderingWorldPlazaDayNightClock layout="embedded" />
              <RenderingWorldPlazaPlayerWorldLayerDebugLabel
                layout="embedded"
                playerPositionRef={playerPositionRef}
                isBuildModeActive={isBlockBuildModeActive}
                selectedWorldLayer={selectedWorldLayer}
                previewWorldLayer={previewWorldLayer}
                hasBuildPreviewTile={hasBuildPreviewTile}
                selectedBlockHeight={selectedBlockHeight}
                previewBlockHeight={previewBlockHeight}
                hasStaminaBar={false}
              />
            </div>

            {healthHudSnapshot &&
            onHealthDamage &&
            onHealthHeal &&
            onHealthPoison &&
            onHealthShield &&
            onHealthToggleInvincible &&
            onHealthDoubleMax &&
            onHealthHalveMax &&
            onHealthTempMax &&
            onHealthHalfDamageBuff &&
            onHealthToggleArmor &&
            onHealthKill &&
            onHealthRevive ? (
              <RenderingWorldPlazaDevModeHealthControls
                hudSnapshot={healthHudSnapshot}
                onDamage={onHealthDamage}
                onHeal={onHealthHeal}
                onPoison={onHealthPoison}
                onShield={onHealthShield}
                onToggleInvincible={onHealthToggleInvincible}
                onDoubleMax={onHealthDoubleMax}
                onHalveMax={onHealthHalveMax}
                onTempMax={onHealthTempMax}
                onHalfDamageBuff={onHealthHalfDamageBuff}
                onToggleArmor={onHealthToggleArmor}
                onKill={onHealthKill}
                onRevive={onHealthRevive}
              />
            ) : null}

            <div className="flex flex-col gap-1">
              <span
                className={
                  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME
                }
              >
                Tools
              </span>
              <div className="flex flex-col gap-1.5">
                <RenderingWorldPlazaTerrainCollisionDebugToggleButton
                  isVisible={isTerrainCollisionDebugVisible}
                  onToggle={onToggleTerrainCollisionDebug}
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
            </div>

            <RenderingWorldPlazaTerrainCollisionBlockerHitDebugLabel
              isVisible={isTerrainCollisionDebugVisible}
            />
          </div>
        ) : (
          <button
            type="button"
            aria-label={LABELING_WORLD_PLAZA_DEV_MODE_LAUNCHER}
            aria-expanded={false}
            className={STYLING_WORLD_PLAZA_DEV_MODE_LAUNCHER_BUTTON_CLASS_NAME}
            onClick={onToggle}
          >
            Dev
          </button>
        )}
      </div>

      {isPerformanceDiagnosticsFeatureAvailable ? (
        <RenderingWorldPlazaPerformanceDiagnosticsOverlay
          isVisible={isOpen && isPerformanceDiagnosticsVisible}
        />
      ) : null}
    </>
  );
}
