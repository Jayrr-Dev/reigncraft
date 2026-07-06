import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { resolvingWorldPlazaExploredBiomesStorageKey } from '@/components/world/domains/definingWorldPlazaExploredBiomesConstants';

/**
 * Persists explored biome kinds to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 * @param exploredKinds - Biome kinds the player has entered.
 */
export function writingWorldPlazaExploredBiomesToStorage(
  storageOwnerId: string | null,
  exploredKinds: ReadonlySet<DefiningWorldPlazaBiomeKind>
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaExploredBiomesStorageKey(storageOwnerId),
    JSON.stringify([...exploredKinds])
  );
}
