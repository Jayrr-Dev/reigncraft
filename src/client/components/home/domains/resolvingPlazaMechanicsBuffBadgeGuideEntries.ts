import type { DefiningWorldPlazaEntityBuffCategoryId } from '@/components/world/health/domains/definingWorldPlazaEntityBuffCategoryRegistry';
import { listingWorldPlazaEntityBuffCategories } from '@/components/world/health/domains/definingWorldPlazaEntityBuffCategoryRegistry';
import {
  listingWorldPlazaEntityBuffDescriptors,
  type DefiningWorldPlazaEntityBuffDescriptor,
  type DefiningWorldPlazaEntityBuffPolarity,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import {
  resolvingWorldPlazaEntityBuffHudIcon,
  type MappingWorldPlazaEntityBuffHudIconName,
} from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';

export type PlazaMechanicsBuffBadgeGuideEntry = {
  id: string;
  label: string;
  description: string;
  polarity: DefiningWorldPlazaEntityBuffPolarity;
  category: DefiningWorldPlazaEntityBuffCategoryId;
  icon: MappingWorldPlazaEntityBuffHudIconName;
  polarityLabel: 'Buff' | 'Debuff';
};

function resolvingPlazaMechanicsBuffBadgeGuideEntry(
  descriptor: DefiningWorldPlazaEntityBuffDescriptor
): PlazaMechanicsBuffBadgeGuideEntry {
  return {
    id: descriptor.id,
    label: descriptor.label,
    description: descriptor.description,
    polarity: descriptor.polarity,
    category: descriptor.category,
    icon: resolvingWorldPlazaEntityBuffHudIcon(descriptor.id),
    polarityLabel: descriptor.polarity === 'debuff' ? 'Debuff' : 'Buff',
  };
}

/** All buff/debuff badge entries for the mechanics guide, sorted by category then name. */
export function listingPlazaMechanicsBuffBadgeGuideEntries(): PlazaMechanicsBuffBadgeGuideEntry[] {
  const categoryOrder = listingWorldPlazaEntityBuffCategories().map(
    (category) => category.id
  );

  return listingWorldPlazaEntityBuffDescriptors()
    .map(resolvingPlazaMechanicsBuffBadgeGuideEntry)
    .sort((left, right) => {
      const leftCategoryIndex = categoryOrder.indexOf(left.category);
      const rightCategoryIndex = categoryOrder.indexOf(right.category);

      if (leftCategoryIndex !== rightCategoryIndex) {
        return leftCategoryIndex - rightCategoryIndex;
      }

      return left.label.localeCompare(right.label);
    });
}

/** Buff badge entries grouped under combat, defence, utility, and character. */
export function listingPlazaMechanicsBuffBadgeGuideEntriesByCategory(): {
  categoryId: DefiningWorldPlazaEntityBuffCategoryId;
  categoryLabel: string;
  entries: PlazaMechanicsBuffBadgeGuideEntry[];
}[] {
  const entries = listingPlazaMechanicsBuffBadgeGuideEntries();

  return listingWorldPlazaEntityBuffCategories().map((category) => ({
    categoryId: category.id,
    categoryLabel: category.label,
    entries: entries.filter((entry) => entry.category === category.id),
  }));
}
