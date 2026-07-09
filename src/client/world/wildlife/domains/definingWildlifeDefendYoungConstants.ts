/**
 * Defend-young social response: adults attack whoever hurts a baby of their species.
 *
 * Size tiers stand in for age until a numeric age roll exists:
 * baby = σ tier −2, adult defender = σ tier ≥ 0 (proxy for age 20+).
 *
 * @module components/world/wildlife/domains/definingWildlifeDefendYoungConstants
 */

import type { DefiningWildlifeSizeTier } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';

/** Victim must be this size tier or smaller to count as a baby. */
export const DEFINING_WILDLIFE_DEFEND_YOUNG_MAX_VICTIM_SIZE_TIER =
  -2 as DefiningWildlifeSizeTier;

/**
 * Defenders must be this size tier or larger (adult / age-20+ proxy).
 * Young (−1) and babies (−2) do not join the counterattack.
 */
export const DEFINING_WILDLIFE_DEFEND_YOUNG_MIN_DEFENDER_SIZE_TIER =
  0 as DefiningWildlifeSizeTier;

/**
 * Threat multiplier on top of pack share so nearby adults lock the attacker
 * even when the baby took a light hit.
 */
export const DEFINING_WILDLIFE_DEFEND_YOUNG_THREAT_SHARE_MULTIPLIER = 2.5 as const;
