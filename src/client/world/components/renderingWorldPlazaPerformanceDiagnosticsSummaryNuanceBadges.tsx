'use client';

import { RenderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStrip } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStrip';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_HINT } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgeConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY,
  type DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry';
import type {
  MeasuringWorldPlazaPerformanceDiagnosticsSampleStats,
  MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import {
  buildingWorldPlazaPerformanceDiagnosticsSampleStatsById,
  resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceCombinedIndex,
} from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex';
import { useState } from 'react';

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SUMMARY_SECTION_LABEL_CLASS_NAME =
  'font-semibold text-amber-200' as const;

export type RenderingWorldPlazaPerformanceDiagnosticsSummaryNuanceBadgesProps =
  {
    snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot;
  };

/**
 * Summary tab nuance strip: combined gauge+sample index; tap shows group highlight.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsSummaryNuanceBadges({
  snapshot,
}: RenderingWorldPlazaPerformanceDiagnosticsSummaryNuanceBadgesProps): React.JSX.Element {
  const [selectedNuanceId, setSelectedNuanceId] =
    useState<DefiningWorldPlazaPerformanceDiagnosticsMetricNuanceId | null>(
      null
    );

  const samplesById = buildingWorldPlazaPerformanceDiagnosticsSampleStatsById(
    snapshot.samples
  );

  const selectedDefinition =
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY.find(
      (definition) => definition.nuanceId === selectedNuanceId
    ) ?? null;

  const selectedIndex = selectedDefinition
    ? resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceCombinedIndex(
        selectedDefinition,
        snapshot.gauges,
        samplesById
      )
    : 0;

  const selectedSamples = selectedDefinition
    ? selectedDefinition.sampleIds
        .map((sampleId) => samplesById.get(sampleId))
        .filter(
          (
            sampleStats
          ): sampleStats is MeasuringWorldPlazaPerformanceDiagnosticsSampleStats =>
            sampleStats !== undefined && sampleStats.measurementCount > 0
        )
        .slice(0, 6)
    : [];

  const selectedGauges = selectedDefinition
    ? selectedDefinition.gaugeIds
        .map((gaugeId) => {
          const gaugeValue = snapshot.gauges[gaugeId];
          if (gaugeValue === undefined) {
            return null;
          }
          return { gaugeId, gaugeValue };
        })
        .filter(
          (entry): entry is { gaugeId: string; gaugeValue: number } =>
            entry !== null
        )
        .slice(0, 6)
    : [];

  const selectedSpikeLines = selectedDefinition
    ? snapshot.recentSpikeLines.filter((spikeLine) =>
        selectedDefinition.sampleIds.some((sampleId) =>
          spikeLine.includes(sampleId)
        )
      )
    : [];

  return (
    <div className="mt-2">
      <div
        className={
          RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SUMMARY_SECTION_LABEL_CLASS_NAME
        }
      >
        Nuance
      </div>
      <RenderingWorldPlazaPerformanceDiagnosticsNuanceBadgeStrip
        hint={DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_HINT}
        items={DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY.map(
          (definition) => ({
            definition,
            index:
              resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceCombinedIndex(
                definition,
                snapshot.gauges,
                samplesById
              ),
          })
        )}
        selectedNuanceId={selectedNuanceId}
        onSelectNuanceId={setSelectedNuanceId}
      />

      {selectedDefinition ? (
        <div>
          <div
            className={
              RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SUMMARY_SECTION_LABEL_CLASS_NAME
            }
          >
            {selectedDefinition.label}{' '}
            <span className="font-normal text-amber-100/70">
              index {selectedIndex.toFixed(2)}
            </span>
          </div>
          <div className="mb-1 text-[9px] text-amber-100/55">
            {selectedDefinition.description}
          </div>
          {selectedGauges.length > 0 ? (
            <>
              <div className="text-amber-100/70">Gauges</div>
              {selectedGauges.map(({ gaugeId, gaugeValue }) => (
                <div key={gaugeId}>
                  {gaugeId}: {gaugeValue}
                </div>
              ))}
            </>
          ) : null}
          {selectedSamples.length > 0 ? (
            <>
              <div className="mt-1 text-amber-100/70">Samples</div>
              {selectedSamples.map((sampleStats) => (
                <div key={sampleStats.sampleId}>
                  {sampleStats.sampleId}: avg {sampleStats.averageMs.toFixed(1)}
                  ms | p95 {sampleStats.percentile95Ms.toFixed(1)}
                  {sampleStats.spikeCount > 0
                    ? ` | spikes ${sampleStats.spikeCount}`
                    : ''}
                </div>
              ))}
            </>
          ) : null}
          {selectedSpikeLines.length > 0 ? (
            <>
              <div className="mt-1 text-amber-100/70">Spikes</div>
              {selectedSpikeLines.map((spikeLine, spikeLineIndex) => (
                <div
                  key={`${spikeLineIndex}-${spikeLine}`}
                  className="text-red-200"
                >
                  {spikeLine}
                </div>
              ))}
            </>
          ) : null}
          {selectedGauges.length === 0 &&
          selectedSamples.length === 0 &&
          selectedSpikeLines.length === 0 ? (
            <div className="text-amber-100/80">No data in this group yet.</div>
          ) : null}
        </div>
      ) : (
        <div className="text-amber-100/80">
          Select a nuance badge for a group snapshot.
        </div>
      )}
    </div>
  );
}
