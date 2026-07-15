/**
 * Resolves study-gated ore inspect fields for the item info dialog.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryOreDetailReveal
 */

import { DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaLapidaryGuideConstants';
import { resolvingPlazaLapidaryOreVeinStatRows } from '@/components/home/domains/resolvingPlazaLapidaryOreVeinStatRows';
import {
  formattingPlazaCodexStudyCountProgress,
  resolvingPlazaCodexNextStudyTierUnlockCount,
  resolvingPlazaCodexStudyFullCount,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';
import { DEFINING_WORLD_PLAZA_ORE_SPECIES_HABITAT_LABEL } from '@/components/world/domains/definingWorldPlazaOreBiomeRarityConstants';
import type {
  DefiningWorldPlazaInventoryItemDetailBadge,
  DefiningWorldPlazaInventoryItemDetailInfoRow,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ORE_DETAIL_REVEAL_BY_TIER,
  type DefiningWorldPlazaInventoryOreDetailReveal,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreDetailRevealConstants';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';

const LAPIDARY_TRACK = 'lapidary' as const;

function resolvingLapidaryOreGuideEntry(speciesId: WorldOreSpeciesId) {
  return (
    DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES.find(
      (entry) => entry.speciesId === speciesId
    ) ?? null
  );
}

/**
 * Resolves reveal flags for one ore Study count.
 */
export function resolvingWorldPlazaInventoryOreDetailReveal(
  studyCount: number
): DefiningWorldPlazaInventoryOreDetailReveal {
  return DEFINING_WORLD_PLAZA_INVENTORY_ORE_DETAIL_REVEAL_BY_TIER[
    resolvingPlazaCodexStudyTierId(LAPIDARY_TRACK, studyCount)
  ];
}

export type ResolvingWorldPlazaInventoryOreDetailContent = {
  readonly description: string;
  readonly badges: readonly DefiningWorldPlazaInventoryItemDetailBadge[];
  readonly infoRows: readonly DefiningWorldPlazaInventoryItemDetailInfoRow[];
};

/**
 * Builds description, badges, and info rows for an ore at a Study tier.
 */
export function resolvingWorldPlazaInventoryOreDetailContent(
  speciesId: WorldOreSpeciesId,
  options: {
    readonly studyCount: number;
    readonly fallbackName: string;
    readonly fallbackDescription: string;
  }
): ResolvingWorldPlazaInventoryOreDetailContent {
  const reveal = resolvingWorldPlazaInventoryOreDetailReveal(
    options.studyCount
  );
  const guideEntry = resolvingLapidaryOreGuideEntry(speciesId);
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
    const nextUnlock = resolvingPlazaCodexNextStudyTierUnlockCount(
      LAPIDARY_TRACK,
      options.studyCount
    );
    const progressLabel = formattingPlazaCodexStudyCountProgress(
      LAPIDARY_TRACK,
      options.studyCount
    );
    const fullCount = resolvingPlazaCodexStudyFullCount(LAPIDARY_TRACK);

    infoRows.push({
      id: 'lapidary-study',
      label: 'Lapidary Study',
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
      id: 'ore-when-worked',
      label: 'When worked',
      value: guideEntry.propertiesSummary.replace(
        /^(Work|Fuel|Smelt|Reagent):\s*/i,
        ''
      ),
      tone: 'positive',
    });
    badges.push({
      id: 'ore-material',
      label: 'Ore specimen',
      variant: 'tool',
    });
  }

  if (reveal.showHabitatLabel) {
    infoRows.push({
      id: 'ore-habitat',
      label: 'Habitat',
      value: DEFINING_WORLD_PLAZA_ORE_SPECIES_HABITAT_LABEL[speciesId],
      tone: 'neutral',
    });
  }

  const veinStatRows = resolvingPlazaLapidaryOreVeinStatRows(speciesId);

  if (reveal.showVeinStatNumbers) {
    for (const [index, row] of veinStatRows.entries()) {
      if (row.label === 'Habitat' && reveal.showHabitatLabel) {
        continue;
      }

      infoRows.push({
        id: `ore-vein-${index}`,
        label: row.label,
        value: row.value,
        tone: 'neutral',
      });
    }
  } else if (reveal.showVeinStatLabels) {
    for (const [index, row] of veinStatRows.entries()) {
      if (row.label === 'Habitat') {
        continue;
      }

      infoRows.push({
        id: `ore-vein-label-${index}`,
        label: row.label,
        value: 'Studied · numbers locked',
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
