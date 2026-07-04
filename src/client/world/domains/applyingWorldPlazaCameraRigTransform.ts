import { computingWorldPlazaCameraFollowWorldLocalScreenPointFromWorldPoint } from '@/components/world/domains/computingWorldPlazaCameraFollowWorldLocalScreenPointFromWorldPoint';
import { computingWorldPlazaCameraOffsetForPlayerFollow } from '@/components/world/domains/computingWorldPlazaCameraOffsetWithFollowDeadZone';
import { computingWorldPlazaEffectiveCameraWorldZoom } from '@/components/world/domains/computingWorldPlazaEffectiveCameraWorldZoom';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import type { Container } from 'pixi.js';

/** Inputs for {@link applyingWorldPlazaCameraRigTransform}. */
export type ApplyingWorldPlazaCameraRigTransformInput = {
  readonly worldContainer: Container;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly viewportSize: DefiningWorldPlazaPixiViewportSize;
  readonly cameraOffsetRef: { current: DefiningWorldPlazaCameraOffset };
  readonly cameraWorldZoomRef: { current: number };
  readonly viewportSizeRef: { current: DefiningWorldPlazaPixiViewportSize };
  readonly fullscreenLogicalViewport: DefiningWorldPlazaPixiViewportSize | null;
  readonly hasInitializedCamera: boolean;
  readonly isMobile: boolean;
};

/**
 * Applies the current follow zoom and offset to the world container.
 *
 * Shared by the camera tick and the pre-render layout pass so Pixi culling sees
 * a centered world before the first frame is drawn.
 */
export function applyingWorldPlazaCameraRigTransform(
  input: ApplyingWorldPlazaCameraRigTransformInput
): void {
  const playerScreenPoint =
    computingWorldPlazaCameraFollowWorldLocalScreenPointFromWorldPoint(
      input.playerPosition
    );
  const currentCameraOffset: DefiningWorldPlazaCameraOffset = {
    x: input.cameraOffsetRef.current.x,
    y: input.cameraOffsetRef.current.y,
  };
  const worldZoom = computingWorldPlazaEffectiveCameraWorldZoom(
    input.viewportSize,
    input.fullscreenLogicalViewport,
    input.isMobile
  );
  const cameraOffset = computingWorldPlazaCameraOffsetForPlayerFollow(
    playerScreenPoint,
    input.viewportSize,
    currentCameraOffset,
    input.hasInitializedCamera,
    worldZoom,
    input.isMobile
  );

  input.worldContainer.scale.set(worldZoom, worldZoom);
  input.worldContainer.position.set(cameraOffset.x, cameraOffset.y);
  input.cameraOffsetRef.current.x = cameraOffset.x;
  input.cameraOffsetRef.current.y = cameraOffset.y;
  input.cameraWorldZoomRef.current = worldZoom;
  input.viewportSizeRef.current.width = input.viewportSize.width;
  input.viewportSizeRef.current.height = input.viewportSize.height;
}
