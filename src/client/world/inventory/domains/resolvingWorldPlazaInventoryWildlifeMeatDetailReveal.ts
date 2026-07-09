/**
 * Resolves study-gated wildlife meat inspect fields for the item info dialog.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryWildlifeMeatDetailReveal
 */

import { resolvingPlazaBestiaryStudyTierId } from '@/components/home/domains/resolvingPlazaBestiaryStudyTier';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import {
  resolvingWorldPlazaEntityDiseaseDescriptor,
  type DefiningWorldPlazaEntityDiseaseId,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type {
  DefiningWorldPlazaInventoryItemDetailBadge,
  DefiningWorldPlazaInventoryItemDetailInfoRow,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_WILDLIFE_MEAT_DETAIL_REVEAL_BY_TIER,
  type DefiningWorldPlazaInventoryWildlifeMeatDetailReveal,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryWildlifeMeatDetailRevealConstants';
import { resolvingWorldPlazaInventoryItemDescription } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDescription';
import type { DefiningWorldPlazaInventoryFoodDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';

function formattingChancePercent(chance: number): string {
  return `${Math.round(chance * 100)}%`;
}

function resolvingDiseaseLabel(
  diseaseId: string | undefined
): string | null {
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

/**
 * Resolves reveal flags for one wildlife meat study count.
 */
export function resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(
  studyCount: number
): DefiningWorldPlazaInventoryWildlifeMeatDetailReveal {
  return DEFINING_WORLD_PLAZA_INVENTORY_WILDLIFE_MEAT_DETAIL_REVEAL_BY_TIER[
    resolvingPlazaBestiaryStudyTierId(studyCount)
  ];
}

export type ResolvingWorldPlazaInventoryWildlifeMeatDetailContent = {
  readonly description: string;
  readonly badges: readonly DefiningWorldPlazaInventoryItemDetailBadge[];
  readonly infoRows: readonly DefiningWorldPlazaInventoryItemDetailInfoRow[];
};

/**
 * Builds description, badges, and info rows for wildlife meat at a study tier.
 */
export function resolvingWorldPlazaInventoryWildlifeMeatDetailContent(
  food: DefiningWorldPlazaInventoryFoodDefinition,
  options: {
    readonly studyCount: number;
    readonly fallbackName: string;
  }
): ResolvingWorldPlazaInventoryWildlifeMeatDetailContent {
  const reveal = resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(
    options.studyCount
  );
  const badges: DefiningWorldPlazaInventoryItemDetailBadge[] = [];
  const infoRows: DefiningWorldPlazaInventoryItemDetailInfoRow[] = [];

  const description = reveal.showDescription
    ? resolvingWorldPlazaInventoryItemDescription(food.itemTypeId, {
        fallbackName: options.fallbackName,
      })
    : '';

  if (reveal.showHungerRestore) {
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

  if (reveal.showPreparationHint) {
    if (food.meatKind === 'raw') {
      infoRows.push({
        id: 'raw-risk-hint',
        label: 'Preparation',
        value: 'Raw, risky to eat',
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
    } else if (
      reveal.showDiseaseChance &&
      food.rawSicknessChance !== undefined
    ) {
      infoRows.push({
        id: 'raw-sickness',
        label: 'Raw meat risk',
        value: `${formattingChancePercent(food.rawSicknessChance)} sickness`,
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
