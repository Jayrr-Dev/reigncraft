import {
  DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_MAX,
  DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_PER_DANGER_BAND,
  DEFINING_WILDLIFE_GOD_SPAWN_TEMPERAMENT_POOL,
} from '@/components/world/wildlife/domains/definingWildlifeGodSpawnConstants';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeGodSpawnChanceForDangerBand,
  resolvingWildlifeGodSpawnFromAnchor,
} from '@/components/world/wildlife/domains/resolvingWildlifeGodSpawnFromAnchor';
import { describe, expect, it } from 'vitest';

function buildingAnchor(
  tileX: number,
  tileY: number,
  packIndex = 0
): DefiningWildlifeSpawnAnchor {
  return {
    anchorId: `wildlife:${tileX}:${tileY}:${packIndex}`,
    tileX,
    tileY,
    speciesId: 'chicken',
    packIndex,
    packSize: 1,
    seed: 0.5,
  };
}

describe('resolvingWildlifeGodSpawnFromAnchor', () => {
  it('never rolls god spawns near origin (band 0)', () => {
    expect(resolvingWildlifeGodSpawnChanceForDangerBand(0)).toBe(0);
    expect(
      resolvingWildlifeGodSpawnFromAnchor(buildingAnchor(100, 100))
    ).toBeNull();
  });

  it('scales chance by danger band and caps at max', () => {
    expect(resolvingWildlifeGodSpawnChanceForDangerBand(1)).toBeCloseTo(
      DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_PER_DANGER_BAND
    );
    expect(resolvingWildlifeGodSpawnChanceForDangerBand(2)).toBeCloseTo(
      DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_PER_DANGER_BAND * 2
    );
    expect(resolvingWildlifeGodSpawnChanceForDangerBand(100)).toBe(
      DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_MAX
    );
  });

  it('assigns an aggressive temperament when a god spawn rolls', () => {
    let found: ReturnType<typeof resolvingWildlifeGodSpawnFromAnchor> = null;

    for (
      let tileX = 1000;
      tileX < 4000 && !found;
      tileX += DEFINING_WILDLIFE_SPAWN_STEP
    ) {
      for (let packIndex = 0; packIndex < 8 && !found; packIndex += 1) {
        found = resolvingWildlifeGodSpawnFromAnchor(
          buildingAnchor(tileX, 0, packIndex)
        );
      }
    }

    expect(found).not.toBeNull();
    expect(found?.isGodSpawn).toBe(true);
    expect(DEFINING_WILDLIFE_GOD_SPAWN_TEMPERAMENT_POOL).toContain(
      found?.temperamentOverrideId
    );
  });
});

const DEFINING_WILDLIFE_SPAWN_STEP = 8;
