'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type {
  DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceDefinition,
  DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry';
import { resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgeClassName } from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgeClassName';

export type RenderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStripItem = {
  definition: DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceDefinition;
  index: number;
};

export type RenderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStripProps = {
  hint: string;
  items: readonly RenderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStripItem[];
  selectedNuanceId: DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId | null;
  onSelectNuanceId: (
    nuanceId: DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId | null
  ) => void;
};

/**
 * Shared green→red nuance badge strip for Metrics / Samples / Summary.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStrip({
  hint,
  items,
  selectedNuanceId,
  onSelectNuanceId,
}: RenderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStripProps): React.JSX.Element {
  return (
    <div>
      <div className="mb-1 text-amber-100/65">{hint}</div>
      <div className="mb-2 flex flex-wrap gap-1">
        {items.map(({ definition, index }) => {
          const isSelected = selectedNuanceId === definition.nuanceId;

          return (
            <button
              key={definition.nuanceId}
              type="button"
              {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
              title={definition.description}
              aria-pressed={isSelected}
              className={resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgeClassName(
                index,
                isSelected
              )}
              onClick={() => {
                onSelectNuanceId(isSelected ? null : definition.nuanceId);
              }}
            >
              {definition.label}{' '}
              <span className="font-mono tabular-nums">{index.toFixed(2)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
