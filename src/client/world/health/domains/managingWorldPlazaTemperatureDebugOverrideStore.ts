/**
 * Module-level store for debug ambient temperature overrides.
 *
 * @module components/world/health/domains/managingWorldPlazaTemperatureDebugOverrideStore
 */

import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_AMBIENT_OFFSET_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_AMBIENT_OFFSET_MIN_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureDebugOverrideConstants';

export type DefiningWorldPlazaTemperatureDebugOverrideSnapshot = {
  ambientOffsetCelsius: number;
  /** 1 = live climate extremes; 0 = climate ambient pinned to midpoint. */
  climateSeverity: number;
  revision: number;
};

const managingWorldPlazaTemperatureDebugOverrideState: {
  ambientOffsetCelsius: number;
  climateSeverity: number;
  revision: number;
} = {
  ambientOffsetCelsius: 0,
  climateSeverity: 1,
  revision: 0,
};

const managingWorldPlazaTemperatureDebugOverrideSubscribers = new Set<
  () => void
>();

let managingWorldPlazaTemperatureDebugOverrideSnapshotCache: DefiningWorldPlazaTemperatureDebugOverrideSnapshot =
  {
    ambientOffsetCelsius: 0,
    climateSeverity: 1,
    revision: 0,
  };

export const DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_OVERRIDE_SERVER_SNAPSHOT: DefiningWorldPlazaTemperatureDebugOverrideSnapshot =
  {
    ambientOffsetCelsius: 0,
    climateSeverity: 1,
    revision: 0,
  };

function notifyingWorldPlazaTemperatureDebugOverrideSubscribers(): void {
  for (const subscriber of managingWorldPlazaTemperatureDebugOverrideSubscribers) {
    subscriber();
  }
}

function clampingWorldPlazaTemperatureDebugAmbientOffsetCelsius(
  offsetCelsius: number
): number {
  return Math.min(
    DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_AMBIENT_OFFSET_MAX_CELSIUS,
    Math.max(
      DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_AMBIENT_OFFSET_MIN_CELSIUS,
      offsetCelsius
    )
  );
}

function clampingWorldPlazaTemperatureDebugClimateSeverity(
  severity: number
): number {
  if (severity < 0) {
    return 0;
  }

  if (severity > 1) {
    return 1;
  }

  return severity;
}

function rebuildingWorldPlazaTemperatureDebugOverrideSnapshot(): DefiningWorldPlazaTemperatureDebugOverrideSnapshot {
  managingWorldPlazaTemperatureDebugOverrideSnapshotCache = {
    ambientOffsetCelsius:
      managingWorldPlazaTemperatureDebugOverrideState.ambientOffsetCelsius,
    climateSeverity:
      managingWorldPlazaTemperatureDebugOverrideState.climateSeverity,
    revision: managingWorldPlazaTemperatureDebugOverrideState.revision,
  };

  return managingWorldPlazaTemperatureDebugOverrideSnapshotCache;
}

export function gettingWorldPlazaTemperatureDebugAmbientOffsetCelsius(): number {
  return managingWorldPlazaTemperatureDebugOverrideState.ambientOffsetCelsius;
}

export function gettingWorldPlazaTemperatureDebugClimateSeverity(): number {
  return managingWorldPlazaTemperatureDebugOverrideState.climateSeverity;
}

/** Monotonic revision for terrain/water invalidation when debug climate changes. */
export function gettingWorldPlazaTemperatureDebugOverrideRevision(): number {
  return managingWorldPlazaTemperatureDebugOverrideState.revision;
}

export function gettingWorldPlazaTemperatureDebugOverrideSnapshot(): DefiningWorldPlazaTemperatureDebugOverrideSnapshot {
  if (
    managingWorldPlazaTemperatureDebugOverrideSnapshotCache.revision ===
    managingWorldPlazaTemperatureDebugOverrideState.revision
  ) {
    return managingWorldPlazaTemperatureDebugOverrideSnapshotCache;
  }

  return rebuildingWorldPlazaTemperatureDebugOverrideSnapshot();
}

export function subscribingWorldPlazaTemperatureDebugOverride(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaTemperatureDebugOverrideSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaTemperatureDebugOverrideSubscribers.delete(onStoreChange);
  };
}

export function settingWorldPlazaTemperatureDebugAmbientOffsetCelsius(
  offsetCelsius: number
): void {
  const next = clampingWorldPlazaTemperatureDebugAmbientOffsetCelsius(
    offsetCelsius
  );

  if (
    next ===
    managingWorldPlazaTemperatureDebugOverrideState.ambientOffsetCelsius
  ) {
    return;
  }

  managingWorldPlazaTemperatureDebugOverrideState.ambientOffsetCelsius = next;
  managingWorldPlazaTemperatureDebugOverrideState.revision += 1;
  notifyingWorldPlazaTemperatureDebugOverrideSubscribers();
}

export function settingWorldPlazaTemperatureDebugClimateSeverity(
  severity: number
): void {
  const next = clampingWorldPlazaTemperatureDebugClimateSeverity(severity);

  if (next === managingWorldPlazaTemperatureDebugOverrideState.climateSeverity) {
    return;
  }

  managingWorldPlazaTemperatureDebugOverrideState.climateSeverity = next;
  managingWorldPlazaTemperatureDebugOverrideState.revision += 1;
  notifyingWorldPlazaTemperatureDebugOverrideSubscribers();
}

export function resettingWorldPlazaTemperatureDebugOverride(): void {
  if (
    managingWorldPlazaTemperatureDebugOverrideState.ambientOffsetCelsius ===
      0 &&
    managingWorldPlazaTemperatureDebugOverrideState.climateSeverity === 1
  ) {
    return;
  }

  managingWorldPlazaTemperatureDebugOverrideState.ambientOffsetCelsius = 0;
  managingWorldPlazaTemperatureDebugOverrideState.climateSeverity = 1;
  managingWorldPlazaTemperatureDebugOverrideState.revision += 1;
  notifyingWorldPlazaTemperatureDebugOverrideSubscribers();
}
