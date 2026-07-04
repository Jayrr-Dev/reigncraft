'use client';

import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import { readingWorldPlazaPlayerNightLightFrontOccluderOcclusionStrengthCached } from '@/components/world/domains/cachingWorldPlazaPlayerNightLightFrontOccluderOcclusion';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint';
import { computingWorldPlazaPlayerNightLightGlowBrightnessAfterCanopyOcclusion } from '@/components/world/domains/computingWorldPlazaPlayerNightLightGlowCanopyOcclusion';
import { computingWorldPlazaPlayerNightLightStateFromSunState } from '@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState';
import { resolvingWorldPlazaPlayerNightLightGlowBakedTexture } from '@/components/world/domains/creatingWorldPlazaPlayerNightLightGlowBakedTexture';
import {
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FLOOR_GLOW_Z_INDEX,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_GLOW_DIM_MAX,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA,
} from '@/components/world/domains/definingWorldPlazaPlayerNightLightConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import { useApplication, useTick } from '@pixi/react';
import type { Sprite } from 'pixi.js';
import { useCallback, useRef } from 'react';

export interface RenderingWorldPlazaPlayerNightLightGroundGlowProps {
  /** Live local player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Placed blocks near the player for depth sorting against occluders. */
  placedBlocksRef: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
}

/**
 * Warm torch pool on the floor layer, painted above ground tiles but beneath
 * every entity (avatars, trees, placed blocks) so the light reads as cast on
 * the ground behind them.
 */
export function RenderingWorldPlazaPlayerNightLightGroundGlow({
  playerPositionRef,
  placedBlocksRef,
}: RenderingWorldPlazaPlayerNightLightGroundGlowProps): React.JSX.Element {
  const sunState = usingWorldPlazaDayNightSunState();
  const nightLightState =
    computingWorldPlazaPlayerNightLightStateFromSunState(sunState);
  const nightLightStateRef = useRef(nightLightState);
  const glowSpriteRef = useRef<Sprite | null>(null);
  const applicationContext = useApplication();

  nightLightStateRef.current = nightLightState;

  const initializingGroundGlowSprite = useCallback((sprite: Sprite): void => {
    glowSpriteRef.current = sprite;
    sprite.eventMode = 'none';
    sprite.blendMode = 'screen';
    sprite.anchor.set(0.5);
    sprite.visible = false;
    sprite.alpha = 0;
  }, []);

  useTick(() => {
    const sprite = glowSpriteRef.current;
    const playerPosition = playerPositionRef.current;
    const placedBlocksScene = placedBlocksRef.current;
    const placedBlocks = placedBlocksScene?.blocks ?? [];
    const placedBlocksByTile = placedBlocksScene?.blocksByTile;
    const { glowBrightness: baseGlowBrightness } = nightLightStateRef.current;

    if (!sprite || !playerPosition || baseGlowBrightness <= 0) {
      if (sprite) {
        sprite.visible = false;
        sprite.alpha = 0;
      }

      return;
    }

    if (
      checkingWorldPlazaPixiApplicationIsReady(applicationContext) &&
      !sprite.texture
    ) {
      sprite.texture = resolvingWorldPlazaPlayerNightLightGlowBakedTexture(
        applicationContext.app.renderer
      );
    }

    const frontOccluderOcclusionStrength =
      readingWorldPlazaPlayerNightLightFrontOccluderOcclusionStrengthCached(
        playerPosition,
        placedBlocks,
        placedBlocksByTile
      );
    const effectiveGlowBrightness =
      computingWorldPlazaPlayerNightLightGlowBrightnessAfterCanopyOcclusion(
        baseGlowBrightness,
        playerPosition,
        placedBlocks
      ) *
      (1 -
        frontOccluderOcclusionStrength *
          DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_GLOW_DIM_MAX);

    if (effectiveGlowBrightness <= 0.01 || !sprite.texture) {
      sprite.visible = false;
      sprite.alpha = 0;
      return;
    }

    const footAnchor =
      computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint(
        playerPosition
      );

    sprite.visible = true;
    sprite.alpha =
      effectiveGlowBrightness *
      DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_WARM_CORE_ALPHA;
    sprite.position.set(footAnchor.centerXPx, footAnchor.centerYPx);
    sprite.zIndex = DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FLOOR_GLOW_Z_INDEX;
  });

  return (
    <pixiSprite
      ref={(instance) => {
        if (instance) {
          initializingGroundGlowSprite(instance);
        }
      }}
      eventMode="none"
    />
  );
}
