/**
 * Stalk alpha prey-pick candidate with mass for weighted selection.
 *
 * @module components/world/wildlife/domains/definingWildlifeStalkPreyPickCandidate
 */

export type DefiningWildlifeStalkPreyPickCandidate = {
  targetId: string;
  /** Effective mass used for size bias (species mass × size sample, or player ref). */
  massKg: number;
  isFavoritePrey: boolean;
};
