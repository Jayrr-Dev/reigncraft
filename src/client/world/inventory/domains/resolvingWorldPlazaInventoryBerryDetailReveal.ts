/**
 * Resolves study-gated berry/tea inspect fields for the item info dialog.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryBerryDetailReveal
 */

import { DEFINING_PLAZA_HERBARIUM_BERRY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaHerbariumBerryGuideConstants';
import {
  formattingPlazaCodexStudyCountProgress,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyFullCount,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { checkingWorldPlazaForageLootKindIsLeaf } from '@/components/world/inventory/domains/definingWorldPlazaForageLootKindMapping';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_BERRY_DETAIL_REVEAL_BY_TIER,
  type DefiningWorldPlazaInventoryBerryDetailReveal,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryBerryDetailRevealConstants';
import { DEFINING_WORLD_PLAZA_BERRY_LOOT_KIND_TO_ITEM_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBerrySpriteSheetConstants';
import type {
  DefiningWorldPlazaInventoryItemDetailBadge,
  DefiningWorldPlazaInventoryItemDetailInfoRow,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';

const HERBARIUM_BERRY_TRACK = 'herbarium-berry' as const;

const WORLD_PLAZA_ITEM_TYPE_ID_TO_BERRY_LOOT_KIND = new Map<
  string,
  WorldShrubBerryLootKind
>(
  Object.entries(DEFINING_WORLD_PLAZA_BERRY_LOOT_KIND_TO_ITEM_TYPE_ID).map(
    ([lootKind, itemTypeId]) => [
      itemTypeId,
      lootKind as WorldShrubBerryLootKind,
    ]
  )
);

/** Parses the shrub berry/tea loot kind from an inventory item type id, if any. */
export function parsingWorldPlazaBerryLootKindFromItemTypeId(
  itemTypeId: string
): WorldShrubBerryLootKind | null {
  return WORLD_PLAZA_ITEM_TYPE_ID_TO_BERRY_LOOT_KIND.get(itemTypeId) ?? null;
}

/** True when the item is a berry or tea leaves specimen tracked by the Herbarium. */
export function checkingWorldPlazaInventoryItemIsBerrySpecimen(
  itemTypeId: string
): boolean {
  return parsingWorldPlazaBerryLootKindFromItemTypeId(itemTypeId) !== null;
}

export function resolvingWorldPlazaInventoryBerryDetailReveal(
  studyCount: number
): DefiningWorldPlazaInventoryBerryDetailReveal {
  return DEFINING_WORLD_PLAZA_INVENTORY_BERRY_DETAIL_REVEAL_BY_TIER[
    resolvingPlazaCodexStudyTierId(HERBARIUM_BERRY_TRACK, studyCount)
  ];
}

function resolvingHerbariumBerryGuideEntry(
  berryLootKind: WorldShrubBerryLootKind
) {
  return (
    DEFINING_PLAZA_HERBARIUM_BERRY_GUIDE_ENTRIES.find(
      (entry) => entry.berryLootKind === berryLootKind
    ) ?? null
  );
}

function formattingChancePercent(chance: number): string {
  return `${Math.round(chance * 100)}%`;
}

function listingBerryWellFedBuffLabels(
  food:
    | {
        readonly cookedWellFedBuffId?: string;
        readonly cookedWellFedBuffIds?: readonly string[];
      }
    | null
    | undefined
): string[] {
  if (!food) {
    return [];
  }

  const buffIds = [
    ...(food.cookedWellFedBuffIds ?? []),
    ...(food.cookedWellFedBuffId ? [food.cookedWellFedBuffId] : []),
  ];

  return buffIds.flatMap((buffId) => {
    const label = resolvingWorldPlazaEntityBuffDescriptor(buffId)?.label;
    return label ? [label] : [];
  });
}

export type ResolvingWorldPlazaInventoryBerryDetailContent = {
  readonly description: string;
  readonly badges: readonly DefiningWorldPlazaInventoryItemDetailBadge[];
  readonly infoRows: readonly DefiningWorldPlazaInventoryItemDetailInfoRow[];
};

export function resolvingWorldPlazaInventoryBerryDetailContent(
  berryLootKind: WorldShrubBerryLootKind,
  options: {
    readonly studyCount: number;
    readonly food?: {
      readonly cookedWellFedBuffId?: string;
      readonly cookedWellFedBuffIds?: readonly string[];
      readonly cookedWellFedChance?: number;
    } | null;
  }
): ResolvingWorldPlazaInventoryBerryDetailContent {
  const reveal = resolvingWorldPlazaInventoryBerryDetailReveal(
    options.studyCount
  );
  const guideEntry = resolvingHerbariumBerryGuideEntry(berryLootKind);
  const badges: DefiningWorldPlazaInventoryItemDetailBadge[] = [];
  const infoRows: DefiningWorldPlazaInventoryItemDetailInfoRow[] = [];

  let description = '';

  if (reveal.descriptionTier === 1) {
    description = guideEntry?.summary ?? '';
  } else if (reveal.descriptionTier >= 2) {
    description = guideEntry?.studiedSummary ?? '';
  }

  if (reveal.showStudyProgress) {
    const nextUnlock = resolvingPlazaCodexNextStudyTierUnlockCount(
      HERBARIUM_BERRY_TRACK,
      options.studyCount
    );
    const progressLabel = formattingPlazaCodexStudyCountProgress(
      HERBARIUM_BERRY_TRACK,
      options.studyCount
    );
    const fullCount = resolvingPlazaCodexStudyFullCount(HERBARIUM_BERRY_TRACK);

    infoRows.push({
      id: 'herbarium-study',
      label: 'Herbarium Study',
      value:
        options.studyCount >= fullCount
          ? `${progressLabel} · Full dossier`
          : nextUnlock !== null
            ? `${progressLabel} · next unlock ${nextUnlock}`
            : progressLabel,
      tone: 'neutral',
    });
  }

  if (reveal.showPropertiesSummary && guideEntry?.propertiesSummary) {
    infoRows.push({
      id: 'berry-when-eaten',
      label: 'When eaten',
      value: guideEntry.propertiesSummary
        .replace(/^Eaten:\s*/i, '')
        .replace(/^Gathered:\s*/i, ''),
      tone: 'positive',
    });
  }

  const wellFedLabels = listingBerryWellFedBuffLabels(options.food);

  if (reveal.showWellFedName && wellFedLabels.length > 0) {
    infoRows.push({
      id: 'berry-well-fed',
      label:
        berryLootKind === 'red_berry'
          ? 'Buzz chance'
          : berryLootKind === 'tea_leaves'
            ? 'Ease chance'
            : checkingWorldPlazaForageLootKindIsLeaf(berryLootKind)
              ? 'Gather chance'
              : 'Effect chance',
      value:
        reveal.showWellFedChance &&
        options.food?.cookedWellFedChance !== undefined
          ? `${wellFedLabels.join(', ')} (${formattingChancePercent(options.food.cookedWellFedChance)})`
          : wellFedLabels.join(', '),
      tone: 'positive',
    });
  }

  return {
    description,
    badges,
    infoRows,
  };
}
