import { computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha } from '@/components/world/health/domains/computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_DIM_ALPHA,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_PERIOD_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha', () => {
  it('returns full opacity after invincibility expires', () => {
    expect(
      computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha(5000, 5000)
    ).toBe(1);
    expect(
      computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha(0, 1000)
    ).toBe(1);
  });

  it('alternates between dim and full opacity while invincible', () => {
    const untilMs = 10_000;
    const dimAtMs =
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_PERIOD_MS *
      0.25;
    const brightAtMs =
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_PERIOD_MS *
      0.75;

    expect(
      computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha(untilMs, dimAtMs)
    ).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_RESPAWN_INVINCIBILITY_BLINK_DIM_ALPHA
    );
    expect(
      computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha(
        untilMs,
        brightAtMs
      )
    ).toBe(1);
  });
});
