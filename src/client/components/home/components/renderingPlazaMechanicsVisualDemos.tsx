'use client';

import type { PlazaMechanicsProfileStatusId } from '@/components/home/domains/definingPlazaMechanicsConstants';
import { Icon } from '@/components/ui/icon';
import { RenderingWorldPlazaPlayerProfileStatusIcon } from '@/components/world/components/renderingWorldPlazaPlayerProfileStatusIcon';
import { cn } from '@/lib/utils';

export type RenderingPlazaMechanicsDemoProps = {
  isMobile?: boolean;
};

type RenderingPlazaMechanicsStatusEffectDemoRow = {
  icon: string;
  value: string;
  borderClassName: string;
  iconClassName: string;
};

function RenderingPlazaMechanicsStatusEffectDemoBadge({
  row,
}: {
  row: RenderingPlazaMechanicsStatusEffectDemoRow;
}): React.JSX.Element {
  return (
    <div
      className={`plaza-status-effect-badge flex items-center gap-1 border py-0 pl-0.5 pr-1 ${row.borderClassName}`}
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
  );
}

/** Player name row with the selected profile status badge. */
export function RenderingPlazaMechanicsProfileStatusDemo({
  statusId,
}: {
  statusId: PlazaMechanicsProfileStatusId;
}): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[15rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-4 py-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-center gap-1.5">
          <span className="font-display text-sm font-bold tracking-wide text-parchment drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
            PlayerName
          </span>
          <RenderingWorldPlazaPlayerProfileStatusIcon
            statusKind={statusId}
            iconSizeClassName="size-4"
          />
        </div>
      </div>
      <p className="text-center text-xs font-medium text-ink-soft">
        Badges appear beside names above avatars in the plaza.
      </p>
    </div>
  );
}

const PLAZA_MECHANICS_DAMAGE_FLOAT_STYLES: Record<
  string,
  { label: string; className: string; icon: string | null }
> = {
  physical: {
    label: '-12',
    className: 'plaza-combat-float-damage text-red-300',
    icon: null,
  },
  fall: {
    label: '-8',
    className: 'plaza-combat-float-damage text-red-300',
    icon: 'mdi:arrow-down-bold',
  },
  'environmental-heat': {
    label: '-3/s',
    className: 'plaza-combat-float-damage text-amber-300',
    icon: 'solar:fire-bold',
  },
  'environmental-cold': {
    label: '-2/s',
    className: 'plaza-combat-float-damage plaza-combat-float-frost',
    icon: 'mdi:snowflake',
  },
  'environmental-lava': {
    label: '-15',
    className: 'plaza-combat-float-damage text-orange-300',
    icon: 'solar:fire-bold',
  },
  'poison-toxic': {
    label: '-6',
    className:
      'plaza-combat-float-damage plaza-combat-float-toxic text-green-400',
    icon: 'mdi:biohazard',
  },
  'poison-venomous': {
    label: '-11',
    className:
      'plaza-combat-float-damage plaza-combat-float-venomous text-green-500',
    icon: 'game-icons:scythe',
  },
  'poison-lethal': {
    label: '-24',
    className:
      'plaza-combat-float-damage plaza-combat-float-lethal-poison text-green-700',
    icon: 'game-icons:death-skull',
  },
  'bleed-bleeding': {
    label: '-4',
    className:
      'plaza-combat-float-damage plaza-combat-float-bleeding text-red-400',
    icon: 'game-icons:drop',
  },
  'bleed-hemorrhaging': {
    label: '-9',
    className:
      'plaza-combat-float-damage plaza-combat-float-hemorrhaging text-red-600',
    icon: 'mdi:blood-bag',
  },
  'bleed-exsanguinating': {
    label: '-18',
    className:
      'plaza-combat-float-damage plaza-combat-float-exsanguinating text-red-900',
    icon: 'game-icons:broken-heart',
  },
  starvation: {
    label: '-2',
    className:
      'plaza-combat-float-damage plaza-combat-float-starvation text-amber-500',
    icon: 'mdi:food-drumstick-off',
  },
  'potential-damage': {
    label: '-25',
    className:
      'plaza-combat-float-damage plaza-combat-float-potential-damage text-amber-300',
    icon: 'mdi:flash',
  },
};

/** Combat float text preview for one damage type. */
export function RenderingPlazaMechanicsDamageTypeDemo({
  sectionId,
}: {
  sectionId: string;
}): React.JSX.Element {
  const style = PLAZA_MECHANICS_DAMAGE_FLOAT_STYLES[sectionId] ?? {
    label: '-10',
    className: 'plaza-combat-float-damage text-red-300',
    icon: null,
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-16 w-full max-w-[15rem] items-center justify-center rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <span
          className={cn(
            'inline-flex items-center gap-1 font-mono text-sm font-bold tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
            style.className
          )}
          aria-hidden
        >
          {style.icon ? (
            <Icon icon={style.icon} className="size-3.5" aria-hidden />
          ) : null}
          {style.label}
        </span>
      </div>
      <p className="text-center text-xs font-medium text-ink-soft">
        Damage numbers float above your avatar when hits land.
      </p>
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

/** Top-right HUD badge preview for one status effect type. */
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
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[15rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-4 py-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="ml-auto flex w-fit flex-col items-end gap-1">
          <RenderingPlazaMechanicsStatusEffectDemoBadge row={row} />
        </div>
      </div>
      <p className="text-center text-xs font-medium text-ink-soft">
        Active effects stack in the top-right corner of the screen.
      </p>
    </div>
  );
}
