'use client';

import {
  LABELING_PLAZA_BIOMES_FORAGING_RESOURCES_SECTION,
  LABELING_PLAZA_BIOMES_FORAGING_VEGETATION_SECTION,
} from '@/components/home/domains/definingPlazaBiomesGuideForagingConstants';
import type { PlazaBiomesGuideForagingDisplay } from '@/components/home/domains/resolvingPlazaBiomesGuideForagingDisplay';
import { Icon } from '@/components/ui/icon';

const PLAZA_BIOMES_FORAGING_LAYOUT_CLASS_NAMES = {
  card: {
    sectionLabel:
      'font-display text-[9px] font-bold uppercase tracking-wide text-poster-teal-deep/80',
    chip: 'inline-flex max-w-full items-center gap-0.5 rounded-sm border border-poster-teal/20 bg-parchment/75 px-1 py-0.5 text-[9px] font-medium leading-tight text-ink-soft',
    chipIcon: 'size-2.5 shrink-0 text-poster-teal-deep',
    wrapper: 'mt-2 flex flex-col gap-2 border-t border-poster-teal/15 pt-2',
  },
  detail: {
    sectionLabel:
      'font-display text-[11px] font-bold uppercase tracking-wide text-poster-teal-deep',
    chip: 'inline-flex max-w-full items-center gap-1 rounded-sm border border-poster-teal/25 bg-parchment/80 px-2 py-1 text-[11px] font-medium leading-tight text-ink-soft',
    chipIcon: 'size-3 shrink-0 text-poster-teal-deep',
    wrapper: 'mt-4 flex flex-col gap-3 border-t border-poster-teal/20 pt-3',
  },
} as const;

export type RenderingPlazaBiomesGuideCardForagingSectionProps = {
  foraging: PlazaBiomesGuideForagingDisplay;
  layout?: 'card' | 'detail';
};

function RenderingPlazaBiomesGuideForagingChipList({
  label,
  tags,
  layout,
}: {
  label: string;
  tags: PlazaBiomesGuideForagingDisplay['resources'];
  layout: 'card' | 'detail';
}): React.JSX.Element | null {
  const layoutClassNames = PLAZA_BIOMES_FORAGING_LAYOUT_CLASS_NAMES[layout];

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <h4 className={layoutClassNames.sectionLabel}>{label}</h4>
      <ul className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <li key={tag.id}>
            <span className={layoutClassNames.chip}>
              <Icon
                icon={tag.icon}
                className={layoutClassNames.chipIcon}
                aria-hidden
              />
              <span className="truncate">{tag.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Resources and vegetation chips for explored biome detail views. */
export function RenderingPlazaBiomesGuideCardForagingSection({
  foraging,
  layout = 'card',
}: RenderingPlazaBiomesGuideCardForagingSectionProps): React.JSX.Element {
  const layoutClassNames = PLAZA_BIOMES_FORAGING_LAYOUT_CLASS_NAMES[layout];

  return (
    <div className={layoutClassNames.wrapper}>
      <RenderingPlazaBiomesGuideForagingChipList
        label={LABELING_PLAZA_BIOMES_FORAGING_RESOURCES_SECTION}
        tags={foraging.resources}
        layout={layout}
      />
      <RenderingPlazaBiomesGuideForagingChipList
        label={LABELING_PLAZA_BIOMES_FORAGING_VEGETATION_SECTION}
        tags={foraging.vegetation}
        layout={layout}
      />
    </div>
  );
}
