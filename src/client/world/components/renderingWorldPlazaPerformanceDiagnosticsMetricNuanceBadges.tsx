'use client';

import { RenderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStrip } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStrip';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_HINT } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgeConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY,
  type DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry';
import { resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex } from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex';
import { useState } from 'react';

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_SECTION_LABEL_CLASS_NAME =
  'font-semibold text-amber-200' as const;

export type RenderingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgesProps = {
  gauges: Readonly<Record<string, number>>;
  countersPerSecond: Readonly<Record<string, number>>;
};

/**
 * Metrics tab: nuance category badges with green→red indexes; tap opens group.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsMetricNuanceBadges({
  gauges,
  countersPerSecond,
}: RenderingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgesProps): React.JSX.Element {
  const [selectedNuanceId, setSelectedNuanceId] =
    useState<DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId | null>(
      null
    );

  const metricDefinitions =
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY.filter(
      (definition) => definition.gaugeIds.length > 0
    );

  const selectedDefinition =
    metricDefinitions.find(
      (definition) => definition.nuanceId === selectedNuanceId
    ) ?? null;

  const selectedIndex = selectedDefinition
    ? resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex(
        selectedDefinition,
        gauges
      )
    : 0;

  return (
    <div>
      <RenderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStrip
        hint={DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_HINT}
        items={metricDefinitions.map((definition) => ({
          definition,
          index: resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex(
            definition,
            gauges
          ),
        }))}
        selectedNuanceId={selectedNuanceId}
        onSelectNuanceId={setSelectedNuanceId}
      />

      {selectedDefinition ? (
        <div>
          <div
            className={
              RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_SECTION_LABEL_CLASS_NAME
            }
          >
            {selectedDefinition.label}{' '}
            <span className="font-normal text-amber-100/70">
              index {selectedIndex.toFixed(2)}
            </span>
          </div>
          <div className="mb-1.5 text-[9px] text-amber-100/55">
            {selectedDefinition.description}
          </div>

          <div
            className={`mb-1 ${RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_SECTION_LABEL_CLASS_NAME}`}
          >
            Gauges
          </div>
          {selectedDefinition.gaugeIds.every(
            (gaugeId) => gauges[gaugeId] === undefined
          ) ? (
            <div className="mb-2 text-amber-100/80">none yet</div>
          ) : (
            selectedDefinition.gaugeIds.map((gaugeId) => {
              const gaugeValue = gauges[gaugeId];
              if (gaugeValue === undefined) {
                return null;
              }
              return (
                <div key={gaugeId}>
                  {gaugeId}: {gaugeValue}
                </div>
              );
            })
          )}

          {selectedDefinition.counterIds.length > 0 ? (
            <>
              <div
                className={`mt-2 ${RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_SECTION_LABEL_CLASS_NAME}`}
              >
                Events / sec
              </div>
              {selectedDefinition.counterIds.every(
                (counterId) => countersPerSecond[counterId] === undefined
              ) ? (
                <div className="text-amber-100/80">none yet</div>
              ) : (
                selectedDefinition.counterIds.map((counterId) => {
                  const counterRate = countersPerSecond[counterId];
                  if (counterRate === undefined) {
                    return null;
                  }
                  return (
                    <div key={counterId}>
                      {counterId}: {counterRate.toFixed(2)}
                    </div>
                  );
                })
              )}
            </>
          ) : null}
        </div>
      ) : (
        <div className="text-amber-100/80">
          Select a nuance badge to inspect gauges.
        </div>
      )}
    </div>
  );
}
