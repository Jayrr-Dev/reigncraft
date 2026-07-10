/**
 * In-memory client error and debug status log for playtest environments
 * without DevTools access.
 *
 * @module components/world/domains/loggingWorldPlazaClientErrors
 */

/** Maximum stored error entries (oldest dropped first). */
const LOGGING_WORLD_PLAZA_CLIENT_ERROR_MAX_ENTRIES = 12 as const;

/** Truncated message length for on-screen display. */
const LOGGING_WORLD_PLAZA_CLIENT_ERROR_MAX_MESSAGE_LENGTH = 140 as const;

/** Max characters per line in exported debug reports. */
const LOGGING_WORLD_PLAZA_CLIENT_ERROR_REPORT_MAX_MESSAGE_LENGTH =
  2000 as const;

/** One captured runtime error. */
export type LoggingWorldPlazaClientErrorEntry = {
  readonly message: string;
  readonly capturedAtMs: number;
};

/** Snapshot for overlays and the minimap. */
export type LoggingWorldPlazaClientLogSnapshot = {
  readonly statusLines: readonly string[];
  readonly errorLines: readonly string[];
  readonly version: number;
};

type LoggingWorldPlazaClientLogListener = () => void;

interface LoggingWorldPlazaClientLogState {
  errorEntries: LoggingWorldPlazaClientErrorEntry[];
  statusLinesByKey: Map<string, string>;
  version: number;
  listeners: Set<LoggingWorldPlazaClientLogListener>;
  isCaptureInstalled: boolean;
}

const loggingWorldPlazaClientLogState: LoggingWorldPlazaClientLogState = {
  errorEntries: [],
  statusLinesByKey: new Map(),
  version: 0,
  listeners: new Set(),
  isCaptureInstalled: false,
};

/** Cached snapshot — `useSyncExternalStore` requires referential stability. */
let loggingWorldPlazaClientLogSnapshotCache: LoggingWorldPlazaClientLogSnapshot =
  {
    statusLines: [],
    errorLines: [],
    version: 0,
  };

/**
 * Truncates long messages so they fit on the minimap and overlay.
 *
 * @param message - Raw message text.
 */
function truncatingWorldPlazaClientLogMessage(
  message: string,
  maxLength: number = LOGGING_WORLD_PLAZA_CLIENT_ERROR_MAX_MESSAGE_LENGTH
): string {
  const trimmedMessage = message.trim();

  if (trimmedMessage.length <= maxLength) {
    return trimmedMessage;
  }

  return `${trimmedMessage.slice(0, maxLength - 1)}…`;
}

/**
 * Formats console arguments into one log line.
 *
 * @param args - Values passed to `console.error`.
 */
