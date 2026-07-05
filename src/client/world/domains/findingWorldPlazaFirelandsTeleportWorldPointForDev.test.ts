import { checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex';
import { findingWorldPlazaFirelandsTeleportWorldPointForDev } from '@/components/world/domains/findingWorldPlazaFirelandsTeleportWorldPointForDev';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { describe, expect, it } from 'vitest';

describe('findingWorldPlazaFirelandsTeleportWorldPointForDev', () => {
  it('finds a Firelands landing point in the procedural search window', () => {
    const destination = findingWorldPlazaFirelandsTeleportWorldPointForDev();

    expect(destination).not.toBeNull();

    if (!destination) {
      return;
    }

    const tileX = Math.floor(destination.x);
    const tileY = Math.floor(destination.y);

    expect(
      checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(tileX, tileY)
    ).toBe(true);
    expect(destination.layer).toBe(
      resolvingWorldPlazaSurfaceLayerAtTileIndex(tileX, tileY)
    );
  });
});
