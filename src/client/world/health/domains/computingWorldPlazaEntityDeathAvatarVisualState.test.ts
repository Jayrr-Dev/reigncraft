import { computingWorldPlazaEntityDeathAvatarVisualState } from '@/components/world/health/domains/computingWorldPlazaEntityDeathAvatarVisualState';
import { DEFINING_WORLD_PLAZA_ENTITY_DEATH_AVATAR_ANIMATION_MS } from '@/components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityDeathAvatarVisualState', () => {
  it('starts at rest and eases toward a knockdown pose', () => {
    const startMs = 1000;
    const atStart = computingWorldPlazaEntityDeathAvatarVisualState(
      startMs,
      startMs
    );

    expect(atStart.progress).toBe(0);
    expect(atStart.spriteRotationRad).toBe(0);
    expect(atStart.spriteAlpha).toBe(1);

    const atEnd = computingWorldPlazaEntityDeathAvatarVisualState(
      startMs,
      startMs + DEFINING_WORLD_PLAZA_ENTITY_DEATH_AVATAR_ANIMATION_MS
    );

    expect(atEnd.progress).toBe(1);
    expect(atEnd.spriteRotationRad).toBeGreaterThan(1);
    expect(atEnd.spriteAlpha).toBeLessThan(1);
    expect(atEnd.shadowAlpha).toBeLessThan(1);
  });
});
