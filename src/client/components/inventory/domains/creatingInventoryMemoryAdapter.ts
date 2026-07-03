import type { DefiningInventoryState } from "@/components/inventory/domains/definingInventoryItem";
import type { DefiningInventoryPersistenceAdapter } from "@/components/inventory/domains/definingInventoryPersistenceAdapter";

/** Options for the in-memory persistence adapter. */
export interface CreatingInventoryMemoryAdapterOptions {
  /** Initial state seed (optional). */
  readonly initialState?: DefiningInventoryState | null;
}

/**
 * Creates an in-memory inventory persistence adapter for tests and demos.
 *
 * @param options - Optional initial state
 */
export function creatingInventoryMemoryAdapter(
  options: CreatingInventoryMemoryAdapterOptions = {},
): DefiningInventoryPersistenceAdapter {
  let storedState: DefiningInventoryState | null =
    options.initialState ?? null;

  return {
    async load(): Promise<DefiningInventoryState | null> {
      return storedState;
    },

    save(state: DefiningInventoryState): void {
      storedState = state;
    },
  };
}
