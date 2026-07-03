"use client";

import { installingWorldPlazaClientErrorCapture } from "@/components/world/domains/loggingWorldPlazaClientErrors";
import { useEffect } from "react";

/**
 * Installs global client error capture for playtest builds without DevTools.
 */
export function usingWorldPlazaClientErrorCapture(): void {
  useEffect(() => {
    return installingWorldPlazaClientErrorCapture();
  }, []);
}
