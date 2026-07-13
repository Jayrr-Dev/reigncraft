/**
 * Serializes async writers per save-slot so partial Redis merges cannot clobber
 * each other when inventory, position, recipes, etc. save at the same time.
 *
 * @module components/home/domains/queuingPlazaSinglePlayerSaveSlotWrites
 */

import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

const plazaSinglePlayerSaveSlotWriteChains = new Map<
  PlazaSaveSlotIndex,
  Promise<void>
>();

/**
 * Runs `writer` after any in-flight write for the same slot finishes.
 * Prior failures do not block later writes.
 */
export function queuingPlazaSinglePlayerSaveSlotWrite<T>(
  saveSlotIndex: PlazaSaveSlotIndex,
  writer: () => Promise<T>
): Promise<T> {
  const previousWrite =
    plazaSinglePlayerSaveSlotWriteChains.get(saveSlotIndex) ??
    Promise.resolve();

  const nextWrite = previousWrite.catch(() => undefined).then(writer);

  plazaSinglePlayerSaveSlotWriteChains.set(
    saveSlotIndex,
    nextWrite.then(
      () => undefined,
      () => undefined
    )
  );

  return nextWrite;
}

/** Test helper: drops queued chains between cases. */
export function clearingPlazaSinglePlayerSaveSlotWriteQueuesForTests(): void {
  plazaSinglePlayerSaveSlotWriteChains.clear();
}
