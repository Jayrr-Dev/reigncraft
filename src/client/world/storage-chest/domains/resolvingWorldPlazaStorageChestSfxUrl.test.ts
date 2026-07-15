import { describe, expect, it } from 'vitest';

import { resolvingWorldPlazaStorageChestSfxUrl } from '@/components/world/storage-chest/domains/resolvingWorldPlazaStorageChestSfxUrl';

describe('resolvingWorldPlazaStorageChestSfxUrl', () => {
  it('resolves fantasy-ui lid open and close clips', () => {
    expect(resolvingWorldPlazaStorageChestSfxUrl('chest_open')).toBe(
      '/home/sfx/fantasy-ui/chest-open.ogg'
    );
    expect(resolvingWorldPlazaStorageChestSfxUrl('chest_close')).toBe(
      '/home/sfx/fantasy-ui/chest-close-01.ogg'
    );
  });
});
