'use client';

export type RenderingWorldPlazaPerformanceDiagnosticsOverlayTabId =
  | 'summary'
  | 'samples'
  | 'metrics'
  | 'flags';

export type RenderingWorldPlazaPerformanceDiagnosticsOverlayTab = {
  id: RenderingWorldPlazaPerformanceDiagnosticsOverlayTabId;
  label: string;
};

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TABS: RenderingWorldPlazaPerformanceDiagnosticsOverlayTab[] =
  [
    { id: 'summary', label: 'Summary' },
    { id: 'samples', label: 'Samples' },
    { id: 'metrics', label: 'FPS load' },
    { id: 'flags', label: 'Flags' },
  ];

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BAR_CLASS_NAME =
  'mb-2 flex shrink-0 gap-0.5 rounded-md border border-amber-300/20 bg-black/40 p-0.5' as const;

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BUTTON_CLASS_NAME =
  'flex-1 rounded px-1 py-1 text-[9px] font-semibold uppercase tracking-wide text-amber-100/55 transition hover:text-amber-100/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300/70' as const;

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BUTTON_ACTIVE_CLASS_NAME =
  'bg-amber-400/20 text-amber-100 shadow-sm' as const;

export interface RenderingWorldPlazaPerformanceDiagnosticsOverlayTabsProps {
  activeTabId: RenderingWorldPlazaPerformanceDiagnosticsOverlayTabId;
  onSelectTab: (
    tabId: RenderingWorldPlazaPerformanceDiagnosticsOverlayTabId
  ) => void;
}

/**
 * Tab strip for the plaza performance diagnostics overlay.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsOverlayTabs({
  activeTabId,
  onSelectTab,
}: RenderingWorldPlazaPerformanceDiagnosticsOverlayTabsProps): React.JSX.Element {
  return (
    <div
      className={
        RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BAR_CLASS_NAME
      }
      role="tablist"
      aria-label="Performance diagnostics sections"
    >
      {RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TABS.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BUTTON_CLASS_NAME} ${
              isActive
                ? RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BUTTON_ACTIVE_CLASS_NAME
                : ''
            }`}
            onClick={() => onSelectTab(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
