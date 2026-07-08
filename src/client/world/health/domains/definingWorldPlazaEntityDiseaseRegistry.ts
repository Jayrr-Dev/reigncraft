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
  | 'vibrio-infection';

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
  icon: MappingWorldPlazaEntityBuffHudIconName;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
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

export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_REGISTRY: Record<
  DefiningWorldPlazaEntityDiseaseId,
  DefiningWorldPlazaEntityDiseaseDescriptor
> = {
  salmonellosis: {
    id: 'salmonellosis',
    label: 'Salmonellosis',
    description:
      'Campylobacter-style gut rot from undercooked poultry. Nausea slows you; mild poison follows.',
    icon: 'mdi:stomach',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_BORDER,
    durationMs: 90_000,
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-nausea-slow-debuff',
        durationMs: 90_000,
      },
      {
        kind: 'poison',
        delayMs: 15_000,
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
    icon: 'mdi:head-question',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_PRION_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_PRION_BORDER,
    durationMs: 180_000,
    grants: [
      {
        kind: 'confusion',
        delayMs: 0,
        intensity: 35,
        durationMs: 120_000,
      },
      {
        kind: 'buff',
        delayMs: 30_000,
        buffId: 'disease-nausea-slow-debuff',
        durationMs: 150_000,
      },
    ],
  },
  trichinellosis: {
    id: 'trichinellosis',
    label: 'Trichinellosis',
    description:
      'Muscle worms from raw pork. Joints seize; poison ramps as larvae stir.',
    icon: 'mdi:biohazard',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_BORDER,
    durationMs: 120_000,
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-muscle-lock-debuff',
        durationMs: 60_000,
      },
      {
        kind: 'poison',
        delayMs: 45_000,
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
    icon: 'mdi:head-question',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_PRION_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_PRION_BORDER,
    durationMs: 200_000,
    grants: [
      {
        kind: 'confusion',
        delayMs: 0,
        intensity: 55,
        durationMs: 150_000,
      },
      {
        kind: 'potential_damage',
        delayMs: 90_000,
        pendingExpectedDamage: 35,
        resolveDelayMs: 8_000,
      },
    ],
  },
  'liver-fluke': {
    id: 'liver-fluke',
    label: 'Liver Fluke',
    description:
      'Sheep liver parasites. Stamina bleeds away while you shuffle.',
    icon: 'mdi:biohazard',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_BORDER,
    durationMs: 150_000,
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-nausea-slow-debuff',
        durationMs: 150_000,
      },
      {
        kind: 'buff',
        delayMs: 20_000,
        buffId: 'disease-stamina-sick-debuff',
        durationMs: 130_000,
      },
    ],
  },
  'sleeping-sickness': {
    id: 'sleeping-sickness',
    label: 'Sleeping Sickness',
    description:
      'Trypanosome fever from zebra meat. Waves of drowsiness and disorientation.',
    icon: 'mdi:sleep',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_BORDER,
    durationMs: 160_000,
    grants: [
      {
        kind: 'confusion',
        delayMs: 0,
        intensity: 40,
        durationMs: 90_000,
      },
      {
        kind: 'sleep',
        delayMs: 60_000,
        durationMs: 8_000,
      },
      {
        kind: 'sleep',
        delayMs: 120_000,
        durationMs: 6_000,
      },
    ],
  },
  'wolf-fever': {
    id: 'wolf-fever',
    label: 'Wolf Fever',
    description:
      'Predator-borne parasites and fever. Cannot jump or roll; footing wavers.',
    icon: 'mdi:biohazard',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_BORDER,
    durationMs: 140_000,
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-joint-lock-debuff',
        durationMs: 60_000,
      },
      {
        kind: 'confusion',
        delayMs: 30_000,
        intensity: 45,
        durationMs: 90_000,
      },
    ],
  },
  'bear-worm': {
    id: 'bear-worm',
    label: 'Bear Worm',
    description:
      'Classic trichinosis from bear. Weakness builds; bleeding starts late.',
    icon: 'mdi:biohazard',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_FEVER_BORDER,
    durationMs: 180_000,
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-weakness-debuff',
        durationMs: 180_000,
      },
      {
        kind: 'bleed',
        delayMs: 90_000,
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
    icon: 'mdi:head-question',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_BORDER,
    durationMs: 130_000,
    grants: [
      {
        kind: 'buff',
        delayMs: 0,
        buffId: 'disease-nausea-slow-debuff',
        durationMs: 130_000,
      },
      {
        kind: 'confusion',
        delayMs: 20_000,
        intensity: 50,
        durationMs: 100_000,
      },
    ],
  },
  'vibrio-infection': {
    id: 'vibrio-infection',
    label: 'Vibrio Infection',
    description:
      'Reptile-borne bacteria. Poison hits fast; delayed shock damage follows.',
    icon: 'mdi:stomach',
    hudIconColorClassName: DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_COLOR,
    hudIconBorderClassName:
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_SICKLY_BORDER,
    durationMs: 110_000,
    grants: [
      {
        kind: 'poison',
        delayMs: 0,
        potency: 'toxic',
        totalPoisonDamage: 30,
      },
      {
        kind: 'buff',
        delayMs: 10_000,
        buffId: 'disease-nausea-slow-debuff',
        durationMs: 100_000,
      },
      {
        kind: 'potential_damage',
        delayMs: 60_000,
        pendingExpectedDamage: 20,
        resolveDelayMs: 5_000,
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
