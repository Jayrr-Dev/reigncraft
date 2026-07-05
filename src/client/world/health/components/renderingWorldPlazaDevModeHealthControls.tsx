'use client';

import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import { formattingWorldPlazaTemperature } from '@/components/world/health/domains/convertingWorldPlazaTemperatureUnits';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';

const RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME =
  'rounded border border-white/20 bg-black/50 px-2 py-1 text-left text-[11px] font-medium text-white/90 hover:bg-white/10' as const;

export interface RenderingWorldPlazaDevModeHealthControlsProps {
  activeSubcategoryId: string;
  hudSnapshot: UsingWorldPlazaPlayerHealthHudSnapshot;
  onDamage: () => void;
  onHeal: () => void;
  onApplyPoison: (potency: DefiningWorldPlazaEntityPoisonPotency) => void;
  onApplyBleed: (severity: DefiningWorldPlazaEntityBleedSeverity) => void;
  onApplyPotentialDamage: () => void;
  onShield: () => void;
  onToggleInvincible: () => void;
  onToggleTemperatureDisplayUnit: () => void;
  onKill: () => void;
  onRevive: () => void;
}

/**
 * Dev panel buttons for manipulating the local player health state.
 */
export function RenderingWorldPlazaDevModeHealthControls({
  activeSubcategoryId,
  hudSnapshot,
  onDamage,
  onHeal,
  onApplyPoison,
  onApplyBleed,
  onApplyPotentialDamage,
  onShield,
  onToggleInvincible,
  onToggleTemperatureDisplayUnit,
  onKill,
  onRevive,
}: RenderingWorldPlazaDevModeHealthControlsProps): React.JSX.Element {
  const localTemperatureLabel =
    hudSnapshot.localTemperatureCelsius === null
      ? '—'
      : formattingWorldPlazaTemperature(
          hudSnapshot.localTemperatureCelsius,
          hudSnapshot.temperatureDisplayUnit
        );

  return (
    <div className="flex flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Player health
      </span>

      {activeSubcategoryId === 'vitals' ? (
        <>
          <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[10px] text-white/80">
            HP {Math.round(hudSnapshot.currentHealth)} /{' '}
            {Math.round(hudSnapshot.effectiveMaxHealth)} · Shield{' '}
            {Math.round(hudSnapshot.shieldPoints)}
            {hudSnapshot.isInvincible ? ' · Invincible' : ''}
            {hudSnapshot.activeDotCount > 0
              ? ` · DoT x${hudSnapshot.activeDotCount}`
              : ''}
            {hudSnapshot.activeBleedCount > 0
              ? ` · Bleed x${hudSnapshot.activeBleedCount}`
              : ''}
            {hudSnapshot.activePoisonCount > 0
              ? ` · Poison x${hudSnapshot.activePoisonCount}`
              : ''}
            {hudSnapshot.activePotentialDamageCount > 0
              ? ` · Potential x${hudSnapshot.activePotentialDamageCount}`
              : ''}
            {hudSnapshot.activeBuffIds.length > 0
              ? ` · Buffs x${hudSnapshot.activeBuffIds.length}`
              : ''}
          </div>
          <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[10px] text-white/80">
            Local temp {localTemperatureLabel} · Heat resist{' '}
            {Math.round(hudSnapshot.temperatureResistance.heatResistance * 100)}
            %
            {hudSnapshot.temperatureResistance.isHeatImmune
              ? ' · Heat immune'
              : ''}
            {' · '}Cold resist{' '}
            {Math.round(hudSnapshot.temperatureResistance.coldResistance * 100)}
            %
            {hudSnapshot.temperatureResistance.isColdImmune
              ? ' · Cold immune'
              : ''}
          </div>
          <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[9px] leading-snug text-white/60">
            Status HUD (top-right): bleed/poison/env show damage left; pending
            damage shows amount·timer until it resolves; shield and temp max
            show amount; invincible shows time. Bleed stacks 10→ Hemorrhaging,
            5→ Exsanguinating.
          </div>
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onDamage}
            >
              Damage 10 EV
            </button>
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onHeal}
            >
              Heal 10 EV
            </button>
            <button
              type="button"
              className={`${RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME} border-green-400/35 text-green-200`}
              onClick={() => onApplyPoison('toxic')}
            >
              Toxic (10 EV + 10% / 1m)
            </button>
            <button
              type="button"
              className={`${RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME} border-green-500/40 text-green-300`}
              onClick={() => onApplyPoison('venomous')}
            >
              Venomous (10 EV + 20% / 30s)
            </button>
            <button
              type="button"
              className={`${RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME} border-green-800/50 text-green-400`}
              onClick={() => onApplyPoison('lethal')}
            >
              Lethal (10 EV + 50% / 10s)
            </button>
            <button
              type="button"
              className={`${RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME} border-red-400/35 text-red-200`}
              onClick={() => onApplyBleed('bleeding')}
            >
              Bleeding (10 EV + 5% / 1m)
            </button>
            <button
              type="button"
              className={`${RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME} border-red-500/40 text-red-300`}
              onClick={() => onApplyBleed('hemorrhaging')}
            >
              Hemorrhaging (10 EV + 10% / 30s)
            </button>
            <button
              type="button"
              className={`${RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME} border-red-800/50 text-red-400`}
              onClick={() => onApplyBleed('exsanguinating')}
            >
              Exsanguinating (10 EV + 25% / 10s)
            </button>
            <button
              type="button"
              className={`${RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME} border-amber-400/40 text-amber-200`}
              onClick={onApplyPotentialDamage}
            >
              Potential (25 EV / 5s)
            </button>
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onShield}
            >
              Shield +25 EV
            </button>
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onToggleInvincible}
            >
              Toggle invincible
            </button>
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onToggleTemperatureDisplayUnit}
            >
              Toggle °C / °F
            </button>
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onKill}
            >
              Kill
            </button>
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onRevive}
            >
              Revive
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
