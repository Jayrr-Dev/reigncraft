import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_LOAD_METRIC_REGISTRY,
  type DefiningWorldPlazaPerformanceDiagnosticsFpsLoadMetricGroup,
  type DefiningWorldPlazaPerformanceDiagnosticsFpsLoadMetricSignal,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsFpsLoadMetricRegistry';

export type ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricReading = {
  readonly metricId: string;
  readonly label: string;
  readonly unit: 'count' | 'milliseconds' | 'per-second';
  readonly value: number;
  readonly pressure: number;
};

export type ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricGroup = {
  readonly groupId: DefiningWorldPlazaPerformanceDiagnosticsFpsLoadMetricGroup['groupId'];
  readonly label: string;
  readonly description: string;
  readonly pressure: number;
  readonly readings: readonly ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricReading[];
};

export type ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetrics = {
  readonly activeGroups: readonly ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricGroup[];
  readonly healthyGroups: readonly ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricGroup[];
};

const RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_ACTIVE_LOAD_PRESSURE = 0.5;

function clampingWorldPlazaPerformanceDiagnosticsPressure(
  value: number
): number {
  return Math.max(0, Math.min(1, value));
}

function resolvingWorldPlazaPerformanceDiagnosticsSignalPressure(
  signal: DefiningWorldPlazaPerformanceDiagnosticsFpsLoadMetricSignal,
  value: number
): number {
  const pressureSpan = signal.criticalAt - signal.healthyAt;

  if (pressureSpan <= 0) {
    return value > signal.criticalAt ? 1 : 0;
  }

  return clampingWorldPlazaPerformanceDiagnosticsPressure(
    (value - signal.healthyAt) / pressureSpan
  );
}

function resolvingWorldPlazaPerformanceDiagnosticsSignalValue(
  signal: DefiningWorldPlazaPerformanceDiagnosticsFpsLoadMetricSignal,
  gauges: Readonly<Record<string, number>>,
  countersPerSecond: Readonly<Record<string, number>>
): number | undefined {
  return signal.source === 'gauge'
    ? gauges[signal.metricId]
    : countersPerSecond[signal.metricId];
}

/**
 * Resolves only current workload signals capable of increasing frame cost.
 */
export function resolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetrics(
  gauges: Readonly<Record<string, number>>,
  countersPerSecond: Readonly<Record<string, number>>
): ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetrics {
  const groups =
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_LOAD_METRIC_REGISTRY.flatMap(
      (
        definition
      ): readonly ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricGroup[] => {
        const readings = definition.signals
          .flatMap(
            (
              signal
            ): readonly ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricReading[] => {
              const value =
                resolvingWorldPlazaPerformanceDiagnosticsSignalValue(
                  signal,
                  gauges,
                  countersPerSecond
                );

              if (value === undefined || !Number.isFinite(value)) {
                return [];
              }

              return [
                {
                  metricId: signal.metricId,
                  label: signal.label,
                  unit: signal.unit,
                  value,
                  pressure:
                    resolvingWorldPlazaPerformanceDiagnosticsSignalPressure(
                      signal,
                      value
                    ),
                },
              ];
            }
          )
          .sort((left, right) => right.pressure - left.pressure);

        if (readings.length === 0) {
          return [];
        }

        return [
          {
            groupId: definition.groupId,
            label: definition.label,
            description: definition.description,
            pressure: Math.max(...readings.map((reading) => reading.pressure)),
            readings,
          },
        ];
      }
    );
  const rankedGroups = [...groups].sort(
    (left, right) => right.pressure - left.pressure
  );

  return {
    activeGroups: rankedGroups.filter(
      (group) =>
        group.pressure >=
        RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_ACTIVE_LOAD_PRESSURE
    ),
    healthyGroups: rankedGroups.filter(
      (group) =>
        group.pressure <
        RESOLVING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_ACTIVE_LOAD_PRESSURE
    ),
  };
}
