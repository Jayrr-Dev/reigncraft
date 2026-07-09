import {
  computingWorldPlazaInGameDaysToDiseaseRealMs,
  computingWorldPlazaInGameHoursToDiseaseRealMs,
} from '@/components/world/health/domains/computingWorldPlazaEntityDiseaseDurationMs';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import type { MappingWorldPlazaEntityBuffHudIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';

/** Reusable disease ids for meat and future sources. */
export type DefiningWorldPlazaEntityDiseaseId =
  | 'salmonellosis'
  | 'chronic-wasting'
  | 'trichinellosis'
  | 'mad-cow'
  | 'liver-fluke'
  | 'sleeping-sickness'
  | 'wolf-fever'
  | 'bear-worm'
  | 'toxoplasmosis'
  | 'vibrio-infection'
  | 'cucco-rage';

/** Player-facing threat tier for sorting, UI, and balance review. */
export type DefiningWorldPlazaEntityDiseaseSeverity =
  | 'mild'
  | 'moderate'
  | 'severe'
  | 'critical';

export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER: Record<
  DefiningWorldPlazaEntityDiseaseSeverity,
  number
> = {
  mild: 0,
  moderate: 1,
  severe: 2,
  critical: 3,
};

export type DefiningWorldPlazaEntityDiseaseStageGrant =
  | {
      kind: 'poison';
      delayMs: number;
      potency: DefiningWorldPlazaEntityPoisonPotency;
      totalPoisonDamage: number;
    }
  | {
      kind: 'bleed';
      delayMs: number;
      severity: DefiningWorldPlazaEntityBleedSeverity;
      flatExpectedDamage: number;
    }
  | {
      kind: 'potential_damage';
      delayMs: number;
      pendingExpectedDamage: number;
      resolveDelayMs: number;
    }
  | {
      kind: 'confusion';
      delayMs: number;
      intensity: number;
      durationMs: number;
    }
  | {
      kind: 'sleep';
      delayMs: number;
      durationMs: number;
      wakeBonusDamage?: number;
    }
  | {
      kind: 'buff';
      delayMs: number;
      buffId: string;
      durationMs: number;
    };

export type DefiningWorldPlazaEntityDiseaseDescriptor = {
  id: DefiningWorldPlazaEntityDiseaseId;
  label: string;
  description: string;
  /**
   * Threat tier from staged grants: mobility locks, incapacitation, and burst damage.
   * mild < moderate < severe < critical.
   */
  severity: DefiningWorldPlazaEntityDiseaseSeverity;
  icon: MappingWorldPlazaEntityBuffHudIconName;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
  /** Silent infection window before symptoms and HUD badge appear. */
  incubationMs: number;
  /** Active illness length after incubation ends. */
  durationMs: number;
  grants: readonly DefiningWorldPlazaEntityDiseaseStageGrant[];
};

const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_COLOR =
  'text-lime-300' as const;
const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_BORDER =
  'border-lime-500/70 bg-lime-950/90' as const;
const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_PRION_COLOR =
  'text-purple-300' as const;
const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_PRION_BORDER =
  'border-purple-500/70 bg-purple-950/90' as const;
const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_COLOR =
  'text-amber-300' as const;
const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_BORDER =
  'border-amber-500/70 bg-amber-950/90' as const;
const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_RAGE_COLOR =
  'text-red-300' as const;
const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_RAGE_BORDER =
  'border-red-500/70 bg-red-950/90' as const;

export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_REGISTRY: Record<
  DefiningWorldPlazaEntityDiseaseId,
  DefiningWorldPlazaEntityDiseaseDescriptor
> = {
  salmonellosis: {
    id: 'salmonellosis',
    label: 'Salmonellosis',
    description:
      'Campylobacter-style gut rot from undercooked poultry. Nausea slows you; mild poison follows.',
    severity: 'mild',
    icon: 'mdi:stomach',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_BORDER,
    incubationMs: computingWorldPlazaInGameHoursToDiseaseRealMs(8),
    durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-nausea-slow-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
      },
      {
        kind: 'poison',
        delayMs: computingWorldPlazaInGameHoursToDiseaseRealMs(6),
        potency: 'toxic',
        totalPoisonDamage: 25,
      },
    ],
  },
  'chronic-wasting': {
    id: 'chronic-wasting',
    label: 'Chronic Wasting',
    description:
      'Prion sickness from cervid meat. Mind wanders, legs drag, and it lingers.',
    severity: 'severe',
    icon: 'mdi:head-question',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_PRION_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_PRION_BORDER,
    incubationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(3),
    durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(7),
    grants: [
      {
        kind: 'confusion',
        delayMs: 0,
        intensity: 25,
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(5),
      },
      {
        kind: 'buff',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
        buffId: 'disease-nausea-slow-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(5),
      },
      {
        kind: 'confusion',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(5),
        intensity: 50,
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
      },
    ],
  },
  trichinellosis: {
    id: 'trichinellosis',
    label: 'Trichinellosis',
    description:
      'Muscle worms from raw pork. Joints seize; poison ramps as larvae stir.',
    severity: 'severe',
    icon: 'mdi:biohazard',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_BORDER,
    incubationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(1.5),
    durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(5),
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-muscle-lock-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(3),
      },
      {
        kind: 'poison',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
        potency: 'venomous',
        totalPoisonDamage: 40,
      },
    ],
  },
  'mad-cow': {
    id: 'mad-cow',
    label: 'Mad Cow',
    description:
      'BSE prions from tainted beef. Confusion deepens; delayed neural damage follows.',
    severity: 'critical',
    icon: 'mdi:head-question',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_PRION_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_PRION_BORDER,
    incubationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(5),
    durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(7),
    grants: [
      {
        kind: 'confusion',
        delayMs: 0,
        intensity: 40,
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(5),
      },
      {
        kind: 'confusion',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(3),
        intensity: 65,
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(4),
      },
      {
        kind: 'potential_damage',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(4),
        pendingExpectedDamage: 35,
        resolveDelayMs: computingWorldPlazaInGameHoursToDiseaseRealMs(8),
      },
    ],
  },
  'liver-fluke': {
    id: 'liver-fluke',
    label: 'Liver Fluke',
    description:
      'Sheep liver parasites. Stamina bleeds away while you shuffle.',
    severity: 'moderate',
    icon: 'mdi:biohazard',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_BORDER,
    incubationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
    durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(6),
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-nausea-slow-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(6),
      },
      {
        kind: 'buff',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(1),
        buffId: 'disease-stamina-sick-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(5),
      },
    ],
  },
  'sleeping-sickness': {
    id: 'sleeping-sickness',
    label: 'Sleeping Sickness',
    description:
      'Trypanosome fever from zebra meat. Waves of drowsiness and disorientation.',
    severity: 'critical',
    icon: 'mdi:sleep',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_BORDER,
    incubationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(4),
    durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(7),
    grants: [
      {
        kind: 'confusion',
        delayMs: 0,
        intensity: 30,
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(4),
      },
      {
        kind: 'sleep',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
        durationMs: computingWorldPlazaInGameHoursToDiseaseRealMs(8),
      },
      {
        kind: 'confusion',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(4),
        intensity: 55,
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(3),
      },
      {
        kind: 'sleep',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(5),
        durationMs: computingWorldPlazaInGameHoursToDiseaseRealMs(6),
      },
    ],
  },
  'wolf-fever': {
    id: 'wolf-fever',
    label: 'Wolf Fever',
    description:
      'Predator-borne parasites and fever. Cannot jump or roll; footing wavers.',
    severity: 'severe',
    icon: 'mdi:biohazard',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_BORDER,
    incubationMs: computingWorldPlazaInGameHoursToDiseaseRealMs(12),
    durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(3),
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-joint-lock-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
      },
      {
        kind: 'confusion',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(1),
        intensity: 45,
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
      },
    ],
  },
  'bear-worm': {
    id: 'bear-worm',
    label: 'Bear Worm',
    description:
      'Classic trichinosis from bear. Weakness builds; bleeding starts late.',
    severity: 'severe',
    icon: 'mdi:biohazard',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_BORDER,
    incubationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
    durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(6),
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-weakness-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(6),
      },
      {
        kind: 'bleed',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(3),
        severity: 'bleeding',
        flatExpectedDamage: 30,
      },
    ],
  },
  toxoplasmosis: {
    id: 'toxoplasmosis',
    label: 'Toxoplasmosis',
    description:
      'Cat-borne parasite from big-cat meat. Slows reflexes and scrambles direction.',
    severity: 'moderate',
    icon: 'mdi:head-question',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_BORDER,
    incubationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(3),
    durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(5),
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-nausea-slow-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(5),
      },
      {
        kind: 'confusion',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(1),
        intensity: 50,
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(4),
      },
    ],
  },
  'vibrio-infection': {
    id: 'vibrio-infection',
    label: 'Vibrio Infection',
    description:
      'Reptile-borne bacteria. Poison hits fast; delayed shock damage follows.',
    severity: 'severe',
    icon: 'mdi:stomach',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_BORDER,
    incubationMs: computingWorldPlazaInGameHoursToDiseaseRealMs(4),
    durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(1),
    grants: [
      {
        kind: 'poison',
        delayMs: 0,
        potency: 'toxic',
        totalPoisonDamage: 30,
      },
      {
        kind: 'buff',
        delayMs: computingWorldPlazaInGameHoursToDiseaseRealMs(2),
        buffId: 'disease-nausea-slow-debuff',
        durationMs: computingWorldPlazaInGameHoursToDiseaseRealMs(20),
      },
      {
        kind: 'potential_damage',
        delayMs: computingWorldPlazaInGameHoursToDiseaseRealMs(8),
        pendingExpectedDamage: 20,
        resolveDelayMs: computingWorldPlazaInGameHoursToDiseaseRealMs(2),
      },
    ],
  },
  'cucco-rage': {
    id: 'cucco-rage',
    label: 'Cucco Rage',
    description:
      'Raw meat from a bird that wanted you dead. You run hotter and hit harder, then the flock takes the wheel.',
    severity: 'severe',
    icon: 'mdi:food-drumstick',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_RAGE_COLOR,
    hudIconBorderClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_RAGE_BORDER,
    incubationMs: computingWorldPlazaInGameHoursToDiseaseRealMs(3),
    durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(3),
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-cucco-frenzy-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2.5),
      },
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-cucco-frenzy-drain-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2.5),
      },
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-cucco-wild-strikes-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
      },
      {
        kind: 'confusion',
        delayMs: computingWorldPlazaInGameHoursToDiseaseRealMs(4),
        intensity: 45,
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
      },
      {
        kind: 'confusion',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(1),
        intensity: 70,
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(1.5),
      },
      {
        kind: 'buff',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(1.75),
        buffId: 'disease-joint-lock-debuff',
        durationMs: computingWorldPlazaInGameDaysToDiseaseRealMs(1.25),
      },
      {
        kind: 'poison',
        delayMs: computingWorldPlazaInGameDaysToDiseaseRealMs(2),
        potency: 'toxic',
        totalPoisonDamage: 20,
      },
    ],
  },
};

