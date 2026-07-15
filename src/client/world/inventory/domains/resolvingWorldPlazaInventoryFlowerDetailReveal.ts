/**
 * Resolves study-gated flower herb inspect fields for the item info dialog.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryFlowerDetailReveal
 */

import {
  formattingPlazaCodexStudyCountProgress,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyFullCount,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';
import { DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaHerbariumGuideConstants';
import { resolvingPlazaHerbariumFlowerEatEffectStatRows } from '@/components/home/domains/resolvingPlazaHerbariumFlowerEatEffectStatRows';
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

const HERBARIUM_FLOWER_TRACK = 'herbarium-flower' as const;

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
    resolvingPlazaCodexStudyTierId(HERBARIUM_FLOWER_TRACK, studyCount)
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
    description = guideEntry?.summary ?? '';
  } else if (reveal.descriptionTier >= 2) {
    // Field notes only. Effect spoilers live in gated info rows.
    description = guideEntry?.studiedSummary ?? '';
  }

  if (reveal.showStudyProgress) {
    const nextUnlock = resolvingPlazaCodexNextStudyTierUnlockCount(
      HERBARIUM_FLOWER_TRACK,
      options.studyCount
    );
    const progressLabel = formattingPlazaCodexStudyCountProgress(
      HERBARIUM_FLOWER_TRACK,
      options.studyCount
    );
    const fullCount = resolvingPlazaCodexStudyFullCount(HERBARIUM_FLOWER_TRACK);

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
