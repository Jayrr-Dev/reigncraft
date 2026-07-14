/**
 * Pure display rows for the companions roster panel.
 *
 * @module components/world/wildlife/pets/domains/resolvingWildlifePetRosterPanelRows
 */

import { COMPUTING_WORLD_PLAZA_IN_GAME_DAY_MS } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeInstanceBaseMaxHealth } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { resolvingWildlifePetDeathCauseNote } from '@/components/world/wildlife/pets/domains/definingWildlifePetDeathCauseNotes';
import { DEFINING_WILDLIFE_PET_MAX_ACTIVE } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import {
  LABELING_WILDLIFE_PET_ROSTER_STATUS_ALIVE,
  LABELING_WILDLIFE_PET_ROSTER_STATUS_DECEASED,
  LABELING_WILDLIFE_PET_ROSTER_UNNAMED,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetRosterPanelConstants';
import type { DefiningWildlifePetPersistedRecord } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import {
  checkingWildlifePetHasCapability,
  resolvingWildlifePetLoyaltyTier,
} from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';

export type ResolvingWildlifePetRosterPanelRow = {
  petId: string;
  speciesId: string;
  displayName: string;
  speciesDisplayName: string;
  isDeceased: boolean;
  statusLabel: string;
  healthText: string;
  loyaltyText: string;
  /** Compact hunger label once Familiar (`hungerUi`); null when locked or unknown. */
  hungerText: string | null;
  /** In-game days since the companion was acquired. */
  daysText: string;
  /** How they died; only set for deceased companions. */
  deathNote: string | null;
  isDeployed: boolean;
};

/** True when the roster record is permanently dead (saved HP ≤ 0). */
export function checkingWildlifePetRosterRecordIsDeceased(
  record: DefiningWildlifePetPersistedRecord
): boolean {
  return record.healthCurrent !== null && record.healthCurrent <= 0;
}

/** Living companions (not deceased) toward {@link DEFINING_WILDLIFE_PET_MAX_ACTIVE}. */
export function countingWildlifePetRosterLiving(
  pets: readonly DefiningWildlifePetPersistedRecord[]
): number {
  let count = 0;

  for (const pet of pets) {
    if (!checkingWildlifePetRosterRecordIsDeceased(pet)) {
      count += 1;
    }
  }

  return count;
}

/** Compact `current/max` label for the companions header (e.g. `0/3`). */
export function resolvingWildlifePetRosterPanelCountLabel(
  pets: readonly DefiningWildlifePetPersistedRecord[]
): string {
  return `${countingWildlifePetRosterLiving(pets)}/${DEFINING_WILDLIFE_PET_MAX_ACTIVE}`;
}

/** In-game days bonded since `acquiredAtMs` (40 real minutes per day). */
export function resolvingWildlifePetRosterDaysBonded(
  acquiredAtMs: number,
  nowMs: number
): number {
  return Math.max(
    0,
    Math.floor((nowMs - acquiredAtMs) / COMPUTING_WORLD_PLAZA_IN_GAME_DAY_MS)
  );
}

/** Compact days label (`0 Days`, `1 Day`, `14 Days`). */
export function resolvingWildlifePetRosterPanelDaysText(
  acquiredAtMs: number,
  nowMs: number
): string {
  const days = resolvingWildlifePetRosterDaysBonded(acquiredAtMs, nowMs);
  return days === 1 ? '1 Day' : `${days} Days`;
}

/** Builds compact display rows for every bonded companion on the roster. */
export function resolvingWildlifePetRosterPanelRows(
  pets: readonly DefiningWildlifePetPersistedRecord[],
  nowMs: number = Date.now()
): readonly ResolvingWildlifePetRosterPanelRow[] {
  const rows: ResolvingWildlifePetRosterPanelRow[] = [];

  const sortedPets = [...pets].sort((left, right) => {
    const leftDead = checkingWildlifePetRosterRecordIsDeceased(left) ? 1 : 0;
    const rightDead = checkingWildlifePetRosterRecordIsDeceased(right) ? 1 : 0;

    if (leftDead !== rightDead) {
      return leftDead - rightDead;
    }

    return right.updatedAtMs - left.updatedAtMs;
  });

  for (const record of sortedPets) {
    const species = resolvingWildlifeSpeciesDefinition(record.speciesId);
    const isDeceased = checkingWildlifePetRosterRecordIsDeceased(record);
    const tier = resolvingWildlifePetLoyaltyTier(record.loyalty);
    const maxHealth = species
      ? resolvingWildlifeInstanceBaseMaxHealth(species, {
          speciesId: record.speciesId,
          aggressionLevel: record.aggressionLevel,
          sizeScaleSample: record.sizeScaleSample,
          largeSizeFrame: null,
        })
      : null;
    const currentHealth = isDeceased
      ? 0
      : (record.healthCurrent ?? maxHealth ?? 0);
    const healthText =
      maxHealth === null
        ? isDeceased
          ? '0 HP'
          : '—'
        : `${Math.round(currentHealth)} / ${maxHealth} HP`;
    const showsHunger =
      !isDeceased &&
      checkingWildlifePetHasCapability(record.loyalty, 'hungerUi');
    const hungerText =
      showsHunger && record.hungerRatio !== null
        ? `Hunger ${Math.round(record.hungerRatio * 100)}%`
        : showsHunger
          ? 'Hunger —'
          : null;

    rows.push({
      petId: record.petId,
      speciesId: record.speciesId,
      displayName:
        record.displayName?.trim() || LABELING_WILDLIFE_PET_ROSTER_UNNAMED,
      speciesDisplayName: species?.displayName ?? record.speciesId,
      isDeceased,
      statusLabel: isDeceased
        ? LABELING_WILDLIFE_PET_ROSTER_STATUS_DECEASED
        : LABELING_WILDLIFE_PET_ROSTER_STATUS_ALIVE,
      healthText,
      loyaltyText: `${tier.displayName} · ${record.loyalty}`,
      hungerText,
      daysText: resolvingWildlifePetRosterPanelDaysText(
        record.acquiredAtMs,
        nowMs
      ),
      deathNote: isDeceased
        ? resolvingWildlifePetDeathCauseNote(record.deathCauseKind)
        : null,
      isDeployed: record.isActive && !isDeceased,
    });
  }

  return rows;
}
