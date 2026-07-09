import { DEFINING_PLAZA_MECHANICS_BADGE_FUZZY_SEARCH_MIN_SCORE } from '@/components/home/domains/definingPlazaMechanicsConstants';

/**
 * Scores how well `needle` matches `haystack` on a 0–100 scale.
 * Substring hits rank highest; otherwise characters must appear in order.
 */
export function scoringPlazaMechanicsBadgeGuideFuzzyMatch(
  haystack: string,
  needle: string
): number {
  const normalizedHaystack = haystack.toLowerCase();
  const normalizedNeedle = needle.toLowerCase();

  if (!normalizedNeedle) {
    return 100;
  }

  if (normalizedHaystack.includes(normalizedNeedle)) {
    const index = normalizedHaystack.indexOf(normalizedNeedle);
    let score = 80;

    if (index === 0) {
      score += 15;
    } else if (normalizedHaystack[index - 1] === ' ') {
      score += 8;
    }

    return score - Math.min(index, 10);
  }

  let haystackIndex = 0;
  let consecutiveMatches = 0;
  let maxConsecutiveMatches = 0;
  let score = 0;
  let lastMatchIndex = -1;
  let firstMatchIndex = -1;

  for (const char of normalizedNeedle) {
    let foundIndex = -1;

    for (
      let index = haystackIndex;
      index < normalizedHaystack.length;
      index += 1
    ) {
      if (normalizedHaystack[index] === char) {
        foundIndex = index;
        break;
      }
    }

    if (foundIndex === -1) {
      return 0;
    }

    if (firstMatchIndex === -1) {
      firstMatchIndex = foundIndex;
    }

    score += 5;

    if (foundIndex === lastMatchIndex + 1) {
      consecutiveMatches += 1;
      maxConsecutiveMatches = Math.max(
        maxConsecutiveMatches,
        consecutiveMatches
      );
    } else {
      consecutiveMatches = 1;
    }

    if (foundIndex === 0 || normalizedHaystack[foundIndex - 1] === ' ') {
      score += 3;
    }

    lastMatchIndex = foundIndex;
    haystackIndex = foundIndex + 1;
  }

  score += maxConsecutiveMatches * 4;

  if (firstMatchIndex >= 0) {
    score -= Math.floor((lastMatchIndex - firstMatchIndex) / 5);
  }

  return Math.max(0, Math.min(100, score));
}

/** Returns true when any searchable text clears the fuzzy match threshold. */
export function checkingPlazaMechanicsBadgeGuideFuzzySearchMatch(
  searchableTexts: readonly string[],
  query: string
): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const bestScore = searchableTexts.reduce((currentBestScore, text) => {
    const nextScore = scoringPlazaMechanicsBadgeGuideFuzzyMatch(
      text,
      normalizedQuery
    );
    return Math.max(currentBestScore, nextScore);
  }, 0);

  return bestScore >= DEFINING_PLAZA_MECHANICS_BADGE_FUZZY_SEARCH_MIN_SCORE;
}
