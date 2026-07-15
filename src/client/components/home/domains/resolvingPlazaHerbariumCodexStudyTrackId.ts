/**
 * Maps Herbarium display entry kinds onto codex study tracks.
 *
 * @module components/home/domains/resolvingPlazaHerbariumCodexStudyTrackId
 */

import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import type { PlazaHerbariumGuideDisplayEntry } from '@/components/home/domains/resolvingPlazaHerbariumGuideDisplayEntries';

const HERBARIUM_KIND_TO_TRACK: Record<
  PlazaHerbariumGuideDisplayEntry['kind'],
  PlazaCodexStudyTrackId
> = {
  flower: 'herbarium-flower',
  tree: 'herbarium-tree',
  clover: 'herbarium-clover',
  berry: 'herbarium-berry',
  mushroom: 'herbarium-mushroom',
};

/** Study track for one Herbarium guide card. */
export function resolvingPlazaHerbariumCodexStudyTrackId(
  kind: PlazaHerbariumGuideDisplayEntry['kind']
): PlazaCodexStudyTrackId {
  return HERBARIUM_KIND_TO_TRACK[kind];
}
