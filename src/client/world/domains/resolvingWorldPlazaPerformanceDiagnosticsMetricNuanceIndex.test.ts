import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceRegistry';
import {
  buildingWorldPlazaPerformanceDiagnosticsSampleStatsById,
  resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceCombinedIndex,
  resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex,
  resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceSignalIndex,
  resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceIndex,
  resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceSignalIndex,
} from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex';
import { describe, expect, it } from 'vitest';

const GAUGE = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE;
const SAMPLE = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE;

describe('resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex', () => {
  it('maps higher-worse backlog from healthy to critical', () => {
    expect(
      resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceSignalIndex(
        {
          gaugeId: GAUGE.WILDLIFE_SIM_BACKLOG_MS,
          polarity: 'higher-worse',
          healthyAt: 0,
          criticalAt: 48,
        },
        0
      )
    ).toBe(0);
    expect(
      resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceSignalIndex(
        {
          gaugeId: GAUGE.WILDLIFE_SIM_BACKLOG_MS,
          polarity: 'higher-worse',
          healthyAt: 0,
          criticalAt: 48,
        },
        24
      )
    ).toBeCloseTo(0.5);
    expect(
      resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceSignalIndex(
        {
          gaugeId: GAUGE.WILDLIFE_SIM_BACKLOG_MS,
          polarity: 'higher-worse',
          healthyAt: 0,
          criticalAt: 48,
        },
        96
      )
    ).toBe(1);
  });

  it('maps lower-worse vitals from full to critical', () => {
    expect(
      resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceSignalIndex(
        {
          gaugeId: GAUGE.PLAYER_HEALTH_RATIO,
          polarity: 'lower-worse',
          healthyAt: 1,
          criticalAt: 0.2,
        },
        1
      )
    ).toBe(0);
    expect(
      resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceSignalIndex(
        {
          gaugeId: GAUGE.PLAYER_HEALTH_RATIO,
          polarity: 'lower-worse',
          healthyAt: 1,
          criticalAt: 0.2,
        },
        0.2
      )
    ).toBe(1);
  });

  it('maps sample p95 ms from healthy to critical', () => {
    expect(
      resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceSignalIndex(
        {
          sampleId: SAMPLE.TERRAIN_SYNC,
          healthyAtMs: 2,
          criticalAtMs: 18,
        },
        10
      )
    ).toBeCloseTo(0.5);
  });

  it('uses worst signal as the group index', () => {
    const wildlifeSim =
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY.find(
        (definition) =>
          definition.nuanceId ===
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.WILDLIFE_SIM
      );

    expect(wildlifeSim).toBeDefined();
    if (!wildlifeSim) {
      return;
    }

    const index = resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceIndex(
      wildlifeSim,
      {
        [GAUGE.WILDLIFE_SIM_BACKLOG_MS]: 24,
        [GAUGE.WILDLIFE_SIM_STEPS_THIS_FRAME]: 0,
        [GAUGE.WILDLIFE_PLAYER_CONTACT_COUNT]: 0,
      }
    );

    expect(index).toBeCloseTo(0.5);
  });

  it('combines gauge and sample indexes for summary', () => {
    const terrain =
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY.find(
        (definition) =>
          definition.nuanceId ===
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.TERRAIN
      );

    expect(terrain).toBeDefined();
    if (!terrain) {
      return;
    }

    const samplesById = buildingWorldPlazaPerformanceDiagnosticsSampleStatsById(
      [
        {
          sampleId: SAMPLE.TERRAIN_SYNC,
          averageMs: 10,
          percentile95Ms: 12,
          percentile99Ms: 14,
          maxMs: 16,
          lastMs: 9,
          measurementCount: 10,
          spikeCount: 0,
        },
      ]
    );

    const sampleIndex =
      resolvingWorldPlazaPerformanceDiagnosticsSampleNuanceIndex(
        terrain,
        samplesById
      );
    const combined =
      resolvingWorldPlazaPerformanceDiagnosticsMetricNuanceCombinedIndex(
        terrain,
        { [GAUGE.FLOOR_CHUNK_COUNT]: 64 },
        samplesById
      );

    expect(sampleIndex).toBeCloseTo(0.5);
    expect(combined).toBeCloseTo(0.5);
  });

  it('registers every nuance id once and covers sample ids', () => {
    const ids =
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY.map(
        (definition) => definition.nuanceId
      );
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE.SYSTEM
    );

    const sampleIds = new Set(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_REGISTRY.flatMap(
        (definition) => [...definition.sampleIds]
      )
    );
    expect(sampleIds.has(SAMPLE.PIXI_RENDER)).toBe(true);
    expect(sampleIds.has(SAMPLE.WILDLIFE_TICK)).toBe(true);
    expect(sampleIds.has(SAMPLE.AVATAR_TICK)).toBe(true);
  });
});
