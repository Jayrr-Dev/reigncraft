'use client';

import { RenderingWorldPlazaDevModeCharacterSkillControls } from '@/components/world/character/components/renderingWorldPlazaDevModeCharacterSkillControls';
import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import { RenderingWorldPlazaDevModeBuffCategoryControls } from '@/components/world/health/components/renderingWorldPlazaDevModeBuffCategoryControls';
import {
  DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_DEV_ROLL_LABEL,
  DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_DEV_ROLL_ORDER,
} from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierForcedDeviationScores';
import type { DefiningWorldPlazaEntityBuffCategoryId } from '@/components/world/health/domains/definingWorldPlazaEntityBuffCategoryRegistry';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';

const RENDERING_WORLD_PLAZA_DEV_MODE_COMBAT_BUTTON_CLASS_NAME =
  'rounded border border-white/20 bg-black/50 px-2 py-1 text-left text-[11px] font-medium text-white/90 hover:bg-white/10' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_COMBAT_BUFF_CATEGORY_IDS: DefiningWorldPlazaEntityBuffCategoryId[] =
  ['combat', 'defence', 'utility', 'character'];

export interface RenderingWorldPlazaDevModeCombatRollControlsProps {
  activeSubcategoryId: string;
  hudSnapshot: UsingWorldPlazaPlayerHealthHudSnapshot;
  onRollDamage: (
    expectedDamage: number,
    forcedTier?: DefiningWorldPlazaDamageOutcomeTier
  ) => void;
  onToggleBuff: (buffId: string) => void;
  characterSkillIds?: readonly string[];
  onUseCharacterSkill?: (skillId: string) => void;
}

/**
 * Damage roll engine debugger: stats readout, roll tests, category buff grids.
 */
export function RenderingWorldPlazaDevModeCombatRollControls({
  activeSubcategoryId,
  hudSnapshot,
  onRollDamage,
  onToggleBuff,
  characterSkillIds = [],
  onUseCharacterSkill,
}: RenderingWorldPlazaDevModeCombatRollControlsProps): React.JSX.Element {
  const { damageRoll, activeBuffIds } = hudSnapshot;
  const activeBuffCategoryId =
    RENDERING_WORLD_PLAZA_DEV_MODE_COMBAT_BUFF_CATEGORY_IDS.find(
      (categoryId) => categoryId === activeSubcategoryId
    ) ?? null;

  return (
    <div className="flex flex-col gap-2">
      {activeSubcategoryId === 'engine' ? (
        <>
          <span
            className={
              STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME
            }
          >
            Damage roll engine
          </span>
          <div className="rounded border border-violet-300/20 bg-violet-500/10 px-2 py-1.5 text-[10px] leading-relaxed text-white/85">
            <div>
              Expected {Math.round(damageRoll.sampleExpectedDamage)} · SD{' '}
              {Math.round(damageRoll.sampleStandardDeviation)} · Luck{' '}
              {damageRoll.luck.toFixed(2)}
            </div>
            <div>
              Expected ×{damageRoll.expectedMultiplier.toFixed(2)} · Variance ×
              {damageRoll.standardDeviationMultiplier.toFixed(2)} · Tier shift{' '}
              {damageRoll.deviationBiasShift.toFixed(1)}
            </div>
            <div>
              Block {damageRoll.blockBiasTotal.toFixed(1)} · Dodge{' '}
              {damageRoll.dodgeBiasTotal.toFixed(1)} · Crit{' '}
              {damageRoll.criticalBiasTotal.toFixed(1)}
              {damageRoll.isLockInActive ? ' · Lock-In' : ''}
              {damageRoll.isChaoticActive ? ' · Chaotic' : ''}
            </div>
          </div>
          <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[9px] leading-snug text-white/60">
            Tiers at ±1/±2/±3 SD: Critical/Lethal/Fatal above ·
            Softened/Blocked/Dodged below. Attacker buffs simulate the incoming
            hit; defender buffs apply to you.
          </div>
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_COMBAT_BUTTON_CLASS_NAME
              }
              onClick={() => onRollDamage(100)}
            >
              Roll 100 EV
            </button>
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_COMBAT_BUTTON_CLASS_NAME
              }
              onClick={() => onRollDamage(10)}
            >
              Roll 10 EV
            </button>
          </div>
        </>
      ) : null}

      {activeSubcategoryId === 'force-tier' ? (
        <div className="flex flex-col gap-1">
          <span
            className={
              STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME
            }
          >
            Force tier (10 EV)
          </span>
          <div className="grid grid-cols-2 gap-1">
            {DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_DEV_ROLL_ORDER.map(
              (tier) => (
                <button
                  key={tier}
                  type="button"
                  className={
                    RENDERING_WORLD_PLAZA_DEV_MODE_COMBAT_BUTTON_CLASS_NAME
                  }
                  onClick={() => onRollDamage(10, tier)}
                >
                  Roll 10 EV ·{' '}
                  {DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_DEV_ROLL_LABEL[
                    tier
                  ] ?? tier}
                </button>
              )
            )}
          </div>
        </div>
      ) : null}

      {activeSubcategoryId === 'character' &&
      onUseCharacterSkill !== undefined ? (
        <RenderingWorldPlazaDevModeCharacterSkillControls
          skillIds={characterSkillIds}
          onUseSkill={onUseCharacterSkill}
        />
      ) : null}

      {activeBuffCategoryId !== null ? (
        <RenderingWorldPlazaDevModeBuffCategoryControls
          categoryId={activeBuffCategoryId}
          activeBuffIds={activeBuffIds}
          onToggleBuff={onToggleBuff}
        />
      ) : null}
    </div>
  );
}
