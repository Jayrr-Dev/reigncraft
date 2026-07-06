'use client';

import {
  DEFINING_PLAZA_MECHANICS_PANEL_DAMAGE_FLOAT_SAMPLES,
  DEFINING_PLAZA_MECHANICS_PANEL_EV_TIER_SAMPLE_CLASS_NAMES,
  DEFINING_PLAZA_MECHANICS_PANEL_FLOAT_SAMPLE_SHELL_CLASS_NAME,
} from '@/components/home/domains/definingPlazaMechanicsPanelFloatSampleConstants';
import type { PlazaMechanicsBuffBadgeGuideEntry } from '@/components/home/domains/resolvingPlazaMechanicsBuffBadgeGuideEntries';
import { Icon } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY,
  listingWorldPlazaDamageOutcomeTierDevRollOrder,
} from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { formattingWorldPlazaEntityHealthFloatTextAmount } from '@/components/world/health/domains/formattingWorldPlazaEntityHealthFloatTextLabel';
import { cn } from '@/lib/utils';

export type RenderingPlazaMechanicsDemoProps = {
  isMobile?: boolean;
};

type RenderingPlazaMechanicsInlineFloatSample = {
  tier: DefiningWorldPlazaDamageOutcomeTier;
  amount: number;
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

const PLAZA_MECHANICS_EV_DAMAGE_EXAMPLE_EV = 12;

const PLAZA_MECHANICS_EV_DAMAGE_TIER_AMOUNTS: Record<
  DefiningWorldPlazaDamageOutcomeTier,
  number
> = {
  dodged: 0,
  blocked: 4,
  softened: 8,
  normal: 12,
  true_strike: 12,
  critical: 18,
  lethal: 22,
  fatal: 28,
};

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

function RenderingPlazaMechanicsInlineFloatLine({
  label,
  className,
  icon,
}: RenderingPlazaMechanicsKindFloatSample): React.JSX.Element {
  return (
    <p
      className={cn(
        'font-mono text-sm font-bold tabular-nums leading-snug',
        className
      )}
      aria-hidden
    >
      {icon ? (
        <Icon
          icon={icon}
          className="mr-1 inline-block size-3.5 align-[-2px]"
          aria-hidden
        />
      ) : null}
      {label}
    </p>
  );
}

function RenderingPlazaMechanicsInlineRollFloatLine({
  tier,
  amount,
}: RenderingPlazaMechanicsInlineFloatSample): React.JSX.Element {
  const descriptor = DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY[tier];

  return (
    <RenderingPlazaMechanicsInlineFloatLine
      label={formattingPlazaMechanicsRollFloatLabel(tier, amount)}
      className={
        DEFINING_PLAZA_MECHANICS_PANEL_EV_TIER_SAMPLE_CLASS_NAMES[tier]
      }
      icon={descriptor.damageIcon}
    />
  );
}

/** EV roll tiers shown as inline float text (example EV = 12). */
export function RenderingPlazaMechanicsEvDamageDemo(): React.JSX.Element {
  const tiers = listingWorldPlazaDamageOutcomeTierDevRollOrder().filter(
    (tier) => tier !== 'true_strike'
  );

  return (
    <div
      className={`${DEFINING_PLAZA_MECHANICS_PANEL_FLOAT_SAMPLE_SHELL_CLASS_NAME} flex flex-col gap-1 border-t border-poster-teal/15 pt-3`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Example rolls at EV {PLAZA_MECHANICS_EV_DAMAGE_EXAMPLE_EV}
      </p>
      <div className="flex flex-col gap-1">
        {tiers.map((tier) => (
          <RenderingPlazaMechanicsInlineRollFloatLine
            key={tier}
            tier={tier}
            amount={PLAZA_MECHANICS_EV_DAMAGE_TIER_AMOUNTS[tier]}
          />
        ))}
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

const PLAZA_MECHANICS_DAMAGE_FLOAT_STYLES =
  DEFINING_PLAZA_MECHANICS_PANEL_DAMAGE_FLOAT_SAMPLES;

/** Inline float text preview for one damage type. */
export function RenderingPlazaMechanicsDamageTypeDemo({
  sectionId,
}: {
  sectionId: string;
}): React.JSX.Element | null {
  if (sectionId === 'ev-damage') {
    return <RenderingPlazaMechanicsEvDamageDemo />;
  }

  const style = PLAZA_MECHANICS_DAMAGE_FLOAT_STYLES[sectionId] ?? {
    label: '-10',
    className: 'text-red-600',
    icon: null,
  };

  return (
    <div
      className={`${DEFINING_PLAZA_MECHANICS_PANEL_FLOAT_SAMPLE_SHELL_CLASS_NAME} border-t border-poster-teal/15 pt-3`}
    >
      <RenderingPlazaMechanicsInlineFloatLine {...style} />
    </div>
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
