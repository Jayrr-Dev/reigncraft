import { describe, expect, it } from 'vitest';

import { DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import {
  checkingWorldPlazaLavaSinkHidesAvatarBodyAtBaseOffsetPx,
  computingWorldPlazaLavaSinkOffsetPxForSurfaceLayer,
  DEFINING_WORLD_PLAZA_LAVA_SINK_EXTRA_OFFSET_PX_PER_LAYER_ABOVE_GROUND,
  DEFINING_WORLD_PLAZA_LAVA_SINK_HIDE_AVATAR_BODY_AFTER_WORLD_LAYERS,
  DEFINING_WORLD_PLAZA_LAVA_SINK_OFFSET_PX,
} from '@/components/world/domains/resolvingWorldPlazaLavaSinkStateAtGridPoint';

describe('computingWorldPlazaLavaSinkOffsetPxForSurfaceLayer', () => {
  it('uses the base offset at ground level', () => {
    expect(computingWorldPlazaLavaSinkOffsetPxForSurfaceLayer(1)).toBe(
      DEFINING_WORLD_PLAZA_LAVA_SINK_OFFSET_PX
    );
  });

  it('adds one layer height of sink depth per layer above ground', () => {
    expect(computingWorldPlazaLavaSinkOffsetPxForSurfaceLayer(4)).toBe(
      DEFINING_WORLD_PLAZA_LAVA_SINK_OFFSET_PX +
        3 *
          DEFINING_WORLD_PLAZA_LAVA_SINK_EXTRA_OFFSET_PX_PER_LAYER_ABOVE_GROUND
    );
  });
});

describe('checkingWorldPlazaLavaSinkHidesAvatarBodyAtBaseOffsetPx', () => {
  const hideThresholdPx =
    DEFINING_WORLD_PLAZA_LAVA_SINK_HIDE_AVATAR_BODY_AFTER_WORLD_LAYERS *
    DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX;

  it('keeps shallow lava wades visible', () => {
    expect(checkingWorldPlazaLavaSinkHidesAvatarBodyAtBaseOffsetPx(0)).toBe(
      false
    );
    expect(
      checkingWorldPlazaLavaSinkHidesAvatarBodyAtBaseOffsetPx(
        DEFINING_WORLD_PLAZA_LAVA_SINK_OFFSET_PX
      )
    ).toBe(false);
    expect(
      checkingWorldPlazaLavaSinkHidesAvatarBodyAtBaseOffsetPx(hideThresholdPx)
    ).toBe(false);
  });

  it('hides the avatar once sink depth exceeds four world layers', () => {
    expect(
      checkingWorldPlazaLavaSinkHidesAvatarBodyAtBaseOffsetPx(
        hideThresholdPx + 1
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaLavaSinkHidesAvatarBodyAtBaseOffsetPx(
        computingWorldPlazaLavaSinkOffsetPxForSurfaceLayer(4)
      )
    ).toBe(true);
  });
});
