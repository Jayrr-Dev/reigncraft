/**
 * Resolves Iron Plate combat crumbs from the current armor loadout.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaIronPlateArmorSetCombatModifiers
 */

import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import {
  DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_PIECE_REGISTRY,
  DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_SET_ID,
  DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_SET_THRESHOLDS,
  formattingWorldPlazaIronPlateArmorSetCombatModifierId,
  resolvingWorldPlazaIronPlateArmorPieceDefinition,
} from '@/components/world/equipment/domains/definingWorldPlazaIronPlateArmorSetRegistry';
import type { DefiningWorldPlazaEntityHealthDamageRollModifier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS =
  100 * 365 * 24 * 60 * 60 * 1000;

export function listingWorldPlazaEquippedIronPlateArmorPieces(
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
      !resolvingWorldPlazaIronPlateArmorPieceDefinition(equipped.itemTypeId)
    ) {
      continue;
    }

    pieces.push({ slotId, itemTypeId: equipped.itemTypeId });
  }

  return pieces;
}

/**
 * Builds long-lived defender damage-roll modifiers for worn Iron Plate pieces + set tiers.
 */
export function resolvingWorldPlazaIronPlateArmorSetCombatModifiers(
  loadout: DefiningWorldPlazaArmorLoadoutState,
  nowMs: number
): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  const equipped = listingWorldPlazaEquippedIronPlateArmorPieces(loadout);
  const expiresAtMs =
    nowMs + DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS;
  const modifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[] = [];
  let crumbIndex = 0;

  for (const worn of equipped) {
    const piece = resolvingWorldPlazaIronPlateArmorPieceDefinition(
      worn.itemTypeId
    );

    if (!piece) {
      continue;
    }

    for (const crumb of piece.pieceModifiers) {
      modifiers.push({
        id: formattingWorldPlazaIronPlateArmorSetCombatModifierId(
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

  for (const threshold of DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_SET_THRESHOLDS) {
    if (pieceCount < threshold.minPieces) {
      continue;
    }

    for (const crumb of threshold.modifiers) {
      modifiers.push({
        id: formattingWorldPlazaIronPlateArmorSetCombatModifierId(
          `set-${threshold.minPieces}-${crumb.kind}-${crumbIndex}`
        ),
        kind: crumb.kind,
        value: crumb.value,
        expiresAtMs,
      });
      crumbIndex += 1;
    }
  }

  return modifiers;
}

export function countingWorldPlazaIronPlateArmorPiecesWorn(
  loadout: DefiningWorldPlazaArmorLoadoutState
): number {
  return listingWorldPlazaEquippedIronPlateArmorPieces(loadout).length;
}

export function listingWorldPlazaIronPlateArmorItemTypeIds(): readonly string[] {
  return DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_PIECE_REGISTRY.map(
    (piece) => piece.itemTypeId
  );
}

export { DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_SET_ID };
