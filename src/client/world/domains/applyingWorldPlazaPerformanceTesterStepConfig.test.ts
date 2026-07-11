import { beforeEach, describe, expect, it, vi } from 'vitest';

import { applyingWorldPlazaPerformanceTesterStepConfig } from '@/components/world/domains/applyingWorldPlazaPerformanceTesterStepConfig';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';

const {
  resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
  settingWorldPlazaPerformanceDiagnosticsRenderLayer,
} = vi.hoisted(() => ({
  resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags: vi.fn(),
  settingWorldPlazaPerformanceDiagnosticsRenderLayer: vi.fn(),
}));

const { settingWorldPlazaProceduralTreesAndRocksFeatureEnabled } = vi.hoisted(
  () => ({
    settingWorldPlazaProceduralTreesAndRocksFeatureEnabled: vi.fn(),
  })
);

const { settingWorldPlazaTerrainCollisionDebugVisible } = vi.hoisted(() => ({
  settingWorldPlazaTerrainCollisionDebugVisible: vi.fn(),
}));

vi.mock(
  '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics',
  () => ({
    resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
    settingWorldPlazaPerformanceDiagnosticsRenderLayer,
  })
);

vi.mock(
  '@/components/world/domains/managingWorldPlazaProceduralTreesAndRocksFeatureStore',
  () => ({
    settingWorldPlazaProceduralTreesAndRocksFeatureEnabled,
  })
);

vi.mock(
  '@/components/world/domains/managingWorldPlazaTerrainCollisionDebugVisibilityStore',
  () => ({
    settingWorldPlazaTerrainCollisionDebugVisible,
  })
);

describe('applyingWorldPlazaPerformanceTesterStepConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restores render layers before applying partial overrides', () => {
    applyingWorldPlazaPerformanceTesterStepConfig({
      restoreAllRenderLayers: true,
      renderLayers: {
        [DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.TREE_TRUNKS]: false,
      },
      collisionDebugVisible: false,
      proceduralTreesAndRocks: false,
    });

    expect(
      resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags
    ).toHaveBeenCalledTimes(1);
    expect(
      settingWorldPlazaPerformanceDiagnosticsRenderLayer
    ).toHaveBeenCalledWith(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.TREE_TRUNKS,
      false
    );
    expect(settingWorldPlazaTerrainCollisionDebugVisible).toHaveBeenCalledWith(
      false
    );
    expect(
      settingWorldPlazaProceduralTreesAndRocksFeatureEnabled
    ).toHaveBeenCalledWith(false);
  });
});
