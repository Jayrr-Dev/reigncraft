import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeAggressionBellCurveSampleFromAnchor,
  resolvingWildlifeAggressionLevelFromAnchor,
} from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';
import { describe, expect, it } from 'vitest';

function buildingAnchor(
  tileX: number,
  tileY: number,
  packIndex: number
): DefiningWildlifeSpawnAnchor {
  return {
    anchorId: `wildlife:${tileX}:${tileY}:${packIndex}`,
    tileX,
    tileY,
    speciesId: 'grey-wolf',
    packIndex,
    packSize: 2,
    seed: 0.5,
  };
}

describe('resolvingWildlifeAggressionLevelFromAnchor', () => {
  it('is deterministic for the same anchor', () => {
    const anchor = buildingAnchor(120, 84, 1);
    const first = resolvingWildlifeAggressionLevelFromAnchor(anchor);
    const second = resolvingWildlifeAggressionLevelFromAnchor(anchor);

    expect(first).toBe(second);
  });

  it('varies across nearby spawn anchors', () => {
    const levels = new Set(
      Array.from({ length: 48 }, (_, index) =>
        resolvingWildlifeAggressionLevelFromAnchor(
          buildingAnchor(120 + index * 12, 240, 0)
        )
      )
    );

    expect(levels.size).toBeGreaterThan(1);
  });

  it('clusters most rolls in the normal tier', () => {
    const counts = { tame: 0, normal: 0, aggressive: 0 };

    for (let tileX = 0; tileX < 600; tileX += 12) {
      for (let tileY = 0; tileY < 600; tileY += 12) {
        for (let packIndex = 0; packIndex < 3; packIndex += 1) {
          const level = resolvingWildlifeAggressionLevelFromAnchor(
            buildingAnchor(tileX, tileY, packIndex)
          );
          counts[level] += 1;
        }
      }
    }

    const total = counts.tame + counts.normal + counts.aggressive;

    expect(counts.normal / total).toBeGreaterThan(0.45);
    expect(counts.tame / total).toBeGreaterThan(0.1);
    expect(counts.aggressive / total).toBeGreaterThan(0.1);
  });

  it('samples a bell curve with finite variance', () => {
    const samples = Array.from({ length: 200 }, (_, index) =>
      resolvingWildlifeAggressionBellCurveSampleFromAnchor(
        buildingAnchor(48 + index * 12, 96, 0)
      )
    );
    const mean =
      samples.reduce((sum, sample) => sum + sample, 0) / samples.length;
    const variance =
      samples.reduce((sum, sample) => sum + (sample - mean) ** 2, 0) /
      samples.length;

    expect(Math.abs(mean)).toBeLessThan(0.35);
    expect(variance).toBeGreaterThan(0.2);
    expect(variance).toBeLessThan(2.5);
  });
});
