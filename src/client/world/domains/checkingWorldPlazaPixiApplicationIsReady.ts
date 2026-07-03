import type { DefiningWorldPlazaPixiApplicationContext } from "@/components/world/domains/definingWorldPlazaPixiApplicationContext";
import type { Application } from "pixi.js";

/**
 * Returns true when the Pixi application is safe to read viewport state from.
 *
 * Checks {@link Application.renderer} before reading screen size because
 * {@link Application.screen} throws after destroy while `isInitialised` can
 * still be true in {@link useApplication} context.
 *
 * @param applicationContext - Value from {@link useApplication}.
 */
export function checkingWorldPlazaPixiApplicationIsReady(
  applicationContext: DefiningWorldPlazaPixiApplicationContext | null | undefined,
): applicationContext is DefiningWorldPlazaPixiApplicationContext & {
  app: Application;
} {
  if (!applicationContext?.isInitialised) {
    return false;
  }

  const app = applicationContext.app;
  const renderer = app?.renderer;

  if (!app || !renderer) {
    return false;
  }

  const screen = renderer.screen;

  return screen.width > 0 && screen.height > 0;
}
