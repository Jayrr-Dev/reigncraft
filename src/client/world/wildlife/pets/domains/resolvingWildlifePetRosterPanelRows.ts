/**
 * Pure display rows for the companions roster panel.
 *
 * @module components/world/wildlife/pets/domains/resolvingWildlifePetRosterPanelRows
 */

import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeInstanceBaseMaxHealth } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { DEFINING_WILDLIFE_PET_MAX_ACTIVE } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import {
  LABELING_WILDLIFE_PET_ROSTER_STATUS_ALIVE,
  LABELING_WILDLIFE_PET_ROSTER_STATUS_DECEASED,
  LABELING_WILDLIFE_PET_ROSTER_UNNAMED,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetRosterPanelConstants';
import type { DefiningWildlifePetPersistedRecord } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { resolvingWildlifePetLoyaltyTier } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';

export type ResolvingWildlifePetRosterPanelRow = {
  petId: string;
  speciesId: string;
  displayName: string;
  speciesDisplayName: string;
  isDeceased: boolean;
  statusLabel: string;
  healthText: string;
  loyaltyText: string;
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

/** Builds compact display rows for every bonded companion on the roster. */
export function resolvingWildlifePetRosterPanelRows(
  pets: readonly DefiningWildlifePetPersistedRecord[]
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
      isDeployed: record.isActive && !isDeceased,
    });
  }

  return rows;
}
