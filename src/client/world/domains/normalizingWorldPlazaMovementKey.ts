import {
  DEFINING_WORLD_PLAZA_SANDBOX_ARROW_KEYS,
  DEFINING_WORLD_PLAZA_SANDBOX_WASD_KEYS,
  type DefiningWorldPlazaSandboxMovementKey,
} from "@/components/world/domains/definingWorldPlazaSandboxConstants";

/**
 * Normalizes a keyboard event key into a plaza movement key, if supported.
 *
 * @param key - {@link KeyboardEvent.key} value.
 */
export function normalizingWorldPlazaMovementKey(
  key: string,
): DefiningWorldPlazaSandboxMovementKey | null {
  if (
    DEFINING_WORLD_PLAZA_SANDBOX_ARROW_KEYS.includes(
      key as (typeof DEFINING_WORLD_PLAZA_SANDBOX_ARROW_KEYS)[number],
    )
  ) {
    return key as DefiningWorldPlazaSandboxMovementKey;
  }

  const lowerKey = key.toLowerCase();

  if (
    DEFINING_WORLD_PLAZA_SANDBOX_WASD_KEYS.includes(
      lowerKey as (typeof DEFINING_WORLD_PLAZA_SANDBOX_WASD_KEYS)[number],
    )
  ) {
    return lowerKey as DefiningWorldPlazaSandboxMovementKey;
  }

  return null;
}

/**
 * Returns true when the key is used for plaza movement (arrows or WASD).
 *
 * @param key - {@link KeyboardEvent.key} value.
 */
export function checkingIsWorldPlazaMovementKey(key: string): boolean {
  return normalizingWorldPlazaMovementKey(key) !== null;
}
