import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import { resolvingWorldPlazaTreeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { resolvingWorldPlazaTreeTrunkEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTreeTrunkEntityZIndex';
import { describe, expect, it } from 'vitest';

/**
 * South-of-object depth regressions (cliff ledge + tree trunk screenshots).
 */
describe('world depth south layering', () => {
  it('draws avatar in front of a tree when standing south on the same tile', () => {
    let treeTile: { tileX: number; tileY: number } | null = null;

    for (let tileX = 0; tileX < 80 && !treeTile; tileX += 1) {
      for (let tileY = 0; tileY < 80; tileY += 1) {
        const tree = resolvingWorldPlazaTreeAtTileIndex(tileX, tileY);

        if (tree) {
          treeTile = { tileX, tileY };
          break;
        }
      }
    }

    expect(treeTile).not.toBeNull();

    if (!treeTile) {
      return;
    }

    const trunkZ = resolvingWorldPlazaTreeTrunkEntityZIndex(
      treeTile.tileX,
      treeTile.tileY
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey({
      x: treeTile.tileX + 0.35,
      y: treeTile.tileY + 0.4,
      layer: 1,
    });

    expect(bodyZ).toBeGreaterThan(trunkZ);
  });

  it('still tucks avatar behind a tree when standing north of it', () => {
    let treeTile: { tileX: number; tileY: number } | null = null;

    for (let tileX = 0; tileX < 80 && !treeTile; tileX += 1) {
      for (let tileY = 0; tileY < 80; tileY += 1) {
        const tree = resolvingWorldPlazaTreeAtTileIndex(tileX, tileY);

        if (tree) {
          treeTile = { tileX, tileY };
          break;
        }
      }
    }

    expect(treeTile).not.toBeNull();

    if (!treeTile) {
      return;
    }

    const trunkZ = resolvingWorldPlazaTreeTrunkEntityZIndex(
      treeTile.tileX,
      treeTile.tileY
    );
    const bodyZ = resolvingWorldDepthAvatarBodySortKey({
      x: treeTile.tileX - 0.6,
      y: treeTile.tileY - 0.6,
      layer: 1,
    });

    expect(bodyZ).toBeLessThan(trunkZ);
  });
});
