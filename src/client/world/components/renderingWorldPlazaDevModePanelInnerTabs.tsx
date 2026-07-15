'use client';

import {
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CHIP_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CHIP_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import type { DefiningWorldPlazaDevModePanelInnerTab } from '@/components/world/domains/definingWorldPlazaDevModePanelInnerTabConstants';
import { cn } from '@/lib/utils';

export type RenderingWorldPlazaDevModePanelInnerTabsProps<TId extends string> =
  {
    tabs: readonly DefiningWorldPlazaDevModePanelInnerTab<TId>[];
    activeTabId: TId;
    onSelectTab: (tabId: TId) => void;
    ariaLabel: string;
  };

/**
 * Compact chip-button tab strip for combined Dev tools leaf views.
 */
export function RenderingWorldPlazaDevModePanelInnerTabs<TId extends string>({
  tabs,
  activeTabId,
  onSelectTab,
  ariaLabel,
}: RenderingWorldPlazaDevModePanelInnerTabsProps<TId>): React.JSX.Element {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(
              STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CHIP_CLASS_NAME,
              'min-w-0 flex-1',
              isActive
                ? STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CHIP_ACTIVE_CLASS_NAME
                : ''
            )}
            onClick={() => {
              onSelectTab(tab.id);
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
