'use client';

import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_DEV_ROLL_LABEL,
  DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_DEV_ROLL_ORDER,
} from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierForcedDeviationScores';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS,
  listingWorldPlazaEntityHealthDamageRollPresetsByCategory,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';

const RENDERING_WORLD_PLAZA_DEV_MODE_COMBAT_BUTTON_CLASS_NAME =
  'rounded border border-white/20 bg-black/50 px-2 py-1 text-left text-[11px] font-medium text-white/90 hover:bg-white/10' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_COMBAT_PRESET_ACTIVE_CLASS_NAME =
  'border-poster-gold/60 bg-poster-gold/15 text-poster-gold' as const;

export interface RenderingWorldPlazaDevModeCombatRollControlsProps {
  activeSubcategoryId: string;
  hudSnapshot: UsingWorldPlazaPlayerHealthHudSnapshot;
  onRollDamage: (
    expectedDamage: number,
    forcedTier?: DefiningWorldPlazaDamageOutcomeTier
  ) => void;
  onToggleDamageRollPreset: (presetId: string) => void;
}

function RenderingWorldPlazaDevModeCombatPresetGrid({
  title,
  presetIds,
  activePresetIds,
  onToggleDamageRollPreset,
}: {
  title: string;
  presetIds: readonly string[];
  activePresetIds: readonly string[];
  onToggleDamageRollPreset: (presetId: string) => void;
}): React.JSX.Element {
  const presets = DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS.filter(
    (preset) => presetIds.includes(preset.id)
  );

  if (presets.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-1">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        {title}
      </span>
      <div className="grid grid-cols-2 gap-1">
        {presets.map((preset) => {
          const isActive = activePresetIds.includes(preset.id);

          return (
            <button
              key={preset.id}
              type="button"
              title={preset.description}
              className={`${RENDERING_WORLD_PLAZA_DEV_MODE_COMBAT_BUTTON_CLASS_NAME} ${
                isActive
                  ? RENDERING_WORLD_PLAZA_DEV_MODE_COMBAT_PRESET_ACTIVE_CLASS_NAME
                  : ''
              }`}
              onClick={() => onToggleDamageRollPreset(preset.id)}
            >
              {isActive ? '✓ ' : ''}
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Damage roll engine debugger: stats readout, roll tests, armour/buff presets.
 */
export function RenderingWorldPlazaDevModeCombatRollControls({
  activeSubcategoryId,
  hudSnapshot,
  onRollDamage,
  onToggleDamageRollPreset,
}: RenderingWorldPlazaDevModeCombatRollControlsProps): React.JSX.Element {
  const { damageRoll } = hudSnapshot;

  const armorPresets = listingWorldPlazaEntityHealthDamageRollPresetsByCategory(
    'armor'
  ).map((preset) => preset.id);
  const defensivePresets =
    listingWorldPlazaEntityHealthDamageRollPresetsByCategory(
      'defensive_buff'
    ).map((preset) => preset.id);
  const offensivePresets =
    listingWorldPlazaEntityHealthDamageRollPresetsByCategory(
      'offensive_buff'
    ).map((preset) => preset.id);
  const consistencyPresets =
    listingWorldPlazaEntityHealthDamageRollPresetsByCategory('consistency').map(
      (preset) => preset.id
    );
  const chaoticPresets =
    listingWorldPlazaEntityHealthDamageRollPresetsByCategory('chaotic').map(
      (preset) => preset.id
    );

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
            Softened/Blocked/Dodged below. Attacker presets simulate the
            incoming hit; defender presets apply to you.
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

      {activeSubcategoryId === 'defender' ? (
        <>
          <RenderingWorldPlazaDevModeCombatPresetGrid
            title="Armour (defender)"
            presetIds={armorPresets}
            activePresetIds={damageRoll.activeDefenderPresetIds}
            onToggleDamageRollPreset={onToggleDamageRollPreset}
          />
          <RenderingWorldPlazaDevModeCombatPresetGrid
            title="Defensive buffs"
            presetIds={defensivePresets}
            activePresetIds={damageRoll.activeDefenderPresetIds}
            onToggleDamageRollPreset={onToggleDamageRollPreset}
          />
        </>
      ) : null}

      {activeSubcategoryId === 'attacker' ? (
        <>
          <RenderingWorldPlazaDevModeCombatPresetGrid
            title="Offensive buffs (attacker)"
            presetIds={offensivePresets}
            activePresetIds={damageRoll.activeAttackerPresetIds}
            onToggleDamageRollPreset={onToggleDamageRollPreset}
          />
          <RenderingWorldPlazaDevModeCombatPresetGrid
            title="Consistency (attacker)"
            presetIds={consistencyPresets}
            activePresetIds={damageRoll.activeAttackerPresetIds}
            onToggleDamageRollPreset={onToggleDamageRollPreset}
          />
          <RenderingWorldPlazaDevModeCombatPresetGrid
            title="Chaotic damage (attacker)"
            presetIds={chaoticPresets}
            activePresetIds={damageRoll.activeAttackerPresetIds}
            onToggleDamageRollPreset={onToggleDamageRollPreset}
          />
        </>
      ) : null}
    </div>
  );
}
