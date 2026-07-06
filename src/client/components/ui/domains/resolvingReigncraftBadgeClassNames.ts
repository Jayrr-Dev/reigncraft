import {
  DEFINING_REIGNCRAFT_BADGE_CAPACITY_LABEL_CLASS_NAME,
  DEFINING_REIGNCRAFT_BADGE_CAPACITY_MAX_VALUE_CLASS_NAME,
  DEFINING_REIGNCRAFT_BADGE_CAPACITY_SHELL_CLASS_NAME,
  DEFINING_REIGNCRAFT_BADGE_CAPACITY_VALUE_CLASS_NAME,
  DEFINING_REIGNCRAFT_BADGE_CSS_SHELL_CLASS_NAME,
  DEFINING_REIGNCRAFT_BADGE_RAINBOW_PAINT_REGISTRY,
  DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_LABEL_CLASS_NAME,
  DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_MAX_VALUE_CLASS_NAME,
  DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_SHELL_CLASS_NAME,
  DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_VALUE_CLASS_NAME,
  type DefiningReigncraftBadgeDarkShade,
  type DefiningReigncraftBadgeRainbowColor,
} from '@/components/ui/domains/definingReigncraftBadgeConstants';

export type ResolvingReigncraftBadgeClassNamesInput = {
  color: DefiningReigncraftBadgeRainbowColor;
  shade?: DefiningReigncraftBadgeDarkShade;
};

export type ResolvingReigncraftBadgeClassNamesResult = {
  shellClassName: string;
  labelClassName: string;
  valueClassName: string;
  maxValueClassName: string;
};

/**
 * Resolves rainbow badge class names for a hue and dark shade.
 */
export function resolvingReigncraftBadgeClassNames({
  color,
  shade = 'dark',
}: ResolvingReigncraftBadgeClassNamesInput): ResolvingReigncraftBadgeClassNamesResult {
  const paint = DEFINING_REIGNCRAFT_BADGE_RAINBOW_PAINT_REGISTRY[color][shade];

  return {
    shellClassName: [
      DEFINING_REIGNCRAFT_BADGE_CSS_SHELL_CLASS_NAME,
      paint.shellClassName,
    ].join(' '),
    labelClassName: DEFINING_REIGNCRAFT_BADGE_CAPACITY_LABEL_CLASS_NAME,
    valueClassName: DEFINING_REIGNCRAFT_BADGE_CAPACITY_VALUE_CLASS_NAME,
    maxValueClassName: DEFINING_REIGNCRAFT_BADGE_CAPACITY_MAX_VALUE_CLASS_NAME,
  };
}

/**
 * Resolves capacity badge shell classes (layout + paint) for in-world HUD.
 */
export function resolvingReigncraftCapacityBadgeShellClassName(
  input: ResolvingReigncraftBadgeClassNamesInput
): string {
  const { shellClassName } = resolvingReigncraftBadgeClassNames(input);

  return [
    DEFINING_REIGNCRAFT_BADGE_CAPACITY_SHELL_CLASS_NAME,
    shellClassName,
  ].join(' ');
}

/**
 * Resolves shell classes for a simple text-only rainbow badge.
 */
export function resolvingReigncraftTextBadgeShellClassName(
  input: ResolvingReigncraftBadgeClassNamesInput
): string {
  const { shellClassName } = resolvingReigncraftBadgeClassNames(input);

  return shellClassName;
}

/**
 * Resolves capacity badge classes for tutorial / guide demos.
 */
export function resolvingReigncraftTutorialCapacityBadgeClassNames(
  input: ResolvingReigncraftBadgeClassNamesInput
): ResolvingReigncraftBadgeClassNamesResult {
  const paint =
    DEFINING_REIGNCRAFT_BADGE_RAINBOW_PAINT_REGISTRY[input.color][
      input.shade ?? 'dark'
    ];

  return {
    shellClassName: [
      DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_SHELL_CLASS_NAME,
      DEFINING_REIGNCRAFT_BADGE_CSS_SHELL_CLASS_NAME,
      paint.shellClassName,
    ].join(' '),
    labelClassName:
      DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_LABEL_CLASS_NAME,
    valueClassName:
      DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_VALUE_CLASS_NAME,
    maxValueClassName:
      DEFINING_REIGNCRAFT_BADGE_TUTORIAL_CAPACITY_MAX_VALUE_CLASS_NAME,
  };
}
