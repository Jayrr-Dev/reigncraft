'use client';

import type { MeasuringWorldPlazaPerformanceDiagnosticsSnapshot } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import {
  resolvingWorldPlazaPerformanceDiagnosticsFpsCauseSummary,
  type ResolvingWorldPlazaPerformanceDiagnosticsFpsCause,
  type ResolvingWorldPlazaPerformanceDiagnosticsFpsCauseSeverity,
} from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsFpsCauseSummary';

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SEVERITY_LABEL: Readonly<
  Record<ResolvingWorldPlazaPerformanceDiagnosticsFpsCauseSeverity, string>
> = {
  healthy: 'Healthy',
  warning: 'Needs attention',
  critical: 'FPS limiter',
};

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SEVERITY_CLASS_NAME: Readonly<
  Record<ResolvingWorldPlazaPerformanceDiagnosticsFpsCauseSeverity, string>
> = {
  healthy: 'border-lime-300/40 bg-lime-500/10 text-lime-100',
  warning: 'border-amber-300/50 bg-amber-500/15 text-amber-50',
  critical: 'border-red-300/60 bg-red-500/20 text-red-50',
};

export type RenderingWorldPlazaPerformanceDiagnosticsSummaryNuanceBadgesProps =
  {
    snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot;
  };

function resolvingCauseEvidence(
  cause: ResolvingWorldPlazaPerformanceDiagnosticsFpsCause
): string {
  if (cause.pattern === 'sustained') {
    return `p95 ${cause.percentile95Ms.toFixed(1)}ms | avg ${cause.averageMs.toFixed(1)}ms | max ${cause.maxMs.toFixed(1)}ms`;
  }

  return `rare spike max ${cause.maxMs.toFixed(1)}ms | normal p95 ${cause.percentile95Ms.toFixed(1)}ms | spikes ${cause.spikeCount}`;
}

function resolvingCauseConfidence(
  measurementCount: number
): 'low confidence' | 'medium confidence' | 'high confidence' {
  if (measurementCount >= 20) {
    return 'high confidence';
  }

  if (measurementCount >= 6) {
    return 'medium confidence';
  }

  return 'low confidence';
}

function RenderingWorldPlazaPerformanceDiagnosticsCauseRow({
  cause,
  rank,
}: {
  readonly cause: ResolvingWorldPlazaPerformanceDiagnosticsFpsCause;
  readonly rank: number;
}): React.JSX.Element {
  return (
    <div
      className={`rounded border px-2 py-1.5 ${RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SEVERITY_CLASS_NAME[cause.severity]}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold">
          {rank}. {cause.label}
        </div>
        <div className="shrink-0 text-[9px] font-semibold uppercase tracking-wide opacity-80">
          {cause.pattern}
        </div>
      </div>
      <div className="text-[9px] opacity-90">
        {resolvingCauseEvidence(cause)}
      </div>
      {cause.loadLines.length > 0 ? (
        <div className="text-[9px] opacity-75">
          {cause.loadLines.join(' | ')}
        </div>
      ) : null}
      <div className="text-[8px] opacity-60">
        {resolvingCauseConfidence(cause.measurementCount)} (
        {cause.measurementCount} samples)
      </div>
    </div>
  );
}

/**
 * Summary tab diagnosis ranked by actual pressure on a 16.7ms frame budget.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsSummaryNuanceBadges({
  snapshot,
}: RenderingWorldPlazaPerformanceDiagnosticsSummaryNuanceBadgesProps): React.JSX.Element {
  const summary =
    resolvingWorldPlazaPerformanceDiagnosticsFpsCauseSummary(snapshot);

  return (
    <div className="space-y-2">
      <section
        className={`rounded border px-2 py-1.5 ${RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SEVERITY_CLASS_NAME[summary.severity]}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="font-bold">
            {
              RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SEVERITY_LABEL[
                summary.severity
              ]
            }
          </div>
          <div className="tabular-nums">
            {snapshot.framesPerSecond.toFixed(1)} FPS
          </div>
        </div>
        <div className="mt-0.5 text-[9px]">{summary.headline}</div>
        <div className="mt-0.5 text-[9px] opacity-80">
          frame p95 {snapshot.framePercentile95Ms.toFixed(1)}ms | p99{' '}
          {snapshot.framePercentile99Ms.toFixed(1)}ms | slow{' '}
          {snapshot.slowFrameCount} | very slow {snapshot.verySlowFrameCount}
        </div>
      </section>

      <section>
        <div className="mb-1 font-semibold text-amber-200">
          Likely FPS contributors
        </div>
        {summary.causes.length > 0 ? (
          <div className="space-y-1">
            {summary.causes.map((cause, causeIndex) => (
              <RenderingWorldPlazaPerformanceDiagnosticsCauseRow
                key={cause.sampleId}
                cause={cause}
                rank={causeIndex + 1}
              />
            ))}
          </div>
        ) : (
          <div className="rounded border border-lime-300/30 bg-lime-500/10 px-2 py-1.5 text-lime-100">
            No measured task is large enough to explain an FPS drop.
          </div>
        )}
      </section>

      {summary.healthyAreas.length > 0 ? (
        <section>
          <div className="mb-1 font-semibold text-amber-200">
            Not limiting FPS now
          </div>
          <div className="flex flex-wrap gap-1">
            {summary.healthyAreas.map((area) => (
              <div
                key={area.sampleId}
                className="rounded border border-lime-300/25 bg-lime-500/10 px-1.5 py-0.5 text-[9px] text-lime-100/90"
              >
                {area.label} p95 {area.percentile95Ms.toFixed(1)}ms
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="border-t border-amber-300/15 pt-1 text-[8px] text-amber-100/55">
        Ranked against the 16.7ms frame budget. Nested parent timings are hidden
        when a child task explains the same work. Use Samples for full raw data.
      </div>
    </div>
  );
}
