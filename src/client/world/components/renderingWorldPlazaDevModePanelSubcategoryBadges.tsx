'use client';

import type { RenderingWorldPlazaDevModePanelTabId } from '@/components/world/components/renderingWorldPlazaDevModePanelTabs';
import {
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORY_BADGE_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORY_BADGE_BAR_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORY_BADGE_BUTTON_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import { listingWorldPlazaDevModePanelSubcategories } from '@/components/world/domains/definingWorldPlazaDevModePanelSubcategories';

export interface RenderingWorldPlazaDevModePanelSubcategoryBadgesProps {
  tabId: RenderingWorldPlazaDevModePanelTabId;
  activeSubcategoryId: string;
  onSelectSubcategory: (subcategoryId: string) => void;
}

/**
 * Pill badge row for filtering dev panel content within a main tab.
 */
export function RenderingWorldPlazaDevModePanelSubcategoryBadges({
  tabId,
  activeSubcategoryId,
  onSelectSubcategory,
}: RenderingWorldPlazaDevModePanelSubcategoryBadgesProps): React.JSX.Element | null {
  const subcategories = listingWorldPlazaDevModePanelSubcategories(tabId);

  if (subcategories.length <= 1) {
    return null;
  }

  return (
    <div
      className={
        STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORY_BADGE_BAR_CLASS_NAME
      }
      role="tablist"
      aria-label="Dev tools subcategories"
    >
      {subcategories.map((subcategory) => {
        const isActive = subcategory.id === activeSubcategoryId;

        return (
          <button
            key={subcategory.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORY_BADGE_BUTTON_CLASS_NAME} ${
              isActive
                ? STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORY_BADGE_ACTIVE_CLASS_NAME
                : ''
            }`}
            onClick={() => onSelectSubcategory(subcategory.id)}
          >
            {subcategory.label}
          </button>
        );
      })}
    </div>
  );
}
