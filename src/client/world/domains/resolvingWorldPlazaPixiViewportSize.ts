import { checkingWorldPlazaPixiApplicationIsReady } from "@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady";
import type { DefiningWorldPlazaPixiApplicationContext } from "@/components/world/domains/definingWorldPlazaPixiApplicationContext";

/** Viewport size in canvas pixels. */
export interface DefiningWorldPlazaPixiViewportSize {
  width: number;
  height: number;
}

/**
 * Returns viewport dimensions when the Pixi application finished init.
 *
 * @param applicationContext - Value from {@link useApplication}.
 */
export function resolvingWorldPlazaPixiViewportSize(
  applicationContext: DefiningWorldPlazaPixiApplicationContext | null | undefined,
): DefiningWorldPlazaPixiViewportSize | null {
  if (!checkingWorldPlazaPixiApplicationIsReady(applicationContext)) {
    return null;
  }

  const screen = applicationContext.app.screen;

  return {
    width: screen.width,
    height: screen.height,
  };
}
