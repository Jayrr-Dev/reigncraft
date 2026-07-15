import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { resolvingWorldPlazaOreSmeltingPopoverUi } from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingPopoverUi';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaOreSmeltingPopoverUi', () => {
  it('labels the clay kiln input slot ITEM with a clay panel', () => {
    const ui = resolvingWorldPlazaOreSmeltingPopoverUi(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_KILN
    );

    expect(ui.inputSlotLabel).toBe('Item');
    expect(ui.idleHintText).toContain('item');
    expect(ui.panelClassName).toContain('bg-[#5c3d28]/95');
    expect(ui.panelClassName).toContain('border-[#a67c52]');
  });

  it('labels the bloomery (refinery) input slot ORE with a soot panel', () => {
    const ui = resolvingWorldPlazaOreSmeltingPopoverUi(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_BLOOMERY
    );

    expect(ui.inputSlotLabel).toBe('Ore');
    expect(ui.idleHintText).toContain('ore');
    expect(ui.panelClassName).toContain('bg-[#141210]/95');
    expect(ui.panelClassName).toContain('border-[#3d3830]');
  });

  it('keeps ORE on the clay stove while using the clay panel', () => {
    const ui = resolvingWorldPlazaOreSmeltingPopoverUi(
      DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CLAY_STOVE
    );

    expect(ui.inputSlotLabel).toBe('Ore');
    expect(ui.panelClassName).toContain('bg-[#5c3d28]/95');
  });
});
