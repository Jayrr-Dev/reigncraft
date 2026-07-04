'use client';

import type { DefiningWorldPlazaEntityBuffCategoryId } from '@/components/world/health/domains/definingWorldPlazaEntityBuffCategoryRegistry';
import { resolvingWorldPlazaEntityBuffCategoryDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffCategoryRegistry';
import {
  listingWorldPlazaEntityInstantBuffsForCategory,
  listingWorldPlazaEntityToggleBuffsForCategory,
} from '@/components/world/health/domains/checkingWorldPlazaEntityBuffIsActive';
import type { DefiningWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';

const RENDERING_WORLD_PLAZA_DEV_MODE_BUFF_BUTTON_CLASS_NAME =
  'rounded border border-white/20 bg-black/50 px-2 py-1 text-left text-[11px] font-medium text-white/90 hover:bg-white/10' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_BUFF_ACTIVE_CLASS_NAME =
  'border-poster-gold/60 bg-poster-gold/15 text-poster-gold' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_BUFF_DEBUFF_CLASS_NAME =
  'border-red-400/40 text-red-200/90' as const;

function RenderingWorldPlazaDevModeBuffButton({
  descriptor,
  isActive,
  onToggleBuff,
}: {
  descriptor: DefiningWorldPlazaEntityBuffDescriptor;
  isActive: boolean;
  onToggleBuff: (buffId: string) => void;
}): React.JSX.Element {
  return (
    <button
      key={descriptor.id}
      type="button"
      title={descriptor.description}
      className={`${RENDERING_WORLD_PLAZA_DEV_MODE_BUFF_BUTTON_CLASS_NAME} ${
        isActive
          ? RENDERING_WORLD_PLAZA_DEV_MODE_BUFF_ACTIVE_CLASS_NAME
          : descriptor.polarity === 'debuff'
            ? RENDERING_WORLD_PLAZA_DEV_MODE_BUFF_DEBUFF_CLASS_NAME
            : ''
      }`}
      onClick={() => onToggleBuff(descriptor.id)}
    >
      {isActive ? '✓ ' : ''}
      {descriptor.label}
    </button>
  );
}

function RenderingWorldPlazaDevModeBuffSection({
  title,
  descriptors,
  activeBuffIds,
  onToggleBuff,
}: {
  title: string;
  descriptors: readonly DefiningWorldPlazaEntityBuffDescriptor[];
  activeBuffIds: readonly string[];
  onToggleBuff: (buffId: string) => void;
}): React.JSX.Element {
  if (descriptors.length === 0) {
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
        {descriptors.map((descriptor) => (
          <RenderingWorldPlazaDevModeBuffButton
            key={descriptor.id}
            descriptor={descriptor}
            isActive={activeBuffIds.includes(descriptor.id)}
            onToggleBuff={onToggleBuff}
          />
        ))}
      </div>
    </div>
  );
}

export interface RenderingWorldPlazaDevModeBuffCategoryControlsProps {
  categoryId: DefiningWorldPlazaEntityBuffCategoryId;
  activeBuffIds: readonly string[];
  onToggleBuff: (buffId: string) => void;
}

/**
 * Dev panel buff/debuff grid for one category (Combat, Defence, Utility, Character).
 */
export function RenderingWorldPlazaDevModeBuffCategoryControls({
  categoryId,
  activeBuffIds,
  onToggleBuff,
}: RenderingWorldPlazaDevModeBuffCategoryControlsProps): React.JSX.Element {
  const category = resolvingWorldPlazaEntityBuffCategoryDescriptor(categoryId);
  const toggleBuffs = listingWorldPlazaEntityToggleBuffsForCategory(categoryId);
  const instantBuffs = listingWorldPlazaEntityInstantBuffsForCategory(categoryId);

  return (
    <div className="flex flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        {category.label} buffs
      </span>
      <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[9px] leading-snug text-white/60">
        Short-term buffs and debuffs from the unified registry. Toggle buffs
        stay until cleared; timed buffs expire automatically.
      </div>
      <RenderingWorldPlazaDevModeBuffSection
        title="Toggle"
        descriptors={toggleBuffs}
        activeBuffIds={activeBuffIds}
        onToggleBuff={onToggleBuff}
      />
      <RenderingWorldPlazaDevModeBuffSection
        title="Instant"
        descriptors={instantBuffs}
        activeBuffIds={activeBuffIds}
        onToggleBuff={onToggleBuff}
      />
    </div>
  );
}
