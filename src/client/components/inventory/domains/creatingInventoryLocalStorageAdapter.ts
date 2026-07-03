import type { DefiningInventoryState } from "@/components/inventory/domains/definingInventoryItem";
import type { DefiningInventoryItemRegistry } from "@/components/inventory/domains/definingInventoryItemRegistry";
import type { DefiningInventoryPersistenceAdapter } from "@/components/inventory/domains/definingInventoryPersistenceAdapter";
import { parsingInventoryState } from "@/components/inventory/domains/parsingInventoryState";

/** Options for the localStorage persistence adapter. */
export interface CreatingInventoryLocalStorageAdapterOptions {
  /** localStorage key. */
  readonly storageKey: string;
  /** Expected slot capacity. */
  readonly capacity: number;
  /** Item type registry for validation on load. */
  readonly registry: DefiningInventoryItemRegistry;
}

/**
 * Creates a localStorage-backed inventory persistence adapter.
 *
 * @param options - Storage key, capacity, and registry
 */
export function creatingInventoryLocalStorageAdapter(
  options: CreatingInventoryLocalStorageAdapterOptions,
): DefiningInventoryPersistenceAdapter {
  const { storageKey, capacity, registry } = options;

  return {
    async load(): Promise<DefiningInventoryState | null> {
      if (typeof window === "undefined") {
        return null;
      }

      try {
        const rawJson = window.localStorage.getItem(storageKey);

        if (!rawJson) {
          return null;
        }

        const parsed: unknown = JSON.parse(rawJson);
        return parsingInventoryState(parsed, capacity, registry);
      } catch {
        return null;
      }
    },

    save(state: DefiningInventoryState): void {
      if (typeof window === "undefined") {
        return;
      }

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        // Quota exceeded or private browsing; fail silently
      }
    },
  };
}
