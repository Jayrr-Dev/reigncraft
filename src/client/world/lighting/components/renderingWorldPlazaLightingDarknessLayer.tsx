'use client';

import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint';
import { computingWorldPlazaPlayerNightLightStateFromSunState } from '@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import { resolvingWorldPlazaLightingRadialBakedTexture } from '@/components/world/lighting/domains/creatingWorldPlazaLightingRadialBakedTexture';
import {
  DEFINING_WORLD_PLAZA_LIGHTING_BASE_HOLE_RADIUS_PX,
  DEFINING_WORLD_PLAZA_LIGHTING_DARKNESS_COLOR,
  DEFINING_WORLD_PLAZA_LIGHTING_DARKNESS_MAX_ALPHA,
  DEFINING_WORLD_PLAZA_LIGHTING_LIGHTMAP_RESOLUTION_SCALE,
  DEFINING_WORLD_PLAZA_LIGHTING_OVERLAY_STAGE_Z_INDEX,
  DEFINING_WORLD_PLAZA_LIGHTING_PLAYER_TORCH_RADIUS_SCALE,
  DEFINING_WORLD_PLAZA_LIGHTING_RADIAL_TEXTURE_SIZE_PX,
} from '@/components/world/lighting/domains/definingWorldPlazaLightingEngineConstants';
import { listingWorldPlazaLightSources } from '@/components/world/lighting/domains/managingWorldPlazaLightSourceStore';
import { useApplication, useTick } from '@pixi/react';
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
  renderTexture: RenderTexture | null;
  lastViewportWidth: number;
  lastViewportHeight: number;
};

function creatingLightingOffscreenScene(): RenderingWorldPlazaLightingOffscreenScene {
  const root = new PixiContainer();
  root.scale.set(DEFINING_WORLD_PLAZA_LIGHTING_LIGHTMAP_RESOLUTION_SCALE);

  const darknessGraphics = new PixiGraphics();
  const lightsContainer = new PixiContainer();

  root.addChild(darknessGraphics);
  root.addChild(lightsContainer);

  const overlaySprite = new PixiSprite();
  overlaySprite.eventMode = 'none';
  overlaySprite.zIndex = DEFINING_WORLD_PLAZA_LIGHTING_OVERLAY_STAGE_Z_INDEX;
  overlaySprite.visible = false;
  overlaySprite.scale.set(
    1 / DEFINING_WORLD_PLAZA_LIGHTING_LIGHTMAP_RESOLUTION_SCALE
  );

  return {
    root,
    darknessGraphics,
    lightsContainer,
    holeSpritePool: new Map(),
    overlaySprite,
    renderTexture: null,
    lastViewportWidth: 0,
    lastViewportHeight: 0,
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
  const darknessNormalizedRef = useRef(0);
  const offscreenSceneRef =
    useRef<RenderingWorldPlazaLightingOffscreenScene | null>(null);
  const applicationContext = useApplication();

  useEffect(() => {
    darknessNormalizedRef.current =
      computingWorldPlazaPlayerNightLightStateFromSunState(
        sunState
      ).darknessNormalized;
  }, [sunState]);

  useEffect(() => {
    const offscreenScene = creatingLightingOffscreenScene();
    offscreenSceneRef.current = offscreenScene;

    return () => {
      offscreenScene.overlaySprite.parent?.removeChild(
        offscreenScene.overlaySprite
      );
      offscreenScene.overlaySprite.destroy();
      offscreenScene.renderTexture?.destroy(true);
      offscreenScene.root.destroy({ children: true });
      offscreenSceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const offscreenScene = offscreenSceneRef.current;

    if (
      !offscreenScene ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      return;
    }

    // Mounted after the camera rig, so appending renders the darkness last
    // (above the whole world) while staying below DOM HUD overlays.
    const stage = applicationContext.app.stage;
    stage.addChild(offscreenScene.overlaySprite);

    return () => {
      stage.removeChild(offscreenScene.overlaySprite);
    };
  }, [applicationContext]);

  useTick(() => {
    const offscreenScene = offscreenSceneRef.current;
    const worldAnchorLayer = worldAnchorLayerRef.current;

    if (
      !offscreenScene ||
      !worldAnchorLayer ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      return;
    }

    const renderer = applicationContext.app.renderer;
    const viewportWidth = renderer.screen.width;
    const viewportHeight = renderer.screen.height;
    const darknessAlpha =
      darknessNormalizedRef.current *
      DEFINING_WORLD_PLAZA_LIGHTING_DARKNESS_MAX_ALPHA;
    const { overlaySprite } = offscreenScene;

    if (darknessAlpha <= 0.005) {
      overlaySprite.visible = false;
      return;
    }

    overlaySprite.visible = true;

    const lightmapWidth = Math.max(
      1,
      Math.ceil(
        viewportWidth * DEFINING_WORLD_PLAZA_LIGHTING_LIGHTMAP_RESOLUTION_SCALE
      )
    );
    const lightmapHeight = Math.max(
      1,
      Math.ceil(
        viewportHeight * DEFINING_WORLD_PLAZA_LIGHTING_LIGHTMAP_RESOLUTION_SCALE
      )
    );

    if (
      !offscreenScene.renderTexture ||
      offscreenScene.lastViewportWidth !== lightmapWidth ||
      offscreenScene.lastViewportHeight !== lightmapHeight
    ) {
      offscreenScene.renderTexture?.destroy(true);
      offscreenScene.renderTexture = RenderTexture.create({
        width: lightmapWidth,
        height: lightmapHeight,
      });
      offscreenScene.lastViewportWidth = lightmapWidth;
      offscreenScene.lastViewportHeight = lightmapHeight;
      overlaySprite.texture = offscreenScene.renderTexture;
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
    const playerPosition = playerPositionRef.current;
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
        holeSprite.destroy();
        holeSpritePool.delete(lightId);
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
  });

  return null;
}
