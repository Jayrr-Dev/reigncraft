import { describe, expect, it } from 'vitest';

import { DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import { resolvingPlazaBestiarySpritePortrait } from '@/components/home/domains/resolvingPlazaBestiarySpritePortrait';

describe('resolvingPlazaBestiarySpritePortrait', () => {
  it('crops the front-facing idle frame for a standard species', () => {
    const portrait = resolvingPlazaBestiarySpritePortrait('deer');

    expect(portrait?.sheetUrl).toBe(
      '/creatures/sprites/species/deer/Idle_Shadowless.webp'
    );
    expect(portrait?.backgroundSizeCss).toBe('1500% 800%');
    expect(portrait?.backgroundPositionCss).toMatch(/^0% 28\.57/);
  });

  it('uses the bespoke hyena idle sheet override', () => {
    const portrait = resolvingPlazaBestiarySpritePortrait('hyena');

    expect(portrait?.sheetUrl).toBe(
      '/creatures/sprites/species/hayena/Hyena idle_Shadowless.webp'
    );
  });

  it('resolves a portrait for every bestiary entry', () => {
    for (const entry of DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES) {
      expect(
        resolvingPlazaBestiarySpritePortrait(entry.speciesId)
      ).not.toBeNull();
    }
  });
});
