'use client';

import { RenderingPlazaMechanicsCombatEvBellCurveChart } from '@/components/home/components/renderingPlazaMechanicsCombatEvBellCurveChart';
import type { ComputingPlazaMechanicsCombatEvDamageRollPreviewResult } from '@/components/home/domains/computingPlazaMechanicsCombatEvDamageRollPreview';
import {
  computingPlazaMechanicsCombatEvDamageRollPreview,
  formattingPlazaMechanicsCombatEvRollSummary,
} from '@/components/home/domains/computingPlazaMechanicsCombatEvDamageRollPreview';
import { DEFINING_PLAZA_MECHANICS_COMBAT_DAMAGE_KIND_PREVIEW_BUTTON_LABEL } from '@/components/home/domains/definingPlazaMechanicsCombatDamageKindPreviewConstants';
import {
  DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_EXAMPLE_EV,
} from '@/components/home/domains/definingPlazaMechanicsConstants';
import type { DefiningPlazaMechanicsCombatTierGuideEntry } from '@/components/home/domains/definingPlazaMechanicsCombatTierGuideConstants';
import {
  DEFINING_PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_BUTTON_LABEL,
  DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_DEFAULT_TIER,
  DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_ENTRIES,
} from '@/components/home/domains/definingPlazaMechanicsCombatTierGuideConstants';
import type { PlazaMechanicsBuffBadgeGuideEntry } from '@/components/home/domains/resolvingPlazaMechanicsBuffBadgeGuideEntries';
import { resolvingPlazaMechanicsCombatDamageKindPreviewSample } from '@/components/home/domains/resolvingPlazaMechanicsCombatDamageKindPreviewSample';
import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  formattingWorldPlazaEntityHealthFloatTextAmount,
  shouldWorldPlazaEntityHealthFloatTextUseDisplayFont,
} from '@/components/world/health/domains/formattingWorldPlazaEntityHealthFloatTextLabel';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export type RenderingPlazaMechanicsDemoProps = {
  isMobile?: boolean;
};

type RenderingPlazaMechanicsKindFloatSample = {
  label: string;
  className: string;
  icon: string | null;
};

type RenderingPlazaMechanicsStatusEffectDemoRow = {
  icon: string;
  value: string;
  borderClassName: string;
  iconClassName: string;
};

const PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_BUTTON_CLASS_NAME =
  'plaza-btn-3d inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-parchment shadow-[0_3px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_MECHANICS_COMBAT_TIER_BADGE_BUTTON_CLASS_NAME =
  'flex min-w-[4.75rem] flex-col items-center rounded-sm border px-2 py-1.5 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

const PLAZA_MECHANICS_COMBAT_EXAMPLE_ROLL_BUTTON_CLASS_NAME =
  'inline-flex cursor-pointer items-center gap-1 rounded-sm border px-2 py-1 font-mono text-[11px] font-bold tabular-nums transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

const PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_ARENA_CLASS_NAME =
  'relative w-full rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-4 py-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]';

function formattingPlazaMechanicsRollFloatLabel(
  tier: DefiningWorldPlazaDamageOutcomeTier,
  amount: number
): string {
  const descriptor = DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY[tier];
  const amountLabel = formattingWorldPlazaEntityHealthFloatTextAmount({
    kind: descriptor.floatTextKind,
    amount,
  });

  if (amountLabel === null) {
    return descriptor.label;
  }

  if (descriptor.floatTextKindLabel.length > 0) {
    return `${descriptor.floatTextKindLabel.trim()} ${amountLabel}`;
  }

  return `-${amountLabel}`;
}

function resolvingPlazaMechanicsCombatFloatPreviewLabel(
  entry: DefiningPlazaMechanicsCombatTierGuideEntry
): string {
  return formattingPlazaMechanicsRollFloatLabel(
    entry.tier,
    entry.exampleAmount
  );
}

function RenderingPlazaMechanicsCombatExampleRollButton({
  entry,
  isSelected,
  onSelect,
}: {
  entry: DefiningPlazaMechanicsCombatTierGuideEntry;
  isSelected: boolean;
  onSelect: (tier: DefiningWorldPlazaDamageOutcomeTier) => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      className={cn(
        PLAZA_MECHANICS_COMBAT_EXAMPLE_ROLL_BUTTON_CLASS_NAME,
        isSelected ? entry.badgeActiveClassName : entry.badgeClassName
      )}
      onClick={() => onSelect(entry.tier)}
      aria-pressed={isSelected}
      aria-label={`Simulate ${resolvingPlazaMechanicsCombatFloatPreviewLabel(entry)}`}
    >
      <Icon
        icon="mdi:play"
        className="size-3 shrink-0 opacity-70"
        aria-hidden
      />
      {resolvingPlazaMechanicsCombatFloatPreviewLabel(entry)}
    </button>
  );
}

