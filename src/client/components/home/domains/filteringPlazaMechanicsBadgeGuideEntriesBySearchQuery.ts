import { checkingPlazaMechanicsBadgeGuideFuzzySearchMatch } from '@/components/home/domains/matchingPlazaMechanicsBadgeGuideFuzzySearch';
import type { PlazaMechanicsBuffBadgeGuideEntry } from '@/components/home/domains/resolvingPlazaMechanicsBuffBadgeGuideEntries';
import type { PlazaMechanicsDiseaseBadgeGuideEntry } from '@/components/home/domains/resolvingPlazaMechanicsDiseaseBadgeGuideEntries';
import type { DefiningWorldPlazaEntityBuffCategoryId } from '@/components/world/health/domains/definingWorldPlazaEntityBuffCategoryRegistry';

export type PlazaMechanicsBuffBadgeGuideCategoryGroup = {
  categoryId: DefiningWorldPlazaEntityBuffCategoryId;
  categoryLabel: string;
  entries: PlazaMechanicsBuffBadgeGuideEntry[];
};

function listingPlazaMechanicsBuffBadgeSearchableTexts(
  entry: PlazaMechanicsBuffBadgeGuideEntry,
  categoryLabel: string
): string[] {
  return [
    entry.label,
    entry.description,
    entry.polarityLabel,
    categoryLabel,
    entry.id.replaceAll('-', ' '),
  ];
}

function listingPlazaMechanicsDiseaseBadgeSearchableTexts(
  entry: PlazaMechanicsDiseaseBadgeGuideEntry
): string[] {
  return [
    entry.label,
    entry.description,
    entry.timelineSubtitle,
    'Disease',
    entry.id.replaceAll('-', ' '),
  ];
}

/** Keeps buff badge groups whose entries match the fuzzy search query. */
export function filteringPlazaMechanicsBuffBadgeGuideGroupsBySearchQuery(
  groups: readonly PlazaMechanicsBuffBadgeGuideCategoryGroup[],
  searchQuery: string
): PlazaMechanicsBuffBadgeGuideCategoryGroup[] {
  const normalizedQuery = searchQuery.trim();

  if (!normalizedQuery) {
    return groups.map((group) => ({
      ...group,
      entries: [...group.entries],
    }));
  }

  return groups
    .map((group) => ({
      ...group,
      entries: group.entries.filter((entry) =>
        checkingPlazaMechanicsBadgeGuideFuzzySearchMatch(
          listingPlazaMechanicsBuffBadgeSearchableTexts(
            entry,
            group.categoryLabel
          ),
          normalizedQuery
        )
      ),
    }))
    .filter((group) => group.entries.length > 0);
}

/** Keeps disease badge entries that match the fuzzy search query. */
export function filteringPlazaMechanicsDiseaseBadgeGuideEntriesBySearchQuery(
  entries: readonly PlazaMechanicsDiseaseBadgeGuideEntry[],
  searchQuery: string
): PlazaMechanicsDiseaseBadgeGuideEntry[] {
  const normalizedQuery = searchQuery.trim();

  if (!normalizedQuery) {
    return [...entries];
  }

  return entries.filter((entry) =>
    checkingPlazaMechanicsBadgeGuideFuzzySearchMatch(
      listingPlazaMechanicsDiseaseBadgeSearchableTexts(entry),
      normalizedQuery
    )
  );
}
