'use client';

import { RenderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStrip } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStrip';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_HINT } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgeConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY,
  type DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry';
import {
  buildingWorldPlazaPerformanceDiagnosticsSampleStatsById,
  resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceIndex,
} from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex';
import type { MeasuringWorldPlazaPerformanceDiagnosticsSampleStats } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { useState } from 'react';

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE_SECTION_LABEL_CLASS_NAME =
  'font-semibold text-amber-200' as const;

export type RenderingWorldPlazaPerformanceDiagnosticsSampleNuanceBadgesProps = {
  samples: readonly MeasuringWorldPlazaPerformanceDiagnosticsSampleStats[];
};

/**
 * Samples tab: nuance category badges with green→red indexes from p95 timings.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsSampleNuanceBadges({
  samples,
}: RenderingWorldPlazaPerformanceDiagnosticsSampleNuanceBadgesProps): React.JSX.Element {
  const [selectedNuanceId, setSelectedNuanceId] =
    useState<DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId | null>(
      null
    );

  const samplesById =
    buildingWorldPlazaPerformanceDiagnosticsSampleStatsById(samples);

  const sampleDefinitions =
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY.filter(
      (definition) => definition.sampleIds.length > 0
    );

  const selectedDefinition =
    sampleDefinitions.find(
      (definition) => definition.nuanceId === selectedNuanceId
    ) ?? null;

  const selectedIndex = selectedDefinition
    ? resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceIndex(
        selectedDefinition,
        samplesById
      )
    : 0;

  return (
    <div>
      <RenderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStrip
        hint={DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_HINT}
        items={sampleDefinitions.map((definition) => ({
          definition,
          index: resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceIndex(
            definition,
            samplesById
          ),
        }))}
        selectedNuanceId={selectedNuanceId}
        onSelectNuanceId={setSelectedNuanceId}
      />

      {selectedDefinition ? (
        <div>
          <div
            className={
              RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE_SECTION_LABEL_CLASS_NAME
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

          {selectedDefinition.sampleIds.every(
            (sampleId) => samplesById.get(sampleId) === undefined
          ) ? (
            <div className="text-amber-100/80">
              Move around to collect timings.
            </div>
          ) : (
            selectedDefinition.sampleIds.map((sampleId) => {
              const sampleStats = samplesById.get(sampleId);
              if (!sampleStats) {
                return null;
              }
              return (
                <div key={sampleId}>
                  {sampleStats.sampleId}: avg{' '}
                  {sampleStats.averageMs.toFixed(1)} | p95{' '}
                  {sampleStats.percentile95Ms.toFixed(1)} | p99{' '}
                  {sampleStats.percentile99Ms.toFixed(1)} | max{' '}
                  {sampleStats.maxMs.toFixed(1)} | last{' '}
                  {sampleStats.lastMs.toFixed(1)}
                  {sampleStats.spikeCount > 0
                    ? ` | spikes ${sampleStats.spikeCount}`
                    : ''}
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="text-amber-100/80">
          Select a nuance badge to inspect samples.
        </div>
      )}
    </div>
  );
}
