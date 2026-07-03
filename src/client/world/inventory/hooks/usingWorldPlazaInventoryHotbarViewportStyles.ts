"use client";

import { usingWorldPlazaViewportHudScaleContext } from "@/components/world/components/providingWorldPlazaViewportHudScale";
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from "@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles";
import { useMemo } from "react";

/**
 * Resolves viewport-scaled inventory hotbar inline styles from context.
 */
export function usingWorldPlazaInventoryHotbarViewportStyles() {
  const viewportHudScale = usingWorldPlazaViewportHudScaleContext();

  return useMemo(
    () => resolvingWorldPlazaInventoryHotbarViewportStyles(viewportHudScale),
    [viewportHudScale],
  );
}
