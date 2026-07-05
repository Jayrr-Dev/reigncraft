'use client';

/**
 * Consolidated dev tools panel for the plaza viewport.
 *
 * @module components/world/components/renderingWorldPlazaDevModePanel
 */

import { RenderingWorldPlazaAvatarSkinSelectorControl } from '@/components/world/components/renderingWorldPlazaAvatarSkinSelectorControl';
import { RenderingWorldPlazaClientDebugStatusReadout } from '@/components/world/components/renderingWorldPlazaClientDebugStatusReadout';
import { RenderingWorldPlazaDayNightClock } from '@/components/world/components/renderingWorldPlazaDayNightClock';
import { RenderingWorldPlazaDevModeFirelandsTeleportControl } from '@/components/world/components/renderingWorldPlazaDevModeFirelandsTeleportControl';
import { RenderingWorldPlazaDevModePanelSubcategoryBadges } from '@/components/world/components/renderingWorldPlazaDevModePanelSubcategoryBadges';
import {
  RenderingWorldPlazaDevModePanelTabs,
  type RenderingWorldPlazaDevModePanelTabId,
} from '@/components/world/components/renderingWorldPlazaDevModePanelTabs';
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
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BODY_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TITLE_CLASS_NAME,
  resolvingWorldPlazaDevModePanelAnchorTopClassName,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import { resolvingWorldPlazaDevModePanelDefaultSubcategoryId } from '@/components/world/domains/definingWorldPlazaDevModePanelSubcategories';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { RenderingWorldPlazaDevModeCombatRollControls } from '@/components/world/health/components/renderingWorldPlazaDevModeCombatRollControls';
import { RenderingWorldPlazaDevModeHealthControls } from '@/components/world/health/components/renderingWorldPlazaDevModeHealthControls';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import { useEffect, useState } from 'react';

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
  onHealthApplyPoison?: (
    potency: DefiningWorldPlazaEntityPoisonPotency
  ) => void;
  onHealthApplyBleed?: (
    severity: DefiningWorldPlazaEntityBleedSeverity
  ) => void;
  onHealthApplyPotentialDamage?: () => void;
  onHealthShield?: () => void;
  onHealthToggleInvincible?: () => void;
  onHealthToggleTemperatureDisplayUnit?: () => void;
  onHealthRollDamage?: (
    expectedDamage: number,
    forcedTier?: DefiningWorldPlazaDamageOutcomeTier
  ) => void;
  onHealthToggleBuff?: (buffId: string) => void;
  characterSkillIds?: readonly string[];
  onUseCharacterSkill?: (skillId: string) => void;
  onHealthKill?: () => void;
  onHealthRevive?: () => void;
  /** Teleports the local player into a procedural Firelands region. */
  onTeleportToFirelands?: () => void;
}

function hasWorldPlazaDevModeHealthControls(
  props: RenderingWorldPlazaDevModePanelProps
): props is RenderingWorldPlazaDevModePanelProps & {
  healthHudSnapshot: UsingWorldPlazaPlayerHealthHudSnapshot;
  onHealthDamage: () => void;
  onHealthHeal: () => void;
  onHealthApplyPoison: (potency: DefiningWorldPlazaEntityPoisonPotency) => void;
  onHealthApplyBleed: (severity: DefiningWorldPlazaEntityBleedSeverity) => void;
  onHealthApplyPotentialDamage: () => void;
  onHealthShield: () => void;
  onHealthToggleInvincible: () => void;
  onHealthToggleTemperatureDisplayUnit: () => void;
  onHealthRollDamage: (
    expectedDamage: number,
    forcedTier?: DefiningWorldPlazaDamageOutcomeTier
  ) => void;
  onHealthToggleBuff: (buffId: string) => void;
  onHealthKill: () => void;
  onHealthRevive: () => void;
} {
  return (
    props.healthHudSnapshot !== undefined &&
    props.onHealthDamage !== undefined &&
    props.onHealthHeal !== undefined &&
    props.onHealthApplyPoison !== undefined &&
    props.onHealthApplyBleed !== undefined &&
    props.onHealthApplyPotentialDamage !== undefined &&
    props.onHealthShield !== undefined &&
    props.onHealthToggleInvincible !== undefined &&
    props.onHealthToggleTemperatureDisplayUnit !== undefined &&
    props.onHealthRollDamage !== undefined &&
    props.onHealthToggleBuff !== undefined &&
    props.onHealthKill !== undefined &&
    props.onHealthRevive !== undefined
  );
}