function formattingWorldPlazaClientLogConsoleArguments(
  args: readonly unknown[]
): string {
  return args
    .map((arg) => {
      if (typeof arg === 'string') {
        return arg;
      }

      if (arg instanceof Error) {
        return arg.stack ?? arg.message;
      }

      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(' ');
}

/** Notifies subscribers after log mutations. */
function notifyingWorldPlazaClientLogListeners(): void {
  loggingWorldPlazaClientLogState.version += 1;

  for (const listener of loggingWorldPlazaClientLogState.listeners) {
    listener();
  }
}

/**
 * Records a runtime error for on-screen display.
 *
 * @param message - Human-readable error text.
 */
export function loggingWorldPlazaClientError(message: string): void {
  const formattedMessage = truncatingWorldPlazaClientLogMessage(message);

  if (!formattedMessage) {
    return;
  }

  const lastEntry = loggingWorldPlazaClientLogState.errorEntries.at(-1) ?? null;

  if (lastEntry?.message === formattedMessage) {
    return;
  }

  loggingWorldPlazaClientLogState.errorEntries.push({
    message: formattedMessage,
    capturedAtMs: Date.now(),
  });

  if (
    loggingWorldPlazaClientLogState.errorEntries.length >
    LOGGING_WORLD_PLAZA_CLIENT_ERROR_MAX_ENTRIES
  ) {
    loggingWorldPlazaClientLogState.errorEntries.shift();
  }

  notifyingWorldPlazaClientLogListeners();
}

/**
 * Updates one keyed debug status line (overwrites prior value for the key).
 *
 * @param statusKey - Stable identifier, e.g. `pixi-screen`.
 * @param statusLine - Full line shown on the minimap and overlay.
 */
export function settingWorldPlazaClientDebugStatus(
  statusKey: string,
  statusLine: string
): void {
  const formattedStatusLine = truncatingWorldPlazaClientLogMessage(statusLine);
  const previousStatusLine =
    loggingWorldPlazaClientLogState.statusLinesByKey.get(statusKey) ?? null;

  if (previousStatusLine === formattedStatusLine) {
    return;
  }

  loggingWorldPlazaClientLogState.statusLinesByKey.set(
    statusKey,
    formattedStatusLine
  );
  notifyingWorldPlazaClientLogListeners();
}

/**
 * Returns the current log snapshot for React `useSyncExternalStore`.
 *
 * Must return the same object reference until `version` changes, otherwise
 * React enters an infinite re-render loop (error #185).
 */
export function gettingWorldPlazaClientLogSnapshot(): LoggingWorldPlazaClientLogSnapshot {
  if (
    loggingWorldPlazaClientLogSnapshotCache.version ===
    loggingWorldPlazaClientLogState.version
  ) {
    return loggingWorldPlazaClientLogSnapshotCache;
  }

  loggingWorldPlazaClientLogSnapshotCache = {
    statusLines: [...loggingWorldPlazaClientLogState.statusLinesByKey.values()],
    errorLines: loggingWorldPlazaClientLogState.errorEntries.map(
      (entry) => entry.message
    ),
    version: loggingWorldPlazaClientLogState.version,
  };

  return loggingWorldPlazaClientLogSnapshotCache;
}

/**
 * Subscribes to log updates.
 *
 * @param listener - Called after errors or status lines change.
 */
export function subscribingWorldPlazaClientLog(
  listener: LoggingWorldPlazaClientLogListener
): () => void {
  loggingWorldPlazaClientLogState.listeners.add(listener);

  return () => {
    loggingWorldPlazaClientLogState.listeners.delete(listener);
  };
}

/**
 * Returns status lines for debug report export (not truncated for HUD).
 */
export function listingWorldPlazaClientDebugStatusLinesForReport(): readonly string[] {
  return [...loggingWorldPlazaClientLogState.statusLinesByKey.entries()].map(
    ([statusKey, statusLine]) =>
      `${statusKey}: ${truncatingWorldPlazaClientLogMessage(
        statusLine,
        LOGGING_WORLD_PLAZA_CLIENT_ERROR_REPORT_MAX_MESSAGE_LENGTH
      )}`
  );
}

/**
 * Returns error entries for debug report export with ISO timestamps.
 */
export function listingWorldPlazaClientErrorEntriesForReport(): readonly LoggingWorldPlazaClientErrorEntry[] {
  return loggingWorldPlazaClientLogState.errorEntries.map((entry) => ({
    message: truncatingWorldPlazaClientLogMessage(
      entry.message,
      LOGGING_WORLD_PLAZA_CLIENT_ERROR_REPORT_MAX_MESSAGE_LENGTH
    ),
    capturedAtMs: entry.capturedAtMs,
  }));
}

export function listingWorldPlazaClientLogLinesForMiniMap(
  maxLineCount: number
): readonly string[] {
  const snapshot = gettingWorldPlazaClientLogSnapshot();
  const combinedLines = [...snapshot.statusLines, ...snapshot.errorLines];

  if (combinedLines.length <= maxLineCount) {
    return combinedLines;
  }

  return combinedLines.slice(-maxLineCount);
}

/**
 * Installs global error capture (`error`, `unhandledrejection`, `console.error`).
 *
 * @returns Cleanup function that restores original handlers.
 */
export function installingWorldPlazaClientErrorCapture(): () => void {
  if (loggingWorldPlazaClientLogState.isCaptureInstalled) {
    return () => {};
  }

  loggingWorldPlazaClientLogState.isCaptureInstalled = true;

  const handlingWindowError = (
    event: ErrorEvent | Event,
    fallbackMessage: string
  ): void => {
    if (event instanceof ErrorEvent) {
      const locationSuffix = event.filename
        ? ` @ ${event.filename}:${event.lineno}`
        : '';

      loggingWorldPlazaClientError(
        `${event.message || fallbackMessage}${locationSuffix}`
      );
      return;
    }

    loggingWorldPlazaClientError(fallbackMessage);
  };

  const handlingWindowErrorEvent = (event: ErrorEvent): void => {
    handlingWindowError(event, 'Unknown error');
  };

  const handlingUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const reason = event.reason;

    if (reason instanceof Error) {
      loggingWorldPlazaClientError(reason.stack ?? reason.message);
      return;
    }

    loggingWorldPlazaClientError(
      formattingWorldPlazaClientLogConsoleArguments([reason])
    );
  };

  const originalConsoleError = console.error.bind(console);

  console.error = (...args: unknown[]): void => {
    loggingWorldPlazaClientError(
      formattingWorldPlazaClientLogConsoleArguments(args)
    );
    originalConsoleError(...args);
  };

  window.addEventListener('error', handlingWindowErrorEvent);
  window.addEventListener('unhandledrejection', handlingUnhandledRejection);

  return () => {
    loggingWorldPlazaClientLogState.isCaptureInstalled = false;
    console.error = originalConsoleError;
    window.removeEventListener('error', handlingWindowErrorEvent);
    window.removeEventListener(
      'unhandledrejection',
      handlingUnhandledRejection
    );
  };
}
