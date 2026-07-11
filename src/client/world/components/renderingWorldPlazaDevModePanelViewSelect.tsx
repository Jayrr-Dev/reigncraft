'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  LABELING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_MENU_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_OPTION_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_OPTION_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_STACK_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_TRIGGER_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_TRIGGER_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  listingWorldPlazaDevModePanelViewGroups,
  resolvingWorldPlazaDevModePanelView,
  type DefiningWorldPlazaDevModePanelGroupId,
  type DefiningWorldPlazaDevModePanelViewGroup,
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

type RenderingWorldPlazaDevModePanelSectionSelectProps = {
  group: DefiningWorldPlazaDevModePanelViewGroup;
  activeViewId: DefiningWorldPlazaDevModePanelViewId;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onSelectView: (viewId: DefiningWorldPlazaDevModePanelViewId) => void;
};

/**
 * One section bar: trigger + portaled leaf menu for that group only.
 */
function RenderingWorldPlazaDevModePanelSectionSelect({
  group,
  activeViewId,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  onSelectView,
}: RenderingWorldPlazaDevModePanelSectionSelectProps): React.JSX.Element {
  const [menuLayout, setMenuLayout] =
    useState<DefiningWorldPlazaDevModePanelViewSelectMenuLayout | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const onCloseMenuRef = useRef(onCloseMenu);
  const listboxId = useId();
  const activeView = resolvingWorldPlazaDevModePanelView(activeViewId);
  const isSectionActive = activeView.groupId === group.groupId;
  const ariaLabel = `${LABELING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT}: ${group.groupLabel}`;

  onCloseMenuRef.current = onCloseMenu;

  useLayoutEffect(() => {
    if (!isMenuOpen) {
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
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
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

      onCloseMenuRef.current();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseMenuRef.current();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isMenuOpen}
        aria-controls={listboxId}
        className={cn(
          STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_TRIGGER_CLASS_NAME,
          isSectionActive
            ? STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_TRIGGER_ACTIVE_CLASS_NAME
            : ''
        )}
        onClick={onToggleMenu}
      >
        <span className="min-w-0 truncate">
          {isSectionActive ? (
            <>
              <span className="text-violet-200/70">{group.groupLabel}</span>
              <span className="text-violet-200/40"> / </span>
              <span>{activeView.label}</span>
            </>
          ) : (
            <span>{group.groupLabel}</span>
          )}
        </span>
        <Icon
          icon="mdi:chevron-down"
          className={cn(
            'size-3.5 shrink-0 transition',
            isSectionActive ? 'text-violet-200/80' : 'text-white/45',
            isMenuOpen ? 'rotate-180' : ''
          )}
          aria-hidden
        />
      </button>

      {isMenuOpen && menuLayout && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              id={listboxId}
              role="listbox"
              aria-label={ariaLabel}
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
                      onCloseMenu();
                    }}
                  >
                    {view.label}
                  </button>
                );
              })}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

/**
 * Stack of section dropdown bars that switch the active dev tools view.
 * Each bar opens a leaf menu for that group only; menu portals to document.body.
 */
export function RenderingWorldPlazaDevModePanelViewSelect({
  activeViewId,
  onSelectView,
}: RenderingWorldPlazaDevModePanelViewSelectProps): React.JSX.Element {
  const [openGroupId, setOpenGroupId] =
    useState<DefiningWorldPlazaDevModePanelGroupId | null>(null);
  const viewGroups = listingWorldPlazaDevModePanelViewGroups();

  return (
    <div
      className={
        STYLING_WORLD_PLAZA_DEV_MODE_PANEL_VIEW_SELECT_STACK_CLASS_NAME
      }
    >
      {viewGroups.map((group) => (
        <RenderingWorldPlazaDevModePanelSectionSelect
          key={group.groupId}
          group={group}
          activeViewId={activeViewId}
          isMenuOpen={openGroupId === group.groupId}
          onToggleMenu={() =>
            setOpenGroupId((current) =>
              current === group.groupId ? null : group.groupId
            )
          }
          onCloseMenu={() => setOpenGroupId(null)}
          onSelectView={onSelectView}
        />
      ))}
    </div>
  );
}
