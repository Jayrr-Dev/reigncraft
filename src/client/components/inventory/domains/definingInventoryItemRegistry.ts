import type { LucideIcon } from "lucide-react";
import type { DefiningInventoryItemRarity } from "@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants";

/**
 * Definition for one registered inventory item type.
 * Add new item types by appending to a registry array.
 */
export interface DefiningInventoryItemTypeDefinition {
  /** Stable type id used in persisted data. */
  readonly typeId: string;
  /** Human-readable name for tooltips and UI. */
  readonly name: string;
  /** Rarity rank shown when inspecting the item. */
  readonly rarity: DefiningInventoryItemRarity;
  /** Optional emoji fallback when no Lucide icon is provided. */
  readonly iconEmoji?: string;
  /** Optional Lucide icon component. */
  readonly Icon?: LucideIcon;
  /** Maximum stack size (1 = non-stackable). */
  readonly maxStack: number;
  /** Whether the item can be dropped out of the inventory. */
  readonly isDroppable: boolean;
  /** Whether identical items merge when dragged together. */
  readonly isStackable: boolean;
  /** Optional tooltip text. */
  readonly tooltip?: string;
}

/** Read-only registry mapping type ids to definitions. */
export interface DefiningInventoryItemRegistry {
  readonly definitions: ReadonlyMap<string, DefiningInventoryItemTypeDefinition>;
  /** Resolves a type definition or returns null when unknown. */
  resolvingItemType: (
    typeId: string,
  ) => DefiningInventoryItemTypeDefinition | null;
}

/**
 * Builds an item type registry from an array of definitions.
 *
 * @param definitions - Item type definitions to register
 */
export function creatingInventoryItemRegistry(
  definitions: readonly DefiningInventoryItemTypeDefinition[],
): DefiningInventoryItemRegistry {
  const definitionMap = new Map<string, DefiningInventoryItemTypeDefinition>();

  for (const definition of definitions) {
    definitionMap.set(definition.typeId, definition);
  }

  return {
    definitions: definitionMap,
    resolvingItemType(typeId: string) {
      return definitionMap.get(typeId) ?? null;
    },
  };
}
