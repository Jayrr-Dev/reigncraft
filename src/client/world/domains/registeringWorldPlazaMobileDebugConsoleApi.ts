/**
 * Attaches `window.__WORLD_PLAZA_DEBUG__` for mobile playtest support.
 *
 * @module components/world/domains/registeringWorldPlazaMobileDebugConsoleApi
 */

import { buildingWorldPlazaMobileDebugReport } from '@/components/world/domains/buildingWorldPlazaMobileDebugReport';
import { checkingWorldPlazaMobileDebugFeatureIsAvailable } from '@/components/world/domains/checkingWorldPlazaMobileDebug';
import { copyingWorldPlazaTextToClipboard } from '@/components/world/domains/copyingWorldPlazaTextToClipboard';
import { DEFINING_WORLD_PLAZA_MOBILE_DEBUG_CONSOLE_API_KEY } from '@/components/world/domains/definingWorldPlazaMobileDebugConstants';
import type { DefiningWorldPlazaPerformanceProfile } from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import type { ManagingWorldPlazaMobileDebugFrameStats } from '@/components/world/domains/managingWorldPlazaMobileDebugSampler';

export type RegisteringWorldPlazaMobileDebugConsoleApi = {
  readonly enable: () => void;
  readonly disable: () => void;
  readonly isEnabled: () => boolean;
  readonly showHud: () => void;
  readonly hideHud: () => void;
  readonly getReport: () => string;
  readonly copy: () => Promise<string>;
};

type RegisteringWorldPlazaMobileDebugConsoleApiState = {
  isEnabled: boolean;
  isHudVisible: boolean;
  performanceProfile: DefiningWorldPlazaPerformanceProfile | null;
  frameStats: ManagingWorldPlazaMobileDebugFrameStats | null;
  uptimeSec: number;
  onEnabledChange: ((isEnabled: boolean) => void) | null;
  onHudVisibleChange: ((isHudVisible: boolean) => void) | null;
};

const registeringWorldPlazaMobileDebugConsoleApiState: RegisteringWorldPlazaMobileDebugConsoleApiState =
  {
    isEnabled: false,
    isHudVisible: false,
    performanceProfile: null,
    frameStats: null,
    uptimeSec: 0,
    onEnabledChange: null,
    onHudVisibleChange: null,
  };

function resolvingWorldPlazaMobileDebugReportParams(): {
  performanceProfile: DefiningWorldPlazaPerformanceProfile;
  frameStats: ManagingWorldPlazaMobileDebugFrameStats | null;
  uptimeSec: number;
} | null {
  const performanceProfile =
    registeringWorldPlazaMobileDebugConsoleApiState.performanceProfile;

  if (!performanceProfile) {
    return null;
  }

  return {
    performanceProfile,
    frameStats: registeringWorldPlazaMobileDebugConsoleApiState.frameStats,
    uptimeSec: registeringWorldPlazaMobileDebugConsoleApiState.uptimeSec,
  };
}

/**
 * Updates live report inputs from the plaza scene hook.
 */
export function updatingWorldPlazaMobileDebugConsoleApiContext(params: {
  readonly performanceProfile: DefiningWorldPlazaPerformanceProfile;
  readonly frameStats: ManagingWorldPlazaMobileDebugFrameStats | null;
  readonly uptimeSec: number;
}): void {
  registeringWorldPlazaMobileDebugConsoleApiState.performanceProfile =
    params.performanceProfile;
  registeringWorldPlazaMobileDebugConsoleApiState.frameStats =
    params.frameStats;
  registeringWorldPlazaMobileDebugConsoleApiState.uptimeSec = params.uptimeSec;
}

/**
 * Registers React callbacks invoked when the console API toggles debug mode.
 */
export function subscribingWorldPlazaMobileDebugConsoleApiHandlers(handlers: {
  readonly onEnabledChange?: (isEnabled: boolean) => void;
  readonly onHudVisibleChange?: (isHudVisible: boolean) => void;
}): () => void {
  registeringWorldPlazaMobileDebugConsoleApiState.onEnabledChange =
    handlers.onEnabledChange ?? null;
  registeringWorldPlazaMobileDebugConsoleApiState.onHudVisibleChange =
    handlers.onHudVisibleChange ?? null;

  return () => {
    registeringWorldPlazaMobileDebugConsoleApiState.onEnabledChange = null;
    registeringWorldPlazaMobileDebugConsoleApiState.onHudVisibleChange = null;
  };
}

