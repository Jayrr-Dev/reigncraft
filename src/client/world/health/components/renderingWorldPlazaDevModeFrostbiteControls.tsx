'use client';

import {
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HINT_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import { DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';
import { listingWorldPlazaEntityFrostbiteStageDescriptors } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry';

const RENDERING_WORLD_PLAZA_DEV_MODE_FROSTBITE_BUTTON_CLASS_NAME =
  `${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME} border-sky-400/35 text-sky-100/90 hover:bg-sky-500/15` as const;

export type RenderingWorldPlazaDevModeFrostbiteControlsProps = {
  onSetFrostbiteStacks: (stackCount: number) => void;
  currentStacks?: number;
};

/**
 * Dev panel buttons that jump frostbite stacks to each stage threshold.
 */
export function RenderingWorldPlazaDevModeFrostbiteControls({
  onSetFrostbiteStacks,
  currentStacks = 0,
}: RenderingWorldPlazaDevModeFrostbiteControlsProps): React.JSX.Element {
  const stages = listingWorldPlazaEntityFrostbiteStageDescriptors();

  return (
    <div className="flex flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Frostbite
      </span>
      <div className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HINT_CLASS_NAME}>
        Set stacks to each stage threshold. Current: {Math.round(currentStacks)}{' '}
        / {DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS}. Clear removes
        frostbite. ± buttons nudge for decay/gain tests.
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_FROSTBITE_BUTTON_CLASS_NAME}
          onClick={() => onSetFrostbiteStacks(0)}
        >
          Clear
        </button>
        {stages.map((stage) => (
          <button
            key={stage.id}
            type="button"
            title={stage.description}
            className={
              RENDERING_WORLD_PLAZA_DEV_MODE_FROSTBITE_BUTTON_CLASS_NAME
            }
            onClick={() => onSetFrostbiteStacks(stage.minStacks)}
          >
            {stage.label} ({stage.minStacks})
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1">
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_FROSTBITE_BUTTON_CLASS_NAME}
          onClick={() => onSetFrostbiteStacks(Math.max(0, currentStacks - 50))}
        >
          −50
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_FROSTBITE_BUTTON_CLASS_NAME}
          onClick={() => onSetFrostbiteStacks(Math.max(0, currentStacks - 10))}
        >
          −10
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_FROSTBITE_BUTTON_CLASS_NAME}
          onClick={() =>
            onSetFrostbiteStacks(
              Math.min(
                DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS,
                currentStacks + 10
              )
            )
          }
        >
          +10
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_FROSTBITE_BUTTON_CLASS_NAME}
          onClick={() =>
            onSetFrostbiteStacks(
              Math.min(
                DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS,
                currentStacks + 50
              )
            )
          }
        >
          +50
        </button>
      </div>
    </div>
  );
}
