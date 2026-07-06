'use client';

import { Badge } from '@/components/ui/badge';
import {
  DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS,
  type DefiningReigncraftBadgeDarkShade,
  type DefiningReigncraftBadgeRainbowColor,
} from '@/components/ui/domains/definingReigncraftBadgeConstants';
import { resolvingReigncraftBadgeClassNames } from '@/components/ui/domains/resolvingReigncraftBadgeClassNames';
import { cn } from '@/lib/utils';

export type RenderingReigncraftCapacityBadgeProps = {
  label: string;
  currentCount: number;
  maxCount: number;
  color: DefiningReigncraftBadgeRainbowColor;
  shade?: DefiningReigncraftBadgeDarkShade;
  isAtMax?: boolean;
  className?: string;
};

/**
 * Compact count badge with rainbow dark fill and white text.
 */
export function RenderingReigncraftCapacityBadge({
  label,
  currentCount,
  maxCount,
  color,
  shade = 'dark',
  isAtMax = false,
  className,
}: RenderingReigncraftCapacityBadgeProps): React.JSX.Element {
  const atMaxPreset = DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS.capacityAtMax;
  const resolved = resolvingReigncraftBadgeClassNames(
    isAtMax
      ? { color: atMaxPreset.color, shade: atMaxPreset.shade }
      : { color, shade }
  );

  return (
    <Badge
      variant="outline"
      aria-label={`${label}: ${currentCount} of ${maxCount} used`}
      title={`${label}: ${currentCount} of ${maxCount} used`}
      className={cn(
        'flex h-5 min-w-0 flex-row items-center justify-center gap-1 rounded-sm border px-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
        resolved.shellClassName,
        className
      )}
    >
      <span className={resolved.labelClassName}>{label}</span>
      <span className={resolved.valueClassName}>
        {currentCount}
        <span className={resolved.maxValueClassName}>/{maxCount}</span>
      </span>
    </Badge>
  );
}