type RegisteringWorldPlazaMobileDebugWindow = Window & {
  [DEFINING_WORLD_PLAZA_MOBILE_DEBUG_CONSOLE_API_KEY]?: RegisteringWorldPlazaMobileDebugConsoleApi;
};

/**
 * Attaches `window.__WORLD_PLAZA_DEBUG__` once on the client.
 */
export function registeringWorldPlazaMobileDebugConsoleApi(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const debugWindow = window as RegisteringWorldPlazaMobileDebugWindow;

  if (debugWindow[DEFINING_WORLD_PLAZA_MOBILE_DEBUG_CONSOLE_API_KEY]) {
    return;
  }

  const consoleApi: RegisteringWorldPlazaMobileDebugConsoleApi = {
    enable: () => {
      registeringWorldPlazaMobileDebugConsoleApiState.isEnabled = true;
      registeringWorldPlazaMobileDebugConsoleApiState.onEnabledChange?.(true);
    },
    disable: () => {
      registeringWorldPlazaMobileDebugConsoleApiState.isEnabled = false;
      registeringWorldPlazaMobileDebugConsoleApiState.onEnabledChange?.(false);
    },
    isEnabled: () => registeringWorldPlazaMobileDebugConsoleApiState.isEnabled,
    showHud: () => {
      registeringWorldPlazaMobileDebugConsoleApiState.isHudVisible = true;
      registeringWorldPlazaMobileDebugConsoleApiState.onHudVisibleChange?.(
        true
      );
    },
    hideHud: () => {
      registeringWorldPlazaMobileDebugConsoleApiState.isHudVisible = false;
      registeringWorldPlazaMobileDebugConsoleApiState.onHudVisibleChange?.(
        false
      );
    },
    getReport: () => {
      const reportParams = resolvingWorldPlazaMobileDebugReportParams();

      if (!reportParams) {
        return 'Mobile debug report unavailable (plaza scene not mounted).';
      }

      return buildingWorldPlazaMobileDebugReport(reportParams);
    },
    copy: async () => {
      const reportText = consoleApi.getReport();
      await copyingWorldPlazaTextToClipboard(reportText);
      return reportText;
    },
  };

  debugWindow[DEFINING_WORLD_PLAZA_MOBILE_DEBUG_CONSOLE_API_KEY] = consoleApi;

  if (checkingWorldPlazaMobileDebugFeatureIsAvailable()) {
    registeringWorldPlazaMobileDebugConsoleApiState.isEnabled = true;
  }
}

/**
 * Returns the latest report params captured from the plaza scene.
 */
export function peekingWorldPlazaMobileDebugReportParams(): {
  performanceProfile: DefiningWorldPlazaPerformanceProfile;
  frameStats: ManagingWorldPlazaMobileDebugFrameStats | null;
  uptimeSec: number;
} | null {
  return resolvingWorldPlazaMobileDebugReportParams();
}

/**
 * Copies the current report using the console API context.
 */
export async function copyingWorldPlazaMobileDebugReportFromConsoleApi(): Promise<string> {
  if (typeof window === 'undefined') {
    return '';
  }

  const debugWindow = window as RegisteringWorldPlazaMobileDebugWindow;
  const consoleApi =
    debugWindow[DEFINING_WORLD_PLAZA_MOBILE_DEBUG_CONSOLE_API_KEY];

  if (!consoleApi) {
    const reportParams = resolvingWorldPlazaMobileDebugReportParams();

    if (!reportParams) {
      return '';
    }

    const reportText = buildingWorldPlazaMobileDebugReport(reportParams);
    await copyingWorldPlazaTextToClipboard(reportText);
    return reportText;
  }

  return consoleApi.copy();
}

/**
 * Returns whether mobile debug mode is active (URL, env, or console API).
 */
export function checkingWorldPlazaMobileDebugIsActive(): boolean {
  return (
    checkingWorldPlazaMobileDebugFeatureIsAvailable() ||
    registeringWorldPlazaMobileDebugConsoleApiState.isEnabled
  );
}
