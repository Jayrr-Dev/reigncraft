/**
 * Spritcore drop ladder: 4 orbs × color cycles (violet → crimson → gold).
 * All payouts share one stack pool; sprite/overlay change by stack quantity.
 * Higher SC repeats the orb cycle with a color overlay (no new sprites).
 *
 * @module components/world/spritcore/domains/definingWorldPlazaSpritcoreDropTierConstants
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT_CRIMSON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT_CRIMSON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT_CRIMSON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_STRONG,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_STRONG_CRIMSON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_STRONG_GOLD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/** Orb power step within one color cycle (sheet column 0–3). */
export type DefiningWorldPlazaSpritcoreOrbStepId = 1 | 2 | 3 | 4;

/** Color cycle: native violet art, then red overlay, then gold overlay. */
export type DefiningWorldPlazaSpritcoreColorCycleId =
  | 'violet'
  | 'crimson'
  | 'gold';

/** Ladder rank 1…12 across all cycles. */
export type DefiningWorldPlazaSpritcoreDropTierId =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;

export type DefiningWorldPlazaSpritcoreColorCycleDefinition = {
  readonly cycleId: DefiningWorldPlazaSpritcoreColorCycleId;
  readonly displayAdjective: string;
  /** CSS fill for mask overlay; null keeps native purple art. */
  readonly overlayColor: string | null;
};

export type DefiningWorldPlazaSpritcoreOrbStepDefinition = {
  readonly orbStep: DefiningWorldPlazaSpritcoreOrbStepId;
  readonly baseName: string;
  readonly spriteColumnIndex: number;
  /** Band width before the final infinite gold-radiant step. */
  readonly bandWidth: number;
};

export type DefiningWorldPlazaSpritcoreDropTierDefinition = {
  readonly tier: DefiningWorldPlazaSpritcoreDropTierId;
  readonly orbStep: DefiningWorldPlazaSpritcoreOrbStepId;
  readonly cycleId: DefiningWorldPlazaSpritcoreColorCycleId;
  /** Canonical stack pool id (always the shared Spritcore type). */
  readonly itemTypeId: string;
  /**
   * Pre-unified tier item ids kept for save/ground migration + is-spritcore checks.
   */
  readonly legacyItemTypeId: string;
  readonly displayName: string;
  readonly minDropAmountInclusive: number;
  readonly maxDropAmountInclusive: number;
  readonly spriteColumnIndex: number;
  readonly overlayColor: string | null;
};

export const DEFINING_WORLD_PLAZA_SPRITCORE_COLOR_CYCLE_DEFINITIONS: readonly DefiningWorldPlazaSpritcoreColorCycleDefinition[] =
  [
    {
      cycleId: 'violet',
      displayAdjective: '',
      overlayColor: null,
    },
    {
      cycleId: 'crimson',
      displayAdjective: 'Crimson ',
      overlayColor: '#e11d48',
    },
    {
      cycleId: 'gold',
      displayAdjective: 'Gilded ',
      overlayColor: '#f5c518',
    },
  ] as const;

export const DEFINING_WORLD_PLAZA_SPRITCORE_ORB_STEP_DEFINITIONS: readonly DefiningWorldPlazaSpritcoreOrbStepDefinition[] =
  [
    {
      orbStep: 1,
      baseName: 'Faint Spritcore',
      spriteColumnIndex: 0,
      bandWidth: 30,
    },
    {
      orbStep: 2,
      baseName: 'Bright Spritcore',
      spriteColumnIndex: 1,
      bandWidth: 30,
    },
    {
      orbStep: 3,
      baseName: 'Strong Spritcore',
      spriteColumnIndex: 2,
      bandWidth: 60,
    },
    {
      orbStep: 4,
      baseName: 'Radiant Spritcore',
      spriteColumnIndex: 3,
      bandWidth: 120,
    },
  ] as const;

/** Legacy per-tier item ids (pre-unified stack pool). */
const DEFINING_WORLD_PLAZA_SPRITCORE_LEGACY_ITEM_TYPE_ID_BY_CYCLE_AND_ORB: Readonly<
  Record<
    DefiningWorldPlazaSpritcoreColorCycleId,
    Record<DefiningWorldPlazaSpritcoreOrbStepId, string>
  >
> = {
  violet: {
    1: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT,
    2: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT,
    3: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_STRONG,
    4: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT,
  },
  crimson: {
    1: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT_CRIMSON,
    2: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT_CRIMSON,
    3: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_STRONG_CRIMSON,
    4: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT_CRIMSON,
  },
  gold: {
    1: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT_GOLD,
    2: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT_GOLD,
    3: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_STRONG_GOLD,
    4: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT_GOLD,
  },
};

function buildingWorldPlazaSpritcoreDropTierDefinitions(): DefiningWorldPlazaSpritcoreDropTierDefinition[] {
  const definitions: DefiningWorldPlazaSpritcoreDropTierDefinition[] = [];
  let nextMinAmount = 1;
  let tierRank = 1;

  for (const colorCycle of DEFINING_WORLD_PLAZA_SPRITCORE_COLOR_CYCLE_DEFINITIONS) {
    for (const orbStep of DEFINING_WORLD_PLAZA_SPRITCORE_ORB_STEP_DEFINITIONS) {
      const isFinalStep =
        colorCycle.cycleId === 'gold' && orbStep.orbStep === 4;
      const maxDropAmountInclusive = isFinalStep
        ? Number.POSITIVE_INFINITY
        : nextMinAmount + orbStep.bandWidth - 1;

      definitions.push({
        tier: tierRank as DefiningWorldPlazaSpritcoreDropTierId,
        orbStep: orbStep.orbStep,
        cycleId: colorCycle.cycleId,
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
        legacyItemTypeId:
          DEFINING_WORLD_PLAZA_SPRITCORE_LEGACY_ITEM_TYPE_ID_BY_CYCLE_AND_ORB[
            colorCycle.cycleId
          ][orbStep.orbStep],
        displayName: `${colorCycle.displayAdjective}${orbStep.baseName}`,
        minDropAmountInclusive: nextMinAmount,
        maxDropAmountInclusive,
        spriteColumnIndex: orbStep.spriteColumnIndex,
        overlayColor: colorCycle.overlayColor,
      });

      if (!isFinalStep) {
        nextMinAmount = maxDropAmountInclusive + 1;
      }

      tierRank += 1;
    }
  }

  return definitions;
}

/** Ordered weakest → strongest across violet, crimson, and gold cycles. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_DROP_TIER_DEFINITIONS: readonly DefiningWorldPlazaSpritcoreDropTierDefinition[] =
  buildingWorldPlazaSpritcoreDropTierDefinitions();

/** Legacy tier item type ids still accepted from old saves / ground loot. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_TIERED_ITEM_TYPE_IDS =
  DEFINING_WORLD_PLAZA_SPRITCORE_DROP_TIER_DEFINITIONS.map(
    (tierDefinition) => tierDefinition.legacyItemTypeId
  );
