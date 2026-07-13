import { checkingWorldBuildingPlacementPreviewUsesClaimTile } from '@/components/world/building/domains/checkingWorldBuildingPlacementPreviewUsesClaimTile';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { describe, expect, it } from 'vitest';

describe('checkingWorldBuildingPlacementPreviewUsesClaimTile', () => {
  it('uses claim tiles only while claim mode is active', () => {
    expect(
      checkingWorldBuildingPlacementPreviewUsesClaimTile({
        isClaimModeActive: true,
        previewWorldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
      })
    ).toBe(true);
  });

  it('keeps ground-layer build placement on the block ghost path', () => {
    expect(
      checkingWorldBuildingPlacementPreviewUsesClaimTile({
        isClaimModeActive: false,
        previewWorldLayer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
      })
    ).toBe(false);
  });
});
