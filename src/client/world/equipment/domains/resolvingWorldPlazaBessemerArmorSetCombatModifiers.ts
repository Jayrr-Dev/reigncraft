/**
 * Resolves Bessemer Plate combat crumbs from the current armor loadout.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaBessemerArmorSetCombatModifiers
 */

import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import {
  DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_FULL_SET_MARKER_ID,
  DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_FULL_SET_SHIELD_POINTS,
  DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_PIECE_REGISTRY,
  DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_SET_ID,
  DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_SET_THRESHOLDS,
  formattingWorldPlazaBessemerArmorSetCombatModifierId,
  resolvingWorldPlazaBessemerArmorPieceDefinition,
} from '@/components/world/equipment/domains/definingWorldPlazaBessemerArmorSetRegistry';
import type { DefiningWorldPlazaEntityHealthDamageRollModifier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS =
  100 * 365 * 24 * 60 * 60 * 1000;

export function listingWorldPlazaEquippedBessemerArmorPieces(
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

    if (!resolvingWorldPlazaBessemerArmorPieceDefinition(equipped.itemTypeId)) {
      continue;
    }

    pieces.push({ slotId, itemTypeId: equipped.itemTypeId });
  }

  return pieces;
}

/**
 * Builds long-lived defender damage-roll modifiers for worn Bessemer pieces + set tiers.
 */
export function resolvingWorldPlazaBessemerArmorSetCombatModifiers(
  loadout: DefiningWorldPlazaArmorLoadoutState,
  nowMs: number
): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  const equipped = listingWorldPlazaEquippedBessemerArmorPieces(loadout);
  const expiresAtMs =
    nowMs + DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS;
  const modifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[] = [];
  let crumbIndex = 0;

  for (const worn of equipped) {
    const piece = resolvingWorldPlazaBessemerArmorPieceDefinition(
      worn.itemTypeId
    );

    if (!piece) {
      continue;
    }

    for (const crumb of piece.pieceModifiers) {
      modifiers.push({
        id: formattingWorldPlazaBessemerArmorSetCombatModifierId(
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

  for (const threshold of DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_SET_THRESHOLDS) {
    if (pieceCount < threshold.minPieces) {
      continue;
    }

    for (const crumb of threshold.modifiers) {
      modifiers.push({
        id: formattingWorldPlazaBessemerArmorSetCombatModifierId(
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
        id: DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_FULL_SET_MARKER_ID,
        kind: 'expected',
        value: 1,
        expiresAtMs,
      });
    }
  }

  return modifiers;
}

export function checkingWorldPlazaBessemerArmorFullSetMarkerIsActive(
  modifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[]
): boolean {
  return modifiers.some(
    (modifier) =>
      modifier.id === DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_FULL_SET_MARKER_ID
  );
}

export function countingWorldPlazaBessemerArmorPiecesWorn(
  loadout: DefiningWorldPlazaArmorLoadoutState
): number {
  return listingWorldPlazaEquippedBessemerArmorPieces(loadout).length;
}

export function listingWorldPlazaBessemerArmorItemTypeIds(): readonly string[] {
  return DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_PIECE_REGISTRY.map(
    (piece) => piece.itemTypeId
  );
}

export function resolvingWorldPlazaBessemerArmorFullSetShieldFloor(
  hasFullSetMarker: boolean
): number {
  return hasFullSetMarker
    ? DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_FULL_SET_SHIELD_POINTS
    : 0;
}

export { DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_SET_ID };
