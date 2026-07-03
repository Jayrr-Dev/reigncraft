"use client";

import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS } from "@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants";
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_TOGGLE_ROW_CLASS_NAME } from "@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants";
import {
  resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
  togglingWorldPlazaPerformanceDiagnosticsRenderLayer,
} from "@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics";
import { usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags } from "@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags";

/**
 * Checkbox toggles that hide individual plaza render layers for perf isolation.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsRenderLayerToggles(): React.JSX.Element {
  const renderLayerFlags = usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();

  return (
    <div className="mt-2 border-t border-amber-300/20 pt-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-semibold text-amber-200">Render layers</span>
        <button
          type="button"
          className="rounded border border-amber-200/30 px-1.5 py-0.5 text-[9px] font-semibold text-amber-100 hover:bg-amber-400/10"
          onClick={() => {
            resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
          }}
        >
          Reset all
        </button>
      </div>
      <div className="space-y-1">
        {DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS.map(
          (layerDefinition) => (
            <label
              key={layerDefinition.layerId}
              className={DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_TOGGLE_ROW_CLASS_NAME}
            >
              <input
                type="checkbox"
                checked={renderLayerFlags[layerDefinition.layerId] ?? true}
                className="size-3 rounded border-amber-200/40 bg-black/40 accent-amber-400"
                onChange={() => {
                  togglingWorldPlazaPerformanceDiagnosticsRenderLayer(
                    layerDefinition.layerId,
                  );
                }}
              />
              <span>{layerDefinition.label}</span>
            </label>
          ),
        )}
      </div>
      <div className="mt-1 text-amber-100/70">
        Uncheck a layer to hide it and skip its sync work.
      </div>
    </div>
  );
}
