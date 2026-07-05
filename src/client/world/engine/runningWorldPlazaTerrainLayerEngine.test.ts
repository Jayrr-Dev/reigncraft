import { DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_HIGH } from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import {
  checkingWorldPlazaTerrainDependencyKeysChanged,
  DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY,
  formattingWorldPlazaTerrainDependencyBoundsKey,
} from '@/components/world/engine/definingWorldPlazaTerrainDependencyKeys';
import type {
  DefiningWorldPlazaTerrainIncrementalLayerDescriptor,
  DefiningWorldPlazaTerrainLayerDescriptor,
  RunningWorldPlazaTerrainLayerEngineContext,
} from '@/components/world/engine/definingWorldPlazaTerrainLayerDescriptor';
import {
  creatingWorldPlazaTerrainLayerEngine,
  RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID,
} from '@/components/world/engine/runningWorldPlazaTerrainLayerEngine';
import { Container } from 'pixi.js';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaTerrainDependencyKeysChanged', () => {
  it('returns true when any watched key changes', () => {
    const previous = {
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS]: '0:1:0:1',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.VIEWPORT_SIZE]: '800x600',
    } as never;
    const current = {
      ...previous,
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS]: '1:2:1:2',
    } as never;

    expect(
      checkingWorldPlazaTerrainDependencyKeysChanged(current, previous, [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS,
      ])
    ).toBe(true);
  });

  it('returns false when watched keys are unchanged', () => {
    const snapshot = {
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS]: '0:1:0:1',
    } as never;

    expect(
      checkingWorldPlazaTerrainDependencyKeysChanged(snapshot, snapshot, [
        DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS,
      ])
    ).toBe(false);
  });
});

describe('formattingWorldPlazaTerrainDependencyBoundsKey', () => {
  it('returns empty string for null bounds', () => {
    expect(formattingWorldPlazaTerrainDependencyBoundsKey(null)).toBe('');
  });
});

describe('creatingWorldPlazaTerrainLayerEngine', () => {
  function creatingTestContext(): RunningWorldPlazaTerrainLayerEngineContext {
    const floorLayer = new Container();
    const trunkLayer = new Container();
    const canopyLayer = new Container();
    floorLayer.sortableChildren = true;

    return {
      performanceProfile: DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_HIGH,
      playerPosition: { x: 4, y: 4 },
      viewportWidth: 800,
      viewportHeight: 600,
      worldZoom: 1,
      floorLayer,
      trunkLayer,
      canopyLayer,
      scenePlacedBlocks: [],
      choppedTreesByTileKey: new Map(),
      burntGrassTileKeys: undefined,
      isFloorRenderLayerEnabled: true,
      isTrunkRenderLayerEnabled: true,
      isCanopyRenderLayerEnabled: true,
      floorBounds: {
        minTileX: 0,
        maxTileX: 8,
        minTileY: 0,
        maxTileY: 8,
      },
      elevationBounds: null,
      treeBounds: null,
      floorBoundsKey: '0:8:0:8',
      elevationBoundsKey: '',
      treeBoundsKey: '',
      sunBucketIndex: 0,
      animationTimeMs: 0,
      playerTileKey: '4,4',
    };
  }

  it('marks an incremental layer incomplete from cross-layer invalidation', () => {
    let floorSyncCount = 0;
    const floorLayer: DefiningWorldPlazaTerrainIncrementalLayerDescriptor = {
      kind: 'incremental',
      id: RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.FLOOR_CHUNKS,
      parentLayer: 'floor',
      boundsProfile: 'floor',
      participatesInHeavyIdleSkip: true,
      invalidateOn: [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS],
      createRuntimeState: () => ({ chunkGraphicsByKey: new Map() }),
      sync: () => {
        floorSyncCount += 1;
        return { isComplete: true, needsChildSort: false };
      },
      resetRuntimeState: () => {},
      destroyRuntimeState: () => {},
    };

    const engine = creatingWorldPlazaTerrainLayerEngine([floorLayer]);
    const context = creatingTestContext();
    const dependencySnapshot = {
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.VIEWPORT_SIZE]: '800x600',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FLOOR_BOUNDS]: '0:8:0:8',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.ELEVATION_BOUNDS]: '',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.TREE_BOUNDS]: '',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PLACED_TREE_BLOCKS]: '',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.CHOPPED_TREES]: '',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.BURNT_GRASS]: '',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.THAW_VISUAL]: '0|',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.SUN_BUCKET]: '0',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.PLAYER_TILE]: '4,4',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.ISLAND_MODE_REVISION]: '0',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.FIRELANDS_TEXTURES_READY]:
        '1',
      [DEFINING_WORLD_PLAZA_TERRAIN_DEPENDENCY_KEY.LAVA_TEXTURES_READY]: '1',
    };

    engine.tick({
      context,
      dependencySnapshot,
      idleHeavySyncKey: 'idle-1',
      floorBoundsForRedraw: context.floorBounds,
      floorBoundsKeyForRedraw: context.floorBoundsKey,
    });
    engine.handle.markIncrementalLayerIncomplete(
      RUNNING_WORLD_PLAZA_TERRAIN_LAYER_ID.FLOOR_CHUNKS
    );
    engine.tick({
      context,
      dependencySnapshot,
      idleHeavySyncKey: 'idle-1',
      floorBoundsForRedraw: context.floorBounds,
      floorBoundsKeyForRedraw: context.floorBoundsKey,
    });

    expect(floorSyncCount).toBe(2);
  });

  it('resets all layer runtime state', () => {
    let destroyCount = 0;
    const testLayer: DefiningWorldPlazaTerrainLayerDescriptor = {
      kind: 'incremental',
      id: 'test-layer',
      parentLayer: 'floor',
      boundsProfile: 'none',
      invalidateOn: [],
      createRuntimeState: () => ({ value: 1 }),
      sync: () => ({ isComplete: true, needsChildSort: false }),
      resetRuntimeState: () => {
        destroyCount += 1;
      },
      destroyRuntimeState: () => {},
    };
    const engine = creatingWorldPlazaTerrainLayerEngine([testLayer]);
    const context = creatingTestContext();

    engine.resetAll(context);

    expect(destroyCount).toBe(0);
  });
});
