/**
 * Builds Herbarium full-dossier eat-effect rows with raw numbers.
 *
 * @module components/home/domains/resolvingPlazaHerbariumFlowerEatEffectStatRows
 */

import { DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO } from '@/components/world/health/domains/definingWorldPlazaEntityHealAmplifierConstants';
import { DEFINING_WORLD_PLAZA_DISEASE_SHORTEN_REMAINING_FACTOR } from '@/components/world/health/domains/shorteningWorldPlazaEntityDiseaseRemainingDuration';
import {
  resolvingWorldPlazaFlowerEatEffectKind,
  type DefiningWorldPlazaFlowerEatEffectKind,
} from '@/components/world/inventory/domains/definingWorldPlazaFlowerEatEffectRegistry';
import {
  DEFINING_WORLD_PLAZA_FLOWER_ARNICA_BRACED_DURATION_MS,
  DEFINING_WORLD_PLAZA_FLOWER_BELLADONNA_POISON_DURATION_MS,
  DEFINING_WORLD_PLAZA_FLOWER_BELLADONNA_POISON_OF_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_CALENDULA_HEAL_OF_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_CALENDULA_MENDING_DURATION_MS,
  DEFINING_WORLD_PLAZA_FLOWER_CHAMOMILE_SLEEP_HEAL_OF_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_CHAMOMILE_SLEEP_MS,
  DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_HEAL_OF_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_SUCCESS_CHANCE,
  DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_TEMP_MAX_BASE_EV,
  DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_TEMP_MAX_MS,
  DEFINING_WORLD_PLAZA_FLOWER_INFECTION_RESIST_CHANCE_MULTIPLIER,
  DEFINING_WORLD_PLAZA_FLOWER_INFECTION_RESIST_MS,
  DEFINING_WORLD_PLAZA_FLOWER_ROSE_COLD_RESISTANCE,
  DEFINING_WORLD_PLAZA_FLOWER_ROSE_COLD_RESIST_MS,
  DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_CELSIUS,
  DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_MS,
  DEFINING_WORLD_PLAZA_FLOWER_VALERIAN_SLEEP_MS,
  DEFINING_WORLD_PLAZA_FLOWER_VALERIAN_SLEEP_REGEN_MULTIPLIER,
  DEFINING_WORLD_PLAZA_FLOWER_YARROW_FALLBACK_HEAL_OF_MAX,
} from '@/components/world/inventory/domains/definingWorldPlazaFlowerEatEffectTunables';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

export type PlazaHerbariumFlowerEatEffectStatRow = {
  readonly label: string;
  readonly value: string;
};

function formattingPlazaHerbariumDurationSeconds(durationMs: number): string {
  const seconds = durationMs / 1_000;

  if (Number.isInteger(seconds)) {
    return `${seconds}s`;
  }

  return `${seconds.toFixed(1)}s`;
}

function formattingPlazaHerbariumPercentOfMax(ratio: number): string {
  return `${Math.round(ratio * 100)}% max HP`;
}

function formattingPlazaHerbariumChancePercent(chance: number): string {
  return `${Math.round(chance * 100)}%`;
}

