'use client';

import { resolvingWorldPlazaCharacterEngineSkillDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineSkillRegistry';
import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';

const RENDERING_WORLD_PLAZA_DEV_MODE_CHARACTER_SKILL_BUTTON_CLASS_NAME =
  'rounded border border-emerald-300/25 bg-emerald-500/10 px-2 py-1 text-left text-[11px] font-medium text-white/90 hover:bg-emerald-500/20' as const;

export type RenderingWorldPlazaDevModeCharacterSkillControlsProps = {
  skillIds: readonly string[];
  onUseSkill: (skillId: string) => void;
};

/**
 * Dev panel buttons for triggering declarative character skills.
 */
export function RenderingWorldPlazaDevModeCharacterSkillControls({
  skillIds,
  onUseSkill,
}: RenderingWorldPlazaDevModeCharacterSkillControlsProps): React.JSX.Element | null {
  if (skillIds.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Character skills
      </span>
      <div className="grid grid-cols-2 gap-1">
        {skillIds.map((skillId) => {
          const skill =
            resolvingWorldPlazaCharacterEngineSkillDefinition(skillId);

          return (
            <button
              key={skillId}
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_CHARACTER_SKILL_BUTTON_CLASS_NAME
              }
              onClick={() => onUseSkill(skillId)}
            >
              {skill?.displayName ?? skillId}
            </button>
          );
        })}
      </div>
    </div>
  );
}
