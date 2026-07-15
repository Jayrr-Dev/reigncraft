/**
 * Resolves Chaos Set combat crumbs from the current armor loadout.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaChaosArmorSetCombatModifiers
 */

import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import {
  DEFINING_WORLD_PLAZA_CHAOS_ARMOR_FULL_SET_MARKER_ID,
  DEFINING_WORLD_PLAZA_CHAOS_ARMOR_FULL_SET_ON_HIT_PROCS,
  DEFINING_WORLD_PLAZA_CHAOS_ARMOR_PIECE_REGISTRY,
  DEFINING_WORLD_PLAZA_CHAOS_ARMOR_SET_ID,
  DEFINING_WORLD_PLAZA_CHAOS_ARMOR_SET_THRESHOLDS,
  encodingWorldPlazaChaosArmorForcedTierValue,
  formattingWorldPlazaArmorSetCombatModifierId,
  resolvingWorldPlazaChaosArmorPieceDefinition,
} from '@/components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry';
import type { DefiningWorldPlazaEntityHealthDamageRollModifier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS =
  100 * 365 * 24 * 60 * 60 * 1000;

export function listingWorldPlazaEquippedChaosArmorPieces(
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

    if (!resolvingWorldPlazaChaosArmorPieceDefinition(equipped.itemTypeId)) {
      continue;
    }

    pieces.push({ slotId, itemTypeId: equipped.itemTypeId });
  }

  return pieces;
}

/**
 * Builds long-lived defender damage-roll modifiers for worn Chaos pieces + set tiers.
 */
export function resolvingWorldPlazaChaosArmorSetCombatModifiers(
  loadout: DefiningWorldPlazaArmorLoadoutState,
  nowMs: number
): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  const equipped = listingWorldPlazaEquippedChaosArmorPieces(loadout);
  const expiresAtMs =
    nowMs + DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS;
  const modifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[] = [];
  let crumbIndex = 0;

  for (const worn of equipped) {
    const piece = resolvingWorldPlazaChaosArmorPieceDefinition(worn.itemTypeId);

    if (!piece) {
      continue;
    }

    for (const crumb of piece.pieceModifiers) {
      modifiers.push({
        id: formattingWorldPlazaArmorSetCombatModifierId(
          DEFINING_WORLD_PLAZA_CHAOS_ARMOR_SET_ID,
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

  for (const threshold of DEFINING_WORLD_PLAZA_CHAOS_ARMOR_SET_THRESHOLDS) {
    if (pieceCount < threshold.minPieces) {
      continue;
    }

    for (const crumb of threshold.modifiers) {
      modifiers.push({
        id: formattingWorldPlazaArmorSetCombatModifierId(
          DEFINING_WORLD_PLAZA_CHAOS_ARMOR_SET_ID,
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
        id: DEFINING_WORLD_PLAZA_CHAOS_ARMOR_FULL_SET_MARKER_ID,
        kind: 'expected',
        value: 1,
        expiresAtMs,
      });
    }
  }

  return modifiers;
}

/**
 * When full Chaos set is marked on health, maybe force an extreme tier for one hit.
 */
export function resolvingWorldPlazaChaosArmorFullSetOnHitEphemeralModifiers(input: {
  readonly hasFullSetMarker: boolean;
  readonly damageKind: string;
  readonly random?: () => number;
}): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  if (!input.hasFullSetMarker || input.damageKind !== 'physical') {
    return [];
  }

  const roll = (input.random ?? Math.random)();
  let cursor = 0;

  for (const proc of DEFINING_WORLD_PLAZA_CHAOS_ARMOR_FULL_SET_ON_HIT_PROCS) {
    cursor += proc.weight;

    if (roll >= cursor) {
      continue;
    }

    return [
      {
        id: formattingWorldPlazaArmorSetCombatModifierId(
          DEFINING_WORLD_PLAZA_CHAOS_ARMOR_SET_ID,
          `on-hit-${proc.tier}`
        ),
        kind: 'forced_tier',
        value: encodingWorldPlazaChaosArmorForcedTierValue(proc.tier),
        expiresAtMs: null,
      },
    ];
  }

  return [];
}

export function checkingWorldPlazaChaosArmorFullSetMarkerIsActive(
  modifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[]
): boolean {
  return modifiers.some(
    (modifier) =>
      modifier.id === DEFINING_WORLD_PLAZA_CHAOS_ARMOR_FULL_SET_MARKER_ID
  );
}

/** Exported for tests / HUD: piece count for the Chaos set. */
export function countingWorldPlazaChaosArmorPiecesWorn(
  loadout: DefiningWorldPlazaArmorLoadoutState
): number {
  return listingWorldPlazaEquippedChaosArmorPieces(loadout).length;
}

export function listingWorldPlazaChaosArmorItemTypeIds(): readonly string[] {
  return DEFINING_WORLD_PLAZA_CHAOS_ARMOR_PIECE_REGISTRY.map(
    (piece) => piece.itemTypeId
  );
}
