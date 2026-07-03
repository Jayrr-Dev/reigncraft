"use client";

import { createContext, useContext } from "react";

/** Default plaza viewport HUD scale when no provider is mounted. */
const PROVIDING_WORLD_PLAZA_VIEWPORT_HUD_SCALE_DEFAULT = 1 as const;

const ProvidingWorldPlazaViewportHudScaleContext = createContext<number>(
  PROVIDING_WORLD_PLAZA_VIEWPORT_HUD_SCALE_DEFAULT,
);

/** Props for {@link ProvidingWorldPlazaViewportHudScale}. */
export interface ProvidingWorldPlazaViewportHudScaleProps {
  readonly viewportHudScale: number;
  readonly children: React.ReactNode;
}

/**
 * Shares live plaza viewport HUD scale with nested inventory slot renderers.
 */
export function ProvidingWorldPlazaViewportHudScale({
  viewportHudScale,
  children,
}: ProvidingWorldPlazaViewportHudScaleProps): React.JSX.Element {
  return (
    <ProvidingWorldPlazaViewportHudScaleContext.Provider value={viewportHudScale}>
      {children}
    </ProvidingWorldPlazaViewportHudScaleContext.Provider>
  );
}

/**
 * Reads the plaza viewport HUD scale from the nearest provider.
 */
export function usingWorldPlazaViewportHudScaleContext(): number {
  return useContext(ProvidingWorldPlazaViewportHudScaleContext);
}