/** Returns one disease descriptor by id. */
export function resolvingWorldPlazaEntityDiseaseDescriptor(
  diseaseId: DefiningWorldPlazaEntityDiseaseId
): DefiningWorldPlazaEntityDiseaseDescriptor {
  return DEFINING_WORLD_PLAZA_ENTITY_DISEASE_REGISTRY[diseaseId];
}

/** Lists all registered disease descriptors. */
export function listingWorldPlazaEntityDiseaseDescriptors(): DefiningWorldPlazaEntityDiseaseDescriptor[] {
  return Object.values(DEFINING_WORLD_PLAZA_ENTITY_DISEASE_REGISTRY);
}

/** Lists diseases for one severity tier, sorted by label. */
export function listingWorldPlazaEntityDiseaseDescriptorsBySeverity(
  severity: DefiningWorldPlazaEntityDiseaseSeverity
): DefiningWorldPlazaEntityDiseaseDescriptor[] {
  return listingWorldPlazaEntityDiseaseDescriptors()
    .filter((descriptor) => descriptor.severity === severity)
    .sort((left, right) => left.label.localeCompare(right.label));
}

/** Groups every disease by severity tier for guides and balance review. */
export function groupingWorldPlazaEntityDiseaseDescriptorsBySeverity(): Record<
  DefiningWorldPlazaEntityDiseaseSeverity,
  DefiningWorldPlazaEntityDiseaseDescriptor[]
> {
  return {
    mild: listingWorldPlazaEntityDiseaseDescriptorsBySeverity('mild'),
    moderate: listingWorldPlazaEntityDiseaseDescriptorsBySeverity('moderate'),
    severe: listingWorldPlazaEntityDiseaseDescriptorsBySeverity('severe'),
    critical: listingWorldPlazaEntityDiseaseDescriptorsBySeverity('critical'),
  };
}