function listingPlazaHerbariumFlowerEatEffectStatRowsForKind(
  effectKind: DefiningWorldPlazaFlowerEatEffectKind
): readonly PlazaHerbariumFlowerEatEffectStatRow[] {
  const diseaseCutPercent = Math.round(
    (1 - DEFINING_WORLD_PLAZA_DISEASE_SHORTEN_REMAINING_FACTOR) * 100
  );
  const mendingBonusPercent = Math.round(
    DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO * 100
  );
  const infectionResistPercent = Math.round(
    DEFINING_WORLD_PLAZA_FLOWER_INFECTION_RESIST_CHANCE_MULTIPLIER * 100
  );
  const roseResistPercent = Math.round(
    DEFINING_WORLD_PLAZA_FLOWER_ROSE_COLD_RESISTANCE * 100
  );

  switch (effectKind) {
    case 'bleedDowngradeOrHeal':
      return [
        { label: 'Bleed', value: 'Downgrade 1 tier' },
        {
          label: 'Else heal',
          value: formattingPlazaHerbariumPercentOfMax(
            DEFINING_WORLD_PLAZA_FLOWER_YARROW_FALLBACK_HEAL_OF_MAX
          ),
        },
      ];
    case 'healAndMending':
      return [
        {
          label: 'Heal',
          value: formattingPlazaHerbariumPercentOfMax(
            DEFINING_WORLD_PLAZA_FLOWER_CALENDULA_HEAL_OF_MAX
          ),
        },
        {
          label: 'Mending',
          value: `+${mendingBonusPercent}% outgoing heal · ${formattingPlazaHerbariumDurationSeconds(DEFINING_WORLD_PLAZA_FLOWER_CALENDULA_MENDING_DURATION_MS)}`,
        },
      ];
    case 'chamomile':
      return [
        { label: 'If confused', value: 'Clears confusion' },
        {
          label: 'Else sleep',
          value: `${formattingPlazaHerbariumDurationSeconds(DEFINING_WORLD_PLAZA_FLOWER_CHAMOMILE_SLEEP_MS)} · +${Math.round(DEFINING_WORLD_PLAZA_FLOWER_CHAMOMILE_SLEEP_HEAL_OF_MAX * 100)}% max HP`,
        },
      ];
    case 'clearSicknessDebuffs':
      return [{ label: 'Clears', value: 'Food sickness · nausea slow' }];
    case 'shortenDiseaseOrInfectionResist':
      return [
        {
          label: 'If diseased',
          value: `Cut remaining time ${diseaseCutPercent}%`,
        },
        {
          label: 'Else resist',
          value: `Infection chance ×${infectionResistPercent / 100} · ${formattingPlazaHerbariumDurationSeconds(DEFINING_WORLD_PLAZA_FLOWER_INFECTION_RESIST_MS)}`,
        },
      ];
    case 'timedColdTolerance':
      return [
        {
          label: 'Cold comfort',
          value: `+${DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_CELSIUS}°C · ${formattingPlazaHerbariumDurationSeconds(DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_MS)}`,
        },
      ];
    case 'timedColdResistance':
      return [
        {
          label: 'Cold resist',
          value: `+${roseResistPercent}% · ${formattingPlazaHerbariumDurationSeconds(DEFINING_WORLD_PLAZA_FLOWER_ROSE_COLD_RESIST_MS)}`,
        },
      ];
    case 'timedHeatTolerance':
      return [
        {
          label: 'Heat comfort',
          value: `+${DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_CELSIUS}°C · ${formattingPlazaHerbariumDurationSeconds(DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_MS)}`,
        },
      ];
    case 'braced':
      return [
        {
          label: 'Braced',
          value: `Incoming rolls Softened · ${formattingPlazaHerbariumDurationSeconds(DEFINING_WORLD_PLAZA_FLOWER_ARNICA_BRACED_DURATION_MS)}`,
        },
      ];
    case 'valerianSleepRegen':
      return [
        {
          label: 'Sleep',
          value: formattingPlazaHerbariumDurationSeconds(
            DEFINING_WORLD_PLAZA_FLOWER_VALERIAN_SLEEP_MS
          ),
        },
        {
          label: 'Regen',
          value: `×${DEFINING_WORLD_PLAZA_FLOWER_VALERIAN_SLEEP_REGEN_MULTIPLIER} while asleep`,
        },
      ];
    case 'foxgloveGamble':
      return [
        {
          label: 'Mercy',
          value: `${formattingPlazaHerbariumChancePercent(DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_SUCCESS_CHANCE)} · heal ${formattingPlazaHerbariumPercentOfMax(DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_HEAL_OF_MAX)} + ~${DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_TEMP_MAX_BASE_EV} temp max HP · ${formattingPlazaHerbariumDurationSeconds(DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_TEMP_MAX_MS)}`,
        },
        {
          label: 'Bane',
          value: `${formattingPlazaHerbariumChancePercent(1 - DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_SUCCESS_CHANCE)} · lethal poison (full max HP pool)`,
        },
      ];
    case 'belladonnaPoison':
      return [
        {
          label: 'Poison',
          value: `Venomous · ${formattingPlazaHerbariumPercentOfMax(DEFINING_WORLD_PLAZA_FLOWER_BELLADONNA_POISON_OF_MAX)} · ${formattingPlazaHerbariumDurationSeconds(DEFINING_WORLD_PLAZA_FLOWER_BELLADONNA_POISON_DURATION_MS)}`,
        },
      ];
    default:
      return [];
  }
}

/**
 * Resolves raw eat-effect stat rows for a fully studied flower species.
 */
export function resolvingPlazaHerbariumFlowerEatEffectStatRows(
  speciesId: WorldFlowerSpeciesId
): readonly PlazaHerbariumFlowerEatEffectStatRow[] | null {
  const effectKind = resolvingWorldPlazaFlowerEatEffectKind(speciesId);

  if (!effectKind) {
    return null;
  }

  const rows = listingPlazaHerbariumFlowerEatEffectStatRowsForKind(effectKind);

  return rows.length > 0 ? rows : null;
}
