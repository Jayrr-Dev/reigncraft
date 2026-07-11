'use client';

import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint';
import { computingWorldPlazaPlayerNightLightGlowBrightnessAfterCanopyOcclusion } from '@/components/world/domains/computingWorldPlazaPlayerNightLightGlowCanopyOcclusion';
import { computingWorldPlazaPlayerNightLightStateFromSunState } from '@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState';
import { resolvingWorldPlazaPlayerNightLightGlowBakedTexture } from '@/components/world/domains/creatingWorldPlazaPlayerNightLightGlowBakedTexture';
import {
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FLOOR_OUTER_DARKNESS_DEPTH_BIAS,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FLOOR_WARM_GLOW_DEPTH_BIAS,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA,
} from '@/components/world/domains/definingWorldPlazaPlayerNightLightConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex } from '@/components/world/domains/resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { useApplication } from '@pixi/react';
import type { Container, Sprite } from 'pixi.js';
import { Sprite as PixiSprite, Texture } from 'pixi.js';
import { useEffect, useRef, type RefObject } from 'react';

export interface RenderingWorldPlazaPlayerNightLightGroundGlowProps {
  /** Imperative floor chunk layer; torch sprites parent here for depth with tiles. */
  floorLayerRef: RefObject<Container | null>;
  /** Live local player position in grid space. */
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  /** Placed blocks near the player for canopy occlusion. */
  placedBlocksRef: RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
}

type RenderingWorldPlazaPlayerNightLightFloorTorchSprites = {
  readonly outerDarknessSprite: Sprite;
  readonly warmGlowSprite: Sprite;
};

/**
 * Player torch lighting rendered entirely on the Pixi floor layer.
 *
 * Warm glow and outer darkness are parented to the floor chunk container so
 * they sort with ground tiles and always stay beneath the entity layer
 * (avatars, tree trunks, canopies, placed blocks). A screen-space DOM mask
 * cannot respect that depth, which is why trees previously looked lit through.
 */
export function RenderingWorldPlazaPlayerNightLightGroundGlow({
  floorLayerRef,
  playerPositionRef,
  placedBlocksRef,
}: RenderingWorldPlazaPlayerNightLightGroundGlowProps): null {
  const sunState = usingWorldPlazaDayNightSunState();
  const nightLightState =
    computingWorldPlazaPlayerNightLightStateFromSunState(sunState);
  const nightLightStateRef = useRef(nightLightState);
  const torchSpritesRef =
    useRef<RenderingWorldPlazaPlayerNightLightFloorTorchSprites | null>(null);
  const applicationContext = useApplication();

  useEffect(() => {
    nightLightStateRef.current = nightLightState;
  }, [nightLightState]);

  useEffect(() => {
    const outerDarknessSprite = new PixiSprite();
    outerDarknessSprite.eventMode = 'none';
    outerDarknessSprite.anchor.set(0.5);
    outerDarknessSprite.visible = false;
    outerDarknessSprite.alpha = 0;

    const warmGlowSprite = new PixiSprite();
    warmGlowSprite.eventMode = 'none';
    warmGlowSprite.blendMode = 'screen';
    warmGlowSprite.anchor.set(0.5);
    warmGlowSprite.visible = false;
    warmGlowSprite.alpha = 0;

    torchSpritesRef.current = {
      outerDarknessSprite,
      warmGlowSprite,
    };

    return () => {
      outerDarknessSprite.destroy();
      warmGlowSprite.destroy();
      torchSpritesRef.current = null;
    };
  }, []);

  useEffect(() => {
    const floorLayer = floorLayerRef.current;
    const torchSprites = torchSpritesRef.current;

    if (!floorLayer || !torchSprites) {
      return;
    }

    const { outerDarknessSprite, warmGlowSprite } = torchSprites;

    floorLayer.addChild(outerDarknessSprite);
    floorLayer.addChild(warmGlowSprite);

    return () => {
      floorLayer.removeChild(outerDarknessSprite);
      floorLayer.removeChild(warmGlowSprite);
    };
  }, [floorLayerRef]);

  usingWorldPlazaSafeTick(() => {
    const torchSprites = torchSpritesRef.current;
    const floorLayer = floorLayerRef.current;
    const playerPosition = playerPositionRef.current;
    const { glowBrightness: baseGlowBrightness } = nightLightStateRef.current;

    if (!torchSprites || !floorLayer || !playerPosition) {
      return;
    }

    const { outerDarknessSprite, warmGlowSprite } = torchSprites;

    // Night darkness comes from the screen-space lighting engine. Keep the
    // retired floor darkness ring hidden without doing movement/depth work.
    outerDarknessSprite.visible = false;
    outerDarknessSprite.alpha = 0;

    if (baseGlowBrightness <= 0) {
      warmGlowSprite.visible = false;
      warmGlowSprite.alpha = 0;
      return;
    }

    const placedBlocksScene = placedBlocksRef.current;
    const placedBlocks = placedBlocksScene?.blocks ?? [];
    const footAnchor =
      computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint(
        playerPosition
      );
    const outerDarknessZIndex =
      resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex(
        playerPosition,
        DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FLOOR_OUTER_DARKNESS_DEPTH_BIAS
      );
    const warmGlowZIndex =
      resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex(
        playerPosition,
        DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FLOOR_WARM_GLOW_DEPTH_BIAS
      );
    let didMutateFloorLayerOrder = false;

    if (outerDarknessSprite.zIndex !== outerDarknessZIndex) {
      outerDarknessSprite.zIndex = outerDarknessZIndex;
      didMutateFloorLayerOrder = true;
    }

    if (warmGlowSprite.zIndex !== warmGlowZIndex) {
      warmGlowSprite.zIndex = warmGlowZIndex;
      didMutateFloorLayerOrder = true;
    }

    if (didMutateFloorLayerOrder && floorLayer.sortableChildren) {
      floorLayer.sortChildren();
    }

    outerDarknessSprite.position.set(
      footAnchor.centerXPx,
      footAnchor.centerYPx
    );
    warmGlowSprite.position.set(footAnchor.centerXPx, footAnchor.centerYPx);

    if (
      checkingWorldPlazaPixiApplicationIsReady(applicationContext) &&
      warmGlowSprite.texture === Texture.EMPTY
    ) {
      warmGlowSprite.texture =
        resolvingWorldPlazaPlayerNightLightGlowBakedTexture(
          applicationContext.app.renderer
        );
    }

    const effectiveGlowBrightness =
      computingWorldPlazaPlayerNightLightGlowBrightnessAfterCanopyOcclusion(
        baseGlowBrightness,
        playerPosition,
        placedBlocks
      );

    if (
      effectiveGlowBrightness <= 0.01 ||
      warmGlowSprite.texture === Texture.EMPTY
    ) {
      warmGlowSprite.visible = false;
      warmGlowSprite.alpha = 0;
      return;
    }

    warmGlowSprite.visible = true;
    warmGlowSprite.alpha =
      effectiveGlowBrightness *
      DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA;
  }, 'tick:player-night-glow');

  return null;
}
