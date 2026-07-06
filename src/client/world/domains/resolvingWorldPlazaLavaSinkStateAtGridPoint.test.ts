import { describe, expect, it } from 'vitest';

import {
  computingWorldPlazaLavaSinkOffsetPxForSurfaceLayer,
  DEFINING_WORLD_PLAZA_LAVA_SINK_EXTRA_OFFSET_PX_PER_LAYER_ABOVE_GROUND,
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
