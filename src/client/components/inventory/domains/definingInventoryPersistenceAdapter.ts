import type { DefiningInventoryState } from "@/components/inventory/domains/definingInventoryItem";

/**
 * Pluggable persistence contract for inventory state.
 * Implementations: localStorage, in-memory, Supabase, etc.
 */
export interface DefiningInventoryPersistenceAdapter {
  /** Loads persisted inventory state, or null when none exists. */
  load(): Promise<DefiningInventoryState | null>;
  /** Persists inventory state. */
  save(state: DefiningInventoryState): Promise<void> | void;
}
