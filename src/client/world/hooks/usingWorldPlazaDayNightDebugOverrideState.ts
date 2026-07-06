'use client';

import { applyingWorldPlazaDayNightDebugOverrideCyclePhase } from '@/components/world/domains/applyingWorldPlazaDayNightDebugOverrideCyclePhase';
import { applyingWorldPlazaDayNightDebugOverridePreset } from '@/components/world/domains/applyingWorldPlazaDayNightDebugOverridePreset';
import type { DefiningWorldPlazaDayNightDebugPreset } from '@/components/world/domains/definingWorldPlazaDayNightDebugOverrideConstants';
import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_OVERRIDE_SERVER_SNAPSHOT,
  gettingWorldPlazaDayNightDebugOverrideSnapshot,
  subscribingWorldPlazaDayNightDebugOverride,
} from '@/components/world/domains/managingWorldPlazaDayNightDebugOverrideStore';
import { useCallback, useSyncExternalStore } from 'react';

export type UsingWorldPlazaDayNightDebugOverrideStateResult = {
  /** Active debug preset (`live` follows wall-clock time). */
  activePreset: DefiningWorldPlazaDayNightDebugPreset;
  /** True when the shared wall-clock cycle is active. */
  isLive: boolean;
  /** Current `HH:MM` value for the clock picker. */
  clockTimeValue: string;
  /** Applies one debug time-of-day preset. */
  applyingDayNightDebugPreset: (
    preset: DefiningWorldPlazaDayNightDebugPreset
  ) => void;
  /** Forces one explicit cycle phase from the clock picker. */
  applyingDayNightDebugCyclePhase: (cyclePhase: number) => void;
};

/**
 * Subscribes to the debug day/night override store.
 */
export function usingWorldPlazaDayNightDebugOverrideState(): UsingWorldPlazaDayNightDebugOverrideStateResult {
  const snapshot = useSyncExternalStore(
    subscribingWorldPlazaDayNightDebugOverride,
    gettingWorldPlazaDayNightDebugOverrideSnapshot,
    () => DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_OVERRIDE_SERVER_SNAPSHOT
  );

  const applyingDayNightDebugPreset = useCallback(
    (preset: DefiningWorldPlazaDayNightDebugPreset): void => {
      applyingWorldPlazaDayNightDebugOverridePreset(preset);
    },
    []
  );

  const applyingDayNightDebugCyclePhase = useCallback(
    (cyclePhase: number): void => {
      applyingWorldPlazaDayNightDebugOverrideCyclePhase(cyclePhase);
    },
    []
  );

  return {
    activePreset: snapshot.activePreset,
    isLive: snapshot.activePreset === 'live',
    clockTimeValue: snapshot.clockTimeValue,
    applyingDayNightDebugPreset,
    applyingDayNightDebugCyclePhase,
  };
}
