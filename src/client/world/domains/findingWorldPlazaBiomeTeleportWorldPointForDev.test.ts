import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { findingWorldPlazaBiomeTeleportWorldPointForDev } from '@/components/world/domains/findingWorldPlazaBiomeTeleportWorldPointForDev';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { describe, expect, it } from 'vitest';

const FINDING_WORLD_PLAZA_BIOME_DEV_TELEPORT_SAMPLE_KINDS: readonly DefiningWorldPlazaBiomeKind[] =
  ['desert', 'snowy_plains', 'jungle', 'ocean', 'firelands'];

describe('findingWorldPlazaBiomeTeleportWorldPointForDev', () => {
  it.each(FINDING_WORLD_PLAZA_BIOME_DEV_TELEPORT_SAMPLE_KINDS)(
    'finds a %s landing point near world origin',
    (biomeKind) => {
      const destination = findingWorldPlazaBiomeTeleportWorldPointForDev({
        biomeKind,
        originWorldPoint: { x: 0, y: 0 },
      });

      expect(destination).not.toBeNull();

      if (!destination) {
        return;
      }

      const tileX = Math.floor(destination.x);
      const tileY = Math.floor(destination.y);

      expect(resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind).toBe(
        biomeKind
      );
      expect(destination.layer).toBe(
        resolvingWorldPlazaSurfaceLayerAtTileIndex(tileX, tileY)
      );
    },
    15_000
  );
});
