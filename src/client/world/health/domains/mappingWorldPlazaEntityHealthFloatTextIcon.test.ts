import { mappingWorldPlazaEntityHealthFloatTextIcon } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';
import { describe, expect, it } from 'vitest';

describe('mappingWorldPlazaEntityHealthFloatTextIcon', () => {
  it('uses distinct base icons for heal, regen, and shield gain', () => {
    expect(
      mappingWorldPlazaEntityHealthFloatTextIcon({
        kind: 'heal',
        damageKind: 'healing',
        outcomeTier: null,
      })
    ).toBe('solar:heart-pulse-bold');

    expect(
      mappingWorldPlazaEntityHealthFloatTextIcon({
        kind: 'heal_regen',
        damageKind: 'healing',
        outcomeTier: null,
      })
    ).toBe('mdi:refresh');

    expect(
      mappingWorldPlazaEntityHealthFloatTextIcon({
        kind: 'shield_gain',
        damageKind: null,
        outcomeTier: null,
      })
    ).toBe('mdi:shield-plus');

    expect(
      mappingWorldPlazaEntityHealthFloatTextIcon({
        kind: 'study',
        damageKind: null,
        outcomeTier: null,
      })
    ).toBe('mdi:book-open-page-variant');

    expect(
      mappingWorldPlazaEntityHealthFloatTextIcon({
        kind: 'loyalty',
        damageKind: null,
        outcomeTier: null,
      })
    ).toBe('mdi:paw');
  });

  it('uses tier-specific heal and shield icons for rolled beneficial amounts', () => {
    expect(
      mappingWorldPlazaEntityHealthFloatTextIcon({
        kind: 'heal',
        damageKind: 'healing',
        outcomeTier: 'critical',
      })
    ).toBe('mdi:heart-flash');

    expect(
      mappingWorldPlazaEntityHealthFloatTextIcon({
        kind: 'shield_gain',
        damageKind: null,
        outcomeTier: 'critical',
      })
    ).toBe('mdi:shield-check');

    expect(
      mappingWorldPlazaEntityHealthFloatTextIcon({
        kind: 'heal',
        damageKind: 'healing',
        outcomeTier: 'dodged',
      })
    ).toBe('ph:heart-half');

    expect(
      mappingWorldPlazaEntityHealthFloatTextIcon({
        kind: 'shield_gain',
        damageKind: null,
        outcomeTier: 'dodged',
      })
    ).toBe('mdi:shield-half-full');
  });
});
