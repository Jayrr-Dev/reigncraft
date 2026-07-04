"use client";

import {
  computingWorldPlazaDayNightSunState,
  type ComputingWorldPlazaDayNightSunState,
} from "@/components/world/domains/computingWorldPlazaDayNightSunState";
import { DEFINING_WORLD_PLAZA_DAY_NIGHT_SUN_STATE_POLL_INTERVAL_MS } from "@/components/world/domains/definingWorldPlazaDayNightCycleConstants";
import {
  gettingWorldPlazaDayNightDebugOverrideRevision,
  subscribingWorldPlazaDayNightDebugOverride,
} from "@/components/world/domains/managingWorldPlazaDayNightDebugOverrideStore";
import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Subscribes a React component to the shared day/night sun state.
 *
 * Re-renders only when the quantized sun bucket advances, so consumers can
 * safely key redraws off the returned object identity.
 *
 * @module components/world/hooks/usingWorldPlazaDayNightSunState
 */
export function usingWorldPlazaDayNightSunState(): ComputingWorldPlazaDayNightSunState {
  const debugOverrideRevision = useSyncExternalStore(
    subscribingWorldPlazaDayNightDebugOverride,
    gettingWorldPlazaDayNightDebugOverrideRevision,
    () => 0,
  );
  const [sunState, setSunState] = useState<ComputingWorldPlazaDayNightSunState>(
    () => computingWorldPlazaDayNightSunState(),
  );

  useEffect(() => {
    const pollingSunState = (): void => {
      // Bucket caching keeps identity stable, so this is a no-op re-render
      // until the sun visibly moves.
      setSunState(computingWorldPlazaDayNightSunState());
    };

    pollingSunState();
    const intervalId = window.setInterval(
      pollingSunState,
      DEFINING_WORLD_PLAZA_DAY_NIGHT_SUN_STATE_POLL_INTERVAL_MS,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [debugOverrideRevision]);

  return sunState;
}
