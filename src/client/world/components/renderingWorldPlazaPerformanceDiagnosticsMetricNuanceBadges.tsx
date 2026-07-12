'use client';

import {
  resolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetrics,
  type ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricGroup,
  type ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricReading,
} from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetrics';

export type RenderingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgesProps = {
  gauges: Readonly<Record<string, number>>;
  countersPerSecond: Readonly<Record<string, number>>;
};

function formattingWorldPlazaPerformanceDiagnosticsFpsLoadMetricValue(
  reading: ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricReading
): string {
  if (reading.unit === 'milliseconds') {
    return `${reading.value.toFixed(1)}ms`;
  }

  if (reading.unit === 'per-second') {
    return `${reading.value.toFixed(1)}/s`;
  }

  return Number.isInteger(reading.value)
    ? `${reading.value}`
    : reading.value.toFixed(1);
}

function resolvingWorldPlazaPerformanceDiagnosticsFpsLoadGroupClassName(
  pressure: number
): string {
  if (pressure >= 0.75) {
    return 'border-red-300/60 bg-red-500/20 text-red-50';
  }

  if (pressure >= 0.4) {
    return 'border-amber-300/60 bg-amber-500/15 text-amber-50';
  }

  return 'border-yellow-300/40 bg-yellow-500/10 text-yellow-50';
}

function resolvingWorldPlazaPerformanceDiagnosticsVisibleLoadReadings(
  group: ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricGroup
): readonly ResolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetricReading[] {
  const nonZeroReadings = group.readings.filter(
    (reading) => reading.pressure > 0 || reading.value > 0
  );

  return (nonZeroReadings.length > 0 ? nonZeroReadings : group.readings).slice(
    0,
    5
  );
}

/**
 * Current workload signals only. Gameplay state and vitals are intentionally
 * absent because they do not explain frame cost.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsMetricNuanceBadges({
  gauges,
  countersPerSecond,
}: RenderingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgesProps): React.JSX.Element {
  const loadMetrics = resolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetrics(
    gauges,
    countersPerSecond
  );

  return (
    <div className="space-y-2">
      <div className="rounded border border-sky-300/30 bg-sky-500/10 px-2 py-1.5 text-[9px] text-sky-100">
        CPU/GPU workload only. Higher pressure means a count or churn rate is
        approaching its FPS risk threshold. Summary timings remain the source of
        truth.
      </div>

      <section>
        <div className="mb-1 font-semibold text-amber-200">Active FPS load</div>
        {loadMetrics.activeGroups.length > 0 ? (
          <div className="space-y-1">
            {loadMetrics.activeGroups.map((group, groupIndex) => (
              <div
                key={group.groupId}
                className={`rounded border px-2 py-1.5 ${resolvingWorldPlazaPerformanceDiagnosticsFpsLoadGroupClassName(group.pressure)}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold">
                    {groupIndex + 1}. {group.label}
                  </div>
                  <div className="tabular-nums">
                    {Math.round(group.pressure * 100)}% pressure
                  </div>
                </div>
                <div className="mb-1 text-[9px] opacity-70">
                  {group.description}
                </div>
                <div className="space-y-0.5">
                  {resolvingWorldPlazaPerformanceDiagnosticsVisibleLoadReadings(
                    group
                  ).map((reading) => (
                    <div
                      key={reading.metricId}
                      className="flex items-center justify-between gap-3 text-[9px]"
                    >
                      <span>{reading.label}</span>
                      <span className="tabular-nums">
                        {formattingWorldPlazaPerformanceDiagnosticsFpsLoadMetricValue(
                          reading
                        )}
                        {reading.pressure > 0
                          ? ` (${Math.round(reading.pressure * 100)}%)`
                          : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded border border-lime-300/30 bg-lime-500/10 px-2 py-1.5 text-lime-100">
            No workload count or churn rate is near its warning threshold.
          </div>
        )}
      </section>

      {loadMetrics.healthyGroups.length > 0 ? (
        <section>
          <div className="mb-1 font-semibold text-amber-200">
            Below warning threshold
          </div>
          <div className="flex flex-wrap gap-1">
            {loadMetrics.healthyGroups.map((group) => (
              <div
                key={group.groupId}
                className="rounded border border-lime-300/25 bg-lime-500/10 px-1.5 py-0.5 text-[9px] text-lime-100/90"
              >
                {group.label}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="border-t border-amber-300/15 pt-1 text-[9px] text-amber-100/55">
        Removed: vitals, stamina, hunger, movement flags, world layer, volume,
        lock state, cache totals, and network latency.
      </div>
    </div>
  );
}
