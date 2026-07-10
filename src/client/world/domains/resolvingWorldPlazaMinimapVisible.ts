import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import { checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore } from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';

/** Inputs for {@link resolvingWorldPlazaMinimapVisible}. */
export type ResolvingWorldPlazaMinimapVisibleParams = {
  /** True when the player wants the minimap shown on this viewport. */
  isMinimapPreferenceEnabled: boolean;
  /** Live perf diagnostics render-layer flags. */
  renderLayerFlags: Readonly<Record<string, boolean>>;
};

/**
 * Resolves whether the plaza minimap canvas should render.
 *
 * Player preference is the source of truth. Performance tier only affects the
 * default when no preference is saved (see {@link usingWorldPlazaMinimapEnabled}).
 */
export function resolvingWorldPlazaMinimapVisible({
  isMinimapPreferenceEnabled,
  renderLayerFlags,
}: ResolvingWorldPlazaMinimapVisibleParams): boolean {
  return (
    isMinimapPreferenceEnabled &&
    checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.MINIMAP,
      renderLayerFlags
    )
  );
}
