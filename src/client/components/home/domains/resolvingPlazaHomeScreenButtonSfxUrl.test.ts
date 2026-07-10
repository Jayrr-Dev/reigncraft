import { describe, expect, it } from 'vitest';

import { resolvingPlazaHomeScreenButtonSfxUrl } from '@/components/home/domains/resolvingPlazaHomeScreenButtonSfxUrl';

describe('resolvingPlazaHomeScreenButtonSfxUrl', () => {
  it('builds public URLs for chest-close button clips', () => {
    expect(resolvingPlazaHomeScreenButtonSfxUrl('chest_close_01')).toBe(
      '/sfx/fantasy-ui/chest-close-01.ogg'
    );
    expect(resolvingPlazaHomeScreenButtonSfxUrl('chest_close_02')).toBe(
      '/sfx/fantasy-ui/chest-close-02.ogg'
    );
  });
});
