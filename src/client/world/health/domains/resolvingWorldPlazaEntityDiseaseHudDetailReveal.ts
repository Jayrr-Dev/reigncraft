/**
 * Resolves study-gated disease HUD tooltip fields from Pathology progress.
 *
 * @module components/world/health/domains/resolvingWorldPlazaEntityDiseaseHudDetailReveal
 */

import { computingPlazaPathologyTotalStudyPoints } from '@/components/home/domains/computingPlazaPathologyStudyPoints';
import { resolvingPlazaPathologyStudyTierId } from '@/components/home/domains/resolvingPlazaPathologyStudyTier';
import {
  gettingWorldPlazaPathologyInfectionStudyPointsSnapshot,
  gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot,
} from '@/components/world/domains/managingWorldPlazaPathologyDiscoveryStore';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import {
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_DETAIL_REVEAL_BY_TIER,
  LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_EFFECTS_TEASER,
  LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_DESCRIPTION,
  LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_NAME,
  type DefiningWorldPlazaEntityDiseaseHudDetailReveal,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseHudDetailRevealConstants';
import type { ResolvingWorldPlazaEntityDiseaseHudDetailLinesResult } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseHudDetailLines';

/**
 * Resolves reveal flags for one Pathology study count.
 */
export function resolvingWorldPlazaEntityDiseaseHudDetailReveal(
  studyCount: number
): DefiningWorldPlazaEntityDiseaseHudDetailReveal {
  return DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_DETAIL_REVEAL_BY_TIER[
    resolvingPlazaPathologyStudyTierId(studyCount)
  ];
}

/**
 * Total Pathology study points for one disease from the discovery store.
 */
export function resolvingWorldPlazaPathologyStudyCountForDisease(
  diseaseId: DefiningWorldPlazaEntityDiseaseId
): number {
  const linkedCreatureStudies =
    gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot()[diseaseId] ?? 0;
  const infectionStudyPoints =
    gettingWorldPlazaPathologyInfectionStudyPointsSnapshot()[diseaseId] ?? 0;

  return computingPlazaPathologyTotalStudyPoints(
    linkedCreatureStudies,
    infectionStudyPoints
  );
}

export type ResolvingWorldPlazaEntityDiseaseHudTooltipContent = {
  readonly label: string;
  readonly description: string;
  readonly severityLabel: string | undefined;
  readonly detailLines: readonly string[];
};

/**
 * Applies Pathology reveal flags to raw disease HUD label / detail content.
 */
export function resolvingWorldPlazaEntityDiseaseHudTooltipContent({
  trueLabel,
  trueDescription,
  detail,
  studyCount,
}: {
  trueLabel: string;
  trueDescription: string;
  detail: ResolvingWorldPlazaEntityDiseaseHudDetailLinesResult;
  studyCount: number;
}): ResolvingWorldPlazaEntityDiseaseHudTooltipContent {
  const reveal = resolvingWorldPlazaEntityDiseaseHudDetailReveal(studyCount);

  if (!reveal.showName) {
    return {
      label: LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_NAME,
      description: LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_DESCRIPTION,
      severityLabel: undefined,
      detailLines: [],
    };
  }

  return {
    label: trueLabel,
    description: reveal.showDescription ? trueDescription : '',
    severityLabel: reveal.showSeverity ? detail.severityLabel : undefined,
    detailLines: reveal.showEffectLines
      ? detail.effectLines
      : [LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_EFFECTS_TEASER],
  };
}
