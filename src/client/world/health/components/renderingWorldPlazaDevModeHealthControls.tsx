'use client';

import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import { formattingWorldPlazaTemperature } from '@/components/world/health/domains/convertingWorldPlazaTemperatureUnits';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';

const RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME =
  'rounded border border-white/20 bg-black/50 px-2 py-1 text-left text-[11px] font-medium text-white/90 hover:bg-white/10' as const;

export interface RenderingWorldPlazaDevModeHealthControlsProps {
  activeSubcategoryId: string;
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
  onAddHeatResistance: () => void;
  onAddColdResistance: () => void;
  onToggleHeatImmunity: () => void;
  onToggleColdImmunity: () => void;
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
  onPoison,
  onShield,
  onToggleInvincible,
  onDoubleMax,
  onHalveMax,
  onTempMax,
  onHalfDamageBuff,
  onAddHeatResistance,
  onAddColdResistance,
  onToggleHeatImmunity,
  onToggleColdImmunity,
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
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onPoison}
            >
              Poison DoT (5 EV/s)
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

      {activeSubcategoryId === 'modifiers' ? (
        <div className="grid grid-cols-2 gap-1">
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
            +50 temp HP EV (30s)
          </button>
          <button
            type="button"
            className={RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME}
            onClick={onHalfDamageBuff}
          >
            Half damage (30s)
          </button>
        </div>
      ) : null}

      {activeSubcategoryId === 'temperature' ? (
        <>
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
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onAddHeatResistance}
            >
              +25% heat resist
            </button>
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onAddColdResistance}
            >
              +25% cold resist
            </button>
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onToggleHeatImmunity}
            >
              Toggle heat immune
            </button>
            <button
              type="button"
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_HEALTH_BUTTON_CLASS_NAME
              }
              onClick={onToggleColdImmunity}
            >
              Toggle cold immune
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
          </div>
        </>
      ) : null}
    </div>
  );
}
