'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { STYLING_WORLD_PLAZA_DEV_PANEL_CLOSE_BUTTON_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevPanelCloseButtonConstants';

export interface RenderingWorldPlazaDevPanelCloseButtonProps {
  /** Closes the parent dev panel or overlay. */
  onClose: () => void;
  /** Accessible label for screen readers. */
  ariaLabel: string;
  /** Optional class overrides for panel-specific accent rings. */
  className?: string;
}

/**
 * Compact X button shared by plaza dev panels and debug overlays.
 */
export function RenderingWorldPlazaDevPanelCloseButton({
  onClose,
  ariaLabel,
  className,
}: RenderingWorldPlazaDevPanelCloseButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      aria-label={ariaLabel}
      className={
        className
          ? `${STYLING_WORLD_PLAZA_DEV_PANEL_CLOSE_BUTTON_CLASS_NAME} ${className}`
          : STYLING_WORLD_PLAZA_DEV_PANEL_CLOSE_BUTTON_CLASS_NAME
      }
      onClick={onClose}
    >
      <Icon icon="mdi:close" className="size-3.5" aria-hidden />
    </button>
  );
}
