'use client';

export type RenderingWorldPlazaDevModePanelTabId =
  | 'world'
  | 'health'
  | 'combat'
  | 'tools';

export type RenderingWorldPlazaDevModePanelTab = {
  id: RenderingWorldPlazaDevModePanelTabId;
  label: string;
};

const RENDERING_WORLD_PLAZA_DEV_MODE_PANEL_TABS: RenderingWorldPlazaDevModePanelTab[] =
  [
    { id: 'world', label: 'World' },
    { id: 'health', label: 'Health' },
    { id: 'combat', label: 'Combat' },
    { id: 'tools', label: 'Tools' },
  ];

const RENDERING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BAR_CLASS_NAME =
  'flex shrink-0 gap-0.5 rounded-md border border-white/10 bg-black/40 p-0.5' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BUTTON_CLASS_NAME =
  'flex-1 rounded px-1 py-1 text-[9px] font-semibold uppercase tracking-wide text-white/55 transition hover:text-white/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-300/70' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BUTTON_ACTIVE_CLASS_NAME =
  'bg-violet-500/25 text-violet-100 shadow-sm' as const;

export interface RenderingWorldPlazaDevModePanelTabsProps {
  activeTabId: RenderingWorldPlazaDevModePanelTabId;
  onSelectTab: (tabId: RenderingWorldPlazaDevModePanelTabId) => void;
}

/**
 * Tab strip for the consolidated plaza dev panel.
 */
export function RenderingWorldPlazaDevModePanelTabs({
  activeTabId,
  onSelectTab,
}: RenderingWorldPlazaDevModePanelTabsProps): React.JSX.Element {
  return (
    <div
      className={RENDERING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BAR_CLASS_NAME}
      role="tablist"
      aria-label="Dev tools sections"
    >
      {RENDERING_WORLD_PLAZA_DEV_MODE_PANEL_TABS.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${RENDERING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BUTTON_CLASS_NAME} ${
              isActive
                ? RENDERING_WORLD_PLAZA_DEV_MODE_PANEL_TAB_BUTTON_ACTIVE_CLASS_NAME
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
