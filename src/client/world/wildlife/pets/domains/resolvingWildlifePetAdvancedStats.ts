/**
 * Pure advanced stat presentation for bonded companions.
 *
 * @module components/world/wildlife/pets/domains/resolvingWildlifePetAdvancedStats
 */

import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import { computingWorldPlazaEquipmentModifiedEv } from '@/components/world/equipment/domains/computingWorldPlazaEquipmentModifiedEv';
import { resolvingWorldPlazaEquipmentAttackEvModifier } from '@/components/world/equipment/domains/resolvingWorldPlazaEquippedAttackEv';
import { resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';
import type { DefiningWildlifeLargeSizeFrame } from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeSpeciesId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeInstanceCombatStatMultiplier,
  resolvingWildlifeInstanceSpeedStatMultiplier,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

export type ResolvingWildlifePetAdvancedStatsParams = {
  speciesId: DefiningWildlifeSpeciesId | string;
  sizeScaleSample: number;
  largeSizeFrame?: DefiningWildlifeLargeSizeFrame | null;
  aggressionLevel?: DefiningWildlifeAggressionLevel;
  weaponItem?: DefiningInventoryItem | null;
};

export type ResolvingWildlifePetAdvancedStatsResult = {
  combat: number;
  agility: number;
  physicality: number;
};

/** Resolves Combat, Agility, and Physicality for the pet stats UI. */
export function resolvingWildlifePetAdvancedStats(
  params: ResolvingWildlifePetAdvancedStatsParams
): ResolvingWildlifePetAdvancedStatsResult | null {
  const species = resolvingWildlifeSpeciesDefinition(params.speciesId);

  if (!species) {
    return null;
  }

  const instanceProfile = {
    speciesId: params.speciesId,
    aggressionLevel: params.aggressionLevel ?? 'normal',
    sizeScaleSample: params.sizeScaleSample,
    largeSizeFrame: params.largeSizeFrame ?? null,
  };
  const sizeMult = resolvingWildlifeInstanceCombatStatMultiplier(
    species,
    instanceProfile
  );
  const sizeSpeedMult = resolvingWildlifeInstanceSpeedStatMultiplier(
    species,
    instanceProfile
  );
  const baseAttackPower = species.vitals.attackPower;
  const baseWalkSpeed = species.vitals.walkSpeedGridPerSecond;
  const baseMaxHealth = species.vitals.baseMaxHealth;

  let combat = Math.round(baseAttackPower * sizeMult);

  if (params.weaponItem) {
    const capabilities = resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId(
      params.weaponItem.itemTypeId
    );
    const modifier = resolvingWorldPlazaEquipmentAttackEvModifier(capabilities);
    combat = Math.round(computingWorldPlazaEquipmentModifiedEv(combat, modifier));
  }

  return {
    combat,
    agility: Math.round(baseWalkSpeed * sizeSpeedMult * 10),
    physicality: Math.round((baseMaxHealth * sizeMult) / 10),
  };
}
