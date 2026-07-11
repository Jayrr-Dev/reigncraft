import { computingWorldPlazaInventoryBagSfxEffectiveVolume } from '@/components/world/inventory/domains/computingWorldPlazaInventoryBagSfxEffectiveVolume';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaInventoryBagSfxEffectiveVolume', () => {
  it('scales pickup, drop, and move base volumes by the SFX slider', () => {
    expect(computingWorldPlazaInventoryBagSfxEffectiveVolume('pickup')).toBe(
      0.58
    );
    expect(computingWorldPlazaInventoryBagSfxEffectiveVolume('drop')).toBe(
      0.55
    );
    expect(computingWorldPlazaInventoryBagSfxEffectiveVolume('move')).toBe(
      0.28
    );
  });
});
