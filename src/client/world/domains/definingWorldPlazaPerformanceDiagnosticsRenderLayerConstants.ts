/**
 * Render-layer feature flags for plaza performance diagnostics.
 *
 * Toggle layers in the Perf overlay or via `window.__WORLD_PLAZA_PERF__` to
 * isolate GPU/CPU cost while running.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants
 */

/** Render-layer ids used by diagnostics toggles. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER = {
  FLOOR_TILES: "floor-tiles",
  TREE_TRUNKS: "tree-trunks",
  TREE_CANOPIES: "tree-canopies",
  AVATARS: "avatars",
  PLACED_BLOCKS: "placed-blocks",
  BIOME_BACKDROP: "biome-backdrop",
  MINIMAP: "minimap",
} as const;

/** One render-layer flag id. */
export type DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId =
  (typeof DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER)[keyof typeof DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER];

/** Overlay label for one render layer. */
export interface DefiningWorldPlazaPerformanceDiagnosticsRenderLayerDefinition {
  readonly layerId: DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId;
  readonly label: string;
}

/** Render layers shown in the Perf overlay, in display order. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS: readonly DefiningWorldPlazaPerformanceDiagnosticsRenderLayerDefinition[] =
  [
    {
      layerId: DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.FLOOR_TILES,
      label: "Floor tiles",
    },
    {
      layerId: DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.TREE_TRUNKS,
      label: "Tree trunks",
    },
    {
      layerId: DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.TREE_CANOPIES,
      label: "Tree canopies",
    },
    {
      layerId: DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.AVATARS,
      label: "Avatars",
    },
    {
      layerId: DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.PLACED_BLOCKS,
      label: "Placed blocks",
    },
    {
      layerId: DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.BIOME_BACKDROP,
      label: "Biome backdrop",
    },
    {
      layerId: DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.MINIMAP,
      label: "Minimap",
    },
  ];

/** Default enabled state for every render layer. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFAULT_ENABLED =
  true as const;
