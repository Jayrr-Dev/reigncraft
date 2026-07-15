/**
 * Builds Herbarium full-dossier eat-effect rows for mushrooms from catalog data.
 *
 * @module components/home/domains/resolvingPlazaHerbariumMushroomEatEffectStatRows
 */

import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import {
  resolvingWorldPlazaEntityDiseaseDescriptor,
  type DefiningWorldPlazaEntityDiseaseId,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { resolvingWorldPlazaMushroomCatalogEntryBySpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

export type PlazaHerbariumMushroomEatEffectStatRow = {
  readonly label: string;
  readonly value: string;
};

function formattingPlazaHerbariumPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

function formattingPlazaHerbariumDurationSeconds(durationMs: number): string {
  const seconds = durationMs / 1_000;

  if (Number.isInteger(seconds)) {
    return `${seconds}s`;
  }

  return `${seconds.toFixed(1)}s`;
}

function resolvingPlazaHerbariumDiseaseLabel(
  diseaseId: string | undefined
): string | null {
  if (!diseaseId) {
    return null;
  }

  return resolvingWorldPlazaEntityDiseaseDescriptor(
    diseaseId as DefiningWorldPlazaEntityDiseaseId
  ).label;
}

/**
 * Resolves raw eat-effect / prep stat rows for a fully studied mushroom species.
 */
export function resolvingPlazaHerbariumMushroomEatEffectStatRows(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): readonly PlazaHerbariumMushroomEatEffectStatRow[] {
  const entry = resolvingWorldPlazaMushroomCatalogEntryBySpeciesId(speciesId);
  const rows: PlazaHerbariumMushroomEatEffectStatRow[] = [
    {
      label: 'Hunger (raw)',
      value: formattingPlazaHerbariumPercent(entry.rawHungerRestoreRatio),
    },
    {
      label: 'Hunger (cooked)',
      value: formattingPlazaHerbariumPercent(entry.cookedHungerRestoreRatio),
    },
  ];

  const rawDiseaseLabel = resolvingPlazaHerbariumDiseaseLabel(
    entry.rawDiseaseId
  );

  if (rawDiseaseLabel) {
    rows.push({
      label: 'Raw disease',
      value:
        entry.rawDiseaseChance !== undefined
          ? `${rawDiseaseLabel} · ${formattingPlazaHerbariumPercent(entry.rawDiseaseChance)}`
          : rawDiseaseLabel,
    });
  }

  if (
    entry.rawPoisonFlatEv !== undefined &&
    entry.rawPoisonDurationMs !== undefined
  ) {
    rows.push({
      label: 'Raw poison',
      value: `${entry.rawPoisonFlatEv} EV · ${formattingPlazaHerbariumDurationSeconds(entry.rawPoisonDurationMs)}`,
    });
  }

  if (entry.cookedWellFedBuffId) {
    const buffLabel =
      resolvingWorldPlazaEntityBuffDescriptor(entry.cookedWellFedBuffId)
        ?.label ?? entry.cookedWellFedBuffId;
    rows.push({
      label: 'Cooked well-fed',
      value:
        entry.cookedWellFedChance !== undefined
          ? `${buffLabel} · ${formattingPlazaHerbariumPercent(entry.cookedWellFedChance)}`
          : buffLabel,
    });
  }

  const residualDiseaseLabel = resolvingPlazaHerbariumDiseaseLabel(
    entry.cookedResidualDiseaseId
  );

  if (residualDiseaseLabel) {
    rows.push({
      label: 'Cooked residual',
      value:
        entry.cookedResidualDiseaseChance !== undefined
          ? `${residualDiseaseLabel} · ${formattingPlazaHerbariumPercent(entry.cookedResidualDiseaseChance)}`
          : residualDiseaseLabel,
    });
  }

  return rows;
}
