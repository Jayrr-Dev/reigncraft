/**
 * Lightweight FPS sampler for mobile debug when full perf diagnostics are off.
 *
 * @module components/world/domains/managingWorldPlazaMobileDebugSampler
 */

import { DEFINING_WORLD_PLAZA_MOBILE_DEBUG_FRAME_HISTORY_SIZE } from '@/components/world/domains/definingWorldPlazaMobileDebugConstants';

export type ManagingWorldPlazaMobileDebugFrameStats = {
  readonly framesPerSecond: number;
  readonly frameAverageMs: number;
  readonly framePercentile95Ms: number;
  readonly frameMaxMs: number;
  /** Rolling window size used for fps / p95. */
  readonly frameSampleCount: number;
};

export type ManagingWorldPlazaMobileDebugSampler = {
  readonly startedAtMs: number;
  frameDurationsMs: number[];
  lastFrameAtMs: number;
  /** Skips the first rAF delta (mount-to-first-frame gap is not a real frame). */
  hasPrimedFrame: boolean;
};

/**
 * Creates a mobile debug frame sampler.
 */
export function creatingWorldPlazaMobileDebugSampler(
  nowMs: number
): ManagingWorldPlazaMobileDebugSampler {
  return {
    startedAtMs: nowMs,
    frameDurationsMs: [],
    lastFrameAtMs: nowMs,
    hasPrimedFrame: false,
  };
}

function computingWorldPlazaMobileDebugPercentileMs(
  values: readonly number[],
  percentile: number
): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const rankIndex = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((percentile / 100) * sorted.length) - 1)
  );

  return sorted[rankIndex] ?? 0;
}

function resolvingWorldPlazaMobileDebugEmptyFrameStats(): ManagingWorldPlazaMobileDebugFrameStats {
  return {
    framesPerSecond: 0,
    frameAverageMs: 0,
    framePercentile95Ms: 0,
    frameMaxMs: 0,
    frameSampleCount: 0,
  };
}

/**
 * Records one animation frame delta and returns rolling stats.
 */
export function markingWorldPlazaMobileDebugFrame(
  sampler: ManagingWorldPlazaMobileDebugSampler,
  nowMs: number
): ManagingWorldPlazaMobileDebugFrameStats {
  const frameDeltaMs = Math.max(0, nowMs - sampler.lastFrameAtMs);
  sampler.lastFrameAtMs = nowMs;

  if (!sampler.hasPrimedFrame) {
    sampler.hasPrimedFrame = true;
    return resolvingWorldPlazaMobileDebugEmptyFrameStats();
  }

  sampler.frameDurationsMs.push(frameDeltaMs);

  if (
    sampler.frameDurationsMs.length >
    DEFINING_WORLD_PLAZA_MOBILE_DEBUG_FRAME_HISTORY_SIZE
  ) {
    sampler.frameDurationsMs.shift();
  }

  const samples = sampler.frameDurationsMs;
  const frameAverageMs =
    samples.reduce((total, value) => total + value, 0) / samples.length;

  return {
    framesPerSecond: frameAverageMs > 0 ? 1000 / frameAverageMs : 0,
    frameAverageMs,
    framePercentile95Ms: computingWorldPlazaMobileDebugPercentileMs(
      samples,
      95
    ),
    frameMaxMs: Math.max(...samples),
    frameSampleCount: samples.length,
  };
}

/**
 * Session uptime in whole seconds since the sampler started.
 */
export function computingWorldPlazaMobileDebugUptimeSec(
  sampler: ManagingWorldPlazaMobileDebugSampler,
  nowMs: number
): number {
  return Math.max(0, Math.floor((nowMs - sampler.startedAtMs) / 1000));
}
