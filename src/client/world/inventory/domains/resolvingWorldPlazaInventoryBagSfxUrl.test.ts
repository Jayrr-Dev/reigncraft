import { describe, expect, it } from 'vitest';

import { resolvingWorldPlazaInventoryBagSfxUrl } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagSfxUrl';

describe('resolvingWorldPlazaInventoryBagSfxUrl', () => {
  it('builds the public URL for the FilmCow strap clip', () => {
    expect(resolvingWorldPlazaInventoryBagSfxUrl('strap_tighten')).toBe(
      '/inventory/sfx/filmcow-recorded/strap-tighten-03.ogg'
    );
  });
});
