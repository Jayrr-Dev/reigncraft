"use client";

import {
  checkingWorldPlazaPerformanceDiagnosticsFeatureIsAvailable,
  registeringWorldPlazaPerformanceDiagnosticsConsoleApi,
  resolvingWorldPlazaPerformanceDiagnosticsInitialEnabledState,
  settingWorldPlazaPerformanceDiagnosticsEnabled,
} from "@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics";
import { useCallback, useEffect, useState } from "react";

/** Result from {@link usingWorldPlazaPerformanceDiagnosticsVisibleState}. */
export interface UsingWorldPlazaPerformanceDiagnosticsVisibleStateResult {
  /** True when the diagnostics HUD is visible and recording. */
  isPerformanceDiagnosticsVisible: boolean;
  /** True when diagnostics can be toggled in this environment. */
  isPerformanceDiagnosticsFeatureAvailable: boolean;
  /** Flips diagnostics visibility and recording. */
  togglingPerformanceDiagnosticsVisible: () => void;
}

/**
 * Runtime toggle for plaza performance diagnostics.
 */
export function usingWorldPlazaPerformanceDiagnosticsVisibleState(): UsingWorldPlazaPerformanceDiagnosticsVisibleStateResult {
  const isPerformanceDiagnosticsFeatureAvailable =
    checkingWorldPlazaPerformanceDiagnosticsFeatureIsAvailable();
  const [isPerformanceDiagnosticsVisible, setIsPerformanceDiagnosticsVisible] =
    useState(
      isPerformanceDiagnosticsFeatureAvailable &&
        resolvingWorldPlazaPerformanceDiagnosticsInitialEnabledState(),
    );

  useEffect(() => {
    if (!isPerformanceDiagnosticsFeatureAvailable) {
      return;
    }

    registeringWorldPlazaPerformanceDiagnosticsConsoleApi();
    settingWorldPlazaPerformanceDiagnosticsEnabled(
      isPerformanceDiagnosticsVisible,
    );
  }, [
    isPerformanceDiagnosticsFeatureAvailable,
    isPerformanceDiagnosticsVisible,
  ]);

  const togglingPerformanceDiagnosticsVisible = useCallback((): void => {
    setIsPerformanceDiagnosticsVisible((isVisible) => !isVisible);
  }, []);

  return {
    isPerformanceDiagnosticsVisible,
    isPerformanceDiagnosticsFeatureAvailable,
    togglingPerformanceDiagnosticsVisible,
  };
}
