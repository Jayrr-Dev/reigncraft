/**
 * Resolves craftable plate-armor combat crumbs (per matching tier only).
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaCraftablePlateArmorSetCombatModifiers
 */

import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import {
  DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_ITEM_TYPE_IDS,
  formattingWorldPlazaCraftablePlateArmorSetCombatModifierId,
  resolvingWorldPlazaCraftablePlateArmorPieceDefinition,
  type DefiningWorldPlazaCraftablePlateArmorPieceDefinition,
} from '@/components/world/equipment/domains/definingWorldPlazaCraftablePlateArmorSetRegistry';
import type { DefiningWorldPlazaCraftablePlateArmorTierId } from '@/components/world/equipment/domains/definingWorldPlazaCraftablePlateArmorTierRegistry';
import type { DefiningWorldPlazaEntityHealthDamageRollModifier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS =
  100 * 365 * 24 * 60 * 60 * 1000;

type DefiningWorldPlazaEquippedCraftablePlateArmorPiece = {
  readonly slotId: DefiningWorldPlazaArmorSlotId;
  readonly piece: DefiningWorldPlazaCraftablePlateArmorPieceDefinition;
};

export function listingWorldPlazaEquippedCraftablePlateArmorPieces(
  loadout: DefiningWorldPlazaArmorLoadoutState
): readonly DefiningWorldPlazaEquippedCraftablePlateArmorPiece[] {
  const pieces: DefiningWorldPlazaEquippedCraftablePlateArmorPiece[] = [];

  for (const slotId of Object.keys(
    loadout
  ) as DefiningWorldPlazaArmorSlotId[]) {
    const equipped = loadout[slotId];

    if (!equipped) {
      continue;
    }

    const piece = resolvingWorldPlazaCraftablePlateArmorPieceDefinition(
      equipped.itemTypeId
    );

    if (!piece) {
      continue;
    }

    pieces.push({ slotId, piece });
  }

  return pieces;
}

/**
 * Builds defender damage-roll modifiers for each worn craftable plate tier.
 * Mixed tiers do not share set bonuses.
 */
export function resolvingWorldPlazaCraftablePlateArmorSetCombatModifiers(
  loadout: DefiningWorldPlazaArmorLoadoutState,
  nowMs: number
): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  const equipped = listingWorldPlazaEquippedCraftablePlateArmorPieces(loadout);
  const expiresAtMs =
    nowMs + DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS;
  const modifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[] = [];
  let crumbIndex = 0;

  const bySetId = new Map<
    DefiningWorldPlazaCraftablePlateArmorTierId,
    DefiningWorldPlazaEquippedCraftablePlateArmorPiece[]
  >();

  for (const worn of equipped) {
    const group = bySetId.get(worn.piece.setId) ?? [];
    group.push(worn);
    bySetId.set(worn.piece.setId, group);
  }

  for (const [setId, wornPieces] of bySetId) {
    for (const worn of wornPieces) {
      for (const crumb of worn.piece.pieceModifiers) {
        modifiers.push({
          id: formattingWorldPlazaCraftablePlateArmorSetCombatModifierId(
            setId,
            `piece-${worn.slotId}-${crumb.kind}-${crumbIndex}`
          ),
          kind: crumb.kind,
          value: crumb.value,
          expiresAtMs,
        });
        crumbIndex += 1;
      }
    }

    const pieceCount = wornPieces.length;
    const tier = wornPieces[0]?.piece.tier;

    if (!tier) {
      continue;
    }

    for (const threshold of tier.setThresholds) {
      if (pieceCount < threshold.minPieces) {
        continue;
      }

      for (const crumb of threshold.modifiers) {
        modifiers.push({
          id: formattingWorldPlazaCraftablePlateArmorSetCombatModifierId(
            setId,
            `set-${threshold.minPieces}-${crumb.kind}-${crumbIndex}`
          ),
          kind: crumb.kind,
          value: crumb.value,
          expiresAtMs,
        });
        crumbIndex += 1;
      }
    }
  }

  return modifiers;
}

export function countingWorldPlazaCraftablePlateArmorPiecesWorn(
  loadout: DefiningWorldPlazaArmorLoadoutState
): number {
  return listingWorldPlazaEquippedCraftablePlateArmorPieces(loadout).length;
}

export function listingWorldPlazaCraftablePlateArmorItemTypeIds(): readonly string[] {
  return DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_ITEM_TYPE_IDS;
}
