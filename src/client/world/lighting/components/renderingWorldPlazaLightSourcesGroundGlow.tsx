'use client';

import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint';
import { computingWorldPlazaPlayerNightLightStateFromSunState } from '@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState';
import { resolvingWorldPlazaPlayerNightLightGlowBakedTexture } from '@/components/world/domains/creatingWorldPlazaPlayerNightLightGlowBakedTexture';
import { resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex } from '@/components/world/domains/resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import {
  DEFINING_WORLD_PLAZA_LIGHT_SOURCE_DEFAULT_TINT,
  DEFINING_WORLD_PLAZA_LIGHT_SOURCE_MAX_RENDERED_COUNT,
  DEFINING_WORLD_PLAZA_LIGHT_SOURCE_WARM_CORE_ALPHA,
} from '@/components/world/lighting/domains/definingWorldPlazaLightSource';
import {
  listingWorldPlazaLightSources,
  peekingWorldPlazaLightSourcesRevision,
} from '@/components/world/lighting/domains/managingWorldPlazaLightSourceStore';
import { useApplication } from '@pixi/react';
import type { Container, Sprite } from 'pixi.js';
import { Sprite as PixiSprite, Texture } from 'pixi.js';
import { useEffect, useRef, type RefObject } from 'react';

/** Floor-layer sort bias so glows paint above coplanar floor chunks. */
const RENDERING_WORLD_PLAZA_LIGHT_GLOW_FLOOR_DEPTH_BIAS = 1;

export interface RenderingWorldPlazaLightSourcesGroundGlowProps {
  /** Imperative floor chunk layer; glow sprites parent here for tile depth. */
  readonly floorLayerRef: RefObject<Container | null>;
}

/**
 * Renders every registered world light source as a warm floor glow.
 *
 * Brightness follows the shared day/night darkness curve (the same one the
 * player torch uses): zero in daytime, ramping toward midnight. Individual
 * sources scale that with their own `brightness` and `radiusScale`.
 */
export function RenderingWorldPlazaLightSourcesGroundGlow({
  floorLayerRef,
}: RenderingWorldPlazaLightSourcesGroundGlowProps): null {
  const sunState = usingWorldPlazaDayNightSunState();
  const nightLightState =
    computingWorldPlazaPlayerNightLightStateFromSunState(sunState);
  const nightGlowBrightnessRef = useRef(nightLightState.glowBrightness);
  const glowSpritePoolRef = useRef<Map<string, Sprite>>(new Map());
  const lastSyncRef = useRef<{
    readonly floorLayer: Container;
    readonly lightRevision: number;
    readonly nightGlowBrightness: number;
  } | null>(null);
  const applicationContext = useApplication();

  useEffect(() => {
    nightGlowBrightnessRef.current = nightLightState.glowBrightness;
  }, [nightLightState.glowBrightness]);

  useEffect(() => {
    const glowSpritePool = glowSpritePoolRef.current;

    return () => {
      for (const sprite of glowSpritePool.values()) {
        sprite.destroy();
      }

      glowSpritePool.clear();
    };
  }, []);

  usingWorldPlazaSafeTick(() => {
    const floorLayer = floorLayerRef.current;
    const glowSpritePool = glowSpritePoolRef.current;

    if (!floorLayer) {
      return;
    }

    const nightGlowBrightness = nightGlowBrightnessRef.current;
    const lightRevision = peekingWorldPlazaLightSourcesRevision();
    const lastSync = lastSyncRef.current;

    if (
      lastSync?.floorLayer === floorLayer &&
      lastSync.lightRevision === lightRevision &&
      lastSync.nightGlowBrightness === nightGlowBrightness
    ) {
      return;
    }

    const lightSources = listingWorldPlazaLightSources().slice(
      0,
      DEFINING_WORLD_PLAZA_LIGHT_SOURCE_MAX_RENDERED_COUNT
    );
    const activeLightIds = new Set(lightSources.map((light) => light.id));

    for (const [lightId, sprite] of glowSpritePool) {
      if (!activeLightIds.has(lightId)) {
        floorLayer.removeChild(sprite);
        sprite.destroy();
        glowSpritePool.delete(lightId);
      }
    }

    if (
      nightGlowBrightness <= 0 ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      for (const sprite of glowSpritePool.values()) {
        sprite.visible = false;
        sprite.alpha = 0;
      }

      if (nightGlowBrightness <= 0) {
        lastSyncRef.current = {
          floorLayer,
          lightRevision,
          nightGlowBrightness,
        };
      }

      return;
    }

    const bakedGlowTexture =
      resolvingWorldPlazaPlayerNightLightGlowBakedTexture(
        applicationContext.app.renderer
      );
    let didMutateFloorLayerOrder = false;

    for (const light of lightSources) {
      let sprite = glowSpritePool.get(light.id);

      if (!sprite) {
        sprite = new PixiSprite();
        sprite.eventMode = 'none';
        sprite.blendMode = 'screen';
        sprite.anchor.set(0.5);
        floorLayer.addChild(sprite);
        glowSpritePool.set(light.id, sprite);
      }

      // Pixi v8 defaults Sprite textures to Texture.EMPTY (truthy), so compare
      // against EMPTY instead of a falsy check when assigning the baked glow.
      if (sprite.texture === Texture.EMPTY) {
        sprite.texture = bakedGlowTexture;
      }

      const gridPoint = {
        x: light.gridX,
        y: light.gridY,
        layer: light.worldLayer,
      };
      const footAnchor =
        computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint(gridPoint);
      const glowZIndex =
        resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex(
          gridPoint,
          RENDERING_WORLD_PLAZA_LIGHT_GLOW_FLOOR_DEPTH_BIAS
        );

      sprite.position.set(footAnchor.centerXPx, footAnchor.centerYPx);
      sprite.scale.set(light.radiusScale);
      sprite.tint =
        light.colorTint ?? DEFINING_WORLD_PLAZA_LIGHT_SOURCE_DEFAULT_TINT;

      if (sprite.zIndex !== glowZIndex) {
        sprite.zIndex = glowZIndex;
        didMutateFloorLayerOrder = true;
      }

      const effectiveAlpha =
        nightGlowBrightness *
        light.brightness *
        DEFINING_WORLD_PLAZA_LIGHT_SOURCE_WARM_CORE_ALPHA;

      sprite.visible = effectiveAlpha > 0.01;
      sprite.alpha = effectiveAlpha;
    }

    if (didMutateFloorLayerOrder && floorLayer.sortableChildren) {
      floorLayer.sortChildren();
    }

    lastSyncRef.current = {
      floorLayer,
      lightRevision,
      nightGlowBrightness,
    };
  }, 'tick:light-sources-glow');

  return null;
}
