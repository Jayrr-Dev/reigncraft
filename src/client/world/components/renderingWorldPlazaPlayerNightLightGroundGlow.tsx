"use client";

import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint } from "@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint";
import { computingWorldPlazaPlayerNightLightStrengthFromSunState } from "@/components/world/domains/computingWorldPlazaPlayerNightLightStrengthFromSunState";
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
  const nightLightStrength =
    computingWorldPlazaPlayerNightLightStrengthFromSunState(sunState);
  const nightLightStrengthRef = useRef(nightLightStrength);
  const glowGraphicsRef = useRef<Graphics | null>(null);
  const lastDrawnStrengthRef = useRef(0);

  nightLightStrengthRef.current = nightLightStrength;

  const initializingGroundGlowGraphics = useCallback((graphics: Graphics): void => {
    glowGraphicsRef.current = graphics;
    graphics.eventMode = "none";
    graphics.blendMode = "screen";
    graphics.visible = false;
    graphics.alpha = 0;
  }, []);

  useTick(() => {
    const graphics = glowGraphicsRef.current;
    const playerPosition = playerPositionRef.current;
    const placedBlocks = placedBlocksRef.current ?? [];
    const strength = nightLightStrengthRef.current;

    if (!graphics || !playerPosition || strength <= 0) {
      if (graphics) {
        graphics.visible = false;
        graphics.alpha = 0;
      }

      lastDrawnStrengthRef.current = 0;
      return;
    }

    if (lastDrawnStrengthRef.current !== strength) {
      drawingWorldPlazaPlayerNightLightWarmGlowOnGraphics(graphics, strength);
      lastDrawnStrengthRef.current = strength;
    }

    const footAnchor =
      computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint(playerPosition);

    graphics.visible = true;
    graphics.alpha = strength;
    graphics.position.set(footAnchor.centerXPx, footAnchor.centerYPx);
    graphics.zIndex = resolvingWorldPlazaPlayerNightLightGroundGlowEntityZIndex(
      playerPosition,
      placedBlocks,
    );
  });

  return <pixiGraphics draw={initializingGroundGlowGraphics} eventMode="none" />;
}
