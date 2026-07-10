/**
 * Plain-text mobile debug report for copy/paste into bug reports.
 *
 * @module components/world/domains/buildingWorldPlazaMobileDebugReport
 */

import {
  DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_DESKTOP,
  DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_MOBILE,
} from '@/components/world/domains/definingWorldPlazaMinimapPreferenceConstants';
import type { DefiningWorldPlazaPerformanceProfile } from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import { DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaViewportProfileConstants';
import {
  listingWorldPlazaClientDebugStatusLinesForReport,
  listingWorldPlazaClientErrorEntriesForReport,
} from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { gettingWorldPlazaMinimapPreference } from '@/components/world/domains/managingWorldPlazaMinimapPreferenceStore';
import type { ManagingWorldPlazaMobileDebugFrameStats } from '@/components/world/domains/managingWorldPlazaMobileDebugSampler';
import {
  buildingWorldPlazaPerformanceDiagnosticsSnapshot,
  checkingWorldPlazaPerformanceDiagnosticsIsEnabled,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { listingWildlifeSpeciesTexturesCacheIds } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import { DEFINING_APP_VERSION } from '@/lib/definingAppVersion';

export type BuildingWorldPlazaMobileDebugReportParams = {
  readonly performanceProfile: DefiningWorldPlazaPerformanceProfile;
  readonly frameStats: ManagingWorldPlazaMobileDebugFrameStats | null;
  readonly uptimeSec: number;
  readonly capturedAtMs?: number;
};

type BuildingWorldPlazaMobileDebugMemorySnapshot = {
  readonly usedMb: number;
  readonly limitMb: number;
  readonly totalMb: number;
};

function formattingWorldPlazaMobileDebugUptime(uptimeSec: number): string {
  const minutes = Math.floor(uptimeSec / 60);
  const seconds = uptimeSec % 60;

  if (minutes <= 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

function resolvingWorldPlazaMobileDebugMemorySnapshot(): BuildingWorldPlazaMobileDebugMemorySnapshot | null {
  if (typeof performance === 'undefined') {
    return null;
  }

  const memory = (
    performance as Performance & {
      memory?: {
        usedJSHeapSize: number;
        jsHeapSizeLimit: number;
        totalJSHeapSize: number;
      };
    }
  ).memory;

  if (!memory) {
    return null;
  }

  const toMb = (bytes: number): number =>
    Math.round((bytes / (1024 * 1024)) * 10) / 10;

  return {
    usedMb: toMb(memory.usedJSHeapSize),
    limitMb: toMb(memory.jsHeapSizeLimit),
    totalMb: toMb(memory.totalJSHeapSize),
  };
}

function resolvingWorldPlazaMobileDebugDeviceLines(): readonly string[] {
  if (typeof window === 'undefined') {
    return ['(server)'];
  }

  const viewportWidthPx = window.innerWidth;
  const viewportHeightPx = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio;
  const hasCoarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;
  const isMobileViewport =
    viewportWidthPx <= DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX;

  return [
    `viewport: ${viewportWidthPx}x${viewportHeightPx} @${devicePixelRatio}x`,
    `mobileViewport: ${isMobileViewport ? 'yes' : 'no'}`,
    `pointer: ${hasCoarsePointer ? 'coarse' : 'fine'}`,
    `visibility: ${document.visibilityState}`,
    `onLine: ${navigator.onLine ? 'yes' : 'no'}`,
    `userAgent: ${navigator.userAgent}`,
  ];
}

function resolvingWorldPlazaMobileDebugPerformanceLines(
  params: BuildingWorldPlazaMobileDebugReportParams
): readonly string[] {
  const { performanceProfile, frameStats } = params;
  const isMobileViewport =
    typeof window !== 'undefined' &&
    window.innerWidth <= DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX;
  const minimapPreference = gettingWorldPlazaMinimapPreference();
  const minimapEnabledForViewport =
    minimapPreference !== null
      ? minimapPreference
      : performanceProfile.isMinimapEnabled &&
        (isMobileViewport
          ? DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_MOBILE
          : DEFINING_WORLD_PLAZA_MINIMAP_DEFAULT_ENABLED_ON_DESKTOP);
  const lines = [
    `tier: ${performanceProfile.tier}`,
    `renderResolutionMax: ${performanceProfile.renderResolutionMax}`,
    `maxVisibleTrees: ${performanceProfile.maxVisibleTrees}`,
    `minimapTierAllowed: ${performanceProfile.isMinimapEnabled ? 'yes' : 'no'}`,
    `minimapPreference: ${
      minimapPreference === null ? 'default' : minimapPreference ? 'on' : 'off'
    }`,
    `minimapVisible: ${minimapEnabledForViewport ? 'yes' : 'no'}`,
    `lightingLightmapRtt: ${
      performanceProfile.lightingUsesLightmapRtt ? 'yes' : 'no'
    }`,
    `floorChunkPrefetchTiles: ${performanceProfile.floorChunkPrefetchTiles}`,
    `wildlifeTextures: ${listingWildlifeSpeciesTexturesCacheIds().length}`,
  ];

  if (checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    const snapshot = buildingWorldPlazaPerformanceDiagnosticsSnapshot();
    lines.push(
      `fps(diag): ${snapshot.framesPerSecond.toFixed(1)}`,
      `frameP95(diag): ${snapshot.framePercentile95Ms.toFixed(1)}ms`,
      `slowFrames(diag): ${snapshot.slowFrameCount}`
    );

    const gaugeLines = Object.entries(snapshot.gauges).map(
      ([gaugeId, gaugeValue]) => `${gaugeId}: ${gaugeValue}`
    );

    if (gaugeLines.length > 0) {
      lines.push(...gaugeLines);
    }

    const counterLines = Object.entries(snapshot.countersPerSecond).map(
      ([counterId, counterRate]) => `${counterId}: ${counterRate.toFixed(2)}/s`
    );

    if (counterLines.length > 0) {
      lines.push(...counterLines);
    }

    return lines;
  }

  if (frameStats) {
    lines.push(
      `fps: ${frameStats.framesPerSecond.toFixed(1)}`,
      `frameAvg: ${frameStats.frameAverageMs.toFixed(1)}ms`,
      `frameP95: ${frameStats.framePercentile95Ms.toFixed(1)}ms`,
      `frameMax: ${frameStats.frameMaxMs.toFixed(1)}ms`
    );
  }

  const memory = resolvingWorldPlazaMobileDebugMemorySnapshot();

  if (memory) {
    lines.push(
      `jsHeapUsedMb: ${memory.usedMb}`,
      `jsHeapTotalMb: ${memory.totalMb}`,
      `jsHeapLimitMb: ${memory.limitMb}`
    );
  }

  return lines;
}

function resolvingWorldPlazaMobileDebugWildlifeLines(): readonly string[] {
  const speciesIds = listingWildlifeSpeciesTexturesCacheIds();

  if (speciesIds.length === 0) {
    return ['wildlifeTextures: 0'];
  }

  return [
    `wildlifeTextures: ${speciesIds.length}`,
    `wildlifeSpecies: ${speciesIds.join(', ')}`,
  ];
}

function joiningWorldPlazaMobileDebugSection(
  title: string,
  lines: readonly string[]
): string {
  if (lines.length === 0) {
    return `--- ${title} ---\n(none)`;
  }

  return `--- ${title} ---\n${lines.join('\n')}`;
}

/**
 * Builds a plain-text debug report for clipboard export.
 */
export function buildingWorldPlazaMobileDebugReport(
  params: BuildingWorldPlazaMobileDebugReportParams
): string {
  const capturedAtMs = params.capturedAtMs ?? Date.now();
  const statusLines = listingWorldPlazaClientDebugStatusLinesForReport();
  const errorEntries = listingWorldPlazaClientErrorEntriesForReport();
  const errorLines =
    errorEntries.length === 0
      ? ['(none)']
      : errorEntries.map(
          (entry) =>
            `${new Date(entry.capturedAtMs).toISOString()} ${entry.message}`
        );

  const headerLines = [
    '=== Reigncraft mobile debug report ===',
    `captured: ${new Date(capturedAtMs).toISOString()}`,
    `uptime: ${formattingWorldPlazaMobileDebugUptime(params.uptimeSec)}`,
    `version: ${DEFINING_APP_VERSION}`,
    `url: ${typeof window !== 'undefined' ? window.location.href : '(unknown)'}`,
  ];

  return [
    ...headerLines,
    joiningWorldPlazaMobileDebugSection(
      'device',
      resolvingWorldPlazaMobileDebugDeviceLines()
    ),
    joiningWorldPlazaMobileDebugSection(
      'performance',
      resolvingWorldPlazaMobileDebugPerformanceLines(params)
    ),
    joiningWorldPlazaMobileDebugSection(
      'wildlife',
      resolvingWorldPlazaMobileDebugWildlifeLines()
    ),
    joiningWorldPlazaMobileDebugSection('status', statusLines),
    joiningWorldPlazaMobileDebugSection('errors', errorLines),
    '=== end ===',
  ].join('\n\n');
}
