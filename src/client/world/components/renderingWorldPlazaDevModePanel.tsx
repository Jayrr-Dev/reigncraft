'use client';

/**
 * Consolidated dev tools panel for the plaza viewport.
 *
 * @module components/world/components/renderingWorldPlazaDevModePanel
 */

import { RenderingSpiritedSpritesBetaDevControls } from '@/components/world/beta/spirited/components/renderingSpiritedSpritesBetaDevControls';
import type { DefiningSpiritedSpritesBetaAnimalId } from '@/components/world/beta/spirited/domains/definingSpiritedSpritesBetaCatalog';
import { RenderingWorldPlazaAvatarSkinSelectorControl } from '@/components/world/components/renderingWorldPlazaAvatarSkinSelectorControl';
import { RenderingWorldPlazaClientDebugStatusReadout } from '@/components/world/components/renderingWorldPlazaClientDebugStatusReadout';
import { RenderingWorldPlazaDayNightClock } from '@/components/world/components/renderingWorldPlazaDayNightClock';
import { RenderingWorldPlazaDevModeBestiaryUnlockControls } from '@/components/world/components/renderingWorldPlazaDevModeBestiaryUnlockControls';
import { RenderingWorldPlazaDevModeBiomeTeleportControl } from '@/components/world/components/renderingWorldPlazaDevModeBiomeTeleportControl';
import { RenderingWorldPlazaDevModeDayNightControls } from '@/components/world/components/renderingWorldPlazaDevModeDayNightControls';
import { RenderingWorldPlazaDevModePanelViewSelect } from '@/components/world/components/renderingWorldPlazaDevModePanelViewSelect';
import { RenderingWorldPlazaDevPanelCloseButton } from '@/components/world/components/renderingWorldPlazaDevPanelCloseButton';
import { RenderingWorldPlazaFeaturesDebugControls } from '@/components/world/components/renderingWorldPlazaFeaturesDebugControls';
import { RenderingWorldPlazaPerformanceDiagnosticsOverlay } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsOverlay';
import { RenderingWorldPlazaPerformanceDiagnosticsToggleButton } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsToggleButton';
import { RenderingWorldPlazaPlayerWorldLayerDebugLabel } from '@/components/world/components/renderingWorldPlazaPlayerWorldLayerDebugLabel';
import { RenderingWorldPlazaTerrainCollisionBlockerHitDebugLabel } from '@/components/world/components/renderingWorldPlazaTerrainCollisionBlockerHitDebugLabel';
import { RenderingWorldPlazaTerrainCollisionDebugToggleButton } from '@/components/world/components/renderingWorldPlazaTerrainCollisionDebugToggleButton';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  LABELING_WORLD_PLAZA_DEV_MODE_HOME_LAUNCHER,
  LABELING_WORLD_PLAZA_DEV_MODE_LAUNCHER,
  LABELING_WORLD_PLAZA_DEV_MODE_PANEL_CLOSE,
  LABELING_WORLD_PLAZA_DEV_MODE_PANEL_TITLE,
  STYLING_WORLD_PLAZA_DEV_MODE_HOME_LAUNCHER_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_LAUNCHER_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HEADER_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BODY_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TITLE_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_DEFAULT_VIEW_ID,
  resolvingWorldPlazaDevModePanelView,
  type DefiningWorldPlazaDevModePanelViewId,
} from '@/components/world/domains/definingWorldPlazaDevModePanelViews';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaDevModePanelViewportLayout } from '@/components/world/domains/resolvingWorldPlazaDevModePanelViewportLayout';
import { RenderingWorldPlazaDevModeCombatRollControls } from '@/components/world/health/components/renderingWorldPlazaDevModeCombatRollControls';
import { RenderingWorldPlazaDevModeHealthControls } from '@/components/world/health/components/renderingWorldPlazaDevModeHealthControls';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import { RenderingWorldPlazaDevProjectileSpawnerControls } from '@/components/world/projectile/components/renderingWorldPlazaDevProjectileSpawnerControls';
import type { SpawningWorldPlazaProjectileRequest } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { RenderingWorldPlazaDevWildlifeSpawnerControls } from '@/components/world/wildlife/components/renderingWorldPlazaDevWildlifeSpawnerControls';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeSpeciesId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { useMemo, useState } from 'react';

