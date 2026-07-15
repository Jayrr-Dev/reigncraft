import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT_CRIMSON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_STRONG,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  resolvingWorldPlazaSpritcoreDropItemTypeId,
  resolvingWorldPlazaSpritcoreDropTierDefinition,
  resolvingWorldPlazaSpritcoreDropTierId,
} from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreDropTier';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaSpritcoreDropTier', () => {
  it('maps small wildlife payouts to violet faint', () => {
    expect(resolvingWorldPlazaSpritcoreDropTierId(7)).toBe(1);
    expect(resolvingWorldPlazaSpritcoreDropItemTypeId(7)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT
    );
  });

  it('maps medium wildlife payouts across the violet cycle', () => {
    expect(resolvingWorldPlazaSpritcoreDropItemTypeId(33)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_BRIGHT
    );
    expect(resolvingWorldPlazaSpritcoreDropItemTypeId(90)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_STRONG
    );
    expect(resolvingWorldPlazaSpritcoreDropItemTypeId(144)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT
    );
  });

  it('repeats the orb cycle with crimson then gold overlays', () => {
    const crimsonFaint = resolvingWorldPlazaSpritcoreDropTierDefinition(241);
    expect(crimsonFaint.cycleId).toBe('crimson');
    expect(crimsonFaint.overlayColor).toBe('#e11d48');
    expect(crimsonFaint.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_FAINT_CRIMSON
    );

    const goldRadiant = resolvingWorldPlazaSpritcoreDropTierDefinition(900);
    expect(goldRadiant.cycleId).toBe('gold');
    expect(goldRadiant.overlayColor).toBe('#f5c518');
    expect(goldRadiant.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE_RADIANT_GOLD
    );
  });

  it('clamps invalid amounts to the weakest tier', () => {
    expect(resolvingWorldPlazaSpritcoreDropTierDefinition(0).tier).toBe(1);
    expect(resolvingWorldPlazaSpritcoreDropTierDefinition(-5).tier).toBe(1);
  });
});
