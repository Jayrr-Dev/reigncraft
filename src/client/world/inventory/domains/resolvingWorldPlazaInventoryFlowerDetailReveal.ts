/**
 * Resolves study-gated flower herb inspect fields for the item info dialog.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryFlowerDetailReveal
 */

import {
  DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT,
  LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_TEASERS,
} from '@/components/home/domains/definingPlazaHerbariumFlowerStudyTier';
import { DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaHerbariumGuideConstants';
import { resolvingPlazaHerbariumFlowerEatEffectStatRows } from '@/components/home/domains/resolvingPlazaHerbariumFlowerEatEffectStatRows';
import {
  formattingPlazaHerbariumFlowerStudyCountProgress,
  resolvingPlazaHerbariumFlowerNextStudyTierUnlockCount,
  resolvingPlazaHerbariumFlowerStudyTierId,
} from '@/components/home/domains/resolvingPlazaHerbariumFlowerStudyTier';
import { resolvingWorldPlazaEntityDiseaseDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import {
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DURATION_MS,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_MIN_PETALS,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_POISON_OF_MAX,
} from '@/components/world/inventory/domains/definingWorldPlazaFlowerPetalSicknessConstants';
import { DEFINING_WORLD_PLAZA_FLOWER_RAW_DISEASE_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaFlowerRawDiseaseRegistry';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_DETAIL_REVEAL_BY_TIER,
  type DefiningWorldPlazaInventoryFlowerDetailReveal,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerDetailRevealConstants';
import type {
  DefiningWorldPlazaInventoryItemDetailBadge,
  DefiningWorldPlazaInventoryItemDetailInfoRow,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import { resolvingWorldPlazaFlowerEatEffectProcChance } from '@/components/world/inventory/domains/resolvingWorldPlazaFlowerEatEffectProcChance';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

function formattingChancePercent(chance: number): string {
  return `${Math.round(chance * 100)}%`;
}

function resolvingHerbariumFlowerGuideEntry(speciesId: WorldFlowerSpeciesId) {
  return (
    DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES.find(
      (entry) => entry.speciesId === speciesId
    ) ?? null
  );
}

/**
 * Resolves reveal flags for one flower Study count.
 */
export function resolvingWorldPlazaInventoryFlowerDetailReveal(
  studyCount: number
): DefiningWorldPlazaInventoryFlowerDetailReveal {
  return DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_DETAIL_REVEAL_BY_TIER[
    resolvingPlazaHerbariumFlowerStudyTierId(studyCount)
  ];
}

export type ResolvingWorldPlazaInventoryFlowerDetailContent = {
  readonly description: string;
  readonly badges: readonly DefiningWorldPlazaInventoryItemDetailBadge[];
  readonly infoRows: readonly DefiningWorldPlazaInventoryItemDetailInfoRow[];
};

/**
 * Builds description, badges, and info rows for a flower herb at a Study tier.
 */
export function resolvingWorldPlazaInventoryFlowerDetailContent(
  speciesId: WorldFlowerSpeciesId,
  options: {
    readonly studyCount: number;
    readonly fallbackName: string;
    readonly fallbackDescription: string;
  }
): ResolvingWorldPlazaInventoryFlowerDetailContent {
  const reveal = resolvingWorldPlazaInventoryFlowerDetailReveal(
    options.studyCount
  );
  const guideEntry = resolvingHerbariumFlowerGuideEntry(speciesId);
  const badges: DefiningWorldPlazaInventoryItemDetailBadge[] = [];
  const infoRows: DefiningWorldPlazaInventoryItemDetailInfoRow[] = [];

  let description = '';

  if (reveal.descriptionTier === 1) {
    description = guideEntry?.summary ?? options.fallbackDescription;
  } else if (reveal.descriptionTier === 2) {
    description = guideEntry?.studiedSummary ?? options.fallbackDescription;
  } else if (reveal.descriptionTier === 3) {
    const studied = guideEntry?.studiedSummary ?? options.fallbackDescription;
    const properties = guideEntry?.propertiesSummary;

    description = properties ? `${studied} ${properties}` : studied;
  }

  if (reveal.showStudyProgress) {
    const nextUnlock = resolvingPlazaHerbariumFlowerNextStudyTierUnlockCount(
      options.studyCount
    );
    const progressLabel = formattingPlazaHerbariumFlowerStudyCountProgress(
      options.studyCount
    );

    infoRows.push({
      id: 'herbarium-study',
      label: 'Herbarium Study',
      value:
        options.studyCount >= DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT
          ? `${progressLabel} · Full dossier`
          : nextUnlock !== null
            ? `${progressLabel} · next unlock ${nextUnlock}`
            : progressLabel,
      tone: 'neutral',
    });

    if (
      options.studyCount < DEFINING_PLAZA_HERBARIUM_FLOWER_STUDY_FULL_COUNT &&
      reveal.descriptionTier === 0
    ) {
      infoRows.push({
        id: 'herbarium-study-hint',
        label: 'Hint',
        value: LABELING_PLAZA_HERBARIUM_FLOWER_STUDY_TIER_TEASERS.fieldNotes,
        tone: 'neutral',
      });
    }
  }

  if (reveal.showPropertiesSummary && guideEntry?.propertiesSummary) {
    infoRows.push({
      id: 'flower-when-eaten',
      label: 'When eaten',
      value: guideEntry.propertiesSummary.replace(/^Eaten:\s*/i, ''),
      tone: 'positive',
    });
    badges.push({
      id: 'flower-edible',
      label: 'Edible herb',
      variant: 'food',
    });
  }

  const eatEffectRows =
    resolvingPlazaHerbariumFlowerEatEffectStatRows(speciesId) ?? [];

  if (reveal.showRawProcChance) {
    const rawProcChance = resolvingWorldPlazaFlowerEatEffectProcChance({
      preparation: 'raw',
    });
    infoRows.push({
      id: 'flower-raw-proc',
      label: 'Effect chance (raw)',
      value: `${formattingChancePercent(rawProcChance)} when chewed raw`,
      tone: 'positive',
    });
  }

  if (reveal.showEatEffectNumbers) {
    for (const [index, row] of eatEffectRows.entries()) {
      if (row.label === 'Proc (raw)') {
        continue;
      }

      infoRows.push({
        id: `flower-effect-${index}`,
        label: row.label,
        value: row.value,
        tone: 'positive',
      });
    }
  } else if (reveal.showEatEffectLabels) {
    for (const [index, row] of eatEffectRows.entries()) {
      if (row.label === 'Proc (raw)') {
        continue;
      }

      infoRows.push({
        id: `flower-effect-label-${index}`,
        label: row.label,
        value: 'Studied · numbers locked',
        tone: 'neutral',
      });
    }
  }

  if (reveal.showPetalSicknessDetails) {
    const poisonPercent = Math.round(
      DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_POISON_OF_MAX * 100
    );
    const durationSeconds = Math.round(
      DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DURATION_MS / 1000
    );
    infoRows.push({
      id: 'petal-sickness',
      label: 'Petal Sickness',
      value: `After ${DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_MIN_PETALS} raw petals/day: confusion, stamina drain, ${poisonPercent}% max HP poison · ${durationSeconds}s (stacks)`,
      tone: 'warning',
    });
  } else if (reveal.showPetalSicknessName) {
    infoRows.push({
      id: 'petal-sickness',
      label: 'Petal Sickness',
      value: 'Raw petals can sicken you if you chew too many',
      tone: 'warning',
    });
  }

  if (reveal.showFlowerDiseaseNames) {
    const diseaseLabels = DEFINING_WORLD_PLAZA_FLOWER_RAW_DISEASE_REGISTRY.map(
      (entry) => {
        const label = resolvingWorldPlazaEntityDiseaseDescriptor(
          entry.diseaseId
        ).label;

        if (reveal.showFlowerDiseaseChances) {
          return `${label} (${formattingChancePercent(entry.chance)})`;
        }

        return label;
      }
    );

    infoRows.push({
      id: 'flower-diseases',
      label: reveal.showFlowerDiseaseChances
        ? 'Flower disease risk'
        : 'Possible flower illness',
      value: diseaseLabels.join(', '),
      tone: 'warning',
    });
  } else if (reveal.showPropertiesSummary) {
    infoRows.push({
      id: 'flower-raw-risk-hint',
      label: 'Preparation',
      value: 'Raw herb · chew carefully',
      tone: 'warning',
    });
  }

  return {
    description,
    badges,
    infoRows,
  };
}
