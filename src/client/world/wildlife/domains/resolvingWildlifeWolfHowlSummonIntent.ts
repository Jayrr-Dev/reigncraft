/**
 * Turns an active howl summon into a travel intent toward the howl point.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeWolfHowlSummonIntent
 */

import { DEFINING_WILDLIFE_WOLF_HOWL_SUMMON_ARRIVAL_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeWolfVocalizationConstants';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeHowlSummonState,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Intent modes a howl summon may replace; combat and flee always win. */
const DEFINING_WILDLIFE_HOWL_SUMMON_OVERRIDABLE_MODES: ReadonlySet<string> =
  new Set(['idle', 'wander', 'graze', 'return', 'seekPackmate']);

export type ResolvingWildlifeWolfHowlSummonOverrideParams = {
  instance: DefiningWildlifeInstance;
  intent: DefiningWildlifeBehaviorIntent;
  nowMs: number;
};

export type ResolvingWildlifeWolfHowlSummonOverrideResult = {
  intent: DefiningWildlifeBehaviorIntent;
  howlSummon: DefiningWildlifeHowlSummonState | null;
};

/**
 * Resolves the think-tick intent under an active howl summon. Clears the
 * summon on expiry or arrival; only overrides passive intents so a summoned
 * wolf still fights or flees normally.
 */
export function resolvingWildlifeWolfHowlSummonOverride({
  instance,
  intent,
  nowMs,
}: ResolvingWildlifeWolfHowlSummonOverrideParams): ResolvingWildlifeWolfHowlSummonOverrideResult {
  const howlSummon = instance.aiState.howlSummon ?? null;

  if (howlSummon === null) {
    return { intent, howlSummon: null };
  }

  if (howlSummon.untilMs <= nowMs) {
    return { intent, howlSummon: null };
  }

  const distanceGrid = Math.hypot(
    howlSummon.targetPoint.x - instance.position.x,
    howlSummon.targetPoint.y - instance.position.y
  );

  if (distanceGrid <= DEFINING_WILDLIFE_WOLF_HOWL_SUMMON_ARRIVAL_RADIUS_GRID) {
    return { intent, howlSummon: null };
  }

  if (!DEFINING_WILDLIFE_HOWL_SUMMON_OVERRIDABLE_MODES.has(intent.mode)) {
    return { intent, howlSummon };
  }

  return {
    intent: {
      mode: 'seekPackmate',
      targetInstanceId: howlSummon.howlerInstanceId,
      targetPoint: howlSummon.targetPoint,
    },
    howlSummon,
  };
}
