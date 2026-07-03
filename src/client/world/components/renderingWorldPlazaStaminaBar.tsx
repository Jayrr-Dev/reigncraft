"use client";

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { LABELING_WORLD_PLAZA_KEYBOARD_CONTROLS_HINT } from "@/components/world/domains/definingWorldPlazaKeyboardInputConstants";
import { DEFINING_WORLD_PLAZA_RUN_STAMINA_LOW_RATIO } from "@/components/world/domains/definingWorldPlazaRunStaminaConstants";

const RENDERING_WORLD_PLAZA_STAMINA_BAR_CONTAINER_CLASS =
  "pointer-events-none absolute left-3 top-3 flex flex-col gap-1 select-none";

const RENDERING_WORLD_PLAZA_STAMINA_BAR_LABEL_CLASS =
  "text-[10px] font-semibold uppercase tracking-wide text-white/85 drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)]";

const RENDERING_WORLD_PLAZA_STAMINA_BAR_TRACK_CLASS =
  "h-2 w-28 overflow-hidden rounded-full border border-white/25 bg-black/60";

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_BASE_CLASS =
  "h-full rounded-full transition-[width,background-color] duration-150 ease-out";

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_READY_CLASS =
  "bg-gradient-to-r from-teal-400 to-emerald-500";

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_LOW_CLASS =
  "bg-gradient-to-r from-amber-400 to-orange-500";

const RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_DEPLETED_CLASS =
  "bg-gradient-to-r from-rose-500 to-red-600";

const RENDERING_WORLD_PLAZA_STAMINA_BAR_HINT_CLASS =
  "max-w-[8.5rem] text-[9px] font-medium leading-snug text-white/70 drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)]";

export interface RenderingWorldPlazaStaminaBarProps {
  /** Current stamina as a 0..1 ratio. */
  staminaRatio: number;
  /** True while actively running. */
  isRunning: boolean;
  /** True while running is locked out after depletion. */
  isDepleted: boolean;
}

function resolvingStaminaBarFillClass({
  staminaRatio,
  isDepleted,
}: Pick<
  RenderingWorldPlazaStaminaBarProps,
  "staminaRatio" | "isDepleted"
>): string {
  if (isDepleted) {
    return RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_DEPLETED_CLASS;
  }

  if (staminaRatio <= DEFINING_WORLD_PLAZA_RUN_STAMINA_LOW_RATIO) {
    return RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_LOW_CLASS;
  }

  return RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_READY_CLASS;
}

/**
 * Small corner bar showing run stamina. Brightens while running and dims when
 * the bar is full and idle so it stays unobtrusive.
 */
export function RenderingWorldPlazaStaminaBar({
  staminaRatio,
  isRunning,
  isDepleted,
}: RenderingWorldPlazaStaminaBarProps): React.JSX.Element {
  const isFullAndIdle = staminaRatio >= 1 && !isRunning && !isDepleted;
  const fillClass = resolvingStaminaBarFillClass({ staminaRatio, isDepleted });
  const fillWidthPercent = Math.round(
    Math.min(1, Math.max(0, staminaRatio)) * 100,
  );

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: "" }}
      className={RENDERING_WORLD_PLAZA_STAMINA_BAR_CONTAINER_CLASS}
      style={{ opacity: isFullAndIdle ? 0.55 : 1 }}
      aria-hidden="true"
    >
      <span className={RENDERING_WORLD_PLAZA_STAMINA_BAR_LABEL_CLASS}>
        {isDepleted ? "Winded" : "Run"}
      </span>
      <div className={RENDERING_WORLD_PLAZA_STAMINA_BAR_TRACK_CLASS}>
        <div
          className={`${RENDERING_WORLD_PLAZA_STAMINA_BAR_FILL_BASE_CLASS} ${fillClass}`}
          style={{ width: `${fillWidthPercent}%` }}
        />
      </div>
      <span className={RENDERING_WORLD_PLAZA_STAMINA_BAR_HINT_CLASS}>
        {LABELING_WORLD_PLAZA_KEYBOARD_CONTROLS_HINT}
      </span>
    </div>
  );
}