function RenderingPlazaMechanicsCombatFloatPreviewArenaShell({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className={PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_ARENA_CLASS_NAME}>
      <div className="mx-auto flex w-fit flex-col items-center gap-2">
        <div className="relative h-2.5 w-28 overflow-hidden rounded-[2px] border border-black/90 bg-[#0d1117] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]">
          <div className="absolute inset-y-0 left-0 w-[68%] bg-[linear-gradient(180deg,#c43b3b_0%,#8f1010_100%)] shadow-[inset_0_1px_0_rgba(255,120,120,0.35)]" />
        </div>

        {children}

        <div className="flex size-12 items-center justify-center rounded-full border-2 border-parchment/80 bg-[linear-gradient(180deg,#c1592f_0%,#8f3a1c_100%)] shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
          <Icon
            icon="ph:person-simple-run"
            className="size-6 text-parchment"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

function RenderingPlazaMechanicsCombatTierBadgeButton({
  entry,
  isSelected,
  onSelect,
}: {
  entry: DefiningPlazaMechanicsCombatTierGuideEntry;
  isSelected: boolean;
  onSelect: (tier: DefiningWorldPlazaDamageOutcomeTier) => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      className={cn(
        PLAZA_MECHANICS_COMBAT_TIER_BADGE_BUTTON_CLASS_NAME,
        isSelected ? entry.badgeActiveClassName : entry.badgeClassName
      )}
      onClick={() => onSelect(entry.tier)}
      aria-pressed={isSelected}
    >
      <span className="text-[11px] font-bold leading-tight">{entry.label}</span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide opacity-80">
        {entry.thresholdLabel}
      </span>
    </button>
  );
}

const PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_FONT_SCALE = 0.62;
const PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_MAX_FONT_PX = 22;

function resolvingPlazaMechanicsCombatFloatPreviewFontSizePx(
  roll: ComputingPlazaMechanicsCombatEvDamageRollPreviewResult
): number {
  return Math.min(
    PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_MAX_FONT_PX,
    Math.round(
      roll.fontSizePx * PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_FONT_SCALE
    )
  );
}

function RenderingPlazaMechanicsCombatFloatPreviewArena({
  roll,
  previewKey,
}: {
  roll: ComputingPlazaMechanicsCombatEvDamageRollPreviewResult | null;
  previewKey: number;
}): React.JSX.Element {
  const scaledFontSizePx =
    roll !== null
      ? resolvingPlazaMechanicsCombatFloatPreviewFontSizePx(roll)
      : 14;
  const usesDisplayFont =
    roll !== null &&
    shouldWorldPlazaEntityHealthFloatTextUseDisplayFont(roll.floatTextKind);

  return (
    <RenderingPlazaMechanicsCombatFloatPreviewArenaShell>
      {roll !== null && previewKey > 0 ? (
        <span
          key={previewKey}
          aria-hidden
          className={cn(
            'plaza-combat-float-text pointer-events-none absolute -top-1 inline-flex items-center gap-0.5 font-bold leading-none',
            roll.damageClassName,
            usesDisplayFont ? 'font-display' : ''
          )}
          style={{
            fontSize: `${scaledFontSizePx}px`,
            animationDuration: `${roll.animationDurationSec}s`,
          }}
        >
          <Icon
            icon={roll.damageIcon}
            className="shrink-0 text-current"
            style={{
              width: `${Math.max(12, scaledFontSizePx - 6)}px`,
              height: `${Math.max(12, scaledFontSizePx - 6)}px`,
            }}
            aria-hidden
          />
          {roll.amountLabel !== null ? (
            <span className="tabular-nums">{roll.amountLabel}</span>
          ) : null}
        </span>
      ) : (
        <p className="absolute -top-1 text-[10px] font-medium text-parchment/55">
          Pick a tier badge, example roll, or roll EV damage
        </p>
      )}
    </RenderingPlazaMechanicsCombatFloatPreviewArenaShell>
  );
}

/** EV roll tiers with badge bands and a playable float preview. */
export function RenderingPlazaMechanicsEvDamageDemo(): React.JSX.Element {
  const [selectedTier, setSelectedTier] =
    useState<DefiningWorldPlazaDamageOutcomeTier>(
      DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_DEFAULT_TIER
    );
  const [previewRoll, setPreviewRoll] =
    useState<ComputingPlazaMechanicsCombatEvDamageRollPreviewResult | null>(
      null
    );
  const [previewKey, setPreviewKey] = useState(0);

  const playingRollPreview = (
    forcedTier?: DefiningWorldPlazaDamageOutcomeTier
  ): void => {
    const roll = computingPlazaMechanicsCombatEvDamageRollPreview({
      forcedTier,
    });

    setPreviewRoll(roll);
    setSelectedTier(forcedTier ?? roll.tier);
    setPreviewKey((currentKey) => currentKey + 1);
  };

  const selectingTier = (tier: DefiningWorldPlazaDamageOutcomeTier): void => {
    setSelectedTier(tier);
    playingRollPreview(tier);
  };

  const rollingRandomEvDamage = (): void => {
    playingRollPreview();
  };

  return (
    <div className="flex flex-col gap-3 border-t border-poster-teal/15 pt-3">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Outcome tiers (σ = standard deviations from EV)
        </p>
        <RenderingPlazaMechanicsCombatEvBellCurveChart
          selectedTier={selectedTier}
          rollDeviationScore={previewRoll?.deviationScore ?? null}
          onSelectTier={selectingTier}
        />
        <div className="flex flex-wrap gap-1.5">
          {DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_ENTRIES.map((entry) => (
            <RenderingPlazaMechanicsCombatTierBadgeButton
              key={entry.tier}
              entry={entry}
              isSelected={entry.tier === selectedTier}
              onSelect={selectingTier}
            />
          ))}
        </div>
        <p className="text-xs font-medium leading-snug text-ink-soft">
          Tap any tier badge or example roll to simulate that outcome. Roll EV
          damage picks a random spread around EV{' '}
          {DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_EXAMPLE_EV}.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Example rolls at EV{' '}
          {DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_EXAMPLE_EV}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_ENTRIES.map((entry) => (
            <RenderingPlazaMechanicsCombatExampleRollButton
              key={`roll-${entry.tier}`}
              entry={entry}
              isSelected={entry.tier === selectedTier}
              onSelect={selectingTier}
            />
          ))}
        </div>
      </div>

      <RenderingPlazaMechanicsCombatFloatPreviewArena
        roll={previewRoll}
        previewKey={previewKey}
      />

      <div className="flex flex-col items-center gap-1.5">
        <button
          type="button"
          className={PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_BUTTON_CLASS_NAME}
          onClick={rollingRandomEvDamage}
        >
          <Icon icon="mdi:play" className="size-4" aria-hidden />
          {DEFINING_PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_BUTTON_LABEL}
        </button>
        {previewRoll ? (
          <p className="text-center text-[11px] font-medium text-ink-soft">
            {formattingPlazaMechanicsCombatEvRollSummary(previewRoll)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Health-bar buff/debuff icon preview matching in-game styling. */
export function RenderingPlazaMechanicsBuffBadgeIconDemo({
  entry,
}: {
  entry: Pick<
    PlazaMechanicsBuffBadgeGuideEntry,
    'icon' | 'polarity' | 'durationLabel'
  >;
}): React.JSX.Element {
  const borderClassName =
    entry.polarity === 'debuff'
      ? 'border-red-400/70 bg-red-950/80'
      : 'border-poster-gold/55 bg-black/80';
  const iconClassName =
    entry.polarity === 'debuff' ? 'text-red-200' : 'text-poster-gold';
  const showTimer = entry.durationLabel !== 'Until cleared';

  return (
    <div className="border-t border-poster-teal/15 pt-3">
      <div className="inline-flex flex-col items-center gap-px" aria-hidden>
        <div
          className={`flex items-center justify-center rounded-[2px] border p-1 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] ${borderClassName}`}
        >
          <Icon icon={entry.icon} className={`size-4 ${iconClassName}`} />
        </div>
        {showTimer ? (
          <span className="text-[10px] font-bold leading-none tabular-nums text-ink-soft">
            {entry.durationLabel === 'Instant'
              ? '∞'
              : entry.durationLabel.replace(/\D/g, '').slice(0, 2) || '30'}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Animated combat float preview for non-EV damage types. */
function RenderingPlazaMechanicsDamageKindFloatPreviewDemo({
  sectionId,
}: {
  sectionId: string;
}): React.JSX.Element | null {
  const sample =
    resolvingPlazaMechanicsCombatDamageKindPreviewSample(sectionId);
  const [previewKey, setPreviewKey] = useState(0);

  if (!sample) {
    return null;
  }

  const replayingPreview = (): void => {
    setPreviewKey((currentKey) => currentKey + 1);
  };

  return (
    <div className="flex flex-col gap-2 border-t border-poster-teal/15 pt-3">
      <RenderingPlazaMechanicsCombatFloatPreviewArenaShell>
        {previewKey > 0 ? (
          <span
            key={previewKey}
            aria-hidden
            className={cn(
              'plaza-combat-float-text pointer-events-none absolute -top-1 inline-flex items-center gap-0.5 text-sm font-bold leading-none',
              sample.damageClassName
            )}
          >
            <Icon
              icon={sample.icon}
              className="size-3.5 shrink-0 text-current"
              aria-hidden
            />
            <span className="tabular-nums">{sample.amountLabel}</span>
          </span>
        ) : (
          <p className="absolute -top-1 text-[10px] font-medium text-parchment/55">
            Press Preview float
          </p>
        )}
      </RenderingPlazaMechanicsCombatFloatPreviewArenaShell>

      <div className="flex justify-center">
        <button
          type="button"
          className={PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_BUTTON_CLASS_NAME}
          onClick={replayingPreview}
        >
          <Icon icon="mdi:play" className="size-4" aria-hidden />
          {DEFINING_PLAZA_MECHANICS_COMBAT_DAMAGE_KIND_PREVIEW_BUTTON_LABEL}
        </button>
      </div>
    </div>
  );
}

/** Inline float text preview for one damage type. */
export function RenderingPlazaMechanicsDamageTypeDemo({
  sectionId,
}: {
  sectionId: string;
}): React.JSX.Element | null {
  if (sectionId === 'ev-damage') {
    return <RenderingPlazaMechanicsEvDamageDemo />;
  }

  return (
    <RenderingPlazaMechanicsDamageKindFloatPreviewDemo sectionId={sectionId} />
  );
}

const PLAZA_MECHANICS_STATUS_EFFECT_DEMO_ROWS: Record<
  string,
  RenderingPlazaMechanicsStatusEffectDemoRow
> = {
  bleed: {
    icon: 'game-icons:drop',
    value: '18',
    borderClassName: 'border-red-500/60 bg-red-950/85',
    iconClassName: 'text-red-300',
  },
  poison: {
    icon: 'mdi:biohazard',
    value: '12',
    borderClassName: 'border-green-500/60 bg-green-950/85',
    iconClassName: 'text-green-400',
  },
  temperature: {
    icon: 'solar:fire-bold',
    value: '3/s',
    borderClassName: 'border-amber-500/60 bg-amber-950/85',
    iconClassName: 'text-amber-300',
  },
  'burn-dot': {
    icon: 'solar:fire-bold',
    value: '9',
    borderClassName: 'border-orange-500/65 bg-orange-950/85',
    iconClassName: 'text-orange-300',
  },
  shield: {
    icon: 'mdi:shield-plus',
    value: '24',
    borderClassName: 'border-sky-400/60 bg-sky-950/85',
    iconClassName: 'text-sky-200',
  },
  invincibility: {
    icon: 'solar:heart-pulse-bold',
    value: '5s',
    borderClassName: 'border-poster-gold/55 bg-black/80',
    iconClassName: 'text-poster-gold',
  },
  'bonus-max-health': {
    icon: 'mdi:heart-plus',
    value: '+10',
    borderClassName: 'border-emerald-500/55 bg-emerald-950/80',
    iconClassName: 'text-emerald-300',
  },
  'fated-damage': {
    icon: 'mdi:flash',
    value: '25',
    borderClassName: 'border-amber-500/65 bg-amber-950/85',
    iconClassName: 'text-amber-300',
  },
};

/** Inline HUD badge preview for one status effect type. */
export function RenderingPlazaMechanicsStatusEffectTypeDemo({
  sectionId,
}: {
  sectionId: string;
}): React.JSX.Element {
  const row = PLAZA_MECHANICS_STATUS_EFFECT_DEMO_ROWS[sectionId] ?? {
    icon: 'mdi:shield-half-full',
    value: '?',
    borderClassName: 'border-poster-teal/40 bg-black/80',
    iconClassName: 'text-parchment',
  };

  return (
    <div className="border-t border-poster-teal/15 pt-3">
      <div
        className={`plaza-status-effect-badge inline-flex items-center gap-1 border py-0 pl-0.5 pr-1 ${row.borderClassName}`}
        aria-hidden
      >
        <span className="plaza-status-effect-badge-socket flex size-3.5 items-center justify-center rounded-[2px]">
          <Icon
            icon={row.icon}
            className={`size-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${row.iconClassName}`}
            aria-hidden
          />
        </span>
        <span className="min-w-5 font-mono text-[11px] font-semibold tabular-nums text-parchment">
          {row.value}
        </span>
      </div>
    </div>
  );
}
