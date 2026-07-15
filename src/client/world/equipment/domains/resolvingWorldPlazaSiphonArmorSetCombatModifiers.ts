/**
 * Resolves Siphon damage-roll crumbs, absorb, and full-set lifesteal.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaSiphonArmorSetCombatModifiers
 */

import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import {
  DEFINING_WORLD_PLAZA_SIPHON_ARMOR_FULL_SET_MARKER_ID,
  DEFINING_WORLD_PLAZA_SIPHON_ARMOR_PIECE_REGISTRY,
  DEFINING_WORLD_PLAZA_SIPHON_ARMOR_SET_THRESHOLDS,
  formattingWorldPlazaSiphonArmorSetCombatModifierId,
  resolvingWorldPlazaSiphonArmorPieceDefinition,
} from '@/components/world/equipment/domains/definingWorldPlazaSiphonArmorSetRegistry';
import type {
  DefiningWorldPlazaEntityHealthDamageRollModifier,
  DefiningWorldPlazaEntityHealthIncomingDamageHealModifier,
  DefiningWorldPlazaEntityHealthPhysicalDamageLifestealModifier,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS =
  100 * 365 * 24 * 60 * 60 * 1000;

export type ResolvingWorldPlazaSiphonArmorSetCombatBundle = {
  readonly damageRollModifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
  readonly incomingDamageHealModifiers: readonly DefiningWorldPlazaEntityHealthIncomingDamageHealModifier[];
  readonly physicalDamageLifestealModifiers: readonly DefiningWorldPlazaEntityHealthPhysicalDamageLifestealModifier[];
};

export function listingWorldPlazaEquippedSiphonArmorPieces(
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

    if (!resolvingWorldPlazaSiphonArmorPieceDefinition(equipped.itemTypeId)) {
      continue;
    }

    pieces.push({ slotId, itemTypeId: equipped.itemTypeId });
  }

  return pieces;
}

export function resolvingWorldPlazaSiphonArmorSetCombatBundle(
  loadout: DefiningWorldPlazaArmorLoadoutState,
  nowMs: number
): ResolvingWorldPlazaSiphonArmorSetCombatBundle {
  const equipped = listingWorldPlazaEquippedSiphonArmorPieces(loadout);
  const expiresAtMs =
    nowMs + DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS;
  const damageRollModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[] =
    [];
  const incomingDamageHealModifiers: DefiningWorldPlazaEntityHealthIncomingDamageHealModifier[] =
    [];
  const physicalDamageLifestealModifiers: DefiningWorldPlazaEntityHealthPhysicalDamageLifestealModifier[] =
    [];
  let crumbIndex = 0;

  for (const worn of equipped) {
    const piece = resolvingWorldPlazaSiphonArmorPieceDefinition(
      worn.itemTypeId
    );

    if (!piece) {
      continue;
    }

    for (const crumb of piece.pieceModifiers) {
      damageRollModifiers.push({
        id: formattingWorldPlazaSiphonArmorSetCombatModifierId(
          `piece-${worn.slotId}-${crumb.kind}-${crumbIndex}`
        ),
        kind: crumb.kind,
        value: crumb.value,
        expiresAtMs,
      });
      crumbIndex += 1;
    }

    for (const healCrumb of piece.pieceHealModifiers) {
      if (healCrumb.kind === 'absorb') {
        incomingDamageHealModifiers.push({
          id: formattingWorldPlazaSiphonArmorSetCombatModifierId(
            `piece-${worn.slotId}-absorb-${crumbIndex}`
          ),
          ratio: healCrumb.ratio,
          expiresAtMs,
        });
      } else {
        physicalDamageLifestealModifiers.push({
          id: formattingWorldPlazaSiphonArmorSetCombatModifierId(
            `piece-${worn.slotId}-lifesteal-${crumbIndex}`
          ),
          ratio: healCrumb.ratio,
          expiresAtMs,
        });
      }
      crumbIndex += 1;
    }
  }

  const pieceCount = equipped.length;

  for (const threshold of DEFINING_WORLD_PLAZA_SIPHON_ARMOR_SET_THRESHOLDS) {
    if (pieceCount < threshold.minPieces) {
      continue;
    }

    for (const crumb of threshold.modifiers) {
      damageRollModifiers.push({
        id: formattingWorldPlazaSiphonArmorSetCombatModifierId(
          `set-${threshold.minPieces}-${crumb.kind}-${crumbIndex}`
        ),
        kind: crumb.kind,
        value: crumb.value,
        expiresAtMs,
      });
      crumbIndex += 1;
    }

    for (const healCrumb of threshold.healModifiers ?? []) {
      if (healCrumb.kind === 'absorb') {
        incomingDamageHealModifiers.push({
          id: formattingWorldPlazaSiphonArmorSetCombatModifierId(
            `set-${threshold.minPieces}-absorb-${crumbIndex}`
          ),
          ratio: healCrumb.ratio,
          expiresAtMs,
        });
      } else {
        physicalDamageLifestealModifiers.push({
          id: formattingWorldPlazaSiphonArmorSetCombatModifierId(
            `set-${threshold.minPieces}-lifesteal-${crumbIndex}`
          ),
          ratio: healCrumb.ratio,
          expiresAtMs,
        });
      }
      crumbIndex += 1;
    }

    if (threshold.grantsFullSetMarker) {
      damageRollModifiers.push({
        id: DEFINING_WORLD_PLAZA_SIPHON_ARMOR_FULL_SET_MARKER_ID,
        kind: 'expected',
        value: 1,
        expiresAtMs,
      });
    }
  }

  return {
    damageRollModifiers,
    incomingDamageHealModifiers,
    physicalDamageLifestealModifiers,
  };
}

export function countingWorldPlazaSiphonArmorPiecesWorn(
  loadout: DefiningWorldPlazaArmorLoadoutState
): number {
  return listingWorldPlazaEquippedSiphonArmorPieces(loadout).length;
}

export function listingWorldPlazaSiphonArmorItemTypeIds(): readonly string[] {
  return DEFINING_WORLD_PLAZA_SIPHON_ARMOR_PIECE_REGISTRY.map(
    (piece) => piece.itemTypeId
  );
}
