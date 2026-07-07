/**
 * Resolved stalk target vitals shared by player and wildlife prey.
 *
 * @module components/world/wildlife/domains/definingWildlifeStalkPreyTypes
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

export type DefiningWildlifeStalkPreyContext = {
  targetId: string;
  position: DefiningWorldPlazaWorldPoint;
  healthRatio: number | null;
  staminaRatio: number | null;
  staminaIsDepleted: boolean;
  stillDurationMs: number;
};
