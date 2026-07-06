'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_BASE_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.glassPanel} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme} pointer-events-auto absolute left-1/2 z-50 w-max max-w-[min(12rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md px-2 py-1.5 text-left shadow-lg`;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_ABOVE_CLASS_NAME = `${RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_BASE_CLASS_NAME} bottom-full mb-1.5`;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_BELOW_CLASS_NAME = `${RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_PANEL_BASE_CLASS_NAME} top-full mt-1.5`;

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_TITLE_CLASS_NAME =
  'font-display text-[10px] font-semibold leading-tight text-ink';

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_BODY_CLASS_NAME =
  'mt-0.5 font-body text-[9px] leading-snug text-ink-soft';

const RENDERING_WORLD_PLAZA_GAMEPLAY_HUD_EXPLANATION_POPOVER_FOOTER_CLASS_NAME =
  'mt-1 font-body text-[8px] font-semibold leading-none tabular-nums text-ink/70';

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
