import type { Application } from "pixi.js";

/** Pixi application context slice from {@link useApplication}. */
export interface DefiningWorldPlazaPixiApplicationContext {
  app: Application | null;
  isInitialised: boolean;
}
