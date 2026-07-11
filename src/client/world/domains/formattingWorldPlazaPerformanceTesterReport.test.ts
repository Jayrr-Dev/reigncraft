import { describe, expect, it } from 'vitest';

import type { ComputingWorldPlazaPerformanceTesterStepResult } from '@/components/world/domains/computingWorldPlazaPerformanceTesterStepResult';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP } from '@/components/world/domains/definingWorldPlazaPerformanceTesterStepRegistry';
import { formattingWorldPlazaPerformanceTesterReport } from '@/components/world/domains/formattingWorldPlazaPerformanceTesterReport';

describe('formattingWorldPlazaPerformanceTesterReport', () => {
  it('formats empty and populated reports', () => {
    expect(formattingWorldPlazaPerformanceTesterReport([])).toContain(
      'no results yet'
    );

    const results: ComputingWorldPlazaPerformanceTesterStepResult[] = [
      {
        stepId: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.IDLE_BASELINE,
        label: 'Idle baseline',
        capturedAtMs: 1,
        framesPerSecond: 60,
        frameAverageMs: 16.6,
        framePercentile95Ms: 18,
        frameMaxMs: 24,
        slowFrameCount: 0,
        sampleAveragesMs: {
          terrainSync: 4.2,
          terrainFloorSync: null,
          terrainTrunkSync: null,
          collisionDebug: null,
        },
      },
    ];

    const report = formattingWorldPlazaPerformanceTesterReport(results);

    expect(report).toContain('idle-baseline');
    expect(report).toContain('60.0');
    expect(report).toContain('4.20');
    expect(report).toContain('-');
  });
});
