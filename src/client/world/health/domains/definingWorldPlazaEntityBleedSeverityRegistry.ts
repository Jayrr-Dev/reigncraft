import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';

/** Bleed intensity tier controlling how fast the bleed pool drains. */
export type DefiningWorldPlazaEntityBleedSeverity =
  | 'bleeding'
  | 'hemorrhaging'
  | 'exsanguinating';

export type DefiningWorldPlazaEntityBleedSeverityDescriptor = {
  severity: DefiningWorldPlazaEntityBleedSeverity;
  damageKind: DefiningWorldPlazaEntityDamageKind;
  label: string;
  description: string;
  /** Total bleed duration in milliseconds. */
  durationMs: number;
  /** Percent of effective max health rolled as the bleed pool percent component. */
  healthPercentExpected: number;
  floatIcon: MappingWorldPlazaEntityHealthFloatTextIconName;
  /** Tailwind classes for damage float text from this bleed source. */
  floatClassNameOverride: string;
  /** Tailwind text color for the HUD debuff icon. */
  hudIconColorClassName: string;
  /** Tailwind border/background for the HUD debuff icon chip. */
  hudIconBorderClassName: string;
  deathScreenTitle: string;
};

export const DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY: Record<
  DefiningWorldPlazaEntityBleedSeverity,
  DefiningWorldPlazaEntityBleedSeverityDescriptor
> = {
  bleeding: {
    severity: 'bleeding',
    damageKind: 'bleeding',
    label: 'Bleeding',
    description:
      'Stacks on repeat hits. 10 stacks escalate to Hemorrhaging. Flat hit plus 10% max HP over 1 minute.',
    durationMs: 60 * 1000,
    healthPercentExpected: 0.1,
    floatIcon: 'game-icons:drop',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-bleeding text-red-400',
    hudIconColorClassName: 'text-red-300',
    hudIconBorderClassName: 'border-red-400/60 bg-red-950/85',
    deathScreenTitle: 'YOU BLED OUT',
  },
  hemorrhaging: {
    severity: 'hemorrhaging',
    damageKind: 'hemorrhaging',
    label: 'Hemorrhaging',
    description:
      'Stacks on repeat hits. 5 stacks escalate to Exsanguinating. Flat hit plus 20% max HP over 30 seconds.',
    durationMs: 30 * 1000,
    healthPercentExpected: 0.2,
    floatIcon: 'mdi:blood-bag',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-hemorrhaging text-red-600',
    hudIconColorClassName: 'text-red-500',
    hudIconBorderClassName: 'border-red-500/70 bg-red-950/90',
    deathScreenTitle: 'YOU HEMORRHAGED',
  },
  exsanguinating: {
    severity: 'exsanguinating',
    damageKind: 'exsanguinating',
    label: 'Exsanguinating',
    description:
      'Maximum bleed tier. Flat hit plus 50% max HP over 10 seconds. Rate starts high, then slows.',
    durationMs: 10 * 1000,
    healthPercentExpected: 0.5,
    floatIcon: 'game-icons:broken-heart',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-exsanguinating text-red-900',
    hudIconColorClassName: 'text-red-800',
    hudIconBorderClassName: 'border-red-800/80 bg-red-950/95',
    deathScreenTitle: 'YOU EXSANGUINATED',
  },
};

/**
 * Returns the descriptor for one bleed severity tier.
 */
export function resolvingWorldPlazaEntityBleedSeverityDescriptor(
  severity: DefiningWorldPlazaEntityBleedSeverity
): DefiningWorldPlazaEntityBleedSeverityDescriptor {
  return DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY[severity];
}

/**
 * Maps a bleed severity to its damage-kind id.
 */
export function mappingWorldPlazaEntityBleedSeverityToDamageKind(
  severity: DefiningWorldPlazaEntityBleedSeverity
): DefiningWorldPlazaEntityDamageKind {
  return DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY[severity]
    .damageKind;
}
