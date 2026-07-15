/**
 * Resolves Glass Veil combat crumbs and full-set instinct dodge procs.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaGlassVeilArmorSetCombatModifiers
 */

import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import {
  DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_FULL_SET_MARKER_ID,
  DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_PIECE_REGISTRY,
  DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_SET_THRESHOLDS,
  DEFINING_WORLD_PLAZA_GLASS_VEIL_INSTINCT_COOLDOWN_MS,
  encodingWorldPlazaGlassVeilForcedDodgedValue,
  formattingWorldPlazaGlassVeilArmorSetCombatModifierId,
  resolvingWorldPlazaGlassVeilArmorPieceDefinition,
} from '@/components/world/equipment/domains/definingWorldPlazaGlassVeilArmorSetRegistry';
import type { DefiningWorldPlazaEntityHealthDamageRollModifier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS =
  100 * 365 * 24 * 60 * 60 * 1000;

export function listingWorldPlazaEquippedGlassVeilArmorPieces(
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

    if (!resolvingWorldPlazaGlassVeilArmorPieceDefinition(equipped.itemTypeId)) {
      continue;
    }

    pieces.push({ slotId, itemTypeId: equipped.itemTypeId });
  }

  return pieces;
}

export function resolvingWorldPlazaGlassVeilArmorSetCombatModifiers(
  loadout: DefiningWorldPlazaArmorLoadoutState,
  nowMs: number
): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  const equipped = listingWorldPlazaEquippedGlassVeilArmorPieces(loadout);
  const expiresAtMs =
    nowMs + DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_DURATION_MS;
  const modifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[] = [];
  let crumbIndex = 0;

  for (const worn of equipped) {
    const piece = resolvingWorldPlazaGlassVeilArmorPieceDefinition(
      worn.itemTypeId
    );

    if (!piece) {
      continue;
    }

    for (const crumb of piece.pieceModifiers) {
      modifiers.push({
        id: formattingWorldPlazaGlassVeilArmorSetCombatModifierId(
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

  for (const threshold of DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_SET_THRESHOLDS) {
    if (pieceCount < threshold.minPieces) {
      continue;
    }

    for (const crumb of threshold.modifiers) {
      modifiers.push({
        id: formattingWorldPlazaGlassVeilArmorSetCombatModifierId(
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
        id: DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_FULL_SET_MARKER_ID,
        kind: 'expected',
        value: 1,
        expiresAtMs,
      });
    }
  }

  return modifiers;
}

export function checkingWorldPlazaGlassVeilArmorFullSetMarkerIsActive(
  modifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[]
): boolean {
  return modifiers.some(
    (modifier) =>
      modifier.id === DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_FULL_SET_MARKER_ID
  );
}

/**
 * Full-set instinct: force Dodged on physical hit when cooldown ready.
 * Returns modifiers + whether the cooldown should start.
 */
export function resolvingWorldPlazaGlassVeilFullSetOnHitEphemeralModifiers(input: {
  readonly hasFullSetMarker: boolean;
  readonly damageKind: string;
  readonly nowMs: number;
  readonly lastInstinctProcAtMs: number;
}): {
  readonly modifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[];
  readonly didProc: boolean;
} {
  if (!input.hasFullSetMarker || input.damageKind !== 'physical') {
    return { modifiers: [], didProc: false };
  }

  if (
    input.nowMs - input.lastInstinctProcAtMs <
    DEFINING_WORLD_PLAZA_GLASS_VEIL_INSTINCT_COOLDOWN_MS
  ) {
    return { modifiers: [], didProc: false };
  }

  return {
    modifiers: [
      {
        id: formattingWorldPlazaGlassVeilArmorSetCombatModifierId(
          'on-hit-instinct-dodged'
        ),
        kind: 'forced_tier',
        value: encodingWorldPlazaGlassVeilForcedDodgedValue(),
        expiresAtMs: null,
      },
    ],
    didProc: true,
  };
}

export function countingWorldPlazaGlassVeilArmorPiecesWorn(
  loadout: DefiningWorldPlazaArmorLoadoutState
): number {
  return listingWorldPlazaEquippedGlassVeilArmorPieces(loadout).length;
}

export function listingWorldPlazaGlassVeilArmorItemTypeIds(): readonly string[] {
  return DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_PIECE_REGISTRY.map(
    (piece) => piece.itemTypeId
  );
}
