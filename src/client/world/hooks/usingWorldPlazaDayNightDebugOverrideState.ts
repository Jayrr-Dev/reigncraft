"use client";

import { applyingWorldPlazaDayNightDebugOverridePreset } from "@/components/world/domains/applyingWorldPlazaDayNightDebugOverridePreset";
import type { DefiningWorldPlazaDayNightDebugPreset } from "@/components/world/domains/definingWorldPlazaDayNightDebugOverrideConstants";
import {
  gettingWorldPlazaDayNightDebugOverridePreset,
  subscribingWorldPlazaDayNightDebugOverride,
} from "@/components/world/domains/managingWorldPlazaDayNightDebugOverrideStore";
import { useCallback, useSyncExternalStore } from "react";

export type UsingWorldPlazaDayNightDebugOverrideStateResult = {
  /** Active debug preset (`live` follows wall-clock time). */
  activePreset: DefiningWorldPlazaDayNightDebugPreset;
  /** Applies one debug time-of-day preset. */
  applyingDayNightDebugPreset: (
    preset: DefiningWorldPlazaDayNightDebugPreset,
  ) => void;
};

/**
 * Subscribes to the debug day/night override store.
 */
export function usingWorldPlazaDayNightDebugOverrideState(): UsingWorldPlazaDayNightDebugOverrideStateResult {
  const activePreset = useSyncExternalStore(
    subscribingWorldPlazaDayNightDebugOverride,
    gettingWorldPlazaDayNightDebugOverridePreset,
    () => "live" as const,
  );

  const applyingDayNightDebugPreset = useCallback(
    (preset: DefiningWorldPlazaDayNightDebugPreset): void => {
      applyingWorldPlazaDayNightDebugOverridePreset(preset);
    },
    [],
  );

  return {
    activePreset,
    applyingDayNightDebugPreset,
  };
}
