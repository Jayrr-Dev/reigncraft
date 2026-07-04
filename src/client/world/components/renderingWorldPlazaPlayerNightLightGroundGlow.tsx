'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { applyingWorldPlazaPlayerNightLightGlowFiltersOnGraphics } from '@/components/world/domains/applyingWorldPlazaPlayerNightLightGlowFiltersOnGraphics';
import { computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint';
import { computingWorldPlazaPlayerNightLightFrontOccluderOcclusionStrength } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFrontOccluderOcclusion';
import { computingWorldPlazaPlayerNightLightGlowBrightnessAfterCanopyOcclusion } from '@/components/world/domains/computingWorldPlazaPlayerNightLightGlowCanopyOcclusion';
import { computingWorldPlazaPlayerNightLightStateFromSunState } from '@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState';
import {
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FLOOR_GLOW_Z_INDEX,
  DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FRONT_OCCLUDER_GLOW_DIM_MAX,
} from '@/components/world/domains/definingWorldPlazaPlayerNightLightConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics } from '@/components/world/domains/drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import { useTick } from '@pixi/react';
import type { Graphics } from 'pixi.js';
import { useCallback, useRef } from 'react';

export interface RenderingWorldPlazaPlayerNightLightGroundGlowProps {
  /** Live local player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Placed blocks near the player for depth sorting against occluders. */
  placedBlocksRef: React.RefObject<DefiningWorldBuildingPlacedBlock[]>;
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
  const glowGraphicsRef = useRef<Graphics | null>(null);
  const lastDrawnGlowBrightnessRef = useRef(0);

  nightLightStateRef.current = nightLightState;

  const initializingGroundGlowGraphics = useCallback(
    (graphics: Graphics): void => {
      glowGraphicsRef.current = graphics;
      graphics.eventMode = 'none';
      graphics.blendMode = 'screen';
      graphics.visible = false;
      graphics.alpha = 0;
      applyingWorldPlazaPlayerNightLightGlowFiltersOnGraphics(graphics);
    },
    []
  );

  useTick(() => {
    const graphics = glowGraphicsRef.current;
    const playerPosition = playerPositionRef.current;
    const placedBlocks = placedBlocksRef.current ?? [];
    const { glowBrightness: baseGlowBrightness } = nightLightStateRef.current;

    if (!graphics || !playerPosition || baseGlowBrightness <= 0) {
      if (graphics) {
        graphics.visible = false;
        graphics.alpha = 0;
      }

      lastDrawnGlowBrightnessRef.current = 0;
      return;
    }

    const frontOccluderOcclusionStrength =
      computingWorldPlazaPlayerNightLightFrontOccluderOcclusionStrength(
        playerPosition,
        placedBlocks
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

    if (effectiveGlowBrightness <= 0.01) {
      graphics.visible = false;
      graphics.alpha = 0;
      lastDrawnGlowBrightnessRef.current = 0;
      return;
    }

    if (lastDrawnGlowBrightnessRef.current !== effectiveGlowBrightness) {
      drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics(
        graphics,
        effectiveGlowBrightness
      );
      lastDrawnGlowBrightnessRef.current = effectiveGlowBrightness;
    }

    const footAnchor =
      computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint(
        playerPosition
      );

    graphics.visible = true;
    graphics.alpha = 1;
    graphics.position.set(footAnchor.centerXPx, footAnchor.centerYPx);
    graphics.zIndex =
      DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_FLOOR_GLOW_Z_INDEX;
  });

  return (
    <pixiGraphics draw={initializingGroundGlowGraphics} eventMode="none" />
  );
}
