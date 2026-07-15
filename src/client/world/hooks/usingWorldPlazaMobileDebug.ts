'use client';

/**
 * Mobile debug sampler, HUD state, and console API wiring.
 *
 * @module components/world/hooks/usingWorldPlazaMobileDebug
 */

import {
  checkingWorldPlazaMobileDebugFeatureIsAvailable,
  resolvingWorldPlazaMobileDebugHudInitiallyOpen,
  settingWorldPlazaMobileDebugHudOpen,
} from '@/components/world/domains/checkingWorldPlazaMobileDebug';
import { copyingWorldPlazaMobileDebugReport } from '@/components/world/domains/copyingWorldPlazaMobileDebugReport';
import type { DefiningWorldPlazaPerformanceProfile } from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import { settingWorldPlazaClientDebugStatus } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import {
  computingWorldPlazaMobileDebugUptimeSec,
  creatingWorldPlazaMobileDebugSampler,
  markingWorldPlazaMobileDebugFrame,
  type ManagingWorldPlazaMobileDebugFrameStats,
} from '@/components/world/domains/managingWorldPlazaMobileDebugSampler';
import {
  checkingWorldPlazaMobileDebugIsActive,
  registeringWorldPlazaMobileDebugConsoleApi,
  subscribingWorldPlazaMobileDebugConsoleApiHandlers,
  updatingWorldPlazaMobileDebugConsoleApiContext,
} from '@/components/world/domains/registeringWorldPlazaMobileDebugConsoleApi';
import { listingWildlifeSpeciesTexturesCacheIds } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UsingWorldPlazaMobileDebugResult = {
  readonly isMobileDebugActive: boolean;
  readonly isMobileDebugHudVisible: boolean;
  readonly frameStatsRef: RefObject<ManagingWorldPlazaMobileDebugFrameStats | null>;
  readonly uptimeSecRef: RefObject<number>;
  readonly hidingMobileDebugHud: () => void;
  readonly copyingMobileDebugReport: () => Promise<string>;
};

function publishingWorldPlazaMobileDebugStatusLines(params: {
  readonly performanceProfile: DefiningWorldPlazaPerformanceProfile;
  readonly frameStats: ManagingWorldPlazaMobileDebugFrameStats | null;
  readonly uptimeSec: number;
}): void {
  const { performanceProfile, frameStats, uptimeSec } = params;

  settingWorldPlazaClientDebugStatus(
    'mobile-debug-tier',
    `tier ${performanceProfile.tier} · trees ${performanceProfile.maxVisibleTrees} · elev ${performanceProfile.maxVisibleElevationColumns}`
  );

  if (frameStats) {
    settingWorldPlazaClientDebugStatus(
      'mobile-debug-fps',
      `fps ${frameStats.framesPerSecond.toFixed(0)} · p95 ${frameStats.framePercentile95Ms.toFixed(0)}ms · up ${uptimeSec}s`
    );
  }

  const speciesIds = listingWildlifeSpeciesTexturesCacheIds();
  settingWorldPlazaClientDebugStatus(
    'mobile-debug-wildlife',
    `wildlife tex ${speciesIds.length}${speciesIds.length > 0 ? ` (${speciesIds.slice(0, 4).join(', ')}${speciesIds.length > 4 ? ', …' : ''})` : ''}`
  );

  if (typeof performance !== 'undefined') {
    const memory = (
      performance as Performance & {
        memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
      }
    ).memory;

    if (memory) {
      const usedMb = Math.round(memory.usedJSHeapSize / (1024 * 1024));
      const limitMb = Math.round(memory.jsHeapSizeLimit / (1024 * 1024));
      settingWorldPlazaClientDebugStatus(
        'mobile-debug-memory',
        `heap ${usedMb}/${limitMb} MB`
      );
    }
  }
}

/**
 * Runs the mobile debug sampler and exposes copy/hide helpers.
 *
 * Frame stats stay in refs so the sampler never re-renders the plaza tree.
 */
export function usingWorldPlazaMobileDebug(
  performanceProfile: DefiningWorldPlazaPerformanceProfile
): UsingWorldPlazaMobileDebugResult {
  const [isMobileDebugActive, setIsMobileDebugActive] = useState(
    checkingWorldPlazaMobileDebugFeatureIsAvailable
  );
  const [isMobileDebugHudVisible, setIsMobileDebugHudVisible] = useState(
    resolvingWorldPlazaMobileDebugHudInitiallyOpen
  );
  const frameStatsRef = useRef<ManagingWorldPlazaMobileDebugFrameStats | null>(
    null
  );
  const uptimeSecRef = useRef(0);

  const hidingMobileDebugHud = useCallback((): void => {
    setIsMobileDebugHudVisible(false);
    settingWorldPlazaMobileDebugHudOpen(false);
  }, []);

  const copyingMobileDebugReport = useCallback(async (): Promise<string> => {
    return copyingWorldPlazaMobileDebugReport({
      performanceProfile,
      frameStats: frameStatsRef.current,
      uptimeSec: uptimeSecRef.current,
    });
  }, [performanceProfile]);

  useEffect(() => {
    registeringWorldPlazaMobileDebugConsoleApi();

    return subscribingWorldPlazaMobileDebugConsoleApiHandlers({
      onEnabledChange: (isEnabled) => {
        setIsMobileDebugActive(isEnabled);
      },
      onHudVisibleChange: (isHudVisible) => {
        setIsMobileDebugHudVisible(isHudVisible);
        settingWorldPlazaMobileDebugHudOpen(isHudVisible);
      },
    });
  }, []);

  useEffect(() => {
    const sampler = creatingWorldPlazaMobileDebugSampler(performance.now());
    let rafId = 0;
    let statusTimeoutId = 0;

    const isSamplerActive = (): boolean =>
      checkingWorldPlazaMobileDebugIsActive() ||
      isMobileDebugActive ||
      isMobileDebugHudVisible;

    const publishingStatus = (): void => {
      if (isSamplerActive()) {
        publishingWorldPlazaMobileDebugStatusLines({
          performanceProfile,
          frameStats: frameStatsRef.current,
          uptimeSec: uptimeSecRef.current,
        });
      }

      updatingWorldPlazaMobileDebugConsoleApiContext({
        performanceProfile,
        frameStats: frameStatsRef.current,
        uptimeSec: uptimeSecRef.current,
      });
      statusTimeoutId = window.setTimeout(publishingStatus, 500);
    };

    const tick = (nowMs: number): void => {
      if (
        typeof document !== 'undefined' &&
        document.visibilityState !== 'visible'
      ) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (isSamplerActive()) {
        const nextFrameStats = markingWorldPlazaMobileDebugFrame(
          sampler,
          nowMs
        );
        frameStatsRef.current = nextFrameStats;
        uptimeSecRef.current = computingWorldPlazaMobileDebugUptimeSec(
          sampler,
          nowMs
        );
      }

      rafId = requestAnimationFrame(tick);
    };

    publishingStatus();
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(statusTimeoutId);
    };
  }, [isMobileDebugActive, isMobileDebugHudVisible, performanceProfile]);

  return {
    isMobileDebugActive:
      isMobileDebugActive || checkingWorldPlazaMobileDebugIsActive(),
    isMobileDebugHudVisible,
    frameStatsRef,
    uptimeSecRef,
    hidingMobileDebugHud,
    copyingMobileDebugReport,
  };
}
