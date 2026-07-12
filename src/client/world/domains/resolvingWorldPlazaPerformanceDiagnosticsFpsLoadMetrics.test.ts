import { resolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetrics } from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetrics';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetrics', () => {
  it('ignores gameplay state and retained culled floor chunks', () => {
    const result = resolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetrics(
      {
        'floor-chunk-count': 215,
        'water-visible-tile-count': 194,
        'wildlife-sim-backlog-ms': 26.7,
        'wildlife-instance-count': 10,
        'audio-inflight-load-count': 2,
        'audio-active-sfx-count': 2,
        'audio-music-active-voice-count': 1,
        'player-stamina-ratio': 0.31,
        'player-health-ratio': 1,
        'player-is-running': 1,
        'audio-music-target-volume': 0.38,
      },
      {}
    );

    expect(result.activeGroups).toEqual([]);
    expect(
      result.healthyGroups.flatMap((group) =>
        group.readings.map((reading) => reading.metricId)
      )
    ).not.toContain('player-stamina-ratio');
    expect(
      result.healthyGroups.flatMap((group) =>
        group.readings.map((reading) => reading.metricId)
      )
    ).not.toContain('floor-chunk-count');
  });

  it('surfaces rebuild churn even when retained counts are unavailable', () => {
    const result = resolvingWorldPlazaPerformanceDiagnosticsFpsLoadMetrics(
      {},
      {
        'floor-chunks-built': 12,
      }
    );

    expect(result.activeGroups[0]?.groupId).toBe('terrain');
    expect(result.activeGroups[0]?.readings[0]?.metricId).toBe(
      'floor-chunks-built'
    );
  });
});
