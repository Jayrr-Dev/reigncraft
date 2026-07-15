/**
 * Resolves Apostle Clay combat crumbs and full-set Exposed crack procs.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaApostleClayArmorSetCombatModifiers
 */

import {
  DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_FULL_SET_MARKER_ID,
  DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_FULL_SET_ON_HIT_PROCS,
  DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_PIECE_REGISTRY,
  DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_SET_ID,
  DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_SET_THRESHOLDS,
  encodingWorldPlazaApostleClayArmorForcedTierValue,
  formattingWorldPlazaApostleClayArmorSetCombatModifierId,
  resolvingWorldPlazaApostleClayArmorPieceDefinition,
} from '@/components/world/equipment/domains/definingWorldPlazaApostleClayArmorSetRegistry';
import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import { formattingWorldPlazaArmorSetCombatModifierId } from '@/components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry';
import type { DefiningWorldPlazaEntityHealthDamageRollModifier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS =
  100 * 365 * 24 * 60 * 60 * 1000;

export function listingWorldPlazaEquippedApostleClayArmorPieces(
  loadout: DefiningWorldPlazaArmorLoadoutState
): readonly { slotId: DefiningWorldPlazaArmorSlotId; itemTypeId: string }[] {
  const pieces: {
    slotId: DefiningWorldPlazaArmorSlotId;
    itemTypeId: string;
  }[] = [];

  for (const slotId of Object.keys(
    loadout
  ) as DefiningWorldPlazaArmorSlotId[]) {
    const equipped = loadout[slotId];

    if (!equipped) {
      continue;
    }

    if (
      !resolvingWorldPlazaApostleClayArmorPieceDefinition(equipped.itemTypeId)
    ) {
      continue;
    }

    pieces.push({ slotId, itemTypeId: equipped.itemTypeId });
  }

  return pieces;
}

export function resolvingWorldPlazaApostleClayArmorSetCombatModifiers(
  loadout: DefiningWorldPlazaArmorLoadoutState,
  nowMs: number
): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  const equipped = listingWorldPlazaEquippedApostleClayArmorPieces(loadout);
  const expiresAtMs =
    nowMs + DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS;
  const modifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[] = [];
  let crumbIndex = 0;

  for (const worn of equipped) {
    const piece = resolvingWorldPlazaApostleClayArmorPieceDefinition(
      worn.itemTypeId
    );

    if (!piece) {
      continue;
    }

    for (const crumb of piece.pieceModifiers) {
      modifiers.push({
        id: formattingWorldPlazaApostleClayArmorSetCombatModifierId(
          `piece-${worn.slotId}-${crumb.kind}-${crumbIndex}`
        ),
        kind: crumb.kind,
        value: crumb.value,
        expiresAtMs,
      });
      crumbIndex += 1;
    }
  }

  const pieceCount = equipped.length;

  for (const threshold of DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_SET_THRESHOLDS) {
    if (pieceCount < threshold.minPieces) {
      continue;
    }

    for (const crumb of threshold.modifiers) {
      modifiers.push({
        id: formattingWorldPlazaApostleClayArmorSetCombatModifierId(
          `set-${threshold.minPieces}-${crumb.kind}-${crumbIndex}`
        ),
        kind: crumb.kind,
        value: crumb.value,
        expiresAtMs,
      });
      crumbIndex += 1;
    }

    if (threshold.grantsFullSetMarker) {
      modifiers.push({
        id: DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_FULL_SET_MARKER_ID,
        kind: 'expected',
        value: 1,
        expiresAtMs,
      });
    }
  }

  return modifiers;
}

/**
 * Full-set crack: 8% force Critical on physical hit taken.
 */
export function resolvingWorldPlazaApostleClayArmorFullSetOnHitEphemeralModifiers(input: {
  readonly hasFullSetMarker: boolean;
  readonly damageKind: string;
  readonly random?: () => number;
}): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  if (!input.hasFullSetMarker || input.damageKind !== 'physical') {
    return [];
  }

  const roll = (input.random ?? Math.random)();
  let cursor = 0;

  for (const proc of DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_FULL_SET_ON_HIT_PROCS) {
    cursor += proc.weight;

    if (roll >= cursor) {
      continue;
    }

    return [
      {
        id: formattingWorldPlazaArmorSetCombatModifierId(
          DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_SET_ID,
          `on-hit-${proc.tier}`
        ),
        kind: 'forced_tier',
        value: encodingWorldPlazaApostleClayArmorForcedTierValue(proc.tier),
        expiresAtMs: null,
      },
    ];
  }

  return [];
}

export function checkingWorldPlazaApostleClayArmorFullSetMarkerIsActive(
  modifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[]
): boolean {
  return modifiers.some(
    (modifier) =>
      modifier.id === DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_FULL_SET_MARKER_ID
  );
}

export function countingWorldPlazaApostleClayArmorPiecesWorn(
  loadout: DefiningWorldPlazaArmorLoadoutState
): number {
  return listingWorldPlazaEquippedApostleClayArmorPieces(loadout).length;
}

export function listingWorldPlazaApostleClayArmorItemTypeIds(): readonly string[] {
  return DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_PIECE_REGISTRY.map(
    (piece) => piece.itemTypeId
  );
}
