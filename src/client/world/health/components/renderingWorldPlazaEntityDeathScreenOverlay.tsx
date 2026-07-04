'use client';

import { Icon } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_MESSAGE,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_REVIVE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_REVIVE_LABEL,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_UI_DATA_ATTRIBUTE,
} from '@/components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants';

export type RenderingWorldPlazaEntityDeathScreenOverlayProps = {
  /** When true, blocks play and shows the revive dialog. */
  isVisible: boolean;
  /** True while a revive teleport sequence is running. */
  isRevivePending?: boolean;
  /** Respawns the player at the plaza spawn point with full health. */
  onRevive: () => void;
};

/**
 * Reusable death screen dialog with revive action for plaza entity health.
 */
export function RenderingWorldPlazaEntityDeathScreenOverlay({
  isVisible,
  isRevivePending = false,
  onRevive,
}: RenderingWorldPlazaEntityDeathScreenOverlayProps): React.JSX.Element | null {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`${DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_OVERLAY_CLASS_NAME} plaza-death-screen-enter`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="world-plaza-entity-death-screen-title"
      aria-describedby="world-plaza-entity-death-screen-message"
    >
      <div className="max-w-sm space-y-5">
        <div className="flex flex-col items-center gap-3">
          <div
            className="plaza-death-skull-pulse flex size-16 items-center justify-center rounded-full border border-red-300/35 bg-red-950/45"
            aria-hidden
          >
            <Icon
              icon="game-icons:death-skull"
              className="size-9 text-red-200"
            />
          </div>
          <p
            id="world-plaza-entity-death-screen-title"
            className="font-display text-xl font-semibold tracking-wide text-red-100"
          >
            {DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE}
          </p>
        </div>
        <p
          id="world-plaza-entity-death-screen-message"
          className="text-sm leading-relaxed text-white/80"
        >
          {DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_MESSAGE}
        </p>
        <button
          type="button"
          {...{
            [DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_UI_DATA_ATTRIBUTE]: true,
          }}
          className={
            DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_REVIVE_BUTTON_CLASS_NAME
          }
          disabled={isRevivePending}
          onClick={onRevive}
        >
          {DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_REVIVE_LABEL}
        </button>
      </div>
    </div>
  );
}
