import { describe, expect, it } from 'vitest';

import { resolvingWildlifeStudySfxUrl } from '@/components/world/wildlife/domains/resolvingWildlifeStudySfxUrl';

describe('resolvingWildlifeStudySfxUrl', () => {
  it('builds public URLs for study-complete clips', () => {
    expect(resolvingWildlifeStudySfxUrl('study_learn')).toBe(
      '/home/sfx/fantasy-ui/study-learn.ogg'
    );
    expect(resolvingWildlifeStudySfxUrl('chest_open')).toBe(
      '/home/sfx/fantasy-ui/chest-open.ogg'
    );
  });
});
