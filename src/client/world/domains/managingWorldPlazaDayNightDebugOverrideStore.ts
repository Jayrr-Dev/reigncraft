import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_CYCLE_PHASES,
  type DefiningWorldPlazaDayNightDebugPreset,
} from '@/components/world/domains/definingWorldPlazaDayNightDebugOverrideConstants';
import { formattingWorldPlazaDayNightClockTimeValue } from '@/components/world/domains/formattingWorldPlazaDayNightClockTimeValue';

/**
 * Module-level store for debug day/night cycle overrides.
 *
 * @module components/world/domains/managingWorldPlazaDayNightDebugOverrideStore
 */

export type DefiningWorldPlazaDayNightDebugOverrideSnapshot = {
  activePreset: DefiningWorldPlazaDayNightDebugPreset;
  clockTimeValue: string;
  revision: number;
};

const managingWorldPlazaDayNightDebugOverrideState: {
  activePreset: DefiningWorldPlazaDayNightDebugPreset;
  overrideCyclePhase: number | null;
  revision: number;
} = {
  activePreset: 'live',
  overrideCyclePhase: null,
  revision: 0,
};

const managingWorldPlazaDayNightDebugOverrideSubscribers = new Set<
  () => void
>();

/** Cached snapshot — `useSyncExternalStore` requires referential stability. */
let managingWorldPlazaDayNightDebugOverrideSnapshotCache: DefiningWorldPlazaDayNightDebugOverrideSnapshot =
  {
    activePreset: 'live',
    clockTimeValue: '12:00',
    revision: 0,
  };

/** Stable server snapshot for `useSyncExternalStore` hydration. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_OVERRIDE_SERVER_SNAPSHOT: DefiningWorldPlazaDayNightDebugOverrideSnapshot =
  {
    activePreset: 'live',
    clockTimeValue: '12:00',
    revision: 0,
  };

function notifyingWorldPlazaDayNightDebugOverrideSubscribers(): void {
  for (const subscriber of managingWorldPlazaDayNightDebugOverrideSubscribers) {
    subscriber();
  }
}

/**
 * Returns the active debug preset.
 */
export function gettingWorldPlazaDayNightDebugOverridePreset(): DefiningWorldPlazaDayNightDebugPreset {
  return managingWorldPlazaDayNightDebugOverrideState.activePreset;
}

/**
 * Returns the forced cycle phase, or null when the live clock is active.
 */
export function gettingWorldPlazaDayNightDebugOverrideCyclePhase():
  | number
  | null {
  return managingWorldPlazaDayNightDebugOverrideState.overrideCyclePhase;
}

/**
 * Returns a revision counter for React external-store subscriptions.
 */
export function gettingWorldPlazaDayNightDebugOverrideRevision(): number {
  return managingWorldPlazaDayNightDebugOverrideState.revision;
}

/**
 * Returns the current debug override snapshot for React `useSyncExternalStore`.
 *
 * Must return the same object reference until `revision` changes, otherwise
 * React enters an infinite re-render loop (error #185).
 */
export function gettingWorldPlazaDayNightDebugOverrideSnapshot(): DefiningWorldPlazaDayNightDebugOverrideSnapshot {
  if (
    managingWorldPlazaDayNightDebugOverrideSnapshotCache.revision ===
    managingWorldPlazaDayNightDebugOverrideState.revision
  ) {
    return managingWorldPlazaDayNightDebugOverrideSnapshotCache;
  }

  managingWorldPlazaDayNightDebugOverrideSnapshotCache = {
    activePreset: managingWorldPlazaDayNightDebugOverrideState.activePreset,
    clockTimeValue: formattingWorldPlazaDayNightClockTimeValue(),
    revision: managingWorldPlazaDayNightDebugOverrideState.revision,
  };

  return managingWorldPlazaDayNightDebugOverrideSnapshotCache;
}

/**
 * Subscribes to debug day/night override changes.
 *
 * @param onStoreChange - Called when the override preset changes.
 */
export function subscribingWorldPlazaDayNightDebugOverride(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaDayNightDebugOverrideSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaDayNightDebugOverrideSubscribers.delete(onStoreChange);
  };
}

/**
 * Applies one debug time-of-day preset.
 *
 * @param preset - Preset to activate (`live` resumes wall-clock time).
 */
export function settingWorldPlazaDayNightDebugOverridePreset(
  preset: DefiningWorldPlazaDayNightDebugPreset
): void {
  if (preset === 'live') {
    managingWorldPlazaDayNightDebugOverrideState.activePreset = 'live';
    managingWorldPlazaDayNightDebugOverrideState.overrideCyclePhase = null;
  } else if (preset === 'custom') {
    return;
  } else {
    managingWorldPlazaDayNightDebugOverrideState.activePreset = preset;
    managingWorldPlazaDayNightDebugOverrideState.overrideCyclePhase =
      DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_CYCLE_PHASES[preset];
  }

  managingWorldPlazaDayNightDebugOverrideState.revision += 1;
  notifyingWorldPlazaDayNightDebugOverrideSubscribers();
}

/**
 * Forces one explicit cycle phase for local lighting previews.
 *
 * @param cyclePhase - Cycle phase to sample (0 = midnight, 0.5 = noon).
 */
export function settingWorldPlazaDayNightDebugOverrideCyclePhase(
  cyclePhase: number
): void {
  const normalizedCyclePhase = ((cyclePhase % 1) + 1) % 1;

  managingWorldPlazaDayNightDebugOverrideState.activePreset = 'custom';
  managingWorldPlazaDayNightDebugOverrideState.overrideCyclePhase =
    normalizedCyclePhase;
  managingWorldPlazaDayNightDebugOverrideState.revision += 1;
  notifyingWorldPlazaDayNightDebugOverrideSubscribers();
}
