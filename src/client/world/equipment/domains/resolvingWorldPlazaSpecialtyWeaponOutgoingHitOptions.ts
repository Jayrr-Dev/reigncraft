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
  type DefiningWorldPlazaSpecialtyWeaponOnHitPotentialDamageProc,
  type DefiningWorldPlazaSpecialtyWeaponOnHitSelfCurseProc,
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
      return {
        attackerDamageRollModifiers,
        potentialDamageProc: null,
        selfCurseProc: null,
        bleedProc: null,
        temperatureProc: null,
      };
    }

    if (proc.kind === 'lock_in') {
      return {
        attackerDamageRollModifiers,
        forcedRollMode: 'lock_in',
        potentialDamageProc: null,
        selfCurseProc: null,
        bleedProc: null,
        temperatureProc: null,
      };
    }

    if (proc.kind === 'potential_damage') {
      return {
        attackerDamageRollModifiers,
        potentialDamageProc: proc,
        selfCurseProc: null,
        bleedProc: null,
        temperatureProc: null,
      };
    }

    if (proc.kind === 'bleed') {
      return {
        attackerDamageRollModifiers,
        potentialDamageProc: null,
        selfCurseProc: null,
        bleedProc: proc,
        temperatureProc: null,
      };
    }

    if (proc.kind === 'temperature') {
      return {
        attackerDamageRollModifiers,
        potentialDamageProc: null,
        selfCurseProc: null,
        bleedProc: null,
        temperatureProc: proc,
      };
    }

    return {
      attackerDamageRollModifiers,
      potentialDamageProc: null,
      selfCurseProc: proc,
      bleedProc: null,
      temperatureProc: null,
    };
  }

  return {
    attackerDamageRollModifiers,
    potentialDamageProc: null,
    selfCurseProc: null,
    bleedProc: null,
    temperatureProc: null,
  };
}
