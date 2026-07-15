/**
 * Resolves per-hit attacker options for specialty weapons.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaSpecialtyWeaponOutgoingHitOptions
 */

import {
  encodingWorldPlazaSpecialtyWeaponForcedTierValue,
  formattingWorldPlazaSpecialtyWeaponModifierId,
  resolvingWorldPlazaSpecialtyWeaponDefinition,
  type DefiningWorldPlazaSpecialtyWeaponDefinition,
  type DefiningWorldPlazaSpecialtyWeaponOnHitBleedProc,
  type DefiningWorldPlazaSpecialtyWeaponOnHitPoisonProc,
  type DefiningWorldPlazaSpecialtyWeaponOnHitPotentialDamageProc,
  type DefiningWorldPlazaSpecialtyWeaponOnHitSelfCurseProc,
  type DefiningWorldPlazaSpecialtyWeaponOnHitSelfShieldProc,
  type DefiningWorldPlazaSpecialtyWeaponOnHitTemperatureProc,
} from '@/components/world/equipment/domains/definingWorldPlazaSpecialtyWeaponRegistry';
import type {
  DefiningWorldPlazaEntityHealthDamageOptions,
  DefiningWorldPlazaEntityHealthDamageRollModifier,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ResolvingWorldPlazaSpecialtyWeaponOutgoingHitOptionsResult = {
  readonly attackerDamageRollModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[];
  readonly forcedRollMode?: DefiningWorldPlazaEntityHealthDamageOptions['forcedRollMode'];
  readonly potentialDamageProc: DefiningWorldPlazaSpecialtyWeaponOnHitPotentialDamageProc | null;
  readonly selfCurseProc: DefiningWorldPlazaSpecialtyWeaponOnHitSelfCurseProc | null;
  readonly bleedProc: DefiningWorldPlazaSpecialtyWeaponOnHitBleedProc | null;
  readonly temperatureProc: DefiningWorldPlazaSpecialtyWeaponOnHitTemperatureProc | null;
  readonly poisonProc: DefiningWorldPlazaSpecialtyWeaponOnHitPoisonProc | null;
  readonly selfShieldProc: DefiningWorldPlazaSpecialtyWeaponOnHitSelfShieldProc | null;
};

function buildingPassiveAttackerModifiers(
  weapon: DefiningWorldPlazaSpecialtyWeaponDefinition
): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  return weapon.attackerRollModifiers.map((crumb, index) => ({
    id: formattingWorldPlazaSpecialtyWeaponModifierId(
      weapon.weaponId,
      `passive-${crumb.kind}-${index}`
    ),
    kind: crumb.kind,
    value: crumb.value,
    expiresAtMs: null,
  }));
}

/**
 * Builds attacker roll crumbs + one weighted on-hit proc for a swing.
 */
export function resolvingWorldPlazaSpecialtyWeaponOutgoingHitOptions(input: {
  readonly itemTypeId: string | null | undefined;
  readonly random?: () => number;
}): ResolvingWorldPlazaSpecialtyWeaponOutgoingHitOptionsResult {
  const empty: ResolvingWorldPlazaSpecialtyWeaponOutgoingHitOptionsResult = {
    attackerDamageRollModifiers: [],
    potentialDamageProc: null,
    selfCurseProc: null,
    bleedProc: null,
    temperatureProc: null,
    poisonProc: null,
    selfShieldProc: null,
  };

  if (!input.itemTypeId) {
    return empty;
  }

  const weapon = resolvingWorldPlazaSpecialtyWeaponDefinition(input.itemTypeId);

  if (!weapon) {
    return empty;
  }

  const attackerDamageRollModifiers = buildingPassiveAttackerModifiers(weapon);
  const roll = (input.random ?? Math.random)();
  let cursor = 0;

  for (const proc of weapon.onHitProcs) {
    cursor += proc.weight;

    if (roll >= cursor) {
      continue;
    }

    if (proc.kind === 'forced_tier') {
      attackerDamageRollModifiers.push({
        id: formattingWorldPlazaSpecialtyWeaponModifierId(
          weapon.weaponId,
          `on-hit-${proc.tier}`
        ),
        kind: 'forced_tier',
        value: encodingWorldPlazaSpecialtyWeaponForcedTierValue(proc.tier),
        expiresAtMs: null,
      });
      return { ...empty, attackerDamageRollModifiers };
    }

    if (proc.kind === 'lock_in') {
      return {
        ...empty,
        attackerDamageRollModifiers,
        forcedRollMode: 'lock_in',
      };
    }

    if (proc.kind === 'potential_damage') {
      return {
        ...empty,
        attackerDamageRollModifiers,
        potentialDamageProc: proc,
      };
    }

    if (proc.kind === 'bleed') {
      return {
        ...empty,
        attackerDamageRollModifiers,
        bleedProc: proc,
      };
    }

    if (proc.kind === 'temperature') {
      return {
        ...empty,
        attackerDamageRollModifiers,
        temperatureProc: proc,
      };
    }

    if (proc.kind === 'poison') {
      return {
        ...empty,
        attackerDamageRollModifiers,
        poisonProc: proc,
      };
    }

    if (proc.kind === 'self_shield') {
      return {
        ...empty,
        attackerDamageRollModifiers,
        selfShieldProc: proc,
      };
    }

    return {
      ...empty,
      attackerDamageRollModifiers,
      selfCurseProc: proc,
    };
  }

  return {
    ...empty,
    attackerDamageRollModifiers,
  };
}
