'use client';

import { Icon } from '@/components/ui/icon';
import {
  LABELING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_GROUP_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_MENU_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_OPTION_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_OPTION_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_TRIGGER_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  listingWorldPlazaDevModePanelViewGroups,
  resolvingWorldPlazaDevModePanelView,
  type DefiningWorldPlazaDevModePanelViewId,
} from '@/components/world/domains/definingWorldPlazaDevModePanelViews';
import { cn } from '@/lib/utils';
import { useEffect, useId, useRef, useState } from 'react';

export type RenderingWorldPlazaDevModePanelViewSelectProps = {
  activeViewId: DefiningWorldPlazaDevModePanelViewId;
  onSelectView: (viewId: DefiningWorldPlazaDevModePanelViewId) => void;
};

/**
 * Single dropdown that switches the active dev tools view.
 * Replaces the old tab strip + subcategory badge row.
 */
export function RenderingWorldPlazaDevModePanelViewSelect({
  activeViewId,
  onSelectView,
}: RenderingWorldPlazaDevModePanelViewSelectProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const activeView = resolvingWorldPlazaDevModePanelView(activeViewId);
  const viewGroups = listingWorldPlazaDevModePanelViewGroups();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={LABELING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        className={
          STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_TRIGGER_CLASS_NAME
        }
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="min-w-0 truncate">
          <span className="text-violet-200/70">{activeView.groupLabel}</span>
          <span className="text-violet-200/40"> / </span>
          <span>{activeView.label}</span>
        </span>
        <Icon
          icon="mdi:chevron-down"
          className={cn(
            'size-3.5 shrink-0 text-violet-200/80 transition',
            isOpen ? 'rotate-180' : ''
          )}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={LABELING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT}
          className={
            STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_MENU_CLASS_NAME
          }
        >
          {viewGroups.map((group) => (
            <div key={group.groupId}>
              <div
                className={
                  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_GROUP_LABEL_CLASS_NAME
                }
              >
                {group.groupLabel}
              </div>
              {group.views.map((view) => {
                const isActive = view.id === activeViewId;

                return (
                  <button
                    key={view.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={cn(
                      STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_OPTION_CLASS_NAME,
                      isActive
                        ? STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_OPTION_ACTIVE_CLASS_NAME
                        : ''
                    )}
                    onClick={() => {
                      onSelectView(view.id);
                      setIsOpen(false);
                    }}
                  >
                    {view.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
