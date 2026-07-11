/**
 * Applies one performance tester step config to plaza feature toggles.
 *
 * @module components/world/domains/applyingWorldPlazaPerformanceTesterStepConfig
 */

import type { DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFAULT_ENABLED,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import type { DefiningWorldPlazaPerformanceTesterStepConfig } from '@/components/world/domains/definingWorldPlazaPerformanceTesterStepRegistry';
import { settingWorldPlazaProceduralTreesAndRocksFeatureEnabled } from '@/components/world/domains/managingWorldPlazaProceduralTreesAndRocksFeatureStore';
import { settingWorldPlazaTerrainCollisionDebugVisible } from '@/components/world/domains/managingWorldPlazaTerrainCollisionDebugVisibilityStore';
import {
  resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
  settingWorldPlazaPerformanceDiagnosticsRenderLayer,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

/**
 * Restores render-layer flags from a captured snapshot.
 *
 * @param renderLayerFlags - Layer id to enabled map.
 */
export function applyingWorldPlazaPerformanceTesterRenderLayerFlagsSnapshot(
  renderLayerFlags: Readonly<Record<string, boolean>>
): void {
  for (const layerDefinition of DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS) {
    const isEnabled =
      renderLayerFlags[layerDefinition.layerId] ??
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFAULT_ENABLED;

    settingWorldPlazaPerformanceDiagnosticsRenderLayer(
      layerDefinition.layerId,
      isEnabled
    );
  }
}

/**
 * Applies procedural, collision-debug, and render-layer toggles for one step.
 *
 * @param config - Declarative step config from the registry.
 */
export function applyingWorldPlazaPerformanceTesterStepConfig(
  config: DefiningWorldPlazaPerformanceTesterStepConfig
): void {
  if (config.restoreAllRenderLayers) {
    resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  }

  if (config.renderLayers) {
    for (const [layerId, isEnabled] of Object.entries(config.renderLayers)) {
      settingWorldPlazaPerformanceDiagnosticsRenderLayer(
        layerId as DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId,
        isEnabled
      );
    }
  }

  if (config.proceduralTreesAndRocks !== undefined) {
    settingWorldPlazaProceduralTreesAndRocksFeatureEnabled(
      config.proceduralTreesAndRocks
    );
  }

  if (config.collisionDebugVisible !== undefined) {
    settingWorldPlazaTerrainCollisionDebugVisible(config.collisionDebugVisible);
  }
}
