'use client';

import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';

const RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME =
  'rounded border border-white/20 bg-black/50 px-2 py-1 text-left text-[11px] font-medium text-white/90 hover:bg-white/10' as const;

export interface RenderingWorldPlazaDevModeHealthControlsProps {
  hudSnapshot: UsingWorldPlazaPlayerHealthHudSnapshot;
  onDamage: () => void;
  onHeal: () => void;
  onPoison: () => void;
  onShield: () => void;
  onToggleInvincible: () => void;
  onDoubleMax: () => void;
  onHalveMax: () => void;
  onTempMax: () => void;
  onHalfDamageBuff: () => void;
  onToggleArmor: () => void;
  onKill: () => void;
  onRevive: () => void;
}

/**
 * Dev panel buttons for manipulating the local player health state.
 */
export function RenderingWorldPlazaDevModeHealthControls({
  hudSnapshot,
  onDamage,
  onHeal,
  onPoison,
  onShield,
  onToggleInvincible,
  onDoubleMax,
  onHalveMax,
  onTempMax,
  onHalfDamageBuff,
  onToggleArmor,
  onKill,
  onRevive,
}: RenderingWorldPlazaDevModeHealthControlsProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Health
      </span>
      <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[10px] text-white/80">
        HP {Math.round(hudSnapshot.currentHealth)} /{' '}
        {Math.round(hudSnapshot.effectiveMaxHealth)} · Shield{' '}
        {Math.round(hudSnapshot.shieldPoints)}
        {hudSnapshot.isInvincible ? ' · Invincible' : ''}
        {hudSnapshot.activeDotCount > 0
          ? ` · DoT x${hudSnapshot.activeDotCount}`
          : ''}
      </div>
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onDamage}
        >
          Damage 10
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onHeal}
        >
          Heal 10
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onPoison}
        >
          Poison DoT
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onShield}
        >
          Shield +25
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onToggleInvincible}
        >
          Toggle invincible
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onDoubleMax}
        >
          Double max HP
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onHalveMax}
        >
          Halve max HP
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onTempMax}
        >
          +50 temp HP (30s)
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onHalfDamageBuff}
        >
          Half damage (30s)
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onToggleArmor}
        >
          Toggle armor
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onKill}
        >
          Kill
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
          onClick={onRevive}
        >
          Revive
        </button>
      </div>
    </div>
  );
}
