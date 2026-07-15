import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS } from '@/components/world/domains/definingWorldPlazaGirlSampleJumpConstants';
import { resolvingWorldPlazaJumpDurationMs } from '@/components/world/domains/resolvingWorldPlazaJumpDurationMs';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaJumpDurationMs', () => {
  it('keeps girl-sample duration at scale 1', () => {
    expect(resolvingWorldPlazaJumpDurationMs(1)).toBe(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS
    );
  });

  it('halves duration at scale 2', () => {
    expect(resolvingWorldPlazaJumpDurationMs(2)).toBe(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS / 2
    );
  });
});
