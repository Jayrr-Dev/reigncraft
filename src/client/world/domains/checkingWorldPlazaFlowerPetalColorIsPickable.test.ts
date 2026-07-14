import { checkingWorldPlazaFlowerPetalColorIsPickable } from '@/components/world/domains/checkingWorldPlazaFlowerPetalColorIsPickable';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaFlowerPetalColorIsPickable', () => {
  it('accepts yellow, pink, and bright white petals', () => {
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0xffd966)).toBe(true);
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0xff8fab)).toBe(true);
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0xff6b9d)).toBe(true);
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0x7ec8e3)).toBe(true);
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0xffffff)).toBe(true);
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0xf8f4ff)).toBe(true);
  });

  it('rejects dull mid-grey petals', () => {
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0x8a8a8a)).toBe(false);
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0x5f6672)).toBe(false);
  });

  it('rejects green foliage petals', () => {
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0x9caf52)).toBe(false);
  });
});
