import { describe, expect, it } from 'vitest';

import {
  computingWorldPlazaInventoryFoodEatSoundRevealText,
  DEFINING_WORLD_PLAZA_FOOD_EAT_SOUND_WORD_REVEAL_INTERVAL_MS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryFoodEatFlavorTextConstants';

const CHOMP_LINE = 'Chomp ChomP CHOMP';
const INTERVAL_MS = DEFINING_WORLD_PLAZA_FOOD_EAT_SOUND_WORD_REVEAL_INTERVAL_MS;

describe('computingWorldPlazaInventoryFoodEatSoundRevealText', () => {
  it('reveals one beat at a time on a slow three-count', () => {
    expect(
      computingWorldPlazaInventoryFoodEatSoundRevealText(
        CHOMP_LINE,
        0,
        INTERVAL_MS
      )
    ).toBe('Chomp');
    expect(
      computingWorldPlazaInventoryFoodEatSoundRevealText(
        CHOMP_LINE,
        INTERVAL_MS,
        INTERVAL_MS
      )
    ).toBe('Chomp ChomP');
    expect(
      computingWorldPlazaInventoryFoodEatSoundRevealText(
        CHOMP_LINE,
        INTERVAL_MS * 2,
        INTERVAL_MS
      )
    ).toBe('Chomp ChomP CHOMP');
  });

  it('holds the rest beat with ellipsis before looping', () => {
    expect(
      computingWorldPlazaInventoryFoodEatSoundRevealText(
        CHOMP_LINE,
        INTERVAL_MS * 3,
        INTERVAL_MS
      )
    ).toBe('Chomp ChomP CHOMP...');
    expect(
      computingWorldPlazaInventoryFoodEatSoundRevealText(
        CHOMP_LINE,
        INTERVAL_MS * 4,
        INTERVAL_MS
      )
    ).toBe('Chomp');
  });
});
