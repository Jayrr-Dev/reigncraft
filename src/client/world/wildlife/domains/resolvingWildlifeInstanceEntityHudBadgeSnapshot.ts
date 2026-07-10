/**
 * Builds entity HUD badge listing snapshots from a wildlife instance health state.
 *
 * Data path only: no DOM overlay. Callers may later feed these rows into a
 * world-anchored badge renderer.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeInstanceEntityHudBadgeSnapshot
 */

import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import type { DefiningWorldPlazaEntityActiveBuffHudEntry } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { listingWorldPlazaEntityActiveBuffHudEntries } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { listingWorldPlazaEntityStatusEffectHudRows } from '@/components/world/health/domains/listingWorldPlazaEntityStatusEffectHudRows';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';

export type ResolvingWildlifeInstanceEntityHudBadgeSnapshot = {
  activeBuffs: readonly DefiningWorldPlazaEntityActiveBuffHudEntry[];
  statusEffectHudRows: readonly DefiningWorldPlazaEntityStatusEffectHudRow[];
};

export type ResolvingWildlifeInstanceEntityHudBadgeSnapshotParams = {
  healthState: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  /** Defaults to disease world epoch helper. */
  worldEpochMs?: number;
};

/**
 * Lists buff/disease overhead entries and compact status rows for one wildlife
 * health state. Skips player-only temperature exposure and roll-dodge rows.
 */
export function resolvingWildlifeInstanceEntityHudBadgeSnapshot({
  healthState,
  nowMs,
  worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs(),
}: ResolvingWildlifeInstanceEntityHudBadgeSnapshotParams): ResolvingWildlifeInstanceEntityHudBadgeSnapshot {
  const defenderModifierIds = healthState.damageRollModifiers.map(
    (modifier) => modifier.id
  );

  return {
    activeBuffs: listingWorldPlazaEntityActiveBuffHudEntries({
      state: healthState,
      nowMs,
      worldEpochMs,
      defenderModifierIds,
      attackerModifierIds: [],
    }),
    statusEffectHudRows: listingWorldPlazaEntityStatusEffectHudRows({
      state: healthState,
      nowMs,
      environmentalTemperatureExposure: null,
    }),
  };
}
