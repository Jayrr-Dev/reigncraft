'use client';

import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint';
import { computingWorldPlazaPlayerNightLightStateFromSunState } from '@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { beginningWorldPlazaPerformanceSample } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { queueingWorldPlazaPixiGpuResourceDisposal } from '@/components/world/domains/queueingWorldPlazaPixiGpuResourceDisposal';
import { resolvingWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { resolvingWorldPlazaLightingRadialBakedTexture } from '@/components/world/lighting/domains/creatingWorldPlazaLightingRadialBakedTexture';
import {
  DEFINING_WORLD_PLAZA_LIGHTING_BASE_HOLE_RADIUS_PX,
  DEFINING_WORLD_PLAZA_LIGHTING_DARKNESS_COLOR,
  DEFINING_WORLD_PLAZA_LIGHTING_DARKNESS_MAX_ALPHA,
  DEFINING_WORLD_PLAZA_LIGHTING_OVERLAY_STAGE_Z_INDEX,
  DEFINING_WORLD_PLAZA_LIGHTING_PLAYER_TORCH_RADIUS_SCALE,
  DEFINING_WORLD_PLAZA_LIGHTING_RADIAL_TEXTURE_SIZE_PX,
} from '@/components/world/lighting/domains/definingWorldPlazaLightingEngineConstants';
import {
  listingWorldPlazaLightSources,
  peekingWorldPlazaLightSourcesRevision,
} from '@/components/world/lighting/domains/managingWorldPlazaLightSourceStore';
import { useApplication } from '@pixi/react';
import type { Container, Sprite } from 'pixi.js';
import {
  Container as PixiContainer,
  Graphics as PixiGraphics,
  Sprite as PixiSprite,
  RenderTexture,
} from 'pixi.js';
import { useEffect, useRef, type RefObject } from 'react';

/** Stable id for the local player's torch light. */
const RENDERING_WORLD_PLAZA_LIGHTING_PLAYER_LIGHT_ID = 'player-torch';

/** Skip RTT when camera translation moves less than this many pixels. */
const RENDERING_WORLD_PLAZA_LIGHTING_CAMERA_DIRTY_EPSILON_PX = 0.5;

/** Skip RTT when player grid position moves less than this. */
const RENDERING_WORLD_PLAZA_LIGHTING_PLAYER_DIRTY_EPSILON_GRID = 0.01;

/** Skip RTT when darkness alpha changes less than this. */
const RENDERING_WORLD_PLAZA_LIGHTING_ALPHA_DIRTY_EPSILON = 0.002;

type RenderingWorldPlazaLightingDirtySnapshot = {
  darknessAlpha: number;
  viewportWidth: number;
  viewportHeight: number;
  cameraTx: number;
  cameraTy: number;
  cameraScaleX: number;
  playerX: number;
  playerY: number;
  playerLayer: number;
  lightRevision: number;
};

export interface RenderingWorldPlazaLightingDarknessLayerProps {
  /** Any container inside the camera rig; its world transform maps world-local to screen. */
  readonly worldAnchorLayerRef: RefObject<Container | null>;
  /** Live local player position; the player torch is always a light. */
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
}

type RenderingWorldPlazaLightingOffscreenScene = {
  readonly root: Container;
  readonly darknessGraphics: PixiGraphics;
  readonly lightsContainer: Container;
  readonly holeSpritePool: Map<string, Sprite>;
  readonly overlaySprite: Sprite;
  readonly staticDarknessGraphics: PixiGraphics;
  renderTexture: RenderTexture | null;
  lastViewportWidth: number;
  lastViewportHeight: number;
  lastStaticViewportWidth: number;
  lastStaticViewportHeight: number;
};

function creatingLightingOffscreenScene(
  lightmapResolutionScale: number
): RenderingWorldPlazaLightingOffscreenScene {
  const root = new PixiContainer();
  root.scale.set(lightmapResolutionScale);

  const darknessGraphics = new PixiGraphics();
  const lightsContainer = new PixiContainer();

  root.addChild(darknessGraphics);
  root.addChild(lightsContainer);

  const overlaySprite = new PixiSprite();
  overlaySprite.eventMode = 'none';
  overlaySprite.zIndex = DEFINING_WORLD_PLAZA_LIGHTING_OVERLAY_STAGE_Z_INDEX;
  overlaySprite.visible = false;
  overlaySprite.scale.set(1 / lightmapResolutionScale);

  const staticDarknessGraphics = new PixiGraphics();
  staticDarknessGraphics.eventMode = 'none';
  staticDarknessGraphics.zIndex =
    DEFINING_WORLD_PLAZA_LIGHTING_OVERLAY_STAGE_Z_INDEX;
  staticDarknessGraphics.visible = false;

  return {
    root,
    darknessGraphics,
    lightsContainer,
    holeSpritePool: new Map(),
    overlaySprite,
    staticDarknessGraphics,
    renderTexture: null,
    lastViewportWidth: 0,
    lastViewportHeight: 0,
    lastStaticViewportWidth: 0,
    lastStaticViewportHeight: 0,
  };
}

/**
 * Screen-space night darkness with erase-blend holes at every light source.
 *
 * This is the standard 2D lightmap technique: an offscreen scene draws a
 * full-viewport darkness rect, then each light erases a soft radial hole.
 * The result is composited over the world once per frame, so any number of
 * lights carve real openings in the night instead of only brightening pixels
 * beneath the dark tint. Darkness strength follows the shared day/night
 * cycle: zero through the day, ramping toward midnight.
 */
export function RenderingWorldPlazaLightingDarknessLayer({
  worldAnchorLayerRef,
  playerPositionRef,
}: RenderingWorldPlazaLightingDarknessLayerProps): null {
  const sunState = usingWorldPlazaDayNightSunState();
  const performanceProfile = usingWorldPlazaPerformanceProfile();
  const darknessNormalizedRef = useRef(0);
  const lastDirtySnapshotRef =
    useRef<RenderingWorldPlazaLightingDirtySnapshot | null>(null);
  const offscreenSceneRef =
    useRef<RenderingWorldPlazaLightingOffscreenScene | null>(null);
  const lastRttAtMsRef = useRef(0);
  const applicationContext = useApplication();

  useEffect(() => {
    darknessNormalizedRef.current =
      computingWorldPlazaPlayerNightLightStateFromSunState(
        sunState
      ).darknessNormalized;
  }, [sunState]);

  useEffect(() => {
    const offscreenScene = creatingLightingOffscreenScene(
      performanceProfile.lightingLightmapResolutionScale
    );
    offscreenSceneRef.current = offscreenScene;
    lastDirtySnapshotRef.current = null;

    return () => {
      offscreenScene.overlaySprite.parent?.removeChild(
        offscreenScene.overlaySprite
      );
      offscreenScene.staticDarknessGraphics.parent?.removeChild(
        offscreenScene.staticDarknessGraphics
      );
      queueingWorldPlazaPixiGpuResourceDisposal(() => {
        offscreenScene.overlaySprite.destroy();
        offscreenScene.staticDarknessGraphics.destroy();
        offscreenScene.renderTexture?.destroy(true);
        offscreenScene.root.destroy({ children: true });
      });
      offscreenSceneRef.current = null;
    };
  }, [performanceProfile.lightingLightmapResolutionScale]);

  useEffect(() => {
    const offscreenScene = offscreenSceneRef.current;

    if (
      !offscreenScene ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      return;
    }

    const stage = applicationContext.app.stage;
    stage.addChild(offscreenScene.overlaySprite);
    stage.addChild(offscreenScene.staticDarknessGraphics);

    return () => {
      stage.removeChild(offscreenScene.overlaySprite);
      stage.removeChild(offscreenScene.staticDarknessGraphics);
    };
  }, [applicationContext]);

  usingWorldPlazaSafeTick(() => {
    const offscreenScene = offscreenSceneRef.current;
    const worldAnchorLayer = worldAnchorLayerRef.current;

    if (
      !offscreenScene ||
      !worldAnchorLayer ||
      !applicationContext.app?.renderer
    ) {
      return;
    }

    const renderer = applicationContext.app.renderer;
    const viewportSize =
      resolvingWorldPlazaPixiViewportSize(applicationContext);

    if (!viewportSize) {
      return;
    }

    const viewportWidth = viewportSize.width;
    const viewportHeight = viewportSize.height;
    const darknessAlpha =
      darknessNormalizedRef.current *
      DEFINING_WORLD_PLAZA_LIGHTING_DARKNESS_MAX_ALPHA;
    const { overlaySprite, staticDarknessGraphics } = offscreenScene;

    if (darknessAlpha <= 0.005) {
      overlaySprite.visible = false;
      staticDarknessGraphics.visible = false;
      lastDirtySnapshotRef.current = null;
      return;
    }

    if (!performanceProfile.lightingUsesLightmapRtt) {
      overlaySprite.visible = false;
      staticDarknessGraphics.visible = true;
      staticDarknessGraphics.alpha = darknessAlpha;

      if (
        offscreenScene.lastStaticViewportWidth !== viewportWidth ||
        offscreenScene.lastStaticViewportHeight !== viewportHeight
      ) {
        staticDarknessGraphics.clear();
        staticDarknessGraphics.rect(0, 0, viewportWidth, viewportHeight);
        staticDarknessGraphics.fill({
          color: DEFINING_WORLD_PLAZA_LIGHTING_DARKNESS_COLOR,
          alpha: 1,
        });
        offscreenScene.lastStaticViewportWidth = viewportWidth;
        offscreenScene.lastStaticViewportHeight = viewportHeight;
      }

      lastDirtySnapshotRef.current = null;
      return;
    }

    staticDarknessGraphics.visible = false;
    overlaySprite.visible = true;

    const worldTransform = worldAnchorLayer.worldTransform;
    const playerPosition = playerPositionRef.current;
    const lightRevision = peekingWorldPlazaLightSourcesRevision();
    const dirtySnapshot: RenderingWorldPlazaLightingDirtySnapshot = {
      darknessAlpha,
      viewportWidth,
      viewportHeight,
      cameraTx: worldTransform.tx,
      cameraTy: worldTransform.ty,
      cameraScaleX: worldTransform.a,
      playerX: playerPosition?.x ?? 0,
      playerY: playerPosition?.y ?? 0,
      playerLayer: playerPosition?.layer ?? 0,
      lightRevision,
    };
    const previousDirtySnapshot = lastDirtySnapshotRef.current;

    if (
      previousDirtySnapshot &&
      Math.abs(
        previousDirtySnapshot.darknessAlpha - dirtySnapshot.darknessAlpha
      ) < RENDERING_WORLD_PLAZA_LIGHTING_ALPHA_DIRTY_EPSILON &&
      previousDirtySnapshot.viewportWidth === dirtySnapshot.viewportWidth &&
      previousDirtySnapshot.viewportHeight === dirtySnapshot.viewportHeight &&
      Math.abs(previousDirtySnapshot.cameraTx - dirtySnapshot.cameraTx) <
        RENDERING_WORLD_PLAZA_LIGHTING_CAMERA_DIRTY_EPSILON_PX &&
      Math.abs(previousDirtySnapshot.cameraTy - dirtySnapshot.cameraTy) <
        RENDERING_WORLD_PLAZA_LIGHTING_CAMERA_DIRTY_EPSILON_PX &&
      Math.abs(
        previousDirtySnapshot.cameraScaleX - dirtySnapshot.cameraScaleX
      ) < 0.0001 &&
      Math.abs(previousDirtySnapshot.playerX - dirtySnapshot.playerX) <
        RENDERING_WORLD_PLAZA_LIGHTING_PLAYER_DIRTY_EPSILON_GRID &&
      Math.abs(previousDirtySnapshot.playerY - dirtySnapshot.playerY) <
        RENDERING_WORLD_PLAZA_LIGHTING_PLAYER_DIRTY_EPSILON_GRID &&
      previousDirtySnapshot.playerLayer === dirtySnapshot.playerLayer &&
      previousDirtySnapshot.lightRevision === dirtySnapshot.lightRevision
    ) {
      return;
    }

    const nowMs = performance.now();

    if (
      performanceProfile.lightingRttMinIntervalMs > 0 &&
      previousDirtySnapshot &&
      nowMs - lastRttAtMsRef.current <
        performanceProfile.lightingRttMinIntervalMs
    ) {
      return;
    }

    lastDirtySnapshotRef.current = dirtySnapshot;
    lastRttAtMsRef.current = nowMs;

    const finishLightingRttSample = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.LIGHTING_RTT
    );

    const lightmapWidth = Math.max(
      1,
      Math.ceil(
        viewportWidth * performanceProfile.lightingLightmapResolutionScale
      )
    );
    const lightmapHeight = Math.max(
      1,
      Math.ceil(
        viewportHeight * performanceProfile.lightingLightmapResolutionScale
      )
    );

    if (
      !offscreenScene.renderTexture ||
      offscreenScene.lastViewportWidth !== lightmapWidth ||
      offscreenScene.lastViewportHeight !== lightmapHeight
    ) {
      const previousRenderTexture = offscreenScene.renderTexture;
      offscreenScene.renderTexture = RenderTexture.create({
        width: lightmapWidth,
        height: lightmapHeight,
      });
      offscreenScene.lastViewportWidth = lightmapWidth;
      offscreenScene.lastViewportHeight = lightmapHeight;
      overlaySprite.texture = offscreenScene.renderTexture;

      if (previousRenderTexture) {
        queueingWorldPlazaPixiGpuResourceDisposal(() => {
          previousRenderTexture.destroy(true);
        });
      }
    }

    offscreenScene.darknessGraphics.clear();
    offscreenScene.darknessGraphics.rect(0, 0, viewportWidth, viewportHeight);
    offscreenScene.darknessGraphics.fill({
      color: DEFINING_WORLD_PLAZA_LIGHTING_DARKNESS_COLOR,
      alpha: darknessAlpha,
    });

    // Mirror the camera transform so world-local light anchors land on the
    // same screen pixels as the world beneath. worldTransform is one frame
    // stale at most, matching how in-world glow sprites already behave.
    offscreenScene.lightsContainer.setFromMatrix(
      worldAnchorLayer.worldTransform
    );

    const radialTexture = resolvingWorldPlazaLightingRadialBakedTexture();
    const holeSpritePool = offscreenScene.holeSpritePool;
    const lightEntries: {
      readonly id: string;
      readonly gridPoint: DefiningWorldPlazaWorldPoint;
      readonly radiusScale: number;
      readonly brightness: number;
    }[] = [];

    if (playerPosition) {
      lightEntries.push({
        id: RENDERING_WORLD_PLAZA_LIGHTING_PLAYER_LIGHT_ID,
        gridPoint: playerPosition,
        radiusScale: DEFINING_WORLD_PLAZA_LIGHTING_PLAYER_TORCH_RADIUS_SCALE,
        brightness: 1,
      });
    }

    for (const light of listingWorldPlazaLightSources()) {
      lightEntries.push({
        id: light.id,
        gridPoint: { x: light.gridX, y: light.gridY, layer: light.worldLayer },
        radiusScale: light.radiusScale,
        brightness: light.brightness,
      });
    }

    const activeLightIds = new Set(lightEntries.map((light) => light.id));

    for (const [lightId, holeSprite] of holeSpritePool) {
      if (!activeLightIds.has(lightId)) {
        offscreenScene.lightsContainer.removeChild(holeSprite);
        holeSpritePool.delete(lightId);
        queueingWorldPlazaPixiGpuResourceDisposal(() => {
          holeSprite.destroy();
        });
      }
    }

    const holeScalePerRadius =
      (DEFINING_WORLD_PLAZA_LIGHTING_BASE_HOLE_RADIUS_PX * 2) /
      DEFINING_WORLD_PLAZA_LIGHTING_RADIAL_TEXTURE_SIZE_PX;

    for (const light of lightEntries) {
      let holeSprite = holeSpritePool.get(light.id);

      if (!holeSprite) {
        holeSprite = new PixiSprite(radialTexture);
        holeSprite.eventMode = 'none';
        holeSprite.blendMode = 'erase';
        holeSprite.anchor.set(0.5);
        offscreenScene.lightsContainer.addChild(holeSprite);
        holeSpritePool.set(light.id, holeSprite);
      }

      const footAnchor =
        computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint(
          light.gridPoint
        );

      holeSprite.position.set(footAnchor.centerXPx, footAnchor.centerYPx);
      holeSprite.scale.set(holeScalePerRadius * light.radiusScale);
      holeSprite.alpha = Math.max(0, Math.min(1, light.brightness));
    }

    renderer.render({
      container: offscreenScene.root,
      target: offscreenScene.renderTexture,
      clear: true,
    });
    finishLightingRttSample();
  }, 'tick:lighting-darkness');

  return null;
}
