import {
  checkingPlazaMechanicsBadgeGuideFuzzySearchMatch,
  scoringPlazaMechanicsBadgeGuideFuzzyMatch,
} from '@/components/home/domains/matchingPlazaMechanicsBadgeGuideFuzzySearch';
import { describe, expect, it } from 'vitest';

describe('plaza mechanics badge guide fuzzy search', () => {
  it('scores exact and prefix substring matches highest', () => {
    expect(scoringPlazaMechanicsBadgeGuideFuzzyMatch('Shield', 'shield')).toBe(
      95
    );
    expect(
      scoringPlazaMechanicsBadgeGuideFuzzyMatch('Bonus Max Health', 'bonus')
    ).toBeGreaterThan(80);
  });

  it('matches scattered characters in order for typo-tolerant search', () => {
    expect(
      scoringPlazaMechanicsBadgeGuideFuzzyMatch('Invincibility', 'invnc')
    ).toBeGreaterThan(0);
    expect(
      checkingPlazaMechanicsBadgeGuideFuzzySearchMatch(
        ['Invincibility', 'Timed invulnerability'],
        'invnc'
      )
    ).toBe(true);
  });

  it('rejects queries that do not appear in order', () => {
    expect(scoringPlazaMechanicsBadgeGuideFuzzyMatch('Shield', 'dleihs')).toBe(
      0
    );
    expect(
      checkingPlazaMechanicsBadgeGuideFuzzySearchMatch(['Shield'], 'dleihs')
    ).toBe(false);
  });

  it('treats an empty query as a match for every entry', () => {
    expect(
      checkingPlazaMechanicsBadgeGuideFuzzySearchMatch(
        ['Poison Resistance'],
        '   '
      )
    ).toBe(true);
  });
});
