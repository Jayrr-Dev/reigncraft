/**
 * Boot-time avatar texture warm-up for the selected skin only.
 *
 * @module components/world/domains/preloadingWorldPlazaBootAvatarTextures
 */

import { DEFINING_WORLD_PLAZA_AVATAR_BOOT_PRELOAD_CONCURRENCY } from '@/components/world/domains/definingWorldPlazaAvatarBootTexturePreloadConstants';
import { resolvingWorldPlazaAvatarCharacterDefinition } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import { gettingWorldPlazaSelectedAvatarSkinId } from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';

/** Reports 0..1 completion for the avatar boot step. */
type PreloadingWorldPlazaBootAvatarProgressReporter = (
  completedRatio: number
) => void;

/**
 * Warms the selected avatar skin's core locomotion textures.
 *
 * Other skins stay unloaded until the player opens the skin selector or a
 * remote avatar with that skin appears.
 */
export async function preloadingWorldPlazaBootAvatarTextures(
  reportProgress: PreloadingWorldPlazaBootAvatarProgressReporter
): Promise<void> {
  const selectedSkinId = gettingWorldPlazaSelectedAvatarSkinId();
  const characterDefinition =
    resolvingWorldPlazaAvatarCharacterDefinition(selectedSkinId);

  // Single selected skin: concurrency constant reserved for future multi-skin
  // warm-up (e.g. remote players). Keep the worker-pool shape for consistency.
  const loadTasks = [() => characterDefinition.loadTextures()];
  let nextIndex = 0;
  let completedCount = 0;

  async function loadingNextAvatarWorker(): Promise<void> {
    while (nextIndex < loadTasks.length) {
      const taskIndex = nextIndex;
      nextIndex += 1;

      await loadTasks[taskIndex]!();

      completedCount += 1;
      reportProgress(completedCount / loadTasks.length);
    }
  }

  const workerCount = Math.min(
    DEFINING_WORLD_PLAZA_AVATAR_BOOT_PRELOAD_CONCURRENCY,
    loadTasks.length
  );

  await Promise.all(
    Array.from({ length: workerCount }, () => loadingNextAvatarWorker())
  );
}
