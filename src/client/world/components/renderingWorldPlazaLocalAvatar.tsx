"use client";

import { computingWorldPlazaIsometricGridStepTowardTarget } from "@/components/world/domains/computingWorldPlazaIsometricGridStepTowardTarget";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_FILL_COLOR,
  DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_RADIUS_PX,
  DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_STROKE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaSandboxConstants";
import { DEFINING_WORLD_PLAZA_ISOMETRIC_SCREEN_WALK_SPEED_PER_SECOND } from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaIsometricEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaIsometricEntityZIndex";
import { useTick } from "@pixi/react";
import type { Graphics, Ticker } from "pixi.js";
import { useCallback, useRef } from "react";

export interface RenderingWorldPlazaLocalAvatarProps {
  /** Shared player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Click destination; null when not walking. */
  walkTargetRef: React.RefObject<DefiningWorldPlazaWorldPoint | null>;
  /** Updated each frame while walking toward a click target. */
  isWalkingRef: React.RefObject<boolean>;
  /** Optional hook invoked when the avatar reaches the click target. */
  onWalkArrivedRef?: React.RefObject<(() => void) | null>;
}

/**
 * Local avatar that walks toward click targets on the isometric grid.
 */
export function RenderingWorldPlazaLocalAvatar({
  playerPositionRef,
  walkTargetRef,
  isWalkingRef,
  onWalkArrivedRef,
}: RenderingWorldPlazaLocalAvatarProps): React.JSX.Element {
  const avatarGraphicsRef = useRef<Graphics | null>(null);

  const drawingAvatar = useCallback(
    (graphics: Graphics): void => {
      avatarGraphicsRef.current = graphics;
      graphics.clear();
      graphics
        .circle(0, 0, DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_RADIUS_PX)
        .fill({ color: DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_FILL_COLOR })
        .stroke({
          color: DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_STROKE_COLOR,
          width: DEFINING_WORLD_PLAZA_SANDBOX_AVATAR_STROKE_WIDTH_PX,
        });

      const playerPosition = playerPositionRef.current;
      const screenPoint =
        convertingWorldPlazaGridPointToIsometricScreenPoint(playerPosition);
      graphics.position.set(screenPoint.x, screenPoint.y);
      graphics.zIndex = resolvingWorldPlazaIsometricEntityZIndex(playerPosition);
    },
    [playerPositionRef],
  );

  useTick((ticker: Ticker) => {
    const graphics = avatarGraphicsRef.current;
    const playerPosition = playerPositionRef.current;
    const walkTarget = walkTargetRef.current;

    if (!graphics || !playerPosition) {
      return;
    }

    if (walkTarget && isWalkingRef.current) {
      const stepResult = computingWorldPlazaIsometricGridStepTowardTarget(
        playerPosition,
        walkTarget,
        DEFINING_WORLD_PLAZA_ISOMETRIC_SCREEN_WALK_SPEED_PER_SECOND,
        ticker.deltaMS / 1000,
      );

      playerPosition.x = stepResult.nextPosition.x;
      playerPosition.y = stepResult.nextPosition.y;

      if (stepResult.arrived) {
        walkTargetRef.current = null;
        isWalkingRef.current = false;
        onWalkArrivedRef?.current?.();
      }
    }

    const screenPoint =
      convertingWorldPlazaGridPointToIsometricScreenPoint(playerPosition);
    graphics.position.set(screenPoint.x, screenPoint.y);
    graphics.zIndex = resolvingWorldPlazaIsometricEntityZIndex(playerPosition);
  });

  return <pixiGraphics draw={drawingAvatar} eventMode="none" />;
}
