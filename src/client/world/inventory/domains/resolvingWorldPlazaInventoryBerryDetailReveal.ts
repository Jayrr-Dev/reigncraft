/**
 * Resolves study-gated berry/tea inspect fields for the item info dialog.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryBerryDetailReveal
 */

import { DEFINING_PLAZA_HERBARIUM_BERRY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaHerbariumBerryGuideConstants';
import {
  DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_FULL_COUNT,
  LABELING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_TEASERS,
} from '@/components/home/domains/definingPlazaHerbariumBerryStudyTier';
import {
  formattingPlazaHerbariumBerryStudyCountProgress,
  resolvingPlazaHerbariumBerryNextStudyTierUnlockCount,
  resolvingPlazaHerbariumBerryStudyTierId,
} from '@/components/home/domains/resolvingPlazaHerbariumBerryStudyTier';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import { DEFINING_WORLD_PLAZA_BERRY_LOOT_KIND_TO_ITEM_TYPE_ID } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBerrySpriteSheetConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_BERRY_DETAIL_REVEAL_BY_TIER,
  type DefiningWorldPlazaInventoryBerryDetailReveal,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryBerryDetailRevealConstants';
import type {
  DefiningWorldPlazaInventoryItemDetailBadge,
  DefiningWorldPlazaInventoryItemDetailInfoRow,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import { resolvingWorldPlazaInventoryFoodHealAmount } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealAmount';
import type { DefiningWorldPlazaInventoryFoodDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';

const DEFINING_WORLD_PLAZA_ITEM_TYPE_ID_TO_BERRY_LOOT_KIND = new Map<
  string,
  WorldShrubBerryLootKind
>(
  (
    Object.entries(DEFINING_WORLD_PLAZA_BERRY_LOOT_KIND_TO_ITEM_TYPE_ID) as [
      WorldShrubBerryLootKind,
      string,
    ][]
  ).map(([lootKind, itemTypeId]) => [itemTypeId, lootKind])
);

function formattingChancePercent(chance: number): string {
  return `${Math.round(chance * 100)}%`;
}

function listingWellFedBuffLabels(
  food: DefiningWorldPlazaInventoryFoodDefinition
): string[] {
  const buffIds = [
    ...(food.cookedWellFedBuffIds ?? []),
    ...(food.cookedWellFedBuffId ? [food.cookedWellFedBuffId] : []),
  ];
  const labels: string[] = [];
  const seen = new Set<string>();

  for (const buffId of buffIds) {
    if (seen.has(buffId)) {
      continue;
    }

    seen.add(buffId);
    const label = resolvingWorldPlazaEntityBuffDescriptor(buffId)?.label;

    if (label) {
      labels.push(label);
    }
  }

  return labels;
}

function resolvingHerbariumBerryGuideEntry(lootKind: WorldShrubBerryLootKind) {
  return (
    DEFINING_PLAZA_HERBARIUM_BERRY_GUIDE_ENTRIES.find(
      (entry) => entry.berryLootKind === lootKind
    ) ?? null
  );
}

/**
 * Maps an inventory item type id to its shrub berry loot kind, if any.
 */
export function parsingWorldPlazaBerryLootKindFromItemTypeId(
  itemTypeId: string
): WorldShrubBerryLootKind | null {
  return (
    DEFINING_WORLD_PLAZA_ITEM_TYPE_ID_TO_BERRY_LOOT_KIND.get(itemTypeId) ?? null
  );
}

/**
 * Resolves reveal flags for one berry Study count.
 */
export function resolvingWorldPlazaInventoryBerryDetailReveal(
  studyCount: number
): DefiningWorldPlazaInventoryBerryDetailReveal {
  return DEFINING_WORLD_PLAZA_INVENTORY_BERRY_DETAIL_REVEAL_BY_TIER[
    resolvingPlazaHerbariumBerryStudyTierId(studyCount)
  ];
}

export type ResolvingWorldPlazaInventoryBerryDetailContent = {
  readonly description: string;
  readonly badges: readonly DefiningWorldPlazaInventoryItemDetailBadge[];
  readonly infoRows: readonly DefiningWorldPlazaInventoryItemDetailInfoRow[];
};

/**
 * Builds description, badges, and info rows for berry/tea loot at a Study tier.
 */
export function resolvingWorldPlazaInventoryBerryDetailContent(
  lootKind: WorldShrubBerryLootKind,
  options: {
    readonly studyCount: number;
    readonly food?: DefiningWorldPlazaInventoryFoodDefinition | null;
    readonly foodItemMetadata?: Readonly<Record<string, unknown>>;
    readonly effectiveMaxHealth?: number;
  }
): ResolvingWorldPlazaInventoryBerryDetailContent {
  const reveal = resolvingWorldPlazaInventoryBerryDetailReveal(
    options.studyCount
  );
  const guideEntry = resolvingHerbariumBerryGuideEntry(lootKind);
  const badges: DefiningWorldPlazaInventoryItemDetailBadge[] = [];
  const infoRows: DefiningWorldPlazaInventoryItemDetailInfoRow[] = [];

  let description = '';

  if (reveal.descriptionTier === 1) {
    description = guideEntry?.summary ?? '';
  } else if (reveal.descriptionTier >= 2) {
    description = guideEntry?.studiedSummary ?? '';
  }

  if (reveal.showStudyProgress) {
    const nextUnlock = resolvingPlazaHerbariumBerryNextStudyTierUnlockCount(
      options.studyCount
    );
    const progressLabel = formattingPlazaHerbariumBerryStudyCountProgress(
      options.studyCount
    );

    infoRows.push({
      id: 'herbarium-study',
      label: 'Herbarium Study',
      value:
        options.studyCount >= DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_FULL_COUNT
          ? `${progressLabel} · Full dossier`
          : nextUnlock !== null
            ? `${progressLabel} · next unlock ${nextUnlock}`
            : progressLabel,
      tone: 'neutral',
    });

    if (
      options.studyCount < DEFINING_PLAZA_HERBARIUM_BERRY_STUDY_FULL_COUNT &&
      reveal.descriptionTier === 0
    ) {
      infoRows.push({
        id: 'herbarium-study-hint',
        label: 'Hint',
        value: LABELING_PLAZA_HERBARIUM_BERRY_STUDY_TIER_TEASERS.fieldNotes,
        tone: 'neutral',
      });
    }
  }

  if (reveal.showPropertiesSummary && guideEntry?.propertiesSummary) {
    infoRows.push({
      id: 'berry-when-eaten',
      label: lootKind === 'tea_leaves' ? 'Gathered' : 'When eaten',
      value: guideEntry.propertiesSummary.replace(/^(Eaten|Gathered):\s*/i, ''),
      tone: lootKind === 'tea_leaves' ? 'neutral' : 'positive',
    });

    if (lootKind !== 'tea_leaves') {
      badges.push({
        id: 'berry-edible',
        label: 'Edible forage',
        variant: 'food',
      });
    }
  }

  const food = options.food;

  if (food && reveal.showHungerRestore && food.hungerRestoreRatio > 0) {
    const hungerPercent = Math.round(food.hungerRestoreRatio * 100);
    badges.push({
      id: 'food',
      label: `Restores ${hungerPercent}% hunger`,
      variant: 'food',
    });
    infoRows.push({
      id: 'hunger-restore',
      label: 'Hunger restore',
      value: `${hungerPercent}%`,
      tone: 'food',
    });
  }

  if (food && reveal.showHealthHeal) {
    const healthHealAmount = resolvingWorldPlazaInventoryFoodHealAmount({
      healthHeal: food.healthHeal,
      effectiveMaxHealth:
        options.effectiveMaxHealth ??
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
      foodItemMetadata: options.foodItemMetadata,
    });

    if (healthHealAmount > 0) {
      const usesPlayerMax = options.effectiveMaxHealth !== undefined;
      badges.push({
        id: 'food-heal',
        label: usesPlayerMax
          ? `Heals ${healthHealAmount} HP`
          : `Heals ~${healthHealAmount} HP`,
        variant: 'food',
      });
      infoRows.push({
        id: 'health-restore',
        label: 'Health restore',
        value: usesPlayerMax
          ? `${healthHealAmount} HP`
          : `~${healthHealAmount} HP`,
        tone: 'positive',
      });
    }
  }

  if (food && reveal.showWellFedName) {
    const wellFedLabels = listingWellFedBuffLabels(food);

    if (wellFedLabels.length > 0) {
      infoRows.push({
        id: 'berry-well-fed',
        label: 'After eating',
        value:
          reveal.showWellFedChance && food.cookedWellFedChance !== undefined
            ? `${wellFedLabels.join(', ')} (${formattingChancePercent(food.cookedWellFedChance)})`
            : wellFedLabels.join(', '),
        tone: 'positive',
      });
    }
  }

  return {
    description,
    badges,
    infoRows,
  };
}
