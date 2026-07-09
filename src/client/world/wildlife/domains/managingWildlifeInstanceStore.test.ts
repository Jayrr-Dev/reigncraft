import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  creatingWildlifeInstanceStore,
  DEFINING_WILDLIFE_DESPAWN_RADIUS_GRID,
  DEFINING_WILDLIFE_HYDRATION_INTERVAL_MS,
  despawningWildlifeInstancesBeyondRadius,
  hydratingWildlifeInstancesNearPoint,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  resolvingWildlifeSpawnAtTileIndex,
  resolvingWildlifeSpawnPositionFromAnchor,
} from '@/components/world/wildlife/domains/resolvingWildlifeSpawnAtTileIndex';
import { describe, expect, it } from 'vitest';

function findingWildlifeTestSpawnAnchor() {
  for (let tileX = 24; tileX <= 120; tileX += 12) {
    for (let tileY = 24; tileY <= 120; tileY += 12) {
      const anchor = resolvingWildlifeSpawnAtTileIndex(tileX, tileY, 0);

      if (anchor) {
        return anchor;
      }
    }
  }

  throw new Error('Expected at least one wildlife spawn anchor for tests');
}

describe('managingWildlifeInstanceStore hydrate/despawn', () => {
  it('does not recreate a fled animal at its spawn while the player stays nearby', () => {
    const store = creatingWildlifeInstanceStore();
    const anchor = findingWildlifeTestSpawnAnchor();
    const spawnPosition = resolvingWildlifeSpawnPositionFromAnchor(anchor);
    const playerCenter = {
      x: spawnPosition.x,
      y: spawnPosition.y,
      layer: 1,
    };
    const fledPosition = {
      x: playerCenter.x + DEFINING_WILDLIFE_DESPAWN_RADIUS_GRID + 2,
      y: playerCenter.y,
      layer: 1,
    };

    store.instances.set(
      anchor.anchorId,
      creatingWildlifeTestInstance({
        instanceId: anchor.anchorId,
        anchorId: anchor.anchorId,
        speciesId: anchor.speciesId,
        spawnAnchor: {
          x: spawnPosition.x,
          y: spawnPosition.y,
          layer: 1,
        },
        position: fledPosition,
      })
    );
    store.knownAnchorIds.add(anchor.anchorId);
    store.lastHydratedAtMs = 0;

    despawningWildlifeInstancesBeyondRadius(store, playerCenter);

    expect(store.instances.has(anchor.anchorId)).toBe(false);
    expect(store.knownAnchorIds.has(anchor.anchorId)).toBe(true);

    hydratingWildlifeInstancesNearPoint(
      store,
      playerCenter,
      resolvingWildlifeSpeciesDefinition,
      DEFINING_WILDLIFE_HYDRATION_INTERVAL_MS
    );

    expect(store.instances.has(anchor.anchorId)).toBe(false);
    expect(store.knownAnchorIds.has(anchor.anchorId)).toBe(true);
  });

  it('forgets streamed-out anchors once the player leaves the despawn radius', () => {
    const store = creatingWildlifeInstanceStore();
    const anchor = findingWildlifeTestSpawnAnchor();
    const spawnPosition = resolvingWildlifeSpawnPositionFromAnchor(anchor);
    const farCenter = {
      x: spawnPosition.x + DEFINING_WILDLIFE_DESPAWN_RADIUS_GRID + 4,
      y: spawnPosition.y,
      layer: 1,
    };

    store.knownAnchorIds.add(anchor.anchorId);
    store.lastHydratedAtMs = 0;

    hydratingWildlifeInstancesNearPoint(
      store,
      farCenter,
      resolvingWildlifeSpeciesDefinition,
      DEFINING_WILDLIFE_HYDRATION_INTERVAL_MS
    );

    expect(store.knownAnchorIds.has(anchor.anchorId)).toBe(false);
  });
});
