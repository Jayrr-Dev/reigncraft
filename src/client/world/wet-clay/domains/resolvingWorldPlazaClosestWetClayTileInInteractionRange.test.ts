import { formattingWorldPlazaWetClayTileSelectionKey } from '@/components/world/wet-clay/domains/formattingWorldPlazaWetClayTileSelectionKey';
import { resolvingWorldPlazaClosestWetClayTileInInteractionRange } from '@/components/world/wet-clay/domains/resolvingWorldPlazaClosestWetClayTileInInteractionRange';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaClosestWetClayTileInInteractionRange', () => {
  it('returns null when there are no entries', () => {
    expect(
      resolvingWorldPlazaClosestWetClayTileInInteractionRange(
        { x: 10.2, y: 20.4 },
        []
      )
    ).toBeNull();
  });

  it('picks the tile whose center is nearest the player', () => {
    const closest = resolvingWorldPlazaClosestWetClayTileInInteractionRange(
      { x: 10.2, y: 20.4 },
      [
        { tileX: 12, tileY: 20 },
        { tileX: 10, tileY: 20 },
        { tileX: 9, tileY: 22 },
      ]
    );

    expect(closest).toEqual({ tileX: 10, tileY: 20 });
  });

  it('keeps a preferred active target when still in range', () => {
    const preferredTargetKey = formattingWorldPlazaWetClayTileSelectionKey(
      12,
      20
    );
    const closest = resolvingWorldPlazaClosestWetClayTileInInteractionRange(
      { x: 10.2, y: 20.4 },
      [
        { tileX: 12, tileY: 20 },
        { tileX: 10, tileY: 20 },
      ],
      preferredTargetKey
    );

    expect(closest).toEqual({ tileX: 12, tileY: 20 });
  });
});
