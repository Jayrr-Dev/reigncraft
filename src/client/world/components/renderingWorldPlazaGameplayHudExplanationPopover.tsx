'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_SHELL_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.explanationPopoverPanel} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.panelShell}`;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_ABOVE_CLASS_NAME = `${RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_SHELL_CLASS_NAME} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.panelAnchored} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.panelAbove}`;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_BELOW_CLASS_NAME = `${RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_SHELL_CLASS_NAME} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.panelAnchored} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.panelBelow}`;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_INLINE_CLASS_NAME = `${RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_SHELL_CLASS_NAME} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.panelInline}`;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_TITLE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.title;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_SUBTITLE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.subtitle;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_BODY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.body;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_DETAIL_LIST_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.detailList;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_DETAIL_LINE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.detailLine;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_FOOTER_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.explanationPopover.footer;

export type RenderingWorldPlazaGameplayHudExplanationPopoverProps = {
  title: string;
  subtitle?: string | null;
  description?: string;
  detailLines?: readonly string[];
  footer?: string | null;
  placement?: 'above' | 'below' | 'inline';
};

/**
 * Compact explanation popover for gameplay HUD badges and buff icons.
 */
export function RenderingWorldPlazaGameplayHudExplanationPopover({
  title,
  subtitle = null,
  description,
  detailLines = [],
  footer = null,
  placement = 'above',
}: RenderingWorldPlazaGameplayHudExplanationPopoverProps): React.JSX.Element {
  const hasDescription =
    description !== undefined && description.trim().length > 0;
  const hasSubtitle = subtitle !== null && subtitle.trim().length > 0;
  const hasDetailLines = detailLines.length > 0;
  const panelClassName =
    placement === 'inline'
      ? RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_INLINE_CLASS_NAME
      : placement === 'below'
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
      {hasSubtitle ? (
        <p
          className={
            RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_SUBTITLE_CLASS_NAME
          }
        >
          {subtitle}
        </p>
      ) : null}
      {hasDescription ? (
        <p
          className={
            RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_BODY_CLASS_NAME
          }
        >
          {description}
        </p>
      ) : null}
      {hasDetailLines ? (
        <ul
          className={
            RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_DETAIL_LIST_CLASS_NAME
          }
        >
          {detailLines.map((line) => (
            <li
              key={line}
              className={
                RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_DETAIL_LINE_CLASS_NAME
              }
            >
              {line}
            </li>
          ))}
        </ul>
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
