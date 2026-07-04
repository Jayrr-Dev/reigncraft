import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_CYCLE_PHASES,
  type DefiningWorldPlazaDayNightDebugPreset,
} from "@/components/world/domains/definingWorldPlazaDayNightDebugOverrideConstants";

/**
 * Module-level store for debug day/night cycle overrides.
 *
 * @module components/world/domains/managingWorldPlazaDayNightDebugOverrideStore
 */

const managingWorldPlazaDayNightDebugOverrideState: {
  activePreset: DefiningWorldPlazaDayNightDebugPreset;
  overrideCyclePhase: number | null;
  revision: number;
} = {
  activePreset: "live",
  overrideCyclePhase: null,
  revision: 0,
};

const managingWorldPlazaDayNightDebugOverrideSubscribers = new Set<() => void>();

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
export function gettingWorldPlazaDayNightDebugOverrideCyclePhase(): number | null {
  return managingWorldPlazaDayNightDebugOverrideState.overrideCyclePhase;
}

/**
 * Returns a revision counter for React external-store subscriptions.
 */
export function gettingWorldPlazaDayNightDebugOverrideRevision(): number {
  return managingWorldPlazaDayNightDebugOverrideState.revision;
}

/**
 * Subscribes to debug day/night override changes.
 *
 * @param onStoreChange - Called when the override preset changes.
 */
export function subscribingWorldPlazaDayNightDebugOverride(
  onStoreChange: () => void,
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
  preset: DefiningWorldPlazaDayNightDebugPreset,
): void {
  if (preset === "live") {
    managingWorldPlazaDayNightDebugOverrideState.activePreset = "live";
    managingWorldPlazaDayNightDebugOverrideState.overrideCyclePhase = null;
  } else {
    managingWorldPlazaDayNightDebugOverrideState.activePreset = preset;
    managingWorldPlazaDayNightDebugOverrideState.overrideCyclePhase =
      DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_CYCLE_PHASES[preset];
  }

  managingWorldPlazaDayNightDebugOverrideState.revision += 1;
  notifyingWorldPlazaDayNightDebugOverrideSubscribers();
}
