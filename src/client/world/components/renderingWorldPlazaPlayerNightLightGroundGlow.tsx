"use client";

import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { applyingWorldPlazaPlayerNightLightGlowFiltersOnGraphics } from "@/components/world/domains/applyingWorldPlazaPlayerNightLightGlowFiltersOnGraphics";
import { computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint } from "@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint";
import { computingWorldPlazaPlayerNightLightGlowBrightnessAfterCanopyOcclusion } from "@/components/world/domains/computingWorldPlazaPlayerNightLightGlowCanopyOcclusion";
import { computingWorldPlazaPlayerNightLightStateFromSunState } from "@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics } from "@/components/world/domains/drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics";
import { resolvingWorldPlazaPlayerNightLightGroundGlowEntityZIndex } from "@/components/world/domains/resolvingWorldPlazaPlayerNightLightGroundGlowEntityZIndex";
import { usingWorldPlazaDayNightSunState } from "@/components/world/hooks/usingWorldPlazaDayNightSunState";
import { useTick } from "@pixi/react";
import type { Graphics } from "pixi.js";
import { useCallback, useRef } from "react";

export interface RenderingWorldPlazaPlayerNightLightGroundGlowProps {
  /** Live local player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Placed blocks near the player for depth sorting against occluders. */
  placedBlocksRef: React.RefObject<DefiningWorldBuildingPlacedBlock[]>;
}

/**
 * Warm torch pool on the entity layer, sorted like an avatar ground shadow.
 */
export function RenderingWorldPlazaPlayerNightLightGroundGlow({
  playerPositionRef,
  placedBlocksRef,
}: RenderingWorldPlazaPlayerNightLightGroundGlowProps): React.JSX.Element {
  const sunState = usingWorldPlazaDayNightSunState();
  const nightLightState = computingWorldPlazaPlayerNightLightStateFromSunState(sunState);
  const nightLightStateRef = useRef(nightLightState);
  const glowGraphicsRef = useRef<Graphics | null>(null);
  const lastDrawnGlowBrightnessRef = useRef(0);

  nightLightStateRef.current = nightLightState;

  const initializingGroundGlowGraphics = useCallback((graphics: Graphics): void => {
    glowGraphicsRef.current = graphics;
    graphics.eventMode = "none";
    graphics.blendMode = "screen";
    graphics.visible = false;
    graphics.alpha = 0;
    applyingWorldPlazaPlayerNightLightGlowFiltersOnGraphics(graphics);
  }, []);

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

    const effectiveGlowBrightness =
      computingWorldPlazaPlayerNightLightGlowBrightnessAfterCanopyOcclusion(
        baseGlowBrightness,
        playerPosition,
        placedBlocks,
      );

    if (effectiveGlowBrightness <= 0.01) {
      graphics.visible = false;
      graphics.alpha = 0;
      lastDrawnGlowBrightnessRef.current = 0;
      return;
    }

    if (lastDrawnGlowBrightnessRef.current !== effectiveGlowBrightness) {
      drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics(
        graphics,
        effectiveGlowBrightness,
      );
      lastDrawnGlowBrightnessRef.current = effectiveGlowBrightness;
    }

    const footAnchor =
      computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint(playerPosition);

    graphics.visible = true;
    graphics.alpha = 1;
    graphics.position.set(footAnchor.centerXPx, footAnchor.centerYPx);
    graphics.zIndex = resolvingWorldPlazaPlayerNightLightGroundGlowEntityZIndex(
      playerPosition,
      placedBlocks,
    );
  });

  return <pixiGraphics draw={initializingGroundGlowGraphics} eventMode="none" />;
}
