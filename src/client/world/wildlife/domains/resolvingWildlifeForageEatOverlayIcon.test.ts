import {
  DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_FOOD,
  DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_GRASS,
  DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_GRAZE,
} from '@/components/world/wildlife/domains/definingWildlifeForageEatOverlayConstants';
import { resolvingWildlifeForageEatOverlayIcon } from '@/components/world/wildlife/domains/resolvingWildlifeForageEatOverlayIcon';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeForageEatOverlayIcon', () => {
  it('uses grass icon for graze and grass forage', () => {
    expect(resolvingWildlifeForageEatOverlayIcon({ mode: 'graze' })).toBe(
      DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_GRAZE
    );
    expect(
      resolvingWildlifeForageEatOverlayIcon({
        mode: 'forageEat',
        targetGroundItemId: 'wildlife-grass:2,3',
        targetPoint: { x: 2.5, y: 3.5, layer: 1 },
      })
    ).toBe(DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_GRASS);
  });

  it('uses food icon for dropped stacks', () => {
    expect(
      resolvingWildlifeForageEatOverlayIcon({
        mode: 'forageEat',
        targetGroundItemId: 'ground-item-1',
        targetPoint: { x: 1, y: 1, layer: 1 },
      })
    ).toBe(DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_FOOD);
  });

  it('returns null for non-eating intents', () => {
    expect(resolvingWildlifeForageEatOverlayIcon({ mode: 'wander' })).toBeNull();
  });
});
