import { describe, expect, it } from 'vitest';

import { resolvingWorldPlazaInventoryBagSfxUrl } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagSfxUrl';

describe('resolvingWorldPlazaInventoryBagSfxUrl', () => {
  it('builds public URLs for pickup and drop clips', () => {
    expect(resolvingWorldPlazaInventoryBagSfxUrl('strap_tighten')).toBe(
      '/inventory/sfx/filmcow-recorded/strap-tighten-03.ogg'
    );
    expect(resolvingWorldPlazaInventoryBagSfxUrl('item_equip')).toBe(
      '/inventory/sfx/400-sounds-items/item-equip.ogg'
    );
  });
});
