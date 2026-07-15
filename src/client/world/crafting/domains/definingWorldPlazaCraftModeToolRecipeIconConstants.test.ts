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

  it('maps gold axe to the gold material set', () => {
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('axe', 'gold')
    ).toMatchObject({
      columnIndex: 9,
      rowIndex: 1,
    });
  });

  it('maps every fishing rod tier to the shared rod cell', () => {
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('fishrod', 'wood')
    ).toMatchObject({
      columnIndex: 1,
      rowIndex: 3,
    });
    expect(
      resolvingWorldPlazaCraftModeToolRecipeSpriteSheetIcon('fishrod', 'gold')
    ).toMatchObject({
      columnIndex: 1,
      rowIndex: 3,
    });
  });
});
