import { buildingWorldPlazaMobileDebugReport } from '@/components/world/domains/buildingWorldPlazaMobileDebugReport';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_LOW } from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import { listingWildlifeSpeciesTexturesCacheIds } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/definingAppVersion', () => ({
  DEFINING_APP_VERSION: 'test-0.0.0',
}));

vi.mock(
  '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures',
  () => ({
    listingWildlifeSpeciesTexturesCacheIds: vi.fn(() => ['cow', 'sheep']),
  })
);

vi.mock('@/components/world/domains/loggingWorldPlazaClientErrors', () => ({
  listingWorldPlazaClientDebugStatusLinesForReport: vi.fn(() => [
    'viewport-pixi: 390x844 pixi=ok',
  ]),
  listingWorldPlazaClientErrorEntriesForReport: vi.fn(() => []),
}));

vi.mock(
  '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics',
  () => ({
    checkingWorldPlazaPerformanceDiagnosticsIsEnabled: vi.fn(() => false),
    buildingWorldPlazaPerformanceDiagnosticsSnapshot: vi.fn(),
  })
);

describe('buildingWorldPlazaMobileDebugReport', () => {
  it('includes tier, device, wildlife, and status sections', () => {
    const report = buildingWorldPlazaMobileDebugReport({
      performanceProfile: DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_LOW,
      frameStats: {
        framesPerSecond: 58.2,
        frameAverageMs: 17.1,
        framePercentile95Ms: 22.4,
        frameMaxMs: 31.5,
        frameSampleCount: 120,
      },
      uptimeSec: 92,
      capturedAtMs: Date.parse('2026-07-09T20:00:00.000Z'),
    });

    expect(report).toContain('=== Reigncraft mobile debug report ===');
    expect(report).toContain('version: test-0.0.0');
    expect(report).toContain('uptime: 1m 32s');
    expect(report).toContain('tier: low');
    expect(report).toContain('frameSamples: 120');
    expect(report).toContain('fps: 58.2');
    expect(report).toContain('wildlifeSpecies: cow, sheep');
    expect(report).toContain('viewport-pixi: 390x844 pixi=ok');
    expect(report).toContain('=== end ===');
    expect(listingWildlifeSpeciesTexturesCacheIds).toHaveBeenCalled();
  });
});
