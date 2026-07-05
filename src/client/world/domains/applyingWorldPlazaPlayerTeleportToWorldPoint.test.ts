import { applyingWorldPlazaPlayerTeleportToWorldPoint } from '@/components/world/domains/applyingWorldPlazaPlayerTeleportToWorldPoint';
import { DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import { findingWorldPlazaFirelandsTeleportWorldPointForDev } from '@/components/world/domains/findingWorldPlazaFirelandsTeleportWorldPointForDev';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaPlayerTeleportToWorldPoint', () => {
  it('snaps the player layer to the procedural surface after collision ejection', () => {
    const destination = findingWorldPlazaFirelandsTeleportWorldPointForDev();

    expect(destination).not.toBeNull();

    if (!destination) {
      return;
    }

    const playerPosition = { x: 0, y: 0, layer: 1 };
    const walkTargetRef = { current: destination };
    const isWalkingRef = { current: true };
    const isJumpingRef = { current: true };
    const localAvatarMotionStateRef = {
      current: { ...DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE, layer: 1 },
    };
    const syncingMovePositionRef = { current: null as (() => void) | null };

    applyingWorldPlazaPlayerTeleportToWorldPoint({
      destinationWorldPoint: destination,
      placedBlocks: [],
      playerPositionRef: { current: playerPosition },
      walkTargetRef,
      isWalkingRef,
      isJumpingRef,
      localAvatarMotionStateRef,
      syncingMovePositionRef,
    });

    const standingTile =
      resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);
    const expectedLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
      standingTile.tileX,
      standingTile.tileY
    );

    expect(playerPosition.layer).toBe(expectedLayer);
    expect(localAvatarMotionStateRef.current.layer).toBe(expectedLayer);
    expect(isWalkingRef.current).toBe(false);
    expect(isJumpingRef.current).toBe(false);
    expect(walkTargetRef.current).toBeNull();
  });
});
