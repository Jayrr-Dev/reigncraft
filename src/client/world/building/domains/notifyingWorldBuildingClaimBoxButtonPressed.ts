import { selectingPlazaHomeScreenButtonSfxClipId } from '@/components/home/domains/selectingPlazaHomeScreenButtonSfxClipId';
import { playingPlazaHomeScreenButtonSfx } from '@/components/home/domains/playingPlazaHomeScreenButtonSfx';
import { DEFINING_WORLD_BUILDING_CLAIM_BOX_BUTTON_SFX_VOLUME_MULTIPLIER } from '@/components/world/building/domains/definingWorldBuildingPlotClaimConstants';
import { unlockingWorldPlazaBiomeMusicFromUserGesture } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';

/**
 * Plays a quieter start-screen button click for claim plot card actions.
 */
export function notifyingWorldBuildingClaimBoxButtonPressed(): void {
  unlockingWorldPlazaBiomeMusicFromUserGesture();
  playingPlazaHomeScreenButtonSfx({
    clipId: selectingPlazaHomeScreenButtonSfxClipId(),
    volumeMultiplier:
      DEFINING_WORLD_BUILDING_CLAIM_BOX_BUTTON_SFX_VOLUME_MULTIPLIER,
  });
}
