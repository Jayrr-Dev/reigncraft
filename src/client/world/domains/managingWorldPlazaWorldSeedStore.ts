/**
 * Module-level store for the procedural plaza world generation seed.
 *
 * LocalStorage is the hot cache. Signed-in single-player mirrors the seed into
 * the Devvit Redis save slot on ordinary save writes.
 *
 * @module components/world/domains/managingWorldPlazaWorldSeedStore
 */

import { readingWorldPlazaLastPositionFromStorage } from '@/components/world/domains/readingWorldPlazaLastPositionFromStorage';
import { readingWorldPlazaWorldSeedFromStorage } from '@/components/world/domains/readingWorldPlazaWorldSeedFromStorage';
import { writingWorldPlazaWorldSeedToStorage } from '@/components/world/domains/writingWorldPlazaWorldSeedToStorage';
import { invalidatingWorldPlazaProceduralGenerationCaches } from '@/components/world/domains/invalidatingWorldPlazaProceduralGenerationCaches';
import type { PlazaSaveSlotIndex } from '../../../shared/plazaGameSession';
import {
  gettingWorldGenerationSeed,
  mintingWorldGenerationSeed,
  settingWorldGenerationSeed,
} from '../../../shared/worldGenerationSeed';

let managingWorldPlazaWorldSeedStorageOwnerId: string | null = null;
let managingWorldPlazaWorldSeedCloudSaveSlotIndex: PlazaSaveSlotIndex | null =
  null;
let managingWorldPlazaWorldSeedValue = 0;

export type InitializingWorldPlazaWorldSeedStoreOptions = {
  cloudSaveSlotIndex?: PlazaSaveSlotIndex | null;
  /**
   * When true, always use seed `0` (shared online rooms / fixed layouts).
   * When false, mint a new seed for empty single-player slots.
   */
  useFixedLegacySeed?: boolean;
};

/**
 * Returns the active world generation seed for the current session.
 */
export function gettingWorldPlazaWorldSeed(): number {
  return managingWorldPlazaWorldSeedValue;
}

/**
 * Returns the world seed to attach on cloud save writes for one slot.
 *
 * @param saveSlotIndex - Save slot being written.
 */
export function gettingWorldPlazaWorldSeedForCloudMirror(
  saveSlotIndex: PlazaSaveSlotIndex
): number | null {
  if (managingWorldPlazaWorldSeedCloudSaveSlotIndex !== saveSlotIndex) {
    return null;
  }

  return managingWorldPlazaWorldSeedValue;
}

function applyingWorldPlazaWorldSeed(worldSeed: number): void {
  const nextSeed = worldSeed | 0;

  if (
    managingWorldPlazaWorldSeedValue === nextSeed &&
    gettingWorldGenerationSeed() === nextSeed
  ) {
    return;
  }

  managingWorldPlazaWorldSeedValue = nextSeed;
  settingWorldGenerationSeed(nextSeed);
  invalidatingWorldPlazaProceduralGenerationCaches();
}

/**
 * Hydrates and activates the world generation seed for one session owner.
 *
 * Empty single-player slots mint a new seed. Legacy saves without a stored seed
 * keep the fixed layout (`0`). Online / shared sessions force `0`.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param options - Cloud mirror + fixed-seed options.
 */
export function initializingWorldPlazaWorldSeedStore(
  storageOwnerId: string | null,
  options?: InitializingWorldPlazaWorldSeedStoreOptions
): void {
  const cloudSaveSlotIndex = options?.cloudSaveSlotIndex ?? null;
  const useFixedLegacySeed = options?.useFixedLegacySeed === true;

  if (
    managingWorldPlazaWorldSeedStorageOwnerId === storageOwnerId &&
    managingWorldPlazaWorldSeedCloudSaveSlotIndex === cloudSaveSlotIndex &&
    !useFixedLegacySeed
  ) {
    applyingWorldPlazaWorldSeed(managingWorldPlazaWorldSeedValue);
    return;
  }

  managingWorldPlazaWorldSeedStorageOwnerId = storageOwnerId;
  managingWorldPlazaWorldSeedCloudSaveSlotIndex = cloudSaveSlotIndex;

  if (useFixedLegacySeed) {
    applyingWorldPlazaWorldSeed(0);
    return;
  }

  const storedSeed = readingWorldPlazaWorldSeedFromStorage(storageOwnerId);

  if (storedSeed !== null) {
    applyingWorldPlazaWorldSeed(storedSeed);
    return;
  }

  const hasLegacySaveProgress =
    readingWorldPlazaLastPositionFromStorage(storageOwnerId) !== null;

  const nextSeed = hasLegacySaveProgress ? 0 : mintingWorldGenerationSeed();

  writingWorldPlazaWorldSeedToStorage(storageOwnerId, nextSeed);
  applyingWorldPlazaWorldSeed(nextSeed);
}

/**
 * Writes a known world seed into localStorage and activates it.
 * Used when hydrating from Redis before the world scene mounts.
 *
 * @param storageOwnerId - Session owner id.
 * @param worldSeed - Seed from the remote save (or legacy `0`).
 */
export function hydratingWorldPlazaWorldSeedFromRemote(
  storageOwnerId: string,
  worldSeed: number
): void {
  const nextSeed = worldSeed | 0;
  writingWorldPlazaWorldSeedToStorage(storageOwnerId, nextSeed);
  managingWorldPlazaWorldSeedStorageOwnerId = storageOwnerId;
  applyingWorldPlazaWorldSeed(nextSeed);
}

/**
 * Resets module state and the shared generation seed (tests + slot delete).
 */
export function resettingWorldPlazaWorldSeedStore(): void {
  managingWorldPlazaWorldSeedStorageOwnerId = null;
  managingWorldPlazaWorldSeedCloudSaveSlotIndex = null;
  managingWorldPlazaWorldSeedValue = 0;
  settingWorldGenerationSeed(0);
}
