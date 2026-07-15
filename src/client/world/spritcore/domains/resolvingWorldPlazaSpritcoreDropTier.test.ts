import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  resolvingWorldPlazaSpritcoreDropItemTypeId,
  resolvingWorldPlazaSpritcoreDropTierDefinition,
  resolvingWorldPlazaSpritcoreDropTierId,
} from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreDropTier';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaSpritcoreDropTier', () => {
  it('maps small wildlife payouts to violet faint visuals', () => {
    expect(resolvingWorldPlazaSpritcoreDropTierId(7)).toBe(1);
    expect(resolvingWorldPlazaSpritcoreDropItemTypeId(7)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE
    );
    expect(resolvingWorldPlazaSpritcoreDropTierDefinition(7).displayName).toBe(
      'Faint Spritcore'
    );
  });

  it('keeps one shared pool item type across violet orb bands', () => {
    expect(resolvingWorldPlazaSpritcoreDropItemTypeId(33)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE
    );
    expect(resolvingWorldPlazaSpritcoreDropItemTypeId(90)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE
    );
    expect(resolvingWorldPlazaSpritcoreDropItemTypeId(144)).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE
    );
    expect(resolvingWorldPlazaSpritcoreDropTierDefinition(33).orbStep).toBe(2);
    expect(resolvingWorldPlazaSpritcoreDropTierDefinition(90).orbStep).toBe(3);
    expect(resolvingWorldPlazaSpritcoreDropTierDefinition(144).orbStep).toBe(4);
  });

  it('repeats the orb cycle with crimson then gold overlays', () => {
    const crimsonFaint = resolvingWorldPlazaSpritcoreDropTierDefinition(241);
    expect(crimsonFaint.cycleId).toBe('crimson');
    expect(crimsonFaint.overlayColor).toBe('#e11d48');
    expect(crimsonFaint.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE
    );
    expect(crimsonFaint.legacyItemTypeId).toContain('crimson');

    const goldRadiant = resolvingWorldPlazaSpritcoreDropTierDefinition(900);
    expect(goldRadiant.cycleId).toBe('gold');
    expect(goldRadiant.overlayColor).toBe('#f5c518');
    expect(goldRadiant.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE
    );
  });

  it('clamps invalid amounts to the weakest tier', () => {
    expect(resolvingWorldPlazaSpritcoreDropTierDefinition(0).tier).toBe(1);
    expect(resolvingWorldPlazaSpritcoreDropTierDefinition(-5).tier).toBe(1);
  });
});
