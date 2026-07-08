import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_CORPUS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDescriptionCorpus';

export type ResolvingWorldPlazaInventoryItemDescriptionOptions = {
  /** Used when the corpus has no entry for this type id. */
  readonly fallbackName?: string;
};

/**
 * Resolves player-facing description copy for one inventory item type.
 */
export function resolvingWorldPlazaInventoryItemDescription(
  typeId: string,
  options?: ResolvingWorldPlazaInventoryItemDescriptionOptions
): string {
  const description =
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DESCRIPTION_CORPUS[typeId];

  if (description) {
    return description;
  }

  return options?.fallbackName ?? typeId;
}
