/**
 * Module-level store for avatar transform cooldown.
 *
 * @module components/world/domains/managingWorldPlazaAvatarTransformCooldownStore
 */

import { DEFINING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_MS } from '@/components/world/domains/definingWorldPlazaAvatarTransformConstants';
import { readingWorldPlazaAvatarTransformCooldownFromStorage } from '@/components/world/domains/readingWorldPlazaAvatarTransformCooldownFromStorage';
import { writingWorldPlazaAvatarTransformCooldownToStorage } from '@/components/world/domains/writingWorldPlazaAvatarTransformCooldownToStorage';

const managingWorldPlazaAvatarTransformCooldownSubscribers = new Set<
  () => void
>();

let managingWorldPlazaAvatarTransformCooldownStorageOwnerId: string | null =
  null;
let managingWorldPlazaAvatarTransformCooldownReadyAtMs = 0;

function notifyingWorldPlazaAvatarTransformCooldownSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaAvatarTransformCooldownSubscribers) {
    onStoreChange();
  }
}

function persistingWorldPlazaAvatarTransformCooldown(): void {
  writingWorldPlazaAvatarTransformCooldownToStorage(
    managingWorldPlazaAvatarTransformCooldownStorageOwnerId,
    managingWorldPlazaAvatarTransformCooldownReadyAtMs
  );
}

/**
 * Hydrates transform cooldown from localStorage for one session owner.
 */
export function initializingWorldPlazaAvatarTransformCooldownStore(
  storageOwnerId: string | null
): void {
  if (managingWorldPlazaAvatarTransformCooldownStorageOwnerId === storageOwnerId) {
    return;
  }

  managingWorldPlazaAvatarTransformCooldownStorageOwnerId = storageOwnerId;
  managingWorldPlazaAvatarTransformCooldownReadyAtMs =
    readingWorldPlazaAvatarTransformCooldownFromStorage(storageOwnerId);
  notifyingWorldPlazaAvatarTransformCooldownSubscribers();
}

/** Wall-clock ms when transform is next allowed (0 when unlocked). */
export function gettingWorldPlazaAvatarTransformCooldownReadyAtMs(): number {
  return managingWorldPlazaAvatarTransformCooldownReadyAtMs;
}

/** True when another transform is still locked. */
export function checkingWorldPlazaAvatarTransformIsOnCooldown(
  nowMs: number = Date.now()
): boolean {
  return nowMs < managingWorldPlazaAvatarTransformCooldownReadyAtMs;
}

/**
 * Starts a fresh 1-day transform lock from `nowMs`.
 */
export function startingWorldPlazaAvatarTransformCooldown(
  nowMs: number = Date.now()
): void {
  managingWorldPlazaAvatarTransformCooldownReadyAtMs =
    nowMs + DEFINING_WORLD_PLAZA_AVATAR_TRANSFORM_COOLDOWN_MS;
  persistingWorldPlazaAvatarTransformCooldown();
  notifyingWorldPlazaAvatarTransformCooldownSubscribers();
}

export function subscribingWorldPlazaAvatarTransformCooldown(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaAvatarTransformCooldownSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaAvatarTransformCooldownSubscribers.delete(onStoreChange);
  };
}

/** Test-only reset helper. */
export function resettingWorldPlazaAvatarTransformCooldownStoreForTests(): void {
  managingWorldPlazaAvatarTransformCooldownStorageOwnerId = null;
  managingWorldPlazaAvatarTransformCooldownReadyAtMs = 0;
  notifyingWorldPlazaAvatarTransformCooldownSubscribers();
}
