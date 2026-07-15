'use client';

import {
  DEFINING_PLAZA_BUTTON_SFX_KIND,
  definingPlazaButtonSfxDataAttributes,
} from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import type {
  PlazaTutorialTabDefinition,
  PlazaTutorialTabId,
} from '@/components/home/domains/definingPlazaTutorialConstants';

const RENDERING_PLAZA_TUTORIAL_TAB_BAR_CLASS_NAME =
  'flex shrink-0 gap-1 rounded-md border border-poster-teal/25 bg-parchment/40 p-1' as const;

const RENDERING_PLAZA_TUTORIAL_TAB_BUTTON_CLASS_NAME =
  'flex-1 rounded-sm px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-soft transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40' as const;

const RENDERING_PLAZA_TUTORIAL_TAB_BUTTON_ACTIVE_CLASS_NAME =
  'border border-poster-teal/30 bg-poster-teal/15 text-poster-teal-deep shadow-sm' as const;

export type RenderingPlazaTutorialTabBarProps = {
  tabs: PlazaTutorialTabDefinition[];
  activeTabId: PlazaTutorialTabId;
  onSelectTab: (tabId: PlazaTutorialTabId) => void;
  /** Prefix for tab / tabpanel ids (e.g. plaza-howto). */
  idPrefix?: string;
};

/**
 * Category tab strip for the reusable how-to-play panel.
 */
export function RenderingPlazaTutorialTabBar({
  tabs,
  activeTabId,
  onSelectTab,
  idPrefix = 'plaza-howto',
}: RenderingPlazaTutorialTabBarProps): React.JSX.Element {
  return (
    <div
      className={RENDERING_PLAZA_TUTORIAL_TAB_BAR_CLASS_NAME}
      role="tablist"
      aria-label="How to play sections"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const tabId = `${idPrefix}-tab-${tab.id}`;
        const panelId = `${idPrefix}-panel-${tab.id}`;

        return (
          <button
            key={tab.id}
            id={tabId}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            {...definingPlazaButtonSfxDataAttributes(
              DEFINING_PLAZA_BUTTON_SFX_KIND.none
            )}
            className={`${RENDERING_PLAZA_TUTORIAL_TAB_BUTTON_CLASS_NAME} ${
              isActive
                ? RENDERING_PLAZA_TUTORIAL_TAB_BUTTON_ACTIVE_CLASS_NAME
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
