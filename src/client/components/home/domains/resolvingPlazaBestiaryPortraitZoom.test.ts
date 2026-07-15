import {
  DEFINING_PLAZA_BESTIARY_PORTRAIT_CARD_ZOOM,
  DEFINING_PLAZA_BESTIARY_PORTRAIT_FISH_CARD_ZOOM,
  DEFINING_PLAZA_BESTIARY_PORTRAIT_FISH_DETAIL_ZOOM,
} from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import { resolvingPlazaBestiaryPortraitZoom } from '@/components/home/domains/resolvingPlazaBestiaryPortraitZoom';
import { describe, expect, it } from 'vitest';

describe('resolvingPlazaBestiaryPortraitZoom', () => {
  it('uses smaller zoom for fishing catch species', () => {
    expect(resolvingPlazaBestiaryPortraitZoom('largemouth-bass', 'card')).toBe(
      DEFINING_PLAZA_BESTIARY_PORTRAIT_FISH_CARD_ZOOM
    );
    expect(
      resolvingPlazaBestiaryPortraitZoom('largemouth-bass', 'detail')
    ).toBe(DEFINING_PLAZA_BESTIARY_PORTRAIT_FISH_DETAIL_ZOOM);
  });

  it('keeps land wildlife card zoom', () => {
    expect(resolvingPlazaBestiaryPortraitZoom('deer', 'card')).toBe(
      DEFINING_PLAZA_BESTIARY_PORTRAIT_CARD_ZOOM
    );
  });
});
