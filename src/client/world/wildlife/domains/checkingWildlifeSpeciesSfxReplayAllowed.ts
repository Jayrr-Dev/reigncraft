import { resolvingWildlifeSpeciesSfxProfile } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry';
import { gettingWildlifeSpeciesSfxLastPlayedAtMs } from '@/components/world/wildlife/domains/managingWildlifeSpeciesSfxPlaybackStore';
import { resolvingWildlifeSpeciesSfxPoolMinReplayIntervalMs } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxPoolMinReplayIntervalMs';

export type CheckingWildlifeSpeciesSfxReplayAllowedParams = {
  instanceId: string;
  speciesId: string;
  nowMs: number;
};

/**
 * True when enough time has passed since this instance last played its vocal pool.
 */
export function checkingWildlifeSpeciesSfxReplayAllowed({
  instanceId,
  speciesId,
  nowMs,
}: CheckingWildlifeSpeciesSfxReplayAllowedParams): boolean {
  const profile = resolvingWildlifeSpeciesSfxProfile(speciesId);

  if (!profile) {
    return false;
  }

  const minReplayIntervalMs = resolvingWildlifeSpeciesSfxPoolMinReplayIntervalMs(
    profile.poolId
  );

  if (minReplayIntervalMs === null) {
    return true;
  }

  const lastPlayedAtMs = gettingWildlifeSpeciesSfxLastPlayedAtMs(
    instanceId,
    profile.poolId
  );

  if (lastPlayedAtMs === null) {
    return true;
  }

  return nowMs - lastPlayedAtMs >= minReplayIntervalMs;
}
