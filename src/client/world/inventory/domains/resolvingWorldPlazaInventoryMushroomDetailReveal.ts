/**
 * Resolves study-gated mushroom inspect fields for the item info dialog.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryMushroomDetailReveal
 */

import { DEFINING_PLAZA_HERBARIUM_MUSHROOM_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaHerbariumMushroomGuideConstants';
import {
  formattingPlazaCodexStudyCountProgress,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyFullCount,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import {
  resolvingWorldPlazaEntityDiseaseDescriptor,
  type DefiningWorldPlazaEntityDiseaseId,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type {
  DefiningWorldPlazaInventoryItemDetailBadge,
  DefiningWorldPlazaInventoryItemDetailInfoRow,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_MUSHROOM_DETAIL_REVEAL_BY_TIER,
  type DefiningWorldPlazaInventoryMushroomDetailReveal,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryMushroomDetailRevealConstants';
import { resolvingWorldPlazaInventoryFoodHealAmount } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealAmount';
import type { DefiningWorldPlazaInventoryFoodDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import { DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

const HERBARIUM_MUSHROOM_TRACK = 'herbarium-mushroom' as const;

const WORLD_PLAZA_ITEM_TYPE_ID_TO_MUSHROOM_SPECIES_ID = new Map<
  string,
  DefiningWorldPlazaMushroomSpeciesId
>(
  DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.flatMap((entry) => [
    [entry.rawItemTypeId, entry.speciesId],
    [entry.cookedItemTypeId, entry.speciesId],
  ])
);

/** Parses the mushroom species id from a raw or cooked item type id, if any. */
export function parsingWorldPlazaMushroomSpeciesIdFromItemTypeId(
  itemTypeId: string
): DefiningWorldPlazaMushroomSpeciesId | null {
  return WORLD_PLAZA_ITEM_TYPE_ID_TO_MUSHROOM_SPECIES_ID.get(itemTypeId) ?? null;
}

/** True when the item is a raw or cooked mushroom tracked by the Herbarium. */
export function checkingWorldPlazaInventoryItemIsMushroomSpecimen(
  itemTypeId: string
): boolean {
  return parsingWorldPlazaMushroomSpeciesIdFromItemTypeId(itemTypeId) !== null;
}

export function resolvingWorldPlazaInventoryMushroomDetailReveal(
  studyCount: number
): DefiningWorldPlazaInventoryMushroomDetailReveal {
  return DEFINING_WORLD_PLAZA_INVENTORY_MUSHROOM_DETAIL_REVEAL_BY_TIER[
    resolvingPlazaCodexStudyTierId(HERBARIUM_MUSHROOM_TRACK, studyCount)
  ];
}

function resolvingHerbariumMushroomGuideEntry(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
) {
  return (
    DEFINING_PLAZA_HERBARIUM_MUSHROOM_GUIDE_ENTRIES.find(
      (entry) => entry.speciesId === speciesId
    ) ?? null
  );
}

function formattingChancePercent(chance: number): string {
  return `${Math.round(chance * 100)}%`;
}

function resolvingDiseaseLabel(diseaseId: string | undefined): string | null {
  if (!diseaseId) {
    return null;
  }

  return resolvingWorldPlazaEntityDiseaseDescriptor(
    diseaseId as DefiningWorldPlazaEntityDiseaseId
  ).label;
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

export type ResolvingWorldPlazaInventoryMushroomDetailContent = {
  readonly description: string;
  readonly badges: readonly DefiningWorldPlazaInventoryItemDetailBadge[];
  readonly infoRows: readonly DefiningWorldPlazaInventoryItemDetailInfoRow[];
};

export function resolvingWorldPlazaInventoryMushroomDetailContent(
  speciesId: DefiningWorldPlazaMushroomSpeciesId,
  options: {
    readonly studyCount: number;
    readonly food: DefiningWorldPlazaInventoryFoodDefinition;
    readonly foodItemMetadata?: Readonly<Record<string, unknown>>;
    readonly effectiveMaxHealth?: number;
  }
): ResolvingWorldPlazaInventoryMushroomDetailContent {
  const reveal = resolvingWorldPlazaInventoryMushroomDetailReveal(
    options.studyCount
  );
  const guideEntry = resolvingHerbariumMushroomGuideEntry(speciesId);
  const food = options.food;
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
      HERBARIUM_MUSHROOM_TRACK,
      options.studyCount
    );
    const progressLabel = formattingPlazaCodexStudyCountProgress(
      HERBARIUM_MUSHROOM_TRACK,
      options.studyCount
    );
    const fullCount = resolvingPlazaCodexStudyFullCount(
      HERBARIUM_MUSHROOM_TRACK
    );

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
      id: 'mushroom-when-eaten',
      label: 'When eaten',
      value: guideEntry.propertiesSummary.replace(/^Eaten:\s*/i, ''),
      tone: 'positive',
    });
  }

  if (reveal.showPreparationHint) {
    if (food.meatKind === 'raw') {
      infoRows.push({
        id: 'raw-risk-hint',
        label: 'Preparation',
        value: 'Raw',
        tone: 'warning',
      });
    } else if (food.meatKind === 'cooked') {
      infoRows.push({
        id: 'cooked-safe',
        label: 'Preparation',
        value: 'Cooked',
        tone: 'positive',
      });
    }
  }

  if (reveal.showFoodHungerBadge) {
    if (food.hungerRestoreRatio > 0) {
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
  } else if (reveal.showFoodEffectLabels) {
    if (food.hungerRestoreRatio > 0) {
      badges.push({
        id: 'food',
        label: 'Fills hunger',
        variant: 'food',
      });
    }

    const healthHealAmount = resolvingWorldPlazaInventoryFoodHealAmount({
      healthHeal: food.healthHeal,
      effectiveMaxHealth:
        options.effectiveMaxHealth ??
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
      foodItemMetadata: options.foodItemMetadata,
    });

    if (healthHealAmount > 0) {
      badges.push({
        id: 'food-heal',
        label: 'Heals',
        variant: 'food',
      });
    }
  }

  if (food.meatKind === 'raw') {
    const diseaseLabel = resolvingDiseaseLabel(food.rawDiseaseId);

    if (reveal.showDiseaseName && diseaseLabel) {
      infoRows.push({
        id: 'raw-disease',
        label: 'Disease risk',
        value:
          reveal.showDiseaseChance && food.rawDiseaseChance !== undefined
            ? `${diseaseLabel} (${formattingChancePercent(food.rawDiseaseChance)})`
            : diseaseLabel,
        tone: 'warning',
      });
    }

    if (
      reveal.showPoisonDamage &&
      food.rawPoisonFlatEv !== undefined &&
      food.rawPoisonDurationMs !== undefined
    ) {
      const poisonSeconds = Math.round(food.rawPoisonDurationMs / 1000);
      infoRows.push({
        id: 'raw-poison',
        label: 'Poison if eaten',
        value: `${food.rawPoisonFlatEv} damage over ${poisonSeconds}s`,
        tone: 'warning',
      });
    }
  }

  if (food.meatKind === 'cooked') {
    const wellFedLabels = listingWellFedBuffLabels(food);

    if (reveal.showWellFedName && wellFedLabels.length > 0) {
      infoRows.push({
        id: 'cooked-well-fed',
        label: 'Well-fed chance',
        value:
          reveal.showWellFedChance && food.cookedWellFedChance !== undefined
            ? `${wellFedLabels.join(', ')} (${formattingChancePercent(food.cookedWellFedChance)})`
            : wellFedLabels.join(', '),
        tone: 'positive',
      });
    }

    const residualLabel = resolvingDiseaseLabel(food.cookedResidualDiseaseId);

    if (
      reveal.showResidualDisease &&
      residualLabel &&
      food.cookedResidualDiseaseChance !== undefined
    ) {
      infoRows.push({
        id: 'cooked-residual-disease',
        label: 'Residual risk',
        value: `${residualLabel} (${formattingChancePercent(food.cookedResidualDiseaseChance)})`,
        tone: 'warning',
      });
    }
  }

  return {
    description,
    badges,
    infoRows,
  };
}
