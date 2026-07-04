/** High-level buff/debuff groupings (extensible). */
export type DefiningWorldPlazaEntityBuffCategoryId =
  | 'combat'
  | 'defence'
  | 'utility'
  | 'character';

export type DefiningWorldPlazaEntityBuffCategoryDescriptor = {
  id: DefiningWorldPlazaEntityBuffCategoryId;
  label: string;
  order: number;
};

/** Display order and labels for buff categories. */
export const DEFINING_WORLD_PLAZA_ENTITY_BUFF_CATEGORY_REGISTRY: Record<
  DefiningWorldPlazaEntityBuffCategoryId,
  DefiningWorldPlazaEntityBuffCategoryDescriptor
> = {
  combat: {
    id: 'combat',
    label: 'Combat',
    order: 1,
  },
  defence: {
    id: 'defence',
    label: 'Defence',
    order: 2,
  },
  utility: {
    id: 'utility',
    label: 'Utility',
    order: 3,
  },
  character: {
    id: 'character',
    label: 'Character',
    order: 4,
  },
};

const DEFINING_WORLD_PLAZA_ENTITY_BUFF_CATEGORY_LIST = Object.values(
  DEFINING_WORLD_PLAZA_ENTITY_BUFF_CATEGORY_REGISTRY
).sort((left, right) => left.order - right.order);

/**
 * Lists buff categories in display order.
 */
export function listingWorldPlazaEntityBuffCategories(): readonly DefiningWorldPlazaEntityBuffCategoryDescriptor[] {
  return DEFINING_WORLD_PLAZA_ENTITY_BUFF_CATEGORY_LIST;
}

/**
 * Returns one buff category descriptor.
 */
export function resolvingWorldPlazaEntityBuffCategoryDescriptor(
  categoryId: DefiningWorldPlazaEntityBuffCategoryId
): DefiningWorldPlazaEntityBuffCategoryDescriptor {
  return DEFINING_WORLD_PLAZA_ENTITY_BUFF_CATEGORY_REGISTRY[categoryId];
}
