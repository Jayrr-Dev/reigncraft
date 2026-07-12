import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  beginningWorldPlazaPerformanceSample,
  buildingWorldPlazaPerformanceDiagnosticsSnapshot,
  settingWorldPlazaPerformanceDiagnosticsEnabled,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { afterEach, describe, expect, it } from 'vitest';

describe('beginningWorldPlazaPerformanceSample', () => {
  afterEach(() => {
    settingWorldPlazaPerformanceDiagnosticsEnabled(false);
  });

  it('records a pooled timer once even if its finisher repeats', () => {
    settingWorldPlazaPerformanceDiagnosticsEnabled(true);

    const finish = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.CAMERA_TICK
    );
    finish();
    finish();

    expect(
      buildingWorldPlazaPerformanceDiagnosticsSnapshot().samples.find(
        (sample) =>
          sample.sampleId ===
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.CAMERA_TICK
      )?.measurementCount
    ).toBe(1);
  });

  it('keeps overlapping timers for the same sample independent', () => {
    settingWorldPlazaPerformanceDiagnosticsEnabled(true);

    const finishFirst = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.ONLINE_POLL_ROUND_TRIP
    );
    const finishSecond = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.ONLINE_POLL_ROUND_TRIP
    );
    finishFirst();
    finishSecond();

    expect(
      buildingWorldPlazaPerformanceDiagnosticsSnapshot().samples.find(
        (sample) =>
          sample.sampleId ===
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.ONLINE_POLL_ROUND_TRIP
      )?.measurementCount
    ).toBe(2);
  });
});