export interface RenderingWorldPlazaDevModePanelProps {
  /** True when the consolidated dev panel is expanded. */
  isOpen: boolean;
  /** Flips dev panel visibility. */
  onToggle: () => void;
  /** Collapses the dev panel. */
  onClose: () => void;
  /** True when the stamina HUD sits above this panel. */
  hasStaminaBar: boolean;
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
  /** True on narrow plaza viewports (action bar covers the left edge). */
  isMobile?: boolean;
  /** True while the plaza host is in native fullscreen. */
  isFullscreen?: boolean;
  /** True when build mode adds a second layer debug line. */
  isBuildModeActive: boolean;
  /** Live local player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Current character body height in world layers. */
  playerHeightWorldLayers: number;
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
  onHealthApplySoulbreak?: () => void;
  onHealthApplyDisease?: (diseaseId: DefiningWorldPlazaEntityDiseaseId) => void;
  onHealthSetFrostbiteStacks?: (stackCount: number) => void;
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
  onSpawnProjectile?: (request: SpawningWorldPlazaProjectileRequest) => void;
  onSpawnAggressiveChickens?: (count: number) => void;
  onSpawnRandomGreyWolf?: () => void;
  onSpawnWildlifeSpecies?: (
    speciesId: DefiningWildlifeSpeciesId,
    aggressionLevel: DefiningWildlifeAggressionLevel
  ) => void;
  onSpawnSpiritedSpritesBetaAnimal?: (
    animalId: DefiningSpiritedSpritesBetaAnimalId
  ) => void;
  onClearSpiritedSpritesBetaSpawns?: () => void;
  onlineUserId?: string | null;
  /** Teleports the local player to the nearest region of a biome. */
  onTeleportToBiome?: (biomeKind: DefiningWorldPlazaBiomeKind) => void;
  /**
   * When set (action-bar Home hidden), shows a compact Home button beside
   * Dev / Perf.
   */
  onExitToHome?: () => void;
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
  onHealthApplySoulbreak: () => void;
  onHealthApplyDisease: (diseaseId: DefiningWorldPlazaEntityDiseaseId) => void;
  onHealthSetFrostbiteStacks: (stackCount: number) => void;
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
    props.onHealthApplySoulbreak !== undefined &&
    props.onHealthApplyDisease !== undefined &&
    props.onHealthSetFrostbiteStacks !== undefined &&
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
    viewportHudScale = 1,
    isMobile = false,
    isFullscreen = false,
    isBlockBuildModeActive,
    playerPositionRef,
    playerHeightWorldLayers,
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
    onTeleportToBiome,
    onExitToHome,
  } = props;

  const viewportLayout = useMemo(
    () =>
      resolvingWorldPlazaDevModePanelViewportLayout({
        viewportHudScale,
        isMobile,
        isFullscreen,
      }),
    [isFullscreen, isMobile, viewportHudScale]
  );
  const [activeViewId, setActiveViewId] =
    useState<DefiningWorldPlazaDevModePanelViewId>(
      DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_DEFAULT_VIEW_ID
    );
  const activeView = resolvingWorldPlazaDevModePanelView(activeViewId);
  const hasHealthControls = hasWorldPlazaDevModeHealthControls(props);

  return (
    <>
      <div
        className={viewportLayout.anchorClassName}
        style={viewportLayout.style}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      >
        {onExitToHome ? (
          <button
            type="button"
            aria-label={LABELING_WORLD_PLAZA_DEV_MODE_HOME_LAUNCHER}
            className={
              STYLING_WORLD_PLAZA_DEV_MODE_HOME_LAUNCHER_BUTTON_CLASS_NAME
            }
            onClick={onExitToHome}
          >
            {LABELING_WORLD_PLAZA_DEV_MODE_HOME_LAUNCHER}
          </button>
        ) : null}
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
              <RenderingWorldPlazaDevPanelCloseButton
                ariaLabel={LABELING_WORLD_PLAZA_DEV_MODE_PANEL_CLOSE}
                onClose={onClose}
                className="focus-visible:ring-violet-300/70"
              />
            </div>

            <RenderingWorldPlazaDevModePanelViewSelect
              activeViewId={activeViewId}
              onSelectView={setActiveViewId}
            />

            <div
              className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BODY_CLASS_NAME}
            >
              {activeViewId === 'world-status' ? (
                <RenderingWorldPlazaClientDebugStatusReadout />
              ) : null}

              {activeViewId === 'world-travel' ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span
                      className={
                        STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME
                      }
                    >
                      Time & travel
                    </span>
                    <RenderingWorldPlazaDayNightClock layout="embedded" />
                    <RenderingWorldPlazaPlayerWorldLayerDebugLabel
                      layout="embedded"
                      playerPositionRef={playerPositionRef}
                      playerHeightWorldLayers={playerHeightWorldLayers}
                      isBuildModeActive={isBlockBuildModeActive}
                      selectedWorldLayer={selectedWorldLayer}
                      previewWorldLayer={previewWorldLayer}
                      hasBuildPreviewTile={hasBuildPreviewTile}
                      selectedBlockHeight={selectedBlockHeight}
                      previewBlockHeight={previewBlockHeight}
                      hasStaminaBar={false}
                    />
                  </div>
                  <RenderingWorldPlazaDevModeDayNightControls />
                  {onTeleportToBiome ? (
                    <RenderingWorldPlazaDevModeBiomeTeleportControl
                      onTeleportToBiome={onTeleportToBiome}
                    />
                  ) : null}
                </div>
              ) : null}

              {activeView.groupId === 'player' && hasHealthControls ? (
                <RenderingWorldPlazaDevModeHealthControls
                  activeSubcategoryId={activeView.leafId}
                  hudSnapshot={props.healthHudSnapshot}
                  onDamage={props.onHealthDamage}
                  onHeal={props.onHealthHeal}
                  onApplyPoison={props.onHealthApplyPoison}
                  onApplyBleed={props.onHealthApplyBleed}
                  onApplyPotentialDamage={props.onHealthApplyPotentialDamage}
                  onApplySoulbreak={props.onHealthApplySoulbreak}
                  onApplyDisease={props.onHealthApplyDisease}
                  onSetFrostbiteStacks={props.onHealthSetFrostbiteStacks}
                  onShield={props.onHealthShield}
                  onToggleInvincible={props.onHealthToggleInvincible}
                  onToggleTemperatureDisplayUnit={
                    props.onHealthToggleTemperatureDisplayUnit
                  }
                  onKill={props.onHealthKill}
                  onRevive={props.onHealthRevive}
                  onToggleBuff={props.onHealthToggleBuff}
                />
              ) : null}

              {activeViewId === 'wildlife-spawner' &&
              props.onSpawnAggressiveChickens &&
              props.onSpawnRandomGreyWolf &&
              props.onSpawnWildlifeSpecies ? (
                <RenderingWorldPlazaDevWildlifeSpawnerControls
                  playerPositionRef={playerPositionRef}
                  onSpawnAggressiveChickens={props.onSpawnAggressiveChickens}
                  onSpawnRandomGreyWolf={props.onSpawnRandomGreyWolf}
                  onSpawnWildlifeSpecies={props.onSpawnWildlifeSpecies}
                />
              ) : null}

              {activeViewId === 'wildlife-spawner' &&
              (!props.onSpawnAggressiveChickens ||
                !props.onSpawnRandomGreyWolf ||
                !props.onSpawnWildlifeSpecies) ? (
                <div className="text-[10px] text-white/60">
                  Wildlife spawner is not wired in this scene.
                </div>
              ) : null}

              {activeViewId === 'wildlife-bestiary' ? (
                <RenderingWorldPlazaDevModeBestiaryUnlockControls />
              ) : null}

              {activeViewId === 'beta-spirited-sprites' &&
              props.onSpawnSpiritedSpritesBetaAnimal &&
              props.onClearSpiritedSpritesBetaSpawns ? (
                <RenderingSpiritedSpritesBetaDevControls
                  onSpawnAnimal={props.onSpawnSpiritedSpritesBetaAnimal}
                  onClearSpawns={props.onClearSpiritedSpritesBetaSpawns}
                />
              ) : null}

              {activeViewId === 'beta-spirited-sprites' &&
              (!props.onSpawnSpiritedSpritesBetaAnimal ||
                !props.onClearSpiritedSpritesBetaSpawns) ? (
                <div className="text-[10px] text-white/60">
                  Spirited Sprites beta spawner is not wired in this scene.
                </div>
              ) : null}

              {activeViewId === 'combat-projectiles' &&
              props.onSpawnProjectile ? (
                <RenderingWorldPlazaDevProjectileSpawnerControls
                  playerPositionRef={playerPositionRef}
                  onSpawnProjectile={props.onSpawnProjectile}
                  localUserId={props.onlineUserId ?? null}
                />
              ) : null}

              {activeViewId === 'combat-projectiles' &&
              !props.onSpawnProjectile ? (
                <div className="text-[10px] text-white/60">
                  Projectile spawner is not wired in this scene.
                </div>
              ) : null}

              {activeView.groupId === 'combat' &&
              activeViewId !== 'combat-projectiles' &&
              hasHealthControls ? (
                <RenderingWorldPlazaDevModeCombatRollControls
                  activeSubcategoryId={activeView.leafId}
                  hudSnapshot={props.healthHudSnapshot}
                  onRollDamage={props.onHealthRollDamage}
                  onToggleBuff={props.onHealthToggleBuff}
                  characterSkillIds={props.characterSkillIds}
                  onUseCharacterSkill={props.onUseCharacterSkill}
                />
              ) : null}

              {activeViewId === 'debug-overlays' ? (
                <div className="flex flex-col gap-1.5">
                  <span
                    className={
                      STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME
                    }
                  >
                    Overlay toggles
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <RenderingWorldPlazaTerrainCollisionDebugToggleButton
                      isVisible={isTerrainCollisionDebugVisible}
                      onToggle={onToggleTerrainCollisionDebug}
                    />
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

              {activeViewId === 'debug-readouts' ? (
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

        {isPerformanceDiagnosticsFeatureAvailable ? (
          <RenderingWorldPlazaPerformanceDiagnosticsToggleButton
            isVisible={isPerformanceDiagnosticsVisible}
            onToggle={onTogglePerformanceDiagnostics}
          />
        ) : null}
      </div>

      {isPerformanceDiagnosticsFeatureAvailable ? (
        <RenderingWorldPlazaPerformanceDiagnosticsOverlay
          isVisible={isPerformanceDiagnosticsVisible}
          onClose={onTogglePerformanceDiagnostics}
        />
      ) : null}
    </>
  );
}
