import { resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIconConstants';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon', () => {
  it('maps wood pickaxe to the first sheet cell', () => {
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('pickaxe', 'wood')
    ).toMatchObject({
      columnIndex: 0,
      rowIndex: 0,
    });
  });

  it('maps gold tools to the gold set with a yellow tint', () => {
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('axe', 'gold')
    ).toMatchObject({
      columnIndex: 9,
      rowIndex: 1,
    });
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('pickaxe', 'gold')
        .cssFilter
    ).toContain('sepia');
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('pickaxe', 'iron')
        .cssFilter
    ).toBeUndefined();
  });

  it('maps every fishing rod tier to the shared rod cell with tier tints', () => {
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('fishrod', 'wood')
    ).toMatchObject({
      columnIndex: 1,
      rowIndex: 3,
    });
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('fishrod', 'wood')
        .cssFilter
    ).toBeUndefined();
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('fishrod', 'iron')
        .cssFilter
    ).toContain('saturate');
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('fishrod', 'gold')
    ).toMatchObject({
      columnIndex: 1,
      rowIndex: 3,
    });
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('fishrod', 'gold')
        .cssFilter
    ).toContain('sepia');
  });
});
