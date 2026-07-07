import { checkingWorldPlazaPixiApplicationIsReady } from "@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady";
import type { DefiningWorldPlazaPixiApplicationContext } from "@/components/world/domains/definingWorldPlazaPixiApplicationContext";

/** Viewport size in canvas pixels. */
export interface DefiningWorldPlazaPixiViewportSize {
  width: number;
  height: number;
}

/** Last non-zero renderer size; reused when layout briefly reports 0×0. */
let resolvingWorldPlazaPixiViewportSizeLastKnownGood: DefiningWorldPlazaPixiViewportSize | null =
  null;

/**
 * Clears the cached viewport size (e.g. when the Pixi app unmounts).
 */
export function invalidatingWorldPlazaPixiViewportSizeLastKnownGood(): void {
  resolvingWorldPlazaPixiViewportSizeLastKnownGood = null;
}

/**
 * Returns viewport dimensions when the Pixi application finished init.
 *
 * Falls back to the last non-zero size when the renderer momentarily reports
 * 0×0 during flex or iframe layout passes, so terrain sync and the camera rig
 * do not alternate between drawing and bailing every frame.
 *
 * @param applicationContext - Value from {@link useApplication}.
 */
export function resolvingWorldPlazaPixiViewportSize(
  applicationContext: DefiningWorldPlazaPixiApplicationContext | null | undefined,
): DefiningWorldPlazaPixiViewportSize | null {
  if (checkingWorldPlazaPixiApplicationIsReady(applicationContext)) {
    const screen = applicationContext.app.screen;
    const nextViewportSize = {
      width: screen.width,
      height: screen.height,
    };

    resolvingWorldPlazaPixiViewportSizeLastKnownGood = nextViewportSize;

    return nextViewportSize;
  }

  return resolvingWorldPlazaPixiViewportSizeLastKnownGood;
}
