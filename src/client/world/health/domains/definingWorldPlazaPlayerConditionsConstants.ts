const DEFINING_WORLD_PLAZA_PLAYER_CONDITIONS_LOCAL_STORAGE_KEY_PREFIX =
  'reigncraft:world-plaza-player-conditions' as const;

/** Resolves the localStorage key for one persistence owner's illness state. */
export function resolvingWorldPlazaPlayerConditionsStorageKey(
  persistenceOwnerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_PLAYER_CONDITIONS_LOCAL_STORAGE_KEY_PREFIX}:${persistenceOwnerId}`;
}

/** Minimum interval between cloud saves for player conditions (ms). */
export const DEFINING_WORLD_PLAZA_PLAYER_CONDITIONS_CLOUD_SAVE_MIN_INTERVAL_MS =
  15_000 as const;

/** Poll interval while checking for illness state changes (ms). */
export const DEFINING_WORLD_PLAZA_PLAYER_CONDITIONS_POLL_INTERVAL_MS =
  2_000 as const;