/**
 * Single dev launcher and panel that groups plaza debug tooling.
 */
export function RenderingWorldPlazaDevModePanel(
  props: RenderingWorldPlazaDevModePanelProps
): React.JSX.Element {
  const {
    isOpen,
    onToggle,
    onClose,
    hasStaminaBar,
    isBlockBuildModeActive,
    playerPositionRef,
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
    onTeleportToFirelands,
  } = props;

  const [activeTabId, setActiveTabId] =
    useState<RenderingWorldPlazaDevModePanelTabId>('world');
  const [activeSubcategoryId, setActiveSubcategoryId] = useState(() =>
    resolvingWorldPlazaDevModePanelDefaultSubcategoryId('world')
  );
  const hasHealthControls = hasWorldPlazaDevModeHealthControls(props);
  const anchorTopClassName =
    resolvingWorldPlazaDevModePanelAnchorTopClassName(hasStaminaBar);

  useEffect(() => {
    setActiveSubcategoryId(
      resolvingWorldPlazaDevModePanelDefaultSubcategoryId(activeTabId)
    );
  }, [activeTabId]);

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

            <RenderingWorldPlazaDevModePanelTabs
              activeTabId={activeTabId}
              onSelectTab={setActiveTabId}
            />

            <RenderingWorldPlazaDevModePanelSubcategoryBadges
              tabId={activeTabId}
              activeSubcategoryId={activeSubcategoryId}
              onSelectSubcategory={setActiveSubcategoryId}
            />

            <div
              className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BODY_CLASS_NAME}
            >
              {activeTabId === 'world' && activeSubcategoryId === 'status' ? (
                <RenderingWorldPlazaClientDebugStatusReadout />
              ) : null}

              {activeTabId === 'world' && activeSubcategoryId === 'state' ? (
                <div className="flex flex-col gap-2">
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
                  {onTeleportToFirelands ? (
                    <RenderingWorldPlazaDevModeFirelandsTeleportControl
                      onTeleportToFirelands={onTeleportToFirelands}
                    />
                  ) : null}
                </div>
              ) : null}

              {activeTabId === 'health' && hasHealthControls ? (
                <RenderingWorldPlazaDevModeHealthControls
                  activeSubcategoryId={activeSubcategoryId}
                  hudSnapshot={props.healthHudSnapshot}
                  onDamage={props.onHealthDamage}
                  onHeal={props.onHealthHeal}
                  onApplyPoison={props.onHealthApplyPoison}
                  onApplyBleed={props.onHealthApplyBleed}
                  onApplyPotentialDamage={props.onHealthApplyPotentialDamage}
                  onShield={props.onHealthShield}
                  onToggleInvincible={props.onHealthToggleInvincible}
                  onToggleTemperatureDisplayUnit={
                    props.onHealthToggleTemperatureDisplayUnit
                  }
                  onKill={props.onHealthKill}
                  onRevive={props.onHealthRevive}
                />
              ) : null}

              {activeTabId === 'combat' && hasHealthControls ? (
                <RenderingWorldPlazaDevModeCombatRollControls
                  activeSubcategoryId={activeSubcategoryId}
                  hudSnapshot={props.healthHudSnapshot}
                  onRollDamage={props.onHealthRollDamage}
                  onToggleBuff={props.onHealthToggleBuff}
                  characterSkillIds={props.characterSkillIds}
                  onUseCharacterSkill={props.onUseCharacterSkill}
                />
              ) : null}

              {activeTabId === 'tools' && activeSubcategoryId === 'toggles' ? (
                <div className="flex flex-col gap-1">
                  <span
                    className={
                      STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME
                    }
                  >
                    Debug tools
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
              ) : null}

              {activeTabId === 'tools' && activeSubcategoryId === 'readouts' ? (
                <RenderingWorldPlazaTerrainCollisionBlockerHitDebugLabel
                  isVisible={isTerrainCollisionDebugVisible}
                />
              ) : null}
            </div>
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
