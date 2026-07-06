'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_BASE_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.explanationPopoverPanel} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.panelBase}`;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_ABOVE_CLASS_NAME = `${RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_BASE_CLASS_NAME} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.panelAbove}`;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_BELOW_CLASS_NAME = `${RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_BASE_CLASS_NAME} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.panelBelow}`;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_TITLE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.title;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_BODY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.body;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_FOOTER_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.footer;

export type RenderingWorldPlazaGameplayHudExplanationPopoverProps = {
  title: string;
  description?: string;
  footer?: string | null;
  placement?: 'above' | 'below';
};

/**
 * Compact explanation popover for gameplay HUD badges and buff icons.
 */
export function RenderingWorldPlazaGameplayHudExplanationPopover({
  title,
  description,
  footer = null,
  placement = 'above',
}: RenderingWorldPlazaGameplayHudExplanationPopoverProps): React.JSX.Element {
  const hasDescription =
    description !== undefined && description.trim().length > 0;
  const panelClassName =
    placement === 'below'
      ? RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_BELOW_CLASS_NAME
      : RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_ABOVE_CLASS_NAME;

  return (
    <div
      role="dialog"
      aria-label={title}
      className={panelClassName}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
    >
      <p
        className={
          RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_TITLE_CLASS_NAME
        }
      >
        {title}
      </p>
      {hasDescription ? (
        <p
          className={
            RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_BODY_CLASS_NAME
          }
        >
          {description}
        </p>
      ) : null}
      {footer !== null && footer.length > 0 ? (
        <p
          className={
            RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_FOOTER_CLASS_NAME
          }
        >
          {footer}
        </p>
      ) : null}
    </div>
  );
}
