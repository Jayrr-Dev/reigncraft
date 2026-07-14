/**
 * Shared portal shell for NPC Talk / Shop / Quest panels.
 *
 * @module components/world/npc/components/renderingNpcPanelShell
 */

'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_NPC_PANEL_BACKDROP_CLASS_NAME,
  DEFINING_NPC_PANEL_BODY_CLASS_NAME,
  DEFINING_NPC_PANEL_CLOSE_BUTTON_CLASS_NAME,
  DEFINING_NPC_PANEL_DATA_ATTRIBUTE,
  DEFINING_NPC_PANEL_HEADER_CLASS_NAME,
  DEFINING_NPC_PANEL_OVERLAY_CLASS_NAME,
  DEFINING_NPC_PANEL_SHELL_CLASS_NAME,
  DEFINING_NPC_PANEL_TITLE_CLASS_NAME,
  LABELING_NPC_PANEL_CLOSE,
} from '@/components/world/npc/domains/definingNpcPanelConstants';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type RenderingNpcPanelShellProps = {
  readonly isOpen: boolean;
  readonly title: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
};

export function RenderingNpcPanelShell({
  isOpen,
  title,
  onClose,
  children,
}: RenderingNpcPanelShellProps): React.JSX.Element | null {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlingKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handlingKeyDown);

    return () => {
      window.removeEventListener('keydown', handlingKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className={DEFINING_NPC_PANEL_OVERLAY_CLASS_NAME}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      {...{ [DEFINING_NPC_PANEL_DATA_ATTRIBUTE]: '' }}
    >
      <button
        type="button"
        aria-label={LABELING_NPC_PANEL_CLOSE}
        className={DEFINING_NPC_PANEL_BACKDROP_CLASS_NAME}
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`pointer-events-auto ${DEFINING_NPC_PANEL_SHELL_CLASS_NAME}`}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      >
        <header className={DEFINING_NPC_PANEL_HEADER_CLASS_NAME}>
          <h2 className={DEFINING_NPC_PANEL_TITLE_CLASS_NAME}>{title}</h2>
          <button
            type="button"
            aria-label={LABELING_NPC_PANEL_CLOSE}
            className={DEFINING_NPC_PANEL_CLOSE_BUTTON_CLASS_NAME}
            onClick={onClose}
          >
            <Icon icon="mdi:close" className="size-4" aria-hidden />
          </button>
        </header>
        <div className={DEFINING_NPC_PANEL_BODY_CLASS_NAME}>{children}</div>
      </section>
    </div>,
    document.body
  );
}
