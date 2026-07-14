import { checkingWorldPlazaFlowerPetalColorIsPickable } from '@/components/world/domains/checkingWorldPlazaFlowerPetalColorIsPickable';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaFlowerPetalColorIsPickable', () => {
  it('accepts yellow and pink petal colors', () => {
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0xffd966)).toBe(true);
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0xff8fab)).toBe(true);
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0xff6b9d)).toBe(true);
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0x7ec8e3)).toBe(true);
  });

  it('rejects white and near-white grey petals', () => {
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0xffffff)).toBe(false);
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0xf8f4ff)).toBe(false);
  });

  it('rejects swamp green foliage petals', () => {
    expect(checkingWorldPlazaFlowerPetalColorIsPickable(0x9caf52)).toBe(false);
  });
});
