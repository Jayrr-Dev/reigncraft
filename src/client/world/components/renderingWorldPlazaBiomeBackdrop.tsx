"use client";

import { DEFINING_WORLD_PLAZA_BIOME_DEFAULT_SKY_BACKDROP_CLASS_NAME } from "@/components/world/domains/definingWorldPlazaBiomeConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaBiomeAtWorldPoint } from "@/components/world/domains/resolvingWorldPlazaBiomeAtWorldPoint";
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from "@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants";
import {
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore,
  usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from "@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags";
import { useEffect, useState } from "react";

/** How often the backdrop reads biome from the player ref (ms). */
const DEFINING_WORLD_PLAZA_BIOME_BACKDROP_POLL_INTERVAL_MS = 750;

/** Tailwind classes shared by every biome backdrop layer. */
const DEFINING_WORLD_PLAZA_BIOME_BACKDROP_BASE_CLASS_NAME =
  "pointer-events-none absolute inset-0 transition-colors duration-700 ease-out";

export interface RenderingWorldPlazaBiomeBackdropProps {
  /** Live player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
}

/**
 * Full-bleed sky gradient that shifts with the player's current biome.
 */
export function RenderingWorldPlazaBiomeBackdrop({
  playerPositionRef,
}: RenderingWorldPlazaBiomeBackdropProps): React.JSX.Element {
  const renderLayerFlags = usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  const [skyBackdropClassName, setSkyBackdropClassName] = useState(
    DEFINING_WORLD_PLAZA_BIOME_DEFAULT_SKY_BACKDROP_CLASS_NAME,
  );

  useEffect(() => {
    const pollingBiomeBackdrop = (): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const biome = resolvingWorldPlazaBiomeAtWorldPoint(playerPosition);

      setSkyBackdropClassName((currentClassName) =>
        currentClassName === biome.skyBackdropClassName
          ? currentClassName
          : biome.skyBackdropClassName,
      );
    };

    pollingBiomeBackdrop();
    const intervalId = window.setInterval(
      pollingBiomeBackdrop,
      DEFINING_WORLD_PLAZA_BIOME_BACKDROP_POLL_INTERVAL_MS,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [playerPositionRef]);

  if (
    !checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.BIOME_BACKDROP,
      renderLayerFlags,
    )
  ) {
    return <div className="pointer-events-none absolute inset-0" aria-hidden />;
  }

  return (
    <div
      className={`${DEFINING_WORLD_PLAZA_BIOME_BACKDROP_BASE_CLASS_NAME} ${skyBackdropClassName}`}
      aria-hidden
    />
  );
}
