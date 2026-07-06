import { DEFINING_PLAZA_MECHANICS_PANEL_DAMAGE_FLOAT_SAMPLES } from '@/components/home/domains/definingPlazaMechanicsPanelFloatSampleConstants';
import {
  DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY,
  resolvingWorldPlazaEntityDamageKindFloatClassNameOverride,
  resolvingWorldPlazaEntityDamageKindFloatIcon,
} from '@/components/world/health/domains/definingWorldPlazaEntityDamageKindRegistry';
import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';

export type DefiningPlazaMechanicsCombatDamageKindPreviewSample = {
  sectionId: string;
  damageKind: DefiningWorldPlazaEntityDamageKind;
  amountLabel: string;
  damageClassName: string;
  icon: MappingWorldPlazaEntityHealthFloatTextIconName;
};

const PLAZA_MECHANICS_COMBAT_DAMAGE_KIND_PREVIEW_SECTION_IDS: Record<
  string,
  DefiningWorldPlazaEntityDamageKind
> = {
  physical: 'physical',
  fall: 'fall',
  'environmental-heat': 'environmental_heat',
  'environmental-cold': 'environmental_cold',
  'environmental-lava': 'environmental_lava',
  'poison-toxic': 'toxic',
  'poison-venomous': 'venomous',
  'poison-lethal': 'lethal',
  'bleed-bleeding': 'bleeding',
  'bleed-hemorrhaging': 'hemorrhaging',
  'bleed-exsanguinating': 'exsanguinating',
  starvation: 'starvation',
  'potential-damage': 'potential_damage',
};

function formattingPlazaMechanicsCombatDamageKindFloatAmountLabel(
  label: string
): string {
  if (label.endsWith('/s')) {
    return label.replace(/^\-/, '');
  }

  return label.replace(/^\-/, '');
}

function buildingPlazaMechanicsCombatDamageKindPreviewSample(
  sectionId: string,
  damageKind: DefiningWorldPlazaEntityDamageKind
): DefiningPlazaMechanicsCombatDamageKindPreviewSample | null {
  const panelSample = DEFINING_PLAZA_MECHANICS_PANEL_DAMAGE_FLOAT_SAMPLES[sectionId];

  if (!panelSample) {
    return null;
  }

  const descriptor = DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY[damageKind];
  const classNameOverride =
    resolvingWorldPlazaEntityDamageKindFloatClassNameOverride(damageKind);
  const icon =
    panelSample.icon ??
    resolvingWorldPlazaEntityDamageKindFloatIcon(damageKind) ??
    descriptor.floatIcon ??
    'boxicons:sword-filled';

  return {
    sectionId,
    damageKind,
    amountLabel: formattingPlazaMechanicsCombatDamageKindFloatAmountLabel(
      panelSample.label
    ),
    damageClassName:
      classNameOverride ?? 'plaza-combat-float-damage text-red-500',
    icon,
  };
}

/** Combat float preview config for non-EV damage type cards. */
export const DEFINING_PLAZA_MECHANICS_COMBAT_DAMAGE_KIND_PREVIEW_SAMPLES: readonly DefiningPlazaMechanicsCombatDamageKindPreviewSample[] =
  Object.entries(PLAZA_MECHANICS_COMBAT_DAMAGE_KIND_PREVIEW_SECTION_IDS)
    .map(([sectionId, damageKind]) =>
      buildingPlazaMechanicsCombatDamageKindPreviewSample(sectionId, damageKind)
    )
    .filter(
      (
        sample
      ): sample is DefiningPlazaMechanicsCombatDamageKindPreviewSample =>
        sample !== null
    );

export const DEFINING_PLAZA_MECHANICS_COMBAT_DAMAGE_KIND_PREVIEW_BUTTON_LABEL =
  'Preview float' as const;
