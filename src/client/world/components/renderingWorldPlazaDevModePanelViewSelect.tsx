'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
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
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type RenderingWorldPlazaDevModePanelViewSelectProps = {
  activeViewId: DefiningWorldPlazaDevModePanelViewId;
  onSelectView: (viewId: DefiningWorldPlazaDevModePanelViewId) => void;
};

type DefiningWorldPlazaDevModePanelViewSelectMenuLayout = {
  top: number;
  left: number;
  width: number;
  openUpward: boolean;
};

/**
 * Dropdown popover that switches the active dev tools view.
 * Menu portals to document.body so panel overflow does not clip it.
 */
export function RenderingWorldPlazaDevModePanelViewSelect({
  activeViewId,
  onSelectView,
}: RenderingWorldPlazaDevModePanelViewSelectProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [menuLayout, setMenuLayout] =
    useState<DefiningWorldPlazaDevModePanelViewSelectMenuLayout | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const activeView = resolvingWorldPlazaDevModePanelView(activeViewId);
  const viewGroups = listingWorldPlazaDevModePanelViewGroups();

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuLayout(null);
      return;
    }

    const syncingMenuLayout = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      if (!triggerRect) {
        return;
      }

      const gapPx = 4;
      const spaceBelow = window.innerHeight - triggerRect.bottom - gapPx;
      const openUpward = spaceBelow < 160 && triggerRect.top > spaceBelow;

      setMenuLayout({
        top: openUpward ? triggerRect.top - gapPx : triggerRect.bottom + gapPx,
        left: triggerRect.left,
        width: triggerRect.width,
        openUpward,
      });
    };

    syncingMenuLayout();
    window.addEventListener('resize', syncingMenuLayout);
    window.addEventListener('scroll', syncingMenuLayout, true);
    return () => {
      window.removeEventListener('resize', syncingMenuLayout);
      window.removeEventListener('scroll', syncingMenuLayout, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
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
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
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

      {isOpen && menuLayout && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              id={listboxId}
              role="listbox"
              aria-label={LABELING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT}
              {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
              className={
                STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_MENU_CLASS_NAME
              }
              style={{
                position: 'fixed',
                top: menuLayout.top,
                left: menuLayout.left,
                width: menuLayout.width,
                transform: menuLayout.openUpward
                  ? 'translateY(-100%)'
                  : undefined,
              }}
              onPointerDown={(event) => event.stopPropagation()}
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
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
