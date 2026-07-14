/**
 * Resolves study-gated clover inspect fields for the item info dialog.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryCloverDetailReveal
 */

import {
  DEFINING_PLAZA_HERBARIUM_CLOVER_GUIDE_ENTRIES,
  LABELING_PLAZA_HERBARIUM_CLOVER_LUCKY_ACTIVE_VAGUE_DESCRIPTION,
  LABELING_PLAZA_HERBARIUM_CLOVER_LUCKY_EFFECTS_LOCKED_TEASER,
} from '@/components/home/domains/definingPlazaHerbariumCloverGuideConstants';
import { DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_FULL_COUNT } from '@/components/home/domains/definingPlazaHerbariumCloverStudyTier';
import { resolvingPlazaHerbariumCloverLuckyEffectStatRows } from '@/components/home/domains/resolvingPlazaHerbariumCloverLuckyEffectStatRows';
import {
  formattingPlazaHerbariumCloverStudyCountProgress,
  resolvingPlazaHerbariumCloverNextStudyTierUnlockCount,
  resolvingPlazaHerbariumCloverStudyTierId,
} from '@/components/home/domains/resolvingPlazaHerbariumCloverStudyTier';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_DETAIL_REVEAL_BY_TIER,
  type DefiningWorldPlazaInventoryCloverDetailReveal,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverDetailRevealConstants';
import type {
  DefiningWorldPlazaInventoryItemDetailBadge,
  DefiningWorldPlazaInventoryItemDetailInfoRow,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import type { WorldCloverSearchLootKind } from '../../../../shared/worldCloverSearchLoot';

export function parsingWorldPlazaCloverKindFromItemTypeId(
  itemTypeId: string
): WorldCloverSearchLootKind | null {
  if (itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_3_LEAF) {
    return 'three_leaf';
  }

  if (itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF) {
    return 'four_leaf';
  }

  return null;
}

export function resolvingWorldPlazaInventoryCloverDetailReveal(
  studyCount: number
): DefiningWorldPlazaInventoryCloverDetailReveal {
  return DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_DETAIL_REVEAL_BY_TIER[
    resolvingPlazaHerbariumCloverStudyTierId(studyCount)
  ];
}

function resolvingHerbariumCloverGuideEntry(
  cloverKind: WorldCloverSearchLootKind
) {
  return (
    DEFINING_PLAZA_HERBARIUM_CLOVER_GUIDE_ENTRIES.find(
      (entry) => entry.cloverKind === cloverKind
    ) ?? null
  );
}

export type ResolvingWorldPlazaInventoryCloverDetailContent = {
  readonly description: string;
  readonly badges: readonly DefiningWorldPlazaInventoryItemDetailBadge[];
  readonly infoRows: readonly DefiningWorldPlazaInventoryItemDetailInfoRow[];
};

export function resolvingWorldPlazaInventoryCloverDetailContent(
  cloverKind: WorldCloverSearchLootKind,
  options: {
    readonly studyCount: number;
    readonly fallbackName: string;
    readonly fallbackDescription: string;
    readonly isLuckyCharmActive?: boolean;
  }
): ResolvingWorldPlazaInventoryCloverDetailContent {
  const reveal = resolvingWorldPlazaInventoryCloverDetailReveal(
    options.studyCount
  );
  const guideEntry = resolvingHerbariumCloverGuideEntry(cloverKind);
  const badges: DefiningWorldPlazaInventoryItemDetailBadge[] = [];
  const infoRows: DefiningWorldPlazaInventoryItemDetailInfoRow[] = [];

  if (reveal.showStudyProgress) {
    const nextUnlock = resolvingPlazaHerbariumCloverNextStudyTierUnlockCount(
      options.studyCount
    );

    infoRows.push({
      id: 'herbarium-study',
      label: 'Herbarium study',
      value:
        nextUnlock === null
          ? `${formattingPlazaHerbariumCloverStudyCountProgress(options.studyCount)} · Fully studied`
          : `${formattingPlazaHerbariumCloverStudyCountProgress(options.studyCount)} · Next at ${nextUnlock}`,
      tone: 'neutral',
    });
  }

  let description = options.fallbackDescription;

  if (reveal.descriptionTier >= 1 && guideEntry) {
    description = guideEntry.summary;
  }

  if (reveal.descriptionTier >= 2 && guideEntry) {
    description = guideEntry.studiedSummary;
  }

  if (
    cloverKind === 'four_leaf' &&
    options.isLuckyCharmActive &&
    !reveal.showLuckyEffectNumbers
  ) {
    description =
      LABELING_PLAZA_HERBARIUM_CLOVER_LUCKY_ACTIVE_VAGUE_DESCRIPTION;
  }

  if (reveal.showPropertiesSummary && guideEntry) {
    const isFullyStudied =
      options.studyCount >= DEFINING_PLAZA_HERBARIUM_CLOVER_STUDY_FULL_COUNT;
    const propertiesSummary =
      cloverKind === 'four_leaf' && isFullyStudied
        ? (guideEntry.propertiesSummaryFull ?? guideEntry.propertiesSummary)
        : guideEntry.propertiesSummary;

    infoRows.push({
      id: 'clover-held',
      label: cloverKind === 'four_leaf' ? 'Held' : 'Forage',
      value: propertiesSummary,
      tone: 'neutral',
    });
  }

  if (
    cloverKind === 'four_leaf' &&
    reveal.showLuckyEffectLabels &&
    !reveal.showLuckyEffectNumbers
  ) {
    infoRows.push({
      id: 'lucky-charm-locked',
      label: 'Lucky charm',
      value: LABELING_PLAZA_HERBARIUM_CLOVER_LUCKY_EFFECTS_LOCKED_TEASER,
      tone: 'neutral',
    });
  }

  if (cloverKind === 'four_leaf' && reveal.showLuckyEffectNumbers) {
    for (const row of resolvingPlazaHerbariumCloverLuckyEffectStatRows()) {
      infoRows.push({
        id: `lucky-${row.label}`,
        label: row.label,
        value: row.value,
        tone: 'neutral',
      });
    }
  }

  return {
    description,
    badges,
    infoRows,
  };
}
