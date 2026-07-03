"use client";

import { detectingWorldPlazaLocalhostDevEnvironment } from "@/components/world/building/domains/detectingWorldPlazaLocalhostDevEnvironment";
import { useEffect, useState } from "react";

/**
 * Tracks whether the plaza is running on localhost for dev-only UI.
 */
export function usingWorldPlazaLocalhostDevEnvironment(): boolean {
  const [isLocalhostDevEnvironment, setIsLocalhostDevEnvironment] =
    useState(false);

  useEffect(() => {
    setIsLocalhostDevEnvironment(detectingWorldPlazaLocalhostDevEnvironment());
  }, []);

  return isLocalhostDevEnvironment;
}
