/**
 * Enqueues a gray spatial Miss float on a wildlife instance.
 *
 * @module components/world/wildlife/domains/enqueueingWildlifeMissFloatFeedback
 */

import { enqueueingWorldPlazaEntityHealthFloatText } from '@/components/world/health/domains/managingWorldPlazaEntityHealthFloatTexts';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Appends a simple gray Miss combat float (out-of-reach melee, etc.).
 */
export function enqueueingWildlifeMissFloatFeedback({
  instance,
  nowMs,
}: {
  instance: DefiningWildlifeInstance;
  nowMs: number;
}): DefiningWildlifeInstance {
  const enqueueResult = enqueueingWorldPlazaEntityHealthFloatText({
    floats: instance.floatingTexts,
    kind: 'miss',
    amount: 0,
    nowMs,
  });

  return {
    ...instance,
    floatingTexts: enqueueResult.floats,
  };
}
