/**
 * Pure advanced stat presentation for bonded companions.
 * Shows real combat values (Attack, Defense, Attack speed, Speed, and Max HP),
 * matching Character attribute chips — not opaque Combat/Agility/Physicality scores.
 *
 * @module components/world/wildlife/pets/domains/resolvingWildlifePetAdvancedStats
 */

import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import { computingWorldPlazaEquipmentModifiedEv } from '@/components/world/equipment/domains/computingWorldPlazaEquipmentModifiedEv';
import { resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId';
import { resolvingWorldPlazaEquipmentAttackEvModifier } from '@/components/world/equipment/domains/resolvingWorldPlazaEquippedAttackEv';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeInstanceAttackPowerMultiplier,
  resolvingWildlifeInstanceBaseMaxHealth,
  resolvingWildlifeInstanceEffectiveAttackIntervalMs,
  resolvingWildlifeInstanceEffectiveDefense,
  resolvingWildlifeInstanceRunSpeedGridPerSecond,
  resolvingWildlifeInstanceSpritcoreUpgradeAttackPowerBonus,
  resolvingWildlifeInstanceWalkSpeedGridPerSecond,
} from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';

export type ResolvingWildlifePetAdvancedStatsParams = {
  instance: DefiningWildlifeInstance;
  weaponItem?: DefiningInventoryItem | null;
};

export type ResolvingWildlifePetAdvancedStatEntry = {
  id: 'attack' | 'defense' | 'attack-speed' | 'speed' | 'max-health';
  label: string;
  iconId: string;
  valueText: string;
};

export type ResolvingWildlifePetAdvancedStatsResult = {
  entries: readonly ResolvingWildlifePetAdvancedStatEntry[];
};

/** Resolves live Attack, Defense, Attack speed, Speed, and Max HP for the pet stats UI. */
export function resolvingWildlifePetAdvancedStats(
  params: ResolvingWildlifePetAdvancedStatsParams
): ResolvingWildlifePetAdvancedStatsResult | null {
  const species = resolvingWildlifeSpeciesDefinition(params.instance.speciesId);

  if (!species) {
    return null;
  }

  const attackPower =
    species.vitals.attackPower *
      resolvingWildlifeInstanceAttackPowerMultiplier(species, params.instance) +
    resolvingWildlifeInstanceSpritcoreUpgradeAttackPowerBonus(params.instance);
  let attackEv = attackPower;

  if (params.weaponItem) {
    const capabilities = resolvingWorldPlazaEquipmentCapabilitiesForItemTypeId(
      params.weaponItem.itemTypeId
    );
    const modifier = resolvingWorldPlazaEquipmentAttackEvModifier(capabilities);
    attackEv = computingWorldPlazaEquipmentModifiedEv(attackEv, modifier);
  }

  const defense = resolvingWildlifeInstanceEffectiveDefense(
    species,
    params.instance
  );
  const attackIntervalMs = resolvingWildlifeInstanceEffectiveAttackIntervalMs(
    species,
    params.instance
  );
  const attackSpeedPerSecond = 1000 / Math.max(1, attackIntervalMs);
  const walkSpeed = resolvingWildlifeInstanceWalkSpeedGridPerSecond(
    species,
    params.instance
  );
  const runSpeed = resolvingWildlifeInstanceRunSpeedGridPerSecond(
    species,
    params.instance
  );
  const maxHealth = resolvingWildlifeInstanceBaseMaxHealth(
    species,
    params.instance
  );

  return {
    entries: [
      {
        id: 'attack',
        label: 'Attack',
        iconId: 'boxicons:sword-filled',
        valueText: `${Math.round(attackEv)}`,
      },
      {
        id: 'defense',
        label: 'Defense',
        iconId: 'mdi:shield-half-full',
        valueText: `${defense}`,
      },
      {
        id: 'attack-speed',
        label: 'Attack speed',
        iconId: 'mdi:flash',
        valueText: `${attackSpeedPerSecond.toFixed(1)}/s`,
      },
      {
        id: 'speed',
        label: 'Speed',
        iconId: 'mdi:run-fast',
        valueText: `${walkSpeed.toFixed(1)} / ${runSpeed.toFixed(1)}`,
      },
      {
        id: 'max-health',
        label: 'Max HP',
        iconId: 'solar:heart-pulse-bold',
        valueText: `${maxHealth}`,
      },
    ],
  };
}
