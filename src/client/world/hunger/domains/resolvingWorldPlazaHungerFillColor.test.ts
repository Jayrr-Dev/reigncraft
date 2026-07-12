import { resolvingWorldPlazaHungerFillColors } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerFillColor';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaHungerFillColors', () => {
  it('returns warm brown at full hunger', () => {
    const colors = resolvingWorldPlazaHungerFillColors(1);
    expect(colors.midCss).toBe('rgb(139 90 43)');
  });

  it('returns reddish brown near mid drain', () => {
    const colors = resolvingWorldPlazaHungerFillColors(0.4);
    expect(colors.midCss).toBe('rgb(138 52 40)');
  });

  it('returns charcoal at empty hunger', () => {
    const colors = resolvingWorldPlazaHungerFillColors(0);
    expect(colors.midCss).toBe('rgb(28 24 22)');
  });

  it('blends between brown and reddish brown', () => {
    const colors = resolvingWorldPlazaHungerFillColors(0.7);
    expect(colors.midCss).toMatch(/^rgb\(\d+ \d+ \d+\)$/);
    expect(colors.fillBackgroundCss).toContain('linear-gradient');
  });
});
