import { computingWorldPlazaEntityStunAvatarWobbleRadians } from '@/components/world/health/domains/computingWorldPlazaEntityStunAvatarWobbleRadians';
import { computingWorldPlazaEntityStunDotsOrbitLayout } from '@/components/world/health/domains/computingWorldPlazaEntityStunDotsOrbitLayout';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityStunAvatarWobbleRadians', () => {
  it('oscillates within the configured wobble range', () => {
    const first = computingWorldPlazaEntityStunAvatarWobbleRadians(0, 0.5);
    const second = computingWorldPlazaEntityStunAvatarWobbleRadians(250, 0.5);

    expect(Math.abs(first)).toBeLessThanOrEqual(0.12);
    expect(Math.abs(second)).toBeLessThanOrEqual(0.12);
    expect(first).not.toBe(second);
  });
});

describe('computingWorldPlazaEntityStunDotsOrbitLayout', () => {
  it('returns four orbiting dot offsets', () => {
    const layout = computingWorldPlazaEntityStunDotsOrbitLayout({
      nowMs: 1000,
      phaseSeed: 0.25,
      cameraWorldZoom: 1,
    });

    expect(layout).toHaveLength(4);
    expect(layout[0]?.x).not.toBe(layout[1]?.x);
  });
});
